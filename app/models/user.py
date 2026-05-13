from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import datetime
from enum import Enum

class UserRole(str, Enum):
    ADMIN = "admin"
    ORGANIZER = "organizer"
    SPEAKER = "speaker"
    ATTENDEE = "attendee"
    STAFF = "staff"

class UserStatus(str, Enum):
    ACTIVE = "active"
    INACTIVE = "inactive"
    SUSPENDED = "suspended"

class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str
    role: UserRole = UserRole.ATTENDEE

class UserUpdate(BaseModel):
    name: Optional[str] = None
    phone: Optional[str] = None
    institution: Optional[str] = None
    bio: Optional[str] = None

class UserInDB(BaseModel):
    id: str
    name: str
    email: str
    role: UserRole
    status: UserStatus = UserStatus.ACTIVE
    phone: Optional[str] = None
    institution: Optional[str] = None
    bio: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class UserPublic(BaseModel):
    id: str
    name: str
    email: str
    role: UserRole
    status: UserStatus
    institution: Optional[str] = None
    created_at: datetime