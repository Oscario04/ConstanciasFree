"""
Seed demo data for ConstanciasFree.

Usage:
    python scripts/seed_demo.py
    python scripts/seed_demo.py --reset-demo

The seed is idempotent and marks records with `demo_seed: true`.
It creates one user per role, several events, requests, attendance records,
and local demo PDFs for public verification/download.
"""

from __future__ import annotations

import argparse
import asyncio
import sys
from datetime import datetime, timedelta, UTC
from pathlib import Path
from typing import Any

from bson import ObjectId
from dotenv import load_dotenv
from motor.motor_asyncio import AsyncIOMotorClient

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))

from app.config import settings
from app.services.pdf_service import generate_constancia_pdf
from app.utils.auth import hash_password


DEMO_PASSWORD = "Demo1234!"
PDF_DIR = Path("/tmp/constancias")


DEMO_USERS = [
    {
        "key": "admin",
        "name": "Admin Demo",
        "email": "admin.demo@constancias.local",
        "role": "admin",
        "institution": "Direccion General",
        "bio": "Gestion completa del sistema demo.",
    },
    {
        "key": "organizer",
        "name": "Organizador Demo",
        "email": "organizador.demo@constancias.local",
        "role": "organizer",
        "institution": "Coordinacion Academica",
        "bio": "Gestion de eventos, solicitudes y documentos.",
    },
    {
        "key": "staff",
        "name": "Staff Demo",
        "email": "staff.demo@constancias.local",
        "role": "staff",
        "institution": "Operaciones",
        "bio": "Registro de asistencia y check-in.",
    },
    {
        "key": "speaker",
        "name": "Ponente Demo",
        "email": "ponente.demo@constancias.local",
        "role": "speaker",
        "institution": "Universidad Demo",
        "bio": "Ponente invitado para sesiones academicas.",
    },
    {
        "key": "attendee",
        "name": "Participante Demo",
        "email": "participante.demo@constancias.local",
        "role": "attendee",
        "institution": "Comunidad Demo",
        "bio": "Participante con solicitudes y documentos emitidos.",
    },
]


def utc(days: int = 0, hours: int = 0) -> datetime:
    return datetime.now(UTC) + timedelta(days=days, hours=hours)


async def upsert_user(db, user: dict[str, Any]) -> ObjectId:
    now = datetime.now(UTC)
    existing = await db.users.find_one({"email": user["email"]})
    update = {
        "$set": {
            "name": user["name"],
            "role": user["role"],
            "status": "active",
            "phone": "555-0100",
            "institution": user["institution"],
            "bio": user["bio"],
            "demo_seed": True,
            "updated_at": now,
        },
        "$setOnInsert": {
            "email": user["email"],
            "password": hash_password(DEMO_PASSWORD),
            "created_at": now,
        },
    }
    result = await db.users.update_one({"email": user["email"]}, update, upsert=True)
    if existing:
        return existing["_id"]
    return result.upserted_id


async def upsert_event(db, key: str, organizer_id: ObjectId, data: dict[str, Any]) -> ObjectId:
    now = datetime.now(UTC)
    doc = {
        **data,
        "organizer_id": str(organizer_id),
        "demo_key": key,
        "demo_seed": True,
        "updated_at": now,
    }
    result = await db.events.update_one(
        {"demo_key": key},
        {
            "$set": doc,
            "$setOnInsert": {
                "created_at": now,
            },
        },
        upsert=True,
    )
    existing = await db.events.find_one({"demo_key": key})
    return existing["_id"] if existing else result.upserted_id


async def upsert_request(
    db,
    user_id: ObjectId,
    event_id: ObjectId,
    requested_role: str,
    status: str,
    message: str,
    admin_id: ObjectId,
) -> ObjectId:
    now = datetime.now(UTC)
    data = {
        "user_id": str(user_id),
        "event_id": str(event_id),
        "requested_role": requested_role,
        "status": status,
        "message": message,
        "admin_message": "Aprobado para la demo" if status == "approved" else None,
        "demo_seed": True,
        "updated_at": now,
    }
    if status in {"approved", "rejected"}:
        data["reviewed_by"] = str(admin_id)
        data["reviewed_at"] = now
    await db.requests.update_one(
        {"user_id": str(user_id), "event_id": str(event_id), "demo_seed": True},
        {"$set": data, "$setOnInsert": {"created_at": now}},
        upsert=True,
    )
    existing = await db.requests.find_one({"user_id": str(user_id), "event_id": str(event_id), "demo_seed": True})
    return existing["_id"]


def write_demo_pdf(code: str, user_name: str, event_title: str, role: str, doc_type: str) -> str:
    PDF_DIR.mkdir(parents=True, exist_ok=True)
    verification_url = f"{settings.FRONTEND_URL}/verificar/{code}"
    pdf_bytes = generate_constancia_pdf(
        recipient_name=user_name,
        event_title=event_title,
        event_date=datetime.now().strftime("%d/%m/%Y"),
        role=role,
        verification_url=verification_url,
        doc_type=doc_type,
        institution="ConstanciasFree Demo",
        hours=12,
    )
    path = PDF_DIR / f"{code}.pdf"
    path.write_bytes(pdf_bytes)
    return f"local-demo://{code}"


async def upsert_document(
    db,
    user_id: ObjectId,
    event_id: ObjectId,
    code: str,
    user_name: str,
    event_title: str,
    role: str,
    doc_type: str,
    status: str = "active",
) -> None:
    now = datetime.now(UTC)
    pdf_url = write_demo_pdf(code, user_name, event_title, role, doc_type)
    await db.documents.update_one(
        {"verification_code": code},
        {
            "$set": {
                "user_id": str(user_id),
                "event_id": str(event_id),
                "document_type": doc_type,
                "status": status,
                "public_url": f"{settings.FRONTEND_URL}/verificar/{code}",
                "pdf_url": pdf_url,
                "qr_url": f"{settings.FRONTEND_URL}/verificar/{code}",
                "issued_at": now - timedelta(days=3),
                "expires_at": now + timedelta(days=365 * 5),
                "metadata": {
                    "user_name": user_name,
                    "event_title": event_title,
                    "role": role,
                    "demo": "true",
                },
                "demo_seed": True,
            },
            "$setOnInsert": {"created_at": now},
        },
        upsert=True,
    )


async def seed(reset_demo: bool) -> None:
    load_dotenv(ROOT / ".env")
    client = AsyncIOMotorClient(settings.MONGODB_URL)
    db = client[settings.DATABASE_NAME]

    if reset_demo:
        for collection in ("qr_tokens", "attendance", "documents", "requests", "events", "users"):
            await db[collection].delete_many({"demo_seed": True})

    users: dict[str, ObjectId] = {}
    for user in DEMO_USERS:
        users[user["key"]] = await upsert_user(db, user)

    events = {
        "published": await upsert_event(
            db,
            "demo-published",
            users["organizer"],
            {
                "title": "Seminario de Innovacion Publica",
                "description": "Evento publicado para probar catalogo, detalle y solicitudes de participantes.",
                "event_type": "seminar",
                "start_date": utc(days=14),
                "end_date": utc(days=14, hours=6),
                "venue": "Auditorio Institucional",
                "capacity": 120,
                "registered": 42,
                "sessions": [
                    {
                        "title": "Gobierno digital y trazabilidad",
                        "start_time": utc(days=14),
                        "end_time": utc(days=14, hours=2),
                        "location": "Sala A",
                        "speaker_ids": [str(users["speaker"])],
                    }
                ],
                "retention_years": 5,
                "status": "published",
            },
        ),
        "ongoing": await upsert_event(
            db,
            "demo-ongoing",
            users["organizer"],
            {
                "title": "Taller de Verificacion Documental",
                "description": "Evento en curso para probar asistencia, documentos y panel staff.",
                "event_type": "workshop",
                "start_date": utc(hours=-2),
                "end_date": utc(hours=4),
                "venue": "Laboratorio de Computo",
                "capacity": 40,
                "registered": 18,
                "sessions": [],
                "retention_years": 5,
                "status": "ongoing",
            },
        ),
        "finished": await upsert_event(
            db,
            "demo-finished",
            users["organizer"],
            {
                "title": "Congreso de Gestion Academica",
                "description": "Evento finalizado con constancias y reconocimientos emitidos.",
                "event_type": "conference",
                "start_date": utc(days=-30),
                "end_date": utc(days=-29),
                "venue": "Centro de Convenciones Demo",
                "capacity": 250,
                "registered": 210,
                "sessions": [],
                "retention_years": 5,
                "status": "finished",
            },
        ),
        "draft": await upsert_event(
            db,
            "demo-draft",
            users["organizer"],
            {
                "title": "Curso Interno en Preparacion",
                "description": "Borrador visible para admin/organizer y oculto para flujo de solicitud.",
                "event_type": "course",
                "start_date": utc(days=45),
                "end_date": utc(days=46),
                "venue": "Por confirmar",
                "capacity": 60,
                "registered": 0,
                "sessions": [],
                "retention_years": 5,
                "status": "draft",
            },
        ),
    }

    await upsert_request(
        db,
        users["attendee"],
        events["published"],
        "attendee",
        "pending",
        "Me interesa participar para conocer el flujo completo.",
        users["admin"],
    )
    await upsert_request(
        db,
        users["attendee"],
        events["finished"],
        "attendee",
        "approved",
        "Participe en el congreso y solicito mi constancia.",
        users["admin"],
    )
    await upsert_request(
        db,
        users["speaker"],
        events["finished"],
        "speaker",
        "approved",
        "Ponencia magistral de prueba.",
        users["admin"],
    )
    await upsert_request(
        db,
        users["staff"],
        events["ongoing"],
        "staff",
        "approved",
        "Apoyo operativo en registro.",
        users["admin"],
    )

    await db.attendance.update_one(
        {"user_id": str(users["attendee"]), "event_id": str(events["finished"]), "demo_seed": True},
        {
            "$set": {
                "user_id": str(users["attendee"]),
                "event_id": str(events["finished"]),
                "session_id": None,
                "check_in": utc(days=-30),
                "check_out": utc(days=-30, hours=6),
                "method": "qr",
                "registered_by": str(users["staff"]),
                "created_at": utc(days=-30),
                "demo_seed": True,
            }
        },
        upsert=True,
    )
    await db.attendance.update_one(
        {"user_id": str(users["staff"]), "event_id": str(events["ongoing"]), "demo_seed": True},
        {
            "$set": {
                "user_id": str(users["staff"]),
                "event_id": str(events["ongoing"]),
                "session_id": None,
                "check_in": utc(hours=-1),
                "check_out": None,
                "method": "manual",
                "registered_by": str(users["admin"]),
                "created_at": utc(hours=-1),
                "demo_seed": True,
            }
        },
        upsert=True,
    )

    await upsert_document(
        db,
        users["attendee"],
        events["finished"],
        "DEMO-CONSTANCIA-001",
        "Participante Demo",
        "Congreso de Gestion Academica",
        "attendee",
        "constancia",
    )
    await upsert_document(
        db,
        users["speaker"],
        events["finished"],
        "DEMO-DIPLOMA-001",
        "Ponente Demo",
        "Congreso de Gestion Academica",
        "speaker",
        "diploma",
    )
    await upsert_document(
        db,
        users["staff"],
        events["ongoing"],
        "DEMO-RECONOCIMIENTO-001",
        "Staff Demo",
        "Taller de Verificacion Documental",
        "staff",
        "reconocimiento",
    )
    await upsert_document(
        db,
        users["attendee"],
        events["finished"],
        "DEMO-REVOKED-001",
        "Participante Demo",
        "Congreso de Gestion Academica",
        "attendee",
        "constancia",
        status="revoked",
    )

    client.close()

    print("Demo seed listo.")
    print(f"Password para todos los usuarios demo: {DEMO_PASSWORD}")
    for user in DEMO_USERS:
        print(f"- {user['role']}: {user['email']}")
    print("Codigos publicos: DEMO-CONSTANCIA-001, DEMO-DIPLOMA-001, DEMO-RECONOCIMIENTO-001, DEMO-REVOKED-001")


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--reset-demo", action="store_true", help="Delete demo_seed records before seeding.")
    args = parser.parse_args()
    asyncio.run(seed(reset_demo=args.reset_demo))
