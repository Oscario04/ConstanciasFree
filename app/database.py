# ─────────────────────────────────────────────────────────────────────────────
# CARPETA: app/
# ARCHIVO: database.py   ← REEMPLAZA el archivo que ya tienes
# ─────────────────────────────────────────────────────────────────────────────

from motor.motor_asyncio import AsyncIOMotorClient
from app.config import settings
import logging

logger = logging.getLogger(__name__)

client: AsyncIOMotorClient = None
db = None


async def connect_db():
    global client, db
    client = AsyncIOMotorClient(settings.MONGODB_URL)
    db = client[settings.DATABASE_NAME]
    logger.info(f"Conectado a MongoDB: {settings.DATABASE_NAME}")
    await create_indexes()


async def create_indexes():
    """
    Crea los índices necesarios para rendimiento y unicidad.
    Se ejecuta en cada arranque — si el índice ya existe, MongoDB lo ignora.
    """
    # ── users ──────────────────────────────────────────────────────────────────
    await db.users.create_index("email", unique=True)
    await db.users.create_index("role")
    await db.users.create_index("status")

    # ── events ─────────────────────────────────────────────────────────────────
    await db.events.create_index("status")
    await db.events.create_index("organizer_id")
    await db.events.create_index("start_date")

    # ── requests ───────────────────────────────────────────────────────────────
    await db.requests.create_index([("user_id", 1), ("event_id", 1)])
    await db.requests.create_index("status")
    await db.requests.create_index("event_id")

    # ── attendance ─────────────────────────────────────────────────────────────
    await db.attendance.create_index([("user_id", 1), ("event_id", 1)])
    await db.attendance.create_index("event_id")

    # ── documents ──────────────────────────────────────────────────────────────
    await db.documents.create_index("verification_code", unique=True)
    await db.documents.create_index([("user_id", 1), ("event_id", 1)])
    await db.documents.create_index("status")
    await db.documents.create_index("expires_at")

    # ── qr_tokens ──────────────────────────────────────────────────────────────
    await db.qr_tokens.create_index("token", unique=True)
    # TTL: los tokens QR expiran automáticamente a los 10 minutos
    await db.qr_tokens.create_index("created_at", expireAfterSeconds=600)

    logger.info("Índices de MongoDB creados/verificados correctamente")


async def disconnect_db():
    global client
    if client:
        client.close()
        logger.info("Desconectado de MongoDB")


def get_db():
    return db