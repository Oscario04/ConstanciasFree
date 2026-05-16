# ─────────────────────────────────────────────────────────────────────────────
# CARPETA: app/
# ARCHIVO: main.py   ← REEMPLAZA el archivo que ya tienes
# ─────────────────────────────────────────────────────────────────────────────

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import auth, events, requests, attendance, documents, stats, users, admin
from app.database import connect_db, disconnect_db
from app.scheduler import start_scheduler, stop_scheduler

app = FastAPI(
    title="Plataforma de Constancias y Reconocimientos",
    description="API para emisión y gestión de diplomas, constancias y reconocimientos verificables",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "https://tu-frontend.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def startup():
    await connect_db()
    start_scheduler()


@app.on_event("shutdown")
async def shutdown():
    await disconnect_db()
    stop_scheduler()


# ── Routers ───────────────────────────────────────────────────────────────────
app.include_router(auth.router,       prefix="/api/auth",       tags=["Autenticación"])
app.include_router(users.router,      prefix="/api/users",      tags=["Usuarios"])
app.include_router(events.router,     prefix="/api/events",     tags=["Eventos"])
app.include_router(requests.router,   prefix="/api/requests",   tags=["Solicitudes"])
app.include_router(attendance.router, prefix="/api/attendance", tags=["Asistencia"])
app.include_router(documents.router,  prefix="/api/documents",  tags=["Documentos"])
app.include_router(stats.router,      prefix="/api/stats",      tags=["Estadísticas"])
app.include_router(admin.router,      prefix="/api/admin",      tags=["Administración"])


@app.get("/")
async def root():
    return {"message": "API de Constancias y Reconocimientos activa", "version": "1.0.0"}


@app.get("/health")
async def health():
    return {"status": "ok"}
