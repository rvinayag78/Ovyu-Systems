import uuid
import logging
from datetime import datetime, timezone

import boto3
from botocore.exceptions import ClientError
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.models.upload import (
    Dimension, DimensionEntry, KeeperMessage, KeeperProfile,
    Person, Place, Upload, VoiceRecording, Year,
)

logger = logging.getLogger(__name__)

VOICE_TYPES = ("name", "profile")


class UploadService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_or_create_upload(self, contract_id: uuid.UUID, maker_id: uuid.UUID) -> Upload:
        result = await self.db.execute(select(Upload).where(Upload.contract_id == contract_id))
        upload = result.scalar_one_or_none()
        if not upload:
            upload = Upload(contract_id=contract_id, maker_id=maker_id)
            self.db.add(upload)
            await self.db.flush()
        return upload

    async def get_upload_by_contract(self, contract_id: uuid.UUID) -> Upload | None:
        result = await self.db.execute(select(Upload).where(Upload.contract_id == contract_id))
        return result.scalar_one_or_none()

    # ── Voice ─────────────────────────────────────────────────────────────────

    def generate_presigned_put(self, upload_id: uuid.UUID, voice_type: str) -> tuple[str, str]:
        s3_key = f"makers/{upload_id}/voice/{voice_type}.webm"
        if not settings.media_bucket:
            raise ValueError("MEDIA_BUCKET not configured")
        s3 = boto3.client("s3", region_name=settings.aws_region)
        url = s3.generate_presigned_url(
            "put_object",
            Params={"Bucket": settings.media_bucket, "Key": s3_key, "ContentType": "audio/webm"},
            ExpiresIn=300,
        )
        return url, s3_key

    async def complete_voice_recording(
        self,
        upload_id: uuid.UUID,
        voice_type: str,
        s3_key: str,
        duration_s: float | None,
    ) -> None:
        result = await self.db.execute(
            select(VoiceRecording).where(
                VoiceRecording.upload_id == upload_id,
                VoiceRecording.type == voice_type,
            )
        )
        recording = result.scalar_one_or_none()
        if recording:
            recording.s3_key = s3_key
            recording.status = "complete"
            recording.duration_s = duration_s
        else:
            recording = VoiceRecording(
                upload_id=upload_id,
                type=voice_type,
                s3_key=s3_key,
                status="complete",
                duration_s=duration_s,
            )
            self.db.add(recording)

        await self._refresh_voice_status(upload_id)
        await self.db.flush()

    async def _refresh_voice_status(self, upload_id: uuid.UUID) -> None:
        result = await self.db.execute(
            select(VoiceRecording).where(VoiceRecording.upload_id == upload_id)
        )
        recordings = result.scalars().all()
        completed = {r.type for r in recordings if r.status == "complete"}
        upload_result = await self.db.execute(select(Upload).where(Upload.id == upload_id))
        upload = upload_result.scalar_one()
        upload.voice_status = "complete" if {"name", "profile"}.issubset(completed) else "pending"

    async def get_voice_status(self, upload_id: uuid.UUID) -> dict[str, str]:
        result = await self.db.execute(
            select(VoiceRecording).where(VoiceRecording.upload_id == upload_id)
        )
        recordings = {r.type: r.status for r in result.scalars().all()}
        return {
            "name": recordings.get("name", "pending"),
            "profile": recordings.get("profile", "pending"),
        }

    # ── YOU — Dimensions ──────────────────────────────────────────────────────

    async def get_dimension(self, upload_id: uuid.UUID, slug: str) -> Dimension | None:
        result = await self.db.execute(
            select(Dimension).where(Dimension.upload_id == upload_id, Dimension.slug == slug)
        )
        return result.scalar_one_or_none()

    async def upsert_dimension(self, upload_id: uuid.UUID, slug: str, structured: dict) -> Dimension:
        dim = await self.get_dimension(upload_id, slug)
        if dim:
            dim.structured = structured
            dim.updated_at = datetime.now(timezone.utc)
        else:
            dim = Dimension(upload_id=upload_id, slug=slug, structured=structured)
            self.db.add(dim)
        await self.db.flush()
        return dim

    async def add_dimension_entry(self, dimension_id: uuid.UUID, body: str) -> DimensionEntry:
        entry = DimensionEntry(dimension_id=dimension_id, body=body)
        self.db.add(entry)
        await self.db.flush()
        return entry

    async def delete_dimension_entry(self, entry_id: uuid.UUID) -> None:
        result = await self.db.execute(select(DimensionEntry).where(DimensionEntry.id == entry_id))
        entry = result.scalar_one_or_none()
        if entry:
            await self.db.delete(entry)

    async def get_dimension_entries(self, dimension_id: uuid.UUID) -> list[DimensionEntry]:
        result = await self.db.execute(
            select(DimensionEntry).where(DimensionEntry.dimension_id == dimension_id)
        )
        return list(result.scalars().all())

    # ── YOUR LIFE — People ────────────────────────────────────────────────────

    async def list_people(self, upload_id: uuid.UUID) -> list[Person]:
        result = await self.db.execute(select(Person).where(Person.upload_id == upload_id))
        return list(result.scalars().all())

    async def add_person(self, upload_id: uuid.UUID, name: str, role: str | None, notes: str | None) -> Person:
        person = Person(upload_id=upload_id, name=name, role=role, notes=notes)
        self.db.add(person)
        await self.db.flush()
        return person

    async def update_person(self, person_id: uuid.UUID, name: str, role: str | None, notes: str | None) -> Person | None:
        result = await self.db.execute(select(Person).where(Person.id == person_id))
        person = result.scalar_one_or_none()
        if person:
            person.name = name
            person.role = role
            person.notes = notes
            await self.db.flush()
        return person

    async def delete_person(self, person_id: uuid.UUID) -> None:
        result = await self.db.execute(select(Person).where(Person.id == person_id))
        person = result.scalar_one_or_none()
        if person:
            await self.db.delete(person)

    # ── YOUR LIFE — Years ─────────────────────────────────────────────────────

    async def list_years(self, upload_id: uuid.UUID) -> list[Year]:
        result = await self.db.execute(
            select(Year).where(Year.upload_id == upload_id).order_by(Year.year.nullsfirst())
        )
        return list(result.scalars().all())

    async def add_year(self, upload_id: uuid.UUID, year: int | None, title: str, body: str | None) -> Year:
        entry = Year(upload_id=upload_id, year=year, title=title, body=body)
        self.db.add(entry)
        await self.db.flush()
        return entry

    async def update_year(self, year_id: uuid.UUID, year: int | None, title: str, body: str | None) -> Year | None:
        result = await self.db.execute(select(Year).where(Year.id == year_id))
        entry = result.scalar_one_or_none()
        if entry:
            entry.year = year
            entry.title = title
            entry.body = body
            await self.db.flush()
        return entry

    async def delete_year(self, year_id: uuid.UUID) -> None:
        result = await self.db.execute(select(Year).where(Year.id == year_id))
        entry = result.scalar_one_or_none()
        if entry:
            await self.db.delete(entry)

    # ── YOUR LIFE — Places ────────────────────────────────────────────────────

    async def list_places(self, upload_id: uuid.UUID) -> list[Place]:
        result = await self.db.execute(select(Place).where(Place.upload_id == upload_id))
        return list(result.scalars().all())

    async def add_place(self, upload_id: uuid.UUID, name: str, why: str | None) -> Place:
        place = Place(upload_id=upload_id, name=name, why=why)
        self.db.add(place)
        await self.db.flush()
        return place

    async def delete_place(self, place_id: uuid.UUID) -> None:
        result = await self.db.execute(select(Place).where(Place.id == place_id))
        place = result.scalar_one_or_none()
        if place:
            await self.db.delete(place)

    # ── FOR KEEPER — Messages ─────────────────────────────────────────────────

    async def list_keeper_messages(self, contract_id: uuid.UUID) -> list[KeeperMessage]:
        result = await self.db.execute(
            select(KeeperMessage).where(KeeperMessage.contract_id == contract_id)
        )
        return list(result.scalars().all())

    async def upsert_keeper_message(
        self, contract_id: uuid.UUID, msg_type: str, body: str, trigger: str | None
    ) -> KeeperMessage:
        if msg_type == "welcome":
            result = await self.db.execute(
                select(KeeperMessage).where(
                    KeeperMessage.contract_id == contract_id,
                    KeeperMessage.type == "welcome",
                )
            )
            existing = result.scalar_one_or_none()
            if existing:
                existing.body = body
                await self.db.flush()
                return existing
        msg = KeeperMessage(contract_id=contract_id, type=msg_type, trigger=trigger, body=body)
        self.db.add(msg)
        await self.db.flush()
        return msg

    async def delete_keeper_message(self, message_id: uuid.UUID) -> None:
        result = await self.db.execute(select(KeeperMessage).where(KeeperMessage.id == message_id))
        msg = result.scalar_one_or_none()
        if msg:
            await self.db.delete(msg)

    # ── FOR KEEPER — Profile ──────────────────────────────────────────────────

    async def get_keeper_profile(self, contract_id: uuid.UUID) -> KeeperProfile | None:
        result = await self.db.execute(
            select(KeeperProfile).where(KeeperProfile.contract_id == contract_id)
        )
        return result.scalar_one_or_none()

    async def upsert_keeper_profile(self, contract_id: uuid.UUID, **fields) -> KeeperProfile:
        profile = await self.get_keeper_profile(contract_id)
        if profile:
            for k, v in fields.items():
                setattr(profile, k, v)
            profile.updated_at = datetime.now(timezone.utc)
        else:
            profile = KeeperProfile(contract_id=contract_id, **fields)
            self.db.add(profile)
        await self.db.flush()
        return profile

    # ── Progress ──────────────────────────────────────────────────────────────

    async def get_progress(self, upload: Upload, contract_id: uuid.UUID) -> dict:
        YOU_SLUGS = ["faith", "family", "work", "health", "values", "personality", "legacy", "lessons"]

        dims_result = await self.db.execute(
            select(Dimension).where(Dimension.upload_id == upload.id)
        )
        filled_dims = {d.slug for d in dims_result.scalars().all() if d.structured}
        you_pct = int(len(filled_dims) / len(YOU_SLUGS) * 100)

        people_result = await self.db.execute(select(Person).where(Person.upload_id == upload.id))
        years_result = await self.db.execute(select(Year).where(Year.upload_id == upload.id))
        places_result = await self.db.execute(select(Place).where(Place.upload_id == upload.id))
        life_items = (
            len(list(people_result.scalars().all()))
            + len(list(years_result.scalars().all()))
            + len(list(places_result.scalars().all()))
        )
        your_life_pct = min(100, life_items * 10)

        msgs_result = await self.db.execute(
            select(KeeperMessage).where(KeeperMessage.contract_id == contract_id)
        )
        profile = await self.get_keeper_profile(contract_id)
        keeper_items = len(list(msgs_result.scalars().all()))
        profile_fields = 0
        if profile:
            profile_fields = sum(
                1 for f in [profile.who_they_are, profile.who_theyre_becoming,
                             profile.what_you_want, profile.what_you_want_known, profile.advice]
                if f
            )
        for_keeper_pct = min(100, int((keeper_items + profile_fields) / 7 * 100))

        return {
            "voice_done": upload.voice_status == "complete",
            "you_pct": you_pct,
            "your_life_pct": your_life_pct,
            "for_keeper_pct": for_keeper_pct,
        }
