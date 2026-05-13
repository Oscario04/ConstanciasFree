from fastapi import APIRouter, HTTPException, Depends
from app.database import get_db
from app.utils.auth import get_current_user, require_role
from app.models.user import UserUpdate
from bson import ObjectId
from datetime import datetime

router = APIRouter()


def serialize(u):
    u["id"] = str(u.pop("_id"))
    u.pop("password", None)
    return u


@router.get("/me")
async def get_me(current_user: dict = Depends(get_current_user)):
    current_user.pop("password", None)
    return current_user


@router.patch("/me")
async def update_me(data: UserUpdate, current_user: dict = Depends(get_current_user)):
    db = get_db()
    updates = {k: v for k, v in data.model_dump().items() if v is not None}
    updates["updated_at"] = datetime.utcnow()
    await db.users.update_one({"_id": current_user["_id"]}, {"$set": updates})
    return {"message": "Perfil actualizado"}


@router.get("/")
async def list_users(current_user: dict = Depends(require_role("admin"))):
    db = get_db()
    cursor = db.users.find({}).sort("created_at", -1)
    return [serialize(u) async for u in cursor]


@router.patch("/{user_id}/status")
async def update_user_status(
    user_id: str,
    status: str,
    current_user: dict = Depends(require_role("admin")),
):
    if status not in ("active", "inactive", "suspended"):
        raise HTTPException(status_code=400, detail="Estado inválido")
    db = get_db()
    await db.users.update_one(
        {"_id": ObjectId(user_id)},
        {"$set": {"status": status, "updated_at": datetime.utcnow()}},
    )
    return {"message": f"Usuario {status}"}