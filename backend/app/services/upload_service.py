import uuid
import logging
from datetime import datetime, timezone

import boto3
from sqlalchemy import func, select
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

    def generate_presigned_put_entry(self, upload_id: uuid.UUID) -> tuple[str, str]:
        """Presigned PUT for a voice-entry audio blob — same envelope as the
        name/profile recordings, but a unique key per entry under entries/."""
        s3_key = f"makers/{upload_id}/entries/{uuid.uuid4()}.webm"
        if not settings.media_bucket:
            raise ValueError("MEDIA_BUCKET not configured")
        s3 = boto3.client("s3", region_name=settings.aws_region)
        url = s3.generate_presigned_url(
            "put_object",
            Params={"Bucket": settings.media_bucket, "Key": s3_key, "ContentType": "audio/webm"},
            ExpiresIn=300,
        )
        return url, s3_key

    def generate_presigned_get(self, s3_key: str) -> str:
        """Presigned GET for playing back a Maker's own recording (voice name/
        profile, or a voice dimension entry) — media bucket is private."""
        if not settings.media_bucket:
            raise ValueError("MEDIA_BUCKET not configured")
        s3 = boto3.client("s3", region_name=settings.aws_region)
        return s3.generate_presigned_url(
            "get_object",
            Params={"Bucket": settings.media_bucket, "Key": s3_key},
            ExpiresIn=300,
        )

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
        # History facts (names, births, homes, family) feed the same People / Years /
        # Places triangulation store as entry tags — populate them automatically.
        if slug == "history":
            await self._triangulate_history_facts(upload_id, structured or {})
        return dim

    async def add_dimension_entry(
        self,
        dimension_id: uuid.UUID,
        body: str,
        title: str | None = None,
        entry_type: str = "text",
        tags: dict | None = None,
        media_s3_key: str | None = None,
        duration_s: int | None = None,
    ) -> DimensionEntry:
        entry = DimensionEntry(
            dimension_id=dimension_id,
            title=title,
            body=body,
            entry_type=entry_type,
            tags=tags,
            media_s3_key=media_s3_key,
            duration_s=duration_s,
        )
        self.db.add(entry)
        await self.db.flush()
        return entry

    async def get_dimension_entry(self, entry_id: uuid.UUID) -> DimensionEntry | None:
        result = await self.db.execute(select(DimensionEntry).where(DimensionEntry.id == entry_id))
        return result.scalar_one_or_none()

    async def update_dimension_entry(
        self,
        entry_id: uuid.UUID,
        *,
        title: str | None = None,
        body: str | None = None,
        tags: dict | None = None,
        retag: bool = False,
    ) -> DimensionEntry | None:
        entry = await self.get_dimension_entry(entry_id)
        if not entry:
            return None
        if title is not None:
            entry.title = title
        if body is not None:
            entry.body = body
        if tags is not None:
            entry.tags = tags
        elif retag:
            entry.tags = self.auto_tag(entry.body)
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

    def auto_tag(self, text: str) -> dict:
        """Best-effort Title/People/Year/Place extraction for an entry (Bedrock Haiku)."""
        from app.services.tagging_service import extract_entry_tags
        return extract_entry_tags(text)

    def fallback_title(self, text: str) -> str:
        """First few words of ``text`` — used when AI title extraction returns nothing."""
        from app.services.tagging_service import first_words_title
        return first_words_title(text)

    # ── Triangulation (form facts → People / Years / Places, deduped) ───────────

    @staticmethod
    def _norm(value: str) -> str:
        return " ".join(value.strip().lower().split())

    async def _triangulate_history_facts(self, upload_id: uuid.UUID, structured: dict) -> None:
        """Populate People / Years / Places from History form facts, skipping
        anything already present (whether it came from the form or an entry tag)."""
        def as_list(key: str) -> list[str]:
            v = structured.get(key)
            if isinstance(v, list):
                return [str(x).strip() for x in v if str(x).strip()]
            if isinstance(v, str) and v.strip():
                return [v.strip()]
            return []

        # People — parents / siblings / partners / children, tagged with their role.
        existing_people = {self._norm(p.name) for p in await self.list_people(upload_id)}
        role_map = {"parents": "parent", "siblings": "sibling", "partners": "partner", "children": "child"}
        for field, role in role_map.items():
            for name in as_list(field):
                if self._norm(name) not in existing_people:
                    self.db.add(Person(upload_id=upload_id, name=name, role=role))
                    existing_people.add(self._norm(name))

        # Places — place of birth + every home.
        existing_places = {self._norm(p.name) for p in await self.list_places(upload_id)}
        place_fields = as_list("place_of_birth") + as_list("homes")
        for name in place_fields:
            if self._norm(name) not in existing_places:
                self.db.add(Place(upload_id=upload_id, name=name))
                existing_places.add(self._norm(name))

        # Years — birth year parsed from DOB (MM/DD/YYYY).
        birth_year = self._parse_year(structured.get("dob"))
        if birth_year is not None:
            existing_years = {y.year for y in await self.list_years(upload_id)}
            if birth_year not in existing_years:
                self.db.add(Year(upload_id=upload_id, year=birth_year, title="Born"))

        await self.db.flush()

    @staticmethod
    def _parse_year(dob) -> int | None:
        if not dob or not isinstance(dob, str):
            return None
        for part in dob.replace("-", "/").split("/"):
            part = part.strip()
            if len(part) == 4 and part.isdigit():
                y = int(part)
                if 1900 <= y <= 2100:
                    return y
        return None

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

    # ── Hub counts ────────────────────────────────────────────────────────────

    async def get_hub_counts(self, upload_id: uuid.UUID) -> dict:
        YOU_SLUGS = ["history", "relationships", "how-you-think", "how-you-talk", "how-you-live", "beliefs", "heart"]

        dims_result = await self.db.execute(
            select(Dimension).where(Dimension.upload_id == upload_id)
        )
        dims = {d.slug: d.id for d in dims_result.scalars().all()}

        dimension_counts: dict[str, int] = {slug: 0 for slug in YOU_SLUGS}
        for slug, dim_id in dims.items():
            if slug in dimension_counts:
                count_result = await self.db.execute(
                    select(func.count()).select_from(DimensionEntry).where(DimensionEntry.dimension_id == dim_id)
                )
                dimension_counts[slug] = count_result.scalar_one()

        people_count = await self.db.scalar(select(func.count()).select_from(Person).where(Person.upload_id == upload_id))
        years_count = await self.db.scalar(select(func.count()).select_from(Year).where(Year.upload_id == upload_id))
        places_count = await self.db.scalar(select(func.count()).select_from(Place).where(Place.upload_id == upload_id))

        return {
            "dimension_counts": dimension_counts,
            "your_life_counts": {
                "people": people_count or 0,
                "years": years_count or 0,
                "places": places_count or 0,
            },
        }

    # ── Progress ──────────────────────────────────────────────────────────────

    async def get_progress(self, upload: Upload, contract_id: uuid.UUID) -> dict:
        YOU_SLUGS = ["history", "relationships", "how-you-think", "how-you-talk", "how-you-live", "beliefs", "heart"]

        dims_result = await self.db.execute(
            select(Dimension).where(Dimension.upload_id == upload.id)
        )
        filled_dims = {d.slug for d in dims_result.scalars().all() if d.structured or True}
        you_pct = min(100, int(len({s for s in filled_dims if s in YOU_SLUGS}) / len(YOU_SLUGS) * 100))

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
