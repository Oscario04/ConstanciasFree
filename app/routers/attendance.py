from fastapi import APIRouter, HTTPException, Depends
from app.database import get_db
from app.utils.auth import get_current_user, require_role
from app.models.document import AttendanceCreate, AttendanceMethod
from bson import ObjectId
from datetime import datetime
import secrets

router = APIRouter()


def serialize(doc):
    doc["id"] = str(doc.pop("_id"))
    return doc


@router.post("/check-in", status_code=201)
async def check_in(
    data: AttendanceCreate,
    current_user: dict = Depends(require_role("admin", "staff", "organizer")),
):
    db = get_db()
    existing = await db.attendance.find_one({
        "user_id": data.user_id,
        "event_id": data.event_id,
        "check_out": None,
    })
    if existing:
        raise HTTPException(status_code=400, detail="El usuario ya tiene check-in activo")

    doc = {
        "user_id": data.user_id,
        "event_id": data.event_id,
        "session_id": data.session_id,
        "check_in": datetime.utcnow(),
        "check_out": None,
        "method": data.method,
        "registered_by": str(current_user["_id"]),
        "created_at": datetime.utcnow(),
    }
    result = await db.attendance.insert_one(doc)
    return {"id": str(result.inserted_id), "message": "Check-in registrado"}


@router.post("/check-out/{attendance_id}")
async def check_out(
    attendance_id: str,
    current_user: dict = Depends(require_role("admin", "staff", "organizer")),
):
    db = get_db()
    result = await db.attendance.update_one(
        {"_id": ObjectId(attendance_id)},
        {"$set": {"check_out": datetime.utcnow()}},
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Registro de asistencia no encontrado")
    return {"message": "Check-out registrado"}


@router.get("/event/{event_id}")
async def event_attendance(
    event_id: str,
    current_user: dict = Depends(require_role("admin", "organizer")),
):
    db = get_db()
    cursor = db.attendance.find({"event_id": event_id}).sort("check_in", -1)
    return [serialize(r) async for r in cursor]


@router.get("/qr/{event_id}/{user_id}")
async def generate_qr_token(
    event_id: str,
    user_id: str,
    current_user: dict = Depends(get_current_user),
):
    """Genera un token temporal para check-in por QR."""
    token = secrets.token_urlsafe(16)
    db = get_db()
    await db.qr_tokens.insert_one({
        "token": token,
        "event_id": event_id,
        "user_id": user_id,
        "created_at": datetime.utcnow(),
        "used": False,
    })
    return {"token": token, "qr_url": f"/api/attendance/qr-scan/{token}"}


@router.post("/qr-scan/{token}")
async def scan_qr(token: str):
    """Procesa un escaneo de QR y registra la asistencia."""
    db = get_db()
    qr = await db.qr_tokens.find_one({"token": token, "used": False})
    if not qr:
        raise HTTPException(status_code=400, detail="QR inválido o ya utilizado")

    await db.qr_tokens.update_one({"_id": qr["_id"]}, {"$set": {"used": True}})
    doc = {
        "user_id": qr["user_id"],
        "event_id": qr["event_id"],
        "check_in": datetime.utcnow(),
        "check_out": None,
        "method": AttendanceMethod.QR,
        "registered_by": None,
        "created_at": datetime.utcnow(),
    }
    result = await db.attendance.insert_one(doc)
    return {"id": str(result.inserted_id), "message": "Asistencia registrada por QR"}