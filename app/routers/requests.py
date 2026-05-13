# ─────────────────────────────────────────────────────────────────────────────
# CARPETA: app/routers/
# ARCHIVO: requests.py
# ─────────────────────────────────────────────────────────────────────────────

from fastapi import APIRouter, HTTPException, Depends
from app.database import get_db
from app.utils.auth import get_current_user, require_role
from app.models.document import RequestCreate, RequestUpdate, RequestStatus
from app.services.email_service import send_approval_email, send_rejection_email
from bson import ObjectId
from datetime import datetime

router = APIRouter()


def serialize(doc):
    doc["id"] = str(doc.pop("_id"))
    return doc


# ── Usuario: crear solicitud ───────────────────────────────────────────────────
@router.post("/", status_code=201)
async def create_request(
    data: RequestCreate,
    current_user: dict = Depends(get_current_user),
):
    db = get_db()
    user_id = str(current_user["_id"])

    # Verificar que el evento existe y está publicado
    event = await db.events.find_one({"_id": ObjectId(data.event_id)})
    if not event:
        raise HTTPException(status_code=404, detail="Evento no encontrado")
    if event.get("status") not in ("published", "ongoing"):
        raise HTTPException(status_code=400, detail="El evento no está disponible para solicitudes")

    # Verificar cupo si aplica
    if event.get("capacity", 0) > 0 and event.get("registered", 0) >= event["capacity"]:
        raise HTTPException(status_code=400, detail="El evento ha alcanzado su capacidad máxima")

    # Evitar solicitud duplicada activa
    existing = await db.requests.find_one({
        "user_id": user_id,
        "event_id": data.event_id,
        "status": {"$in": ["pending", "approved"]},
    })
    if existing:
        raise HTTPException(status_code=400, detail="Ya tienes una solicitud activa para este evento")

    doc = {
        "user_id": user_id,
        "event_id": data.event_id,
        "requested_role": data.requested_role,
        "status": RequestStatus.PENDING,
        "message": data.message,
        "admin_message": None,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow(),
    }
    result = await db.requests.insert_one(doc)
    return {"id": str(result.inserted_id), "message": "Solicitud enviada correctamente"}


# ── Usuario: ver mis solicitudes ───────────────────────────────────────────────
@router.get("/me")
async def my_requests(current_user: dict = Depends(get_current_user)):
    db = get_db()
    cursor = db.requests.find({"user_id": str(current_user["_id"])}).sort("created_at", -1)
    return [serialize(r) async for r in cursor]


# ── Admin/Organizer: ver solicitudes de un evento ──────────────────────────────
@router.get("/event/{event_id}")
async def event_requests(
    event_id: str,
    status: str = None,
    current_user: dict = Depends(require_role("admin", "organizer")),
):
    db = get_db()
    query = {"event_id": event_id}
    if status:
        query["status"] = status
    cursor = db.requests.find(query).sort("created_at", -1)
    return [serialize(r) async for r in cursor]


# ── Admin/Organizer: ver una solicitud individual ──────────────────────────────
@router.get("/{request_id}")
async def get_request(
    request_id: str,
    current_user: dict = Depends(require_role("admin", "organizer")),
):
    db = get_db()
    req = await db.requests.find_one({"_id": ObjectId(request_id)})
    if not req:
        raise HTTPException(status_code=404, detail="Solicitud no encontrada")
    return serialize(req)


# ── Admin/Organizer: aprobar o rechazar solicitud ─────────────────────────────
@router.patch("/{request_id}/review")
async def review_request(
    request_id: str,
    data: RequestUpdate,
    current_user: dict = Depends(require_role("admin", "organizer")),
):
    db = get_db()
    req = await db.requests.find_one({"_id": ObjectId(request_id)})
    if not req:
        raise HTTPException(status_code=404, detail="Solicitud no encontrada")
    if req["status"] != RequestStatus.PENDING:
        raise HTTPException(status_code=400, detail="La solicitud ya fue procesada")

    updates = {
        "status": data.status,
        "admin_message": data.admin_message,
        "updated_at": datetime.utcnow(),
        "reviewed_by": str(current_user["_id"]),
        "reviewed_at": datetime.utcnow(),
    }
    await db.requests.update_one({"_id": ObjectId(request_id)}, {"$set": updates})

    # Obtener datos de usuario y evento para el correo
    user = await db.users.find_one({"_id": ObjectId(req["user_id"])})
    event = await db.events.find_one({"_id": ObjectId(req["event_id"])})

    if user and event:
        if data.status == RequestStatus.APPROVED:
            # Incrementar contador de registrados en el evento
            await db.events.update_one(
                {"_id": ObjectId(req["event_id"])},
                {"$inc": {"registered": 1}},
            )
            await send_approval_email(
                to_email=user["email"],
                name=user["name"],
                event_title=event["title"],
                role=req.get("requested_role", "participante"),
            )
        elif data.status == RequestStatus.REJECTED:
            await send_rejection_email(
                to_email=user["email"],
                name=user["name"],
                event_title=event["title"],
                reason=data.admin_message or "",
            )

    return {"message": f"Solicitud {data.status} correctamente"}


# ── Usuario: cancelar su propia solicitud pendiente ────────────────────────────
@router.delete("/{request_id}")
async def cancel_request(
    request_id: str,
    current_user: dict = Depends(get_current_user),
):
    db = get_db()
    req = await db.requests.find_one({
        "_id": ObjectId(request_id),
        "user_id": str(current_user["_id"]),
    })
    if not req:
        raise HTTPException(status_code=404, detail="Solicitud no encontrada")
    if req["status"] != RequestStatus.PENDING:
        raise HTTPException(status_code=400, detail="Solo se pueden cancelar solicitudes pendientes")

    await db.requests.update_one(
        {"_id": ObjectId(request_id)},
        {"$set": {"status": "cancelled", "updated_at": datetime.utcnow()}},
    )
    return {"message": "Solicitud cancelada"}