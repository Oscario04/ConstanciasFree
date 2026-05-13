from fastapi import APIRouter, HTTPException, Depends, Query
from app.database import get_db
from app.utils.auth import get_current_user, require_role
from app.models.event import EventCreate, EventUpdate, EventStatus
from bson import ObjectId
from datetime import datetime
from typing import Optional

router = APIRouter()


def serialize_event(e: dict) -> dict:
    e["id"] = str(e.pop("_id"))
    return e


@router.get("/")
async def list_events(
    status: Optional[str] = None,
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
):
    db = get_db()
    query = {}
    if status:
        query["status"] = status
    cursor = db.events.find(query).skip(skip).limit(limit).sort("start_date", -1)
    events = [serialize_event(e) async for e in cursor]
    total = await db.events.count_documents(query)
    return {"events": events, "total": total}


@router.get("/{event_id}")
async def get_event(event_id: str):
    db = get_db()
    event = await db.events.find_one({"_id": ObjectId(event_id)})
    if not event:
        raise HTTPException(status_code=404, detail="Evento no encontrado")
    return serialize_event(event)


@router.post("/", status_code=201)
async def create_event(
    data: EventCreate,
    current_user: dict = Depends(require_role("admin", "organizer")),
):
    db = get_db()
    doc = data.model_dump()
    doc.update({
        "organizer_id": str(current_user["_id"]),
        "status": EventStatus.DRAFT,
        "registered": 0,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow(),
    })
    result = await db.events.insert_one(doc)
    return {"id": str(result.inserted_id), "message": "Evento creado"}


@router.patch("/{event_id}")
async def update_event(
    event_id: str,
    data: EventUpdate,
    current_user: dict = Depends(require_role("admin", "organizer")),
):
    db = get_db()
    updates = {k: v for k, v in data.model_dump().items() if v is not None}
    updates["updated_at"] = datetime.utcnow()
    result = await db.events.update_one({"_id": ObjectId(event_id)}, {"$set": updates})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Evento no encontrado")
    return {"message": "Evento actualizado"}


@router.delete("/{event_id}")
async def archive_event(
    event_id: str,
    current_user: dict = Depends(require_role("admin")),
):
    db = get_db()
    result = await db.events.update_one(
        {"_id": ObjectId(event_id)},
        {"$set": {"status": EventStatus.ARCHIVED, "updated_at": datetime.utcnow()}},
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Evento no encontrado")
    return {"message": "Evento archivado"}