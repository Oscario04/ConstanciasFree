# ─────────────────────────────────────────────────────────────────────────────
# CARPETA: app/routers/
# ARCHIVO: stats.py   ← REEMPLAZA el archivo que ya tienes
# ─────────────────────────────────────────────────────────────────────────────

from fastapi import APIRouter, Depends
from fastapi.responses import StreamingResponse
from app.database import get_db
from app.utils.auth import require_role
from bson import ObjectId
import csv
import io

router = APIRouter()


# ── Dashboard general ─────────────────────────────────────────────────────────
@router.get("/dashboard")
async def dashboard_stats(current_user: dict = Depends(require_role("admin", "organizer"))):
    db = get_db()
    total_events     = await db.events.count_documents({})
    total_users      = await db.users.count_documents({})
    total_documents  = await db.documents.count_documents({})
    total_requests   = await db.requests.count_documents({})
    pending_requests = await db.requests.count_documents({"status": "pending"})
    approved_requests= await db.requests.count_documents({"status": "approved"})

    # Documentos emitidos por tipo
    docs_by_type = {}
    for dtype in ("constancia", "diploma", "reconocimiento"):
        docs_by_type[dtype] = await db.documents.count_documents({"document_type": dtype})

    # Eventos por status
    events_by_status = {}
    for status in ("draft", "published", "ongoing", "finished", "archived"):
        events_by_status[status] = await db.events.count_documents({"status": status})

    return {
        "total_events": total_events,
        "total_users": total_users,
        "total_documents": total_documents,
        "total_requests": total_requests,
        "pending_requests": pending_requests,
        "approved_requests": approved_requests,
        "documents_by_type": docs_by_type,
        "events_by_status": events_by_status,
    }


# ── Estadísticas de un evento ─────────────────────────────────────────────────
@router.get("/event/{event_id}")
async def event_stats(
    event_id: str,
    current_user: dict = Depends(require_role("admin", "organizer")),
):
    db = get_db()
    total_requests = await db.requests.count_documents({"event_id": event_id})
    approved       = await db.requests.count_documents({"event_id": event_id, "status": "approved"})
    rejected       = await db.requests.count_documents({"event_id": event_id, "status": "rejected"})
    pending        = await db.requests.count_documents({"event_id": event_id, "status": "pending"})
    total_attend   = await db.attendance.count_documents({"event_id": event_id})
    total_docs     = await db.documents.count_documents({"event_id": event_id})

    # Asistencia por rol
    pipeline_roles = [
        {"$match": {"event_id": event_id, "status": "approved"}},
        {"$group": {"_id": "$requested_role", "count": {"$sum": 1}}},
    ]
    roles_raw = db.requests.aggregate(pipeline_roles)
    by_role = {r["_id"]: r["count"] async for r in roles_raw}

    return {
        "total_requests": total_requests,
        "approved": approved,
        "rejected": rejected,
        "pending": pending,
        "total_attendance": total_attend,
        "total_documents": total_docs,
        "by_role": by_role,
    }


# ── Exportar asistencia de un evento a CSV ────────────────────────────────────
@router.get("/event/{event_id}/export/attendance")
async def export_attendance_csv(
    event_id: str,
    current_user: dict = Depends(require_role("admin", "organizer")),
):
    """
    Descarga un CSV con el registro de asistencia de todos los participantes
    de un evento, incluyendo nombre, email, check-in, check-out y método.
    """
    db = get_db()
    event = await db.events.find_one({"_id": ObjectId(event_id)})
    event_title = event["title"] if event else event_id

    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(["nombre", "email", "rol", "check_in", "check_out", "metodo", "duracion_min"])

    cursor = db.attendance.find({"event_id": event_id}).sort("check_in", 1)
    async for record in cursor:
        user = await db.users.find_one({"_id": ObjectId(record["user_id"])})
        req  = await db.requests.find_one({"user_id": record["user_id"], "event_id": event_id})

        check_in  = record.get("check_in")
        check_out = record.get("check_out")
        duracion  = ""
        if check_in and check_out:
            diff = check_out - check_in
            duracion = str(int(diff.total_seconds() / 60))

        writer.writerow([
            user["name"]  if user else record["user_id"],
            user["email"] if user else "",
            req.get("requested_role", "") if req else "",
            check_in.strftime("%Y-%m-%d %H:%M")  if check_in  else "",
            check_out.strftime("%Y-%m-%d %H:%M") if check_out else "",
            record.get("method", ""),
            duracion,
        ])

    output.seek(0)
    filename = f"asistencia_{event_title.replace(' ', '_')}.csv"
    return StreamingResponse(
        iter([output.getvalue()]),
        media_type="text/csv",
        headers={"Content-Disposition": f'attachment; filename="{filename}"'},
    )


# ── Exportar documentos emitidos de un evento a CSV ──────────────────────────
@router.get("/event/{event_id}/export/documents")
async def export_documents_csv(
    event_id: str,
    current_user: dict = Depends(require_role("admin", "organizer")),
):
    """
    Descarga un CSV con los documentos emitidos para un evento.
    """
    db = get_db()
    event = await db.events.find_one({"_id": ObjectId(event_id)})
    event_title = event["title"] if event else event_id

    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(["nombre", "tipo_documento", "rol", "fecha_emision", "expira", "status", "url_verificacion"])

    cursor = db.documents.find({"event_id": event_id}).sort("issued_at", 1)
    async for doc in cursor:
        meta = doc.get("metadata", {})
        writer.writerow([
            meta.get("user_name", ""),
            doc.get("document_type", ""),
            meta.get("role", ""),
            doc["issued_at"].strftime("%Y-%m-%d") if doc.get("issued_at") else "",
            doc["expires_at"].strftime("%Y-%m-%d") if doc.get("expires_at") else "",
            doc.get("status", ""),
            doc.get("public_url", ""),
        ])

    output.seek(0)
    filename = f"documentos_{event_title.replace(' ', '_')}.csv"
    return StreamingResponse(
        iter([output.getvalue()]),
        media_type="text/csv",
        headers={"Content-Disposition": f'attachment; filename="{filename}"'},
    )