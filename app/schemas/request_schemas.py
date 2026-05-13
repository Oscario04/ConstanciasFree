# ─────────────────────────────────────────────────────────────────────────────
# CARPETA: app/schemas/
# ARCHIVO: request_schemas.py
# ─────────────────────────────────────────────────────────────────────────────

"""
Schemas de entrada y salida para los endpoints de la API.
Se separan de los modelos de base de datos para mayor claridad
y para evitar exponer campos internos (como passwords o IDs de Mongo).
"""

from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import datetime
from enum import Enum


# ══════════════════════════════════════════════════════════════════════════════
# AUTH
# ══════════════════════════════════════════════════════════════════════════════

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: dict


class PasswordChange(BaseModel):
    current_password: str
    new_password: str = Field(..., min_length=8)


class PasswordReset(BaseModel):
    email: EmailStr


# ══════════════════════════════════════════════════════════════════════════════
# USERS
# ══════════════════════════════════════════════════════════════════════════════

class UserResponse(BaseModel):
    id: str
    name: str
    email: str
    role: str
    status: str
    phone: Optional[str] = None
    institution: Optional[str] = None
    bio: Optional[str] = None
    created_at: datetime


class UserListResponse(BaseModel):
    users: List[UserResponse]
    total: int
    skip: int
    limit: int


# ══════════════════════════════════════════════════════════════════════════════
# EVENTS
# ══════════════════════════════════════════════════════════════════════════════

class EventResponse(BaseModel):
    id: str
    title: str
    description: str
    event_type: str
    start_date: datetime
    end_date: datetime
    venue: Optional[str] = None
    capacity: int
    registered: int
    status: str
    organizer_id: str
    retention_years: int
    created_at: datetime


class EventListResponse(BaseModel):
    events: List[EventResponse]
    total: int


# ══════════════════════════════════════════════════════════════════════════════
# REQUESTS
# ══════════════════════════════════════════════════════════════════════════════

class RequestResponse(BaseModel):
    id: str
    user_id: str
    event_id: str
    requested_role: str
    status: str
    message: Optional[str] = None
    admin_message: Optional[str] = None
    created_at: datetime
    updated_at: datetime


# ══════════════════════════════════════════════════════════════════════════════
# ATTENDANCE
# ══════════════════════════════════════════════════════════════════════════════

class AttendanceResponse(BaseModel):
    id: str
    user_id: str
    event_id: str
    session_id: Optional[str] = None
    check_in: datetime
    check_out: Optional[datetime] = None
    method: str
    registered_by: Optional[str] = None


# ══════════════════════════════════════════════════════════════════════════════
# DOCUMENTS
# ══════════════════════════════════════════════════════════════════════════════

class DocumentResponse(BaseModel):
    id: str
    user_id: str
    event_id: str
    document_type: str
    status: str
    verification_code: str
    public_url: str
    pdf_url: str
    issued_at: datetime
    expires_at: Optional[datetime] = None
    metadata: dict = {}


class DocumentVerifyResponse(BaseModel):
    valid: bool
    document_type: str
    issued_at: datetime
    expires_at: Optional[datetime] = None
    metadata: dict
    pdf_url: Optional[str] = None


# ══════════════════════════════════════════════════════════════════════════════
# STATS
# ══════════════════════════════════════════════════════════════════════════════

class DashboardStatsResponse(BaseModel):
    total_events: int
    total_users: int
    total_documents: int
    total_requests: int
    pending_requests: int
    approved_requests: int


class EventStatsResponse(BaseModel):
    total_requests: int
    approved: int
    rejected: int
    pending: int
    total_attendance: int
    total_documents: int