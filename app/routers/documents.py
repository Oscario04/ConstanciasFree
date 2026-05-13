# ─────────────────────────────────────────────────────────────────────────────
# CARPETA: app/routers/
# ARCHIVO: documents.py   ← REEMPLAZA el archivo que ya tienes
# ─────────────────────────────────────────────────────────────────────────────

from fastapi import APIRouter, HTTPException, Depends, Response
from fastapi.responses import StreamingResponse
from app.database import get_db
from app.utils.auth import get_current_user, require_role
from app.services.pdf_service import generate_constancia_pdf
from app.services.email_service import send_document_email
from app.services.storage_service import upload_pdf
from app.models.document import DocumentType
from app.config import settings
from bson import ObjectId
from datetime import datetime, timedelta
import secrets
import httpx
import io

router = APIRouter()


def serialize(doc):
    doc["id"] = str(doc.pop("_id"))
    return doc


# ── Emitir documento ──────────────────────────────────────────────────────────
@router.post("/issue", status_code=201)
async def issue_document(
    event_id: str,
    user_id: str,
    doc_type: DocumentType = DocumentType.CONSTANCIA,
    current_user: dict = Depends(require_role("admin", "organizer")),
):
    db = get_db()
    user = await db.users.find_one({"_id": ObjectId(user_id)})
    event = await db.events.find_one({"_id": ObjectId(event_id)})

    if not user or not event:
        raise HTTPException(status_code=404, detail="Usuario o evento no encontrado")

    # Verificar solicitud aprobada
    req = await db.requests.find_one({
        "user_id": user_id,
        "event_id": event_id,
        "status": "approved",
    })
    if not req:
        raise HTTPException(status_code=400, detail="El usuario no tiene solicitud aprobada")

    # Evitar duplicados activos
    existing = await db.documents.find_one({
        "user_id": user_id,
        "event_id": event_id,
        "status": "active",
    })
    if existing:
        raise HTTPException(status_code=400, detail="Ya existe un documento emitido para este usuario en este evento")

    verification_code = secrets.token_urlsafe(12)
    public_url = f"{settings.FRONTEND_URL}/verify/{verification_code}"

    # Generar PDF
    pdf_bytes = generate_constancia_pdf(
        recipient_name=user["name"],
        event_title=event["title"],
        event_date=event.get("start_date", datetime.utcnow()).strftime("%d/%m/%Y"),
        role=req.get("requested_role", "participante"),
        verification_url=public_url,
        doc_type=doc_type,
        hours=event.get("hours"),
    )

    # Subir PDF a Cloudinary y obtener URL real
    pdf_url = await upload_pdf(pdf_bytes, public_id=verification_code)

    retention_years = event.get("retention_years", 5)
    expires_at = datetime.utcnow() + timedelta(days=365 * retention_years)

    doc = {
        "user_id": user_id,
        "event_id": event_id,
        "document_type": doc_type,
        "status": "active",
        "verification_code": verification_code,
        "public_url": public_url,
        "pdf_url": pdf_url,
        "qr_url": public_url,
        "issued_at": datetime.utcnow(),
        "expires_at": expires_at,
        "metadata": {
            "user_name": user["name"],
            "event_title": event["title"],
            "role": req.get("requested_role"),
        },
    }
    result = await db.documents.insert_one(doc)

    await send_document_email(user["email"], user["name"], event["title"], pdf_url)

    return {
        "id": str(result.inserted_id),
        "verification_code": verification_code,
        "public_url": public_url,
        "pdf_url": pdf_url,
        "message": "Documento emitido y notificación enviada",
    }


# ── Descargar PDF por código de verificación ──────────────────────────────────
@router.get("/pdf/{code}")
async def download_pdf(code: str):
    """
    Endpoint público para descargar el PDF de un documento verificado.
    Si el PDF está en Cloudinary se hace un proxy de la descarga.
    Si está guardado localmente (fallback desarrollo) se sirve desde disco.
    """
    db = get_db()
    doc = await db.documents.find_one({"verification_code": code})
    if not doc:
        raise HTTPException(status_code=404, detail="Documento no encontrado")
    if doc.get("status") != "active":
        raise HTTPException(status_code=410, detail=f"Documento {doc.get('status')}")

    pdf_url: str = doc.get("pdf_url", "")

    # ── Caso 1: PDF en Cloudinary (URL externa) ───────────────────────────────
    if pdf_url.startswith("https://"):
        async with httpx.AsyncClient() as client:
            resp = await client.get(pdf_url)
            if resp.status_code != 200:
                raise HTTPException(status_code=502, detail="No se pudo obtener el archivo")
            filename = f"constancia_{code}.pdf"
            return Response(
                content=resp.content,
                media_type="application/pdf",
                headers={"Content-Disposition": f'attachment; filename="{filename}"'},
            )

    # ── Caso 2: PDF guardado localmente (fallback desarrollo) ─────────────────
    local_path = f"/tmp/constancias/{code}.pdf"
    try:
        with open(local_path, "rb") as f:
            pdf_bytes = f.read()
        filename = f"constancia_{code}.pdf"
        return Response(
            content=pdf_bytes,
            media_type="application/pdf",
            headers={"Content-Disposition": f'attachment; filename="{filename}"'},
        )
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail="Archivo PDF no disponible")


# ── Verificar autenticidad de documento (público) ─────────────────────────────
@router.get("/verify/{code}")
async def verify_document(code: str):
    """Endpoint público para verificar la autenticidad de un documento."""
    db = get_db()
    doc = await db.documents.find_one({"verification_code": code})
    if not doc:
        raise HTTPException(status_code=404, detail="Documento no encontrado")
    if doc.get("status") != "active":
        raise HTTPException(status_code=410, detail=f"Documento {doc.get('status')}")
    return {
        "valid": True,
        "document_type": doc["document_type"],
        "issued_at": doc["issued_at"],
        "expires_at": doc.get("expires_at"),
        "metadata": doc.get("metadata", {}),
        "pdf_url": doc.get("pdf_url"),
    }


# ── Mis documentos (usuario autenticado) ──────────────────────────────────────
@router.get("/me")
async def my_documents(current_user: dict = Depends(get_current_user)):
    db = get_db()
    cursor = db.documents.find({"user_id": str(current_user["_id"])}).sort("issued_at", -1)
    return [serialize(d) async for d in cursor]


# ── Documentos de un evento (admin/organizer) ─────────────────────────────────
@router.get("/event/{event_id}")
async def event_documents(
    event_id: str,
    current_user: dict = Depends(require_role("admin", "organizer")),
):
    db = get_db()
    cursor = db.documents.find({"event_id": event_id}).sort("issued_at", -1)
    return [serialize(d) async for d in cursor]


# ── Emitir documentos masivamente para todo un evento ─────────────────────────
@router.post("/issue-batch/{event_id}", status_code=201)
async def issue_batch(
    event_id: str,
    doc_type: DocumentType = DocumentType.CONSTANCIA,
    current_user: dict = Depends(require_role("admin", "organizer")),
):
    """
    Emite documentos para todos los participantes aprobados de un evento
    que aún no tengan documento activo.
    """
    db = get_db()
    event = await db.events.find_one({"_id": ObjectId(event_id)})
    if not event:
        raise HTTPException(status_code=404, detail="Evento no encontrado")

    approved_requests = db.requests.find({"event_id": event_id, "status": "approved"})
    issued = 0
    skipped = 0
    errors = []

    async for req in approved_requests:
        uid = req["user_id"]
        # Saltar si ya tiene documento
        existing = await db.documents.find_one({"user_id": uid, "event_id": event_id, "status": "active"})
        if existing:
            skipped += 1
            continue
        try:
            user = await db.users.find_one({"_id": ObjectId(uid)})
            if not user:
                errors.append({"user_id": uid, "error": "Usuario no encontrado"})
                continue

            verification_code = secrets.token_urlsafe(12)
            public_url = f"{settings.FRONTEND_URL}/verify/{verification_code}"

            pdf_bytes = generate_constancia_pdf(
                recipient_name=user["name"],
                event_title=event["title"],
                event_date=event.get("start_date", datetime.utcnow()).strftime("%d/%m/%Y"),
                role=req.get("requested_role", "participante"),
                verification_url=public_url,
                doc_type=doc_type,
                hours=event.get("hours"),
            )
            pdf_url = await upload_pdf(pdf_bytes, public_id=verification_code)

            retention_years = event.get("retention_years", 5)
            expires_at = datetime.utcnow() + timedelta(days=365 * retention_years)

            await db.documents.insert_one({
                "user_id": uid,
                "event_id": event_id,
                "document_type": doc_type,
                "status": "active",
                "verification_code": verification_code,
                "public_url": public_url,
                "pdf_url": pdf_url,
                "qr_url": public_url,
                "issued_at": datetime.utcnow(),
                "expires_at": expires_at,
                "metadata": {
                    "user_name": user["name"],
                    "event_title": event["title"],
                    "role": req.get("requested_role"),
                },
            })
            await send_document_email(user["email"], user["name"], event["title"], pdf_url)
            issued += 1
        except Exception as e:
            errors.append({"user_id": uid, "error": str(e)})

    return {
        "issued": issued,
        "skipped": skipped,
        "errors": errors,
        "message": f"Proceso completado: {issued} emitidos, {skipped} omitidos",
    }


# ── Revocar documento ─────────────────────────────────────────────────────────
@router.patch("/{doc_id}/revoke")
async def revoke_document(
    doc_id: str,
    reason: str = "",
    current_user: dict = Depends(require_role("admin")),
):
    db = get_db()
    result = await db.documents.update_one(
        {"_id": ObjectId(doc_id)},
        {"$set": {"status": "revoked", "revoke_reason": reason, "revoked_at": datetime.utcnow()}},
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Documento no encontrado")
    return {"message": "Documento revocado"}