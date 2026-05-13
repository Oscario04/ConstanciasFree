"""
Script para crear el primer usuario administrador.
Ejecutar desde la raíz del proyecto:
    python crear_admin.py
"""

import asyncio
import sys
import os

# Asegura que Python encuentre los módulos de la app
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "app"))

from dotenv import load_dotenv
load_dotenv("app/.env")

from motor.motor_asyncio import AsyncIOMotorClient
from app.utils.auth import hash_password
from datetime import datetime, UTC

# ─── Configura aquí tus datos de admin ───────────────────────────────────────
ADMIN_NAME       = "Administrador"
ADMIN_EMAIL      = "oscar@gmail.com"
ADMIN_PASSWORD   = "Admin123"   # Cámbiala después de entrar
# ─────────────────────────────────────────────────────────────────────────────

MONGO_URL = os.getenv("MONGODB_URL", "mongodb+srv://oscardavidguzmanmares2004_db_user:zRH113thwNsusLnX@cluster0.ervxzcm.mongodb.net/?appName=Cluster0")
DB_NAME   = os.getenv("DB_NAME", "constancias_db")


async def crear_admin():
    client = AsyncIOMotorClient(MONGO_URL)
    db = client[DB_NAME]

    # Verifica si ya existe un admin
    existente = await db.users.find_one({"email": ADMIN_EMAIL})
    if existente:
        print(f"⚠️  Ya existe un usuario con el correo {ADMIN_EMAIL}")
        client.close()
        return

    doc = {
        "name":       ADMIN_NAME,
        "email":      ADMIN_EMAIL,
        "password":   hash_password(ADMIN_PASSWORD),
        "role":       "admin",
        "status":     "active",
        "created_at": datetime.now(UTC),
        "updated_at": datetime.now(UTC),
    }

    result = await db.users.insert_one(doc)
    print("✅ Admin creado exitosamente")
    print(f"   ID:       {result.inserted_id}")
    print(f"   Email:    {ADMIN_EMAIL}")
    print(f"   Password: {ADMIN_PASSWORD}")
    print("\n⚠️  Cambia la contraseña después de tu primer login.")
    client.close()


if __name__ == "__main__":
    asyncio.run(crear_admin())