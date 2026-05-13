from fastapi import APIRouter, Depends
from app.database import get_db
from app.utils.auth import require_role
from datetime import datetime

router = APIRouter()


@router.get("/config")
async def get_config(current_user: dict = Depends(require_role("admin"))):
    db = get_db()
    config = await db.config.find_one({"key": "app_config"})
    if not config:
        return {"modules": {"attendance": True, "qr": True, "email": True, "stats": True}}
    config.pop("_id", None)
    return config


@router.patch("/config")
async def update_config(config: dict, current_user: dict = Depends(require_role("admin"))):
    db = get_db()
    config["updated_at"] = datetime.utcnow()
    await db.config.update_one(
        {"key": "app_config"},
        {"$set": config},
        upsert=True,
    )
    return {"message": "Configuración actualizada"}