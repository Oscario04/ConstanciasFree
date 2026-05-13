# ─────────────────────────────────────────────────────────────────────────────
# CARPETA: app/
# ARCHIVO: scheduler.py
# ─────────────────────────────────────────────────────────────────────────────

"""
Tareas programadas con APScheduler.
Se integra en el ciclo de vida de FastAPI (startup/shutdown).

Instalar dependencia:
    pip install apscheduler==3.10.4

Agregar en requirements.txt:
    apscheduler==3.10.4
"""

from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.triggers.cron import CronTrigger
from app.database import get_db
from datetime import datetime
import logging

logger = logging.getLogger(__name__)

scheduler = AsyncIOScheduler()


# ── Job 1: Archivar eventos que ya terminaron ─────────────────────────────────
async def archive_finished_events():
    """
    Cambia a 'finished' los eventos cuya fecha de fin ya pasó
    y aún están en estado 'published' u 'ongoing'.
    Corre cada hora.
    """
    db = get_db()
    now = datetime.utcnow()
    result = await db.events.update_many(
        {
            "status": {"$in": ["published", "ongoing"]},
            "end_date": {"$lt": now},
        },
        {"$set": {"status": "finished", "updated_at": now}},
    )
    if result.modified_count:
        logger.info(f"[Scheduler] Eventos archivados como 'finished': {result.modified_count}")


# ── Job 2: Cambiar eventos a 'ongoing' cuando empiezan ────────────────────────
async def activate_started_events():
    """
    Cambia a 'ongoing' los eventos cuya fecha de inicio ya pasó
    y aún están en 'published'.
    Corre cada hora.
    """
    db = get_db()
    now = datetime.utcnow()
    result = await db.events.update_many(
        {
            "status": "published",
            "start_date": {"$lte": now},
            "end_date": {"$gt": now},
        },
        {"$set": {"status": "ongoing", "updated_at": now}},
    )
    if result.modified_count:
        logger.info(f"[Scheduler] Eventos activados como 'ongoing': {result.modified_count}")


# ── Job 3: Marcar documentos expirados ───────────────────────────────────────
async def expire_old_documents():
    """
    Cambia a 'archived' los documentos cuya fecha de expiración ya pasó.
    Corre una vez al día a medianoche.
    """
    db = get_db()
    now = datetime.utcnow()
    result = await db.documents.update_many(
        {
            "status": "active",
            "expires_at": {"$lt": now},
        },
        {"$set": {"status": "archived", "updated_at": now}},
    )
    if result.modified_count:
        logger.info(f"[Scheduler] Documentos archivados por expiración: {result.modified_count}")


# ── Job 4: Limpiar tokens QR usados o vencidos ────────────────────────────────
async def clean_used_qr_tokens():
    """
    Elimina tokens QR que ya fueron usados.
    Los no usados se eliminan automáticamente por el TTL index de MongoDB (10 min).
    Corre cada 30 minutos.
    """
    db = get_db()
    result = await db.qr_tokens.delete_many({"used": True})
    if result.deleted_count:
        logger.info(f"[Scheduler] Tokens QR usados eliminados: {result.deleted_count}")


# ── Registro de jobs ──────────────────────────────────────────────────────────
def start_scheduler():
    scheduler.add_job(archive_finished_events, CronTrigger(minute=0))          # cada hora
    scheduler.add_job(activate_started_events, CronTrigger(minute=5))          # cada hora :05
    scheduler.add_job(expire_old_documents, CronTrigger(hour=0, minute=10))    # medianoche
    scheduler.add_job(clean_used_qr_tokens, CronTrigger(minute="*/30"))        # cada 30 min
    scheduler.start()
    logger.info("[Scheduler] APScheduler iniciado con 4 jobs registrados")


def stop_scheduler():
    scheduler.shutdown(wait=False)
    logger.info("[Scheduler] APScheduler detenido")