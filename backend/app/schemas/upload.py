import uuid
from datetime import datetime
from typing import Any

from pydantic import BaseModel, ConfigDict


class UploadRead(BaseModel):
    id: uuid.UUID
    contract_id: uuid.UUID
    voice_status: str
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)


class VoicePresignedResponse(BaseModel):
    upload_id: uuid.UUID
    presigned_url: str
    s3_key: str


class VoiceCompleteRequest(BaseModel):
    upload_id: uuid.UUID
    type: str  # 'name' | 'profile'
    s3_key: str
    duration_s: float | None = None


class VoiceStatusResponse(BaseModel):
    name: str   # pending | complete
    profile: str


class UploadProgressResponse(BaseModel):
    voice_done: bool
    you_pct: int
    your_life_pct: int
    for_keeper_pct: int


class DimensionEntryRead(BaseModel):
    id: uuid.UUID
    title: str | None
    body: str
    entry_type: str
    tags: dict | None
    media_s3_key: str | None = None
    duration_s: int | None = None
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)


class DimensionEntryCreate(BaseModel):
    title: str | None = None
    body: str
    entry_type: str = "text"
    tags: dict | None = None
    media_s3_key: str | None = None
    duration_s: int | None = None


class DimensionEntryUpdate(BaseModel):
    # All optional — only provided fields are updated (partial edit from the entry editor).
    title: str | None = None
    body: str | None = None
    tags: dict | None = None
    retag: bool = False  # re-run auto-tagging from the (possibly edited) body


class DimensionRead(BaseModel):
    id: uuid.UUID
    slug: str
    structured: dict[str, Any] | None
    entries: list[DimensionEntryRead]
    model_config = ConfigDict(from_attributes=True)


class DimensionUpdate(BaseModel):
    structured: dict[str, Any]


class HubResponse(BaseModel):
    contract_id: uuid.UUID
    keeper_name: str
    upload_id: uuid.UUID
    voice_status: str
    dimension_counts: dict  # {"history": 2, "relationships": 0, ...}
    your_life_counts: dict  # {"people": 3, "years": 1, "places": 2}
    model_config = ConfigDict(from_attributes=True)


class PersonRead(BaseModel):
    id: uuid.UUID
    name: str
    role: str | None
    notes: str | None
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)


class PersonCreate(BaseModel):
    name: str
    role: str | None = None
    notes: str | None = None


class YearRead(BaseModel):
    id: uuid.UUID
    year: int | None
    title: str
    body: str | None
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)


class YearCreate(BaseModel):
    year: int | None = None
    title: str
    body: str | None = None


class PlaceRead(BaseModel):
    id: uuid.UUID
    name: str
    why: str | None
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)


class PlaceCreate(BaseModel):
    name: str
    why: str | None = None


class KeeperMessageRead(BaseModel):
    id: uuid.UUID
    type: str
    trigger: str | None
    body: str
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)


class KeeperMessageCreate(BaseModel):
    type: str  # 'welcome' | 'for_when'
    trigger: str | None = None
    body: str


class KeeperProfileRead(BaseModel):
    who_they_are: str | None
    who_theyre_becoming: str | None
    what_you_want: str | None
    what_you_want_known: str | None
    advice: str | None
    model_config = ConfigDict(from_attributes=True)


class KeeperProfileUpdate(BaseModel):
    who_they_are: str | None = None
    who_theyre_becoming: str | None = None
    what_you_want: str | None = None
    what_you_want_known: str | None = None
    advice: str | None = None
