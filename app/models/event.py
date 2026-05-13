from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from enum import Enum

class EventStatus(str, Enum):
    DRAFT = "draft"
    PUBLISHED = "published"
    ONGOING = "ongoing"
    FINISHED = "finished"
    ARCHIVED = "archived"

class EventType(str, Enum):
    CONFERENCE = "conference"
    WORKSHOP = "workshop"
    COURSE = "course"
    SEMINAR = "seminar"
    WEBINAR = "webinar"

class SessionModel(BaseModel):
    title: str
    start_time: datetime
    end_time: datetime
    location: Optional[str] = None
    speaker_ids: List[str] = []

class EventCreate(BaseModel):
    title: str
    description: str
    event_type: EventType
    start_date: datetime
    end_date: datetime
    venue: Optional[str] = None
    capacity: int = 0
    sessions: List[SessionModel] = []
    retention_years: int = 5

class EventUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    venue: Optional[str] = None
    capacity: Optional[int] = None
    status: Optional[EventStatus] = None

class EventInDB(BaseModel):
    id: str
    title: str
    description: str
    event_type: EventType
    start_date: datetime
    end_date: datetime
    venue: Optional[str] = None
    capacity: int
    registered: int = 0
    sessions: List[SessionModel] = []
    organizer_id: str
    status: EventStatus = EventStatus.DRAFT
    retention_years: int = 5
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)