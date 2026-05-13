from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from enum import Enum

# ── Solicitudes ────────────────────────────────────────────────────────────────

class RequestStatus(str, Enum):
    PENDING = "pending"
    APPROVED = "approved"
    REJECTED = "rejected"

class ParticipantRole(str, Enum):
    SPEAKER = "speaker"
    ATTENDEE = "attendee"
    STAFF = "staff"
    ORGANIZER = "organizer"

class RequestCreate(BaseModel):
    event_id: str
    requested_role: ParticipantRole = ParticipantRole.ATTENDEE
    message: Optional[str] = None

class RequestUpdate(BaseModel):
    status: RequestStatus
    admin_message: Optional[str] = None

class RequestInDB(BaseModel):
    id: str
    user_id: str
    event_id: str
    requested_role: ParticipantRole
    status: RequestStatus = RequestStatus.PENDING
    message: Optional[str] = None
    admin_message: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

# ── Asistencia ─────────────────────────────────────────────────────────────────

class AttendanceMethod(str, Enum):
    QR = "qr"
    MANUAL = "manual"
    SESSION = "session"

class AttendanceRecord(BaseModel):
    id: str
    user_id: str
    event_id: str
    session_id: Optional[str] = None
    check_in: datetime
    check_out: Optional[datetime] = None
    method: AttendanceMethod = AttendanceMethod.MANUAL
    registered_by: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

class AttendanceCreate(BaseModel):
    user_id: str
    event_id: str
    session_id: Optional[str] = None
    method: AttendanceMethod = AttendanceMethod.MANUAL

# ── Documentos ─────────────────────────────────────────────────────────────────

class DocumentType(str, Enum):
    DIPLOMA = "diploma"
    CONSTANCIA = "constancia"
    RECONOCIMIENTO = "reconocimiento"

class DocumentStatus(str, Enum):
    ACTIVE = "active"
    REVOKED = "revoked"
    ARCHIVED = "archived"

class DocumentInDB(BaseModel):
    id: str
    user_id: str
    event_id: str
    document_type: DocumentType
    status: DocumentStatus = DocumentStatus.ACTIVE
    verification_code: str
    public_url: str
    pdf_url: str
    qr_url: str
    issued_at: datetime = Field(default_factory=datetime.utcnow)
    expires_at: Optional[datetime] = None
    metadata: dict = {}