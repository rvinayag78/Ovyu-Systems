import logging
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.models.user import User
from app.schemas.upload import (
    DimensionEntryCreate, DimensionEntryRead, DimensionRead, DimensionUpdate,
    HubResponse,
    KeeperMessageCreate, KeeperMessageRead, KeeperProfileRead, KeeperProfileUpdate,
    PersonCreate, PersonRead, PlaceCreate, PlaceRead,
    UploadProgressResponse, UploadRead, VoiceCompleteRequest,
    VoicePresignedResponse, VoiceStatusResponse, YearCreate, YearRead,
)
from app.services.contract_service import ContractService
from app.services.upload_service import UploadService

logger = logging.getLogger(__name__)
router = APIRouter()

YOU_SLUGS = ["history", "relationships", "how-you-think", "how-you-talk", "how-you-live", "beliefs", "heart"]


async def _require_upload(
    contract_id: UUID,
    current_user: User,
    db: AsyncSession,
) -> tuple["Upload", "UploadService"]:
    svc = UploadService(db)
    contract_svc = ContractService(db)
    contract = await contract_svc.get_contract(contract_id, current_user)
    if contract.maker_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only the Maker can upload")
    if contract.status != "LOCKED":
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Contract must be LOCKED to upload")
    upload = await svc.get_or_create_upload(contract_id, current_user.id)
    await db.commit()
    return upload, svc


# ── Hub ───────────────────────────────────────────────────────────────────────

@router.get("/contracts/{contract_id}/upload/hub", response_model=HubResponse)
async def get_hub(
    contract_id: UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> HubResponse:
    upload, svc = await _require_upload(contract_id, current_user, db)
    contract_svc = ContractService(db)
    contract = await contract_svc.get_contract(contract_id, current_user)
    counts = await svc.get_hub_counts(upload.id)
    return HubResponse(
        contract_id=contract_id,
        keeper_name=contract.keeper_name,
        upload_id=upload.id,
        voice_status=upload.voice_status,
        dimension_counts=counts["dimension_counts"],
        your_life_counts=counts["your_life_counts"],
    )


# ── Upload state ──────────────────────────────────────────────────────────────

@router.get("/contracts/{contract_id}/upload", response_model=UploadRead)
async def get_upload(
    contract_id: UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> UploadRead:
    upload, _ = await _require_upload(contract_id, current_user, db)
    return upload


@router.get("/contracts/{contract_id}/upload/progress", response_model=UploadProgressResponse)
async def get_progress(
    contract_id: UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> UploadProgressResponse:
    upload, svc = await _require_upload(contract_id, current_user, db)
    progress = await svc.get_progress(upload, contract_id)
    return UploadProgressResponse(**progress)


# ── Voice ─────────────────────────────────────────────────────────────────────

@router.post("/contracts/{contract_id}/upload/voice/presigned", response_model=VoicePresignedResponse)
async def voice_presigned(
    contract_id: UUID,
    voice_type: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> VoicePresignedResponse:
    if voice_type not in ("name", "profile"):
        raise HTTPException(status_code=400, detail="voice_type must be 'name' or 'profile'")
    upload, svc = await _require_upload(contract_id, current_user, db)
    try:
        url, s3_key = svc.generate_presigned_put(upload.id, voice_type)
    except ValueError as e:
        raise HTTPException(status_code=503, detail=str(e))
    return VoicePresignedResponse(upload_id=upload.id, presigned_url=url, s3_key=s3_key)


@router.post("/contracts/{contract_id}/upload/voice/complete", status_code=204)
async def voice_complete(
    contract_id: UUID,
    body: VoiceCompleteRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> None:
    upload, svc = await _require_upload(contract_id, current_user, db)
    if str(upload.id) != str(body.upload_id):
        raise HTTPException(status_code=400, detail="upload_id mismatch")
    if body.type not in ("name", "profile"):
        raise HTTPException(status_code=400, detail="type must be 'name' or 'profile'")
    await svc.complete_voice_recording(upload.id, body.type, body.s3_key, body.duration_s)
    await db.commit()


@router.get("/contracts/{contract_id}/upload/voice/status", response_model=VoiceStatusResponse)
async def voice_status(
    contract_id: UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> VoiceStatusResponse:
    upload, svc = await _require_upload(contract_id, current_user, db)
    statuses = await svc.get_voice_status(upload.id)
    return VoiceStatusResponse(**statuses)


# ── YOU — Dimensions ──────────────────────────────────────────────────────────

@router.get("/contracts/{contract_id}/upload/dimensions/{slug}", response_model=DimensionRead)
async def get_dimension(
    contract_id: UUID,
    slug: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> DimensionRead:
    if slug not in YOU_SLUGS:
        raise HTTPException(status_code=404, detail="Unknown dimension slug")
    upload, svc = await _require_upload(contract_id, current_user, db)
    dim = await svc.get_dimension(upload.id, slug)
    entries = await svc.get_dimension_entries(dim.id) if dim else []
    if not dim:
        return DimensionRead(id=upload.id, slug=slug, structured=None, entries=[])
    return DimensionRead(id=dim.id, slug=slug, structured=dim.structured, entries=[
        DimensionEntryRead(id=e.id, title=e.title, body=e.body, entry_type=e.entry_type, tags=e.tags, created_at=e.created_at) for e in entries
    ])


@router.put("/contracts/{contract_id}/upload/dimensions/{slug}", response_model=DimensionRead)
async def upsert_dimension(
    contract_id: UUID,
    slug: str,
    body: DimensionUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> DimensionRead:
    if slug not in YOU_SLUGS:
        raise HTTPException(status_code=404, detail="Unknown dimension slug")
    upload, svc = await _require_upload(contract_id, current_user, db)
    dim = await svc.upsert_dimension(upload.id, slug, body.structured)
    entries = await svc.get_dimension_entries(dim.id)
    await db.commit()
    return DimensionRead(id=dim.id, slug=slug, structured=dim.structured, entries=[
        DimensionEntryRead(id=e.id, title=e.title, body=e.body, entry_type=e.entry_type, tags=e.tags, created_at=e.created_at) for e in entries
    ])


@router.post("/contracts/{contract_id}/upload/dimensions/{slug}/entries", response_model=DimensionEntryRead, status_code=201)
async def add_dimension_entry(
    contract_id: UUID,
    slug: str,
    body: DimensionEntryCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> DimensionEntryRead:
    if slug not in YOU_SLUGS:
        raise HTTPException(status_code=404, detail="Unknown dimension slug")
    upload, svc = await _require_upload(contract_id, current_user, db)
    dim = await svc.get_dimension(upload.id, slug)
    if not dim:
        dim = await svc.upsert_dimension(upload.id, slug, {})
    entry = await svc.add_dimension_entry(dim.id, body.body, body.title, body.entry_type, body.tags)
    await db.commit()
    return DimensionEntryRead(id=entry.id, title=entry.title, body=entry.body, entry_type=entry.entry_type, tags=entry.tags, created_at=entry.created_at)


@router.delete("/contracts/{contract_id}/upload/dimensions/{slug}/entries/{entry_id}", status_code=204)
async def delete_dimension_entry(
    contract_id: UUID,
    slug: str,
    entry_id: UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> None:
    upload, svc = await _require_upload(contract_id, current_user, db)
    await svc.delete_dimension_entry(entry_id)
    await db.commit()


# ── YOUR LIFE — People ────────────────────────────────────────────────────────

@router.get("/contracts/{contract_id}/upload/people", response_model=list[PersonRead])
async def list_people(
    contract_id: UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> list[PersonRead]:
    upload, svc = await _require_upload(contract_id, current_user, db)
    return await svc.list_people(upload.id)


@router.post("/contracts/{contract_id}/upload/people", response_model=PersonRead, status_code=201)
async def add_person(
    contract_id: UUID,
    body: PersonCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> PersonRead:
    upload, svc = await _require_upload(contract_id, current_user, db)
    person = await svc.add_person(upload.id, body.name, body.role, body.notes)
    await db.commit()
    return person


@router.put("/contracts/{contract_id}/upload/people/{person_id}", response_model=PersonRead)
async def update_person(
    contract_id: UUID,
    person_id: UUID,
    body: PersonCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> PersonRead:
    upload, svc = await _require_upload(contract_id, current_user, db)
    person = await svc.update_person(person_id, body.name, body.role, body.notes)
    if not person:
        raise HTTPException(status_code=404, detail="Person not found")
    await db.commit()
    return person


@router.delete("/contracts/{contract_id}/upload/people/{person_id}", status_code=204)
async def delete_person(
    contract_id: UUID,
    person_id: UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> None:
    upload, svc = await _require_upload(contract_id, current_user, db)
    await svc.delete_person(person_id)
    await db.commit()


# ── YOUR LIFE — Years ─────────────────────────────────────────────────────────

@router.get("/contracts/{contract_id}/upload/years", response_model=list[YearRead])
async def list_years(
    contract_id: UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> list[YearRead]:
    upload, svc = await _require_upload(contract_id, current_user, db)
    return await svc.list_years(upload.id)


@router.post("/contracts/{contract_id}/upload/years", response_model=YearRead, status_code=201)
async def add_year(
    contract_id: UUID,
    body: YearCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> YearRead:
    upload, svc = await _require_upload(contract_id, current_user, db)
    entry = await svc.add_year(upload.id, body.year, body.title, body.body)
    await db.commit()
    return entry


@router.put("/contracts/{contract_id}/upload/years/{year_id}", response_model=YearRead)
async def update_year(
    contract_id: UUID,
    year_id: UUID,
    body: YearCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> YearRead:
    upload, svc = await _require_upload(contract_id, current_user, db)
    entry = await svc.update_year(year_id, body.year, body.title, body.body)
    if not entry:
        raise HTTPException(status_code=404, detail="Entry not found")
    await db.commit()
    return entry


@router.delete("/contracts/{contract_id}/upload/years/{year_id}", status_code=204)
async def delete_year(
    contract_id: UUID,
    year_id: UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> None:
    upload, svc = await _require_upload(contract_id, current_user, db)
    await svc.delete_year(year_id)
    await db.commit()


# ── YOUR LIFE — Places ────────────────────────────────────────────────────────

@router.get("/contracts/{contract_id}/upload/places", response_model=list[PlaceRead])
async def list_places(
    contract_id: UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> list[PlaceRead]:
    upload, svc = await _require_upload(contract_id, current_user, db)
    return await svc.list_places(upload.id)


@router.post("/contracts/{contract_id}/upload/places", response_model=PlaceRead, status_code=201)
async def add_place(
    contract_id: UUID,
    body: PlaceCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> PlaceRead:
    upload, svc = await _require_upload(contract_id, current_user, db)
    place = await svc.add_place(upload.id, body.name, body.why)
    await db.commit()
    return place


@router.delete("/contracts/{contract_id}/upload/places/{place_id}", status_code=204)
async def delete_place(
    contract_id: UUID,
    place_id: UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> None:
    upload, svc = await _require_upload(contract_id, current_user, db)
    await svc.delete_place(place_id)
    await db.commit()


# ── FOR KEEPER — Messages ─────────────────────────────────────────────────────

@router.get("/contracts/{contract_id}/upload/messages", response_model=list[KeeperMessageRead])
async def list_messages(
    contract_id: UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> list[KeeperMessageRead]:
    upload, svc = await _require_upload(contract_id, current_user, db)
    return await svc.list_keeper_messages(contract_id)


@router.post("/contracts/{contract_id}/upload/messages", response_model=KeeperMessageRead, status_code=201)
async def add_message(
    contract_id: UUID,
    body: KeeperMessageCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> KeeperMessageRead:
    if body.type not in ("welcome", "for_when"):
        raise HTTPException(status_code=400, detail="type must be 'welcome' or 'for_when'")
    upload, svc = await _require_upload(contract_id, current_user, db)
    msg = await svc.upsert_keeper_message(contract_id, body.type, body.body, body.trigger)
    await db.commit()
    return msg


@router.delete("/contracts/{contract_id}/upload/messages/{message_id}", status_code=204)
async def delete_message(
    contract_id: UUID,
    message_id: UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> None:
    upload, svc = await _require_upload(contract_id, current_user, db)
    await svc.delete_keeper_message(message_id)
    await db.commit()


# ── FOR KEEPER — Profile ──────────────────────────────────────────────────────

@router.get("/contracts/{contract_id}/upload/keeper-profile", response_model=KeeperProfileRead)
async def get_keeper_profile(
    contract_id: UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> KeeperProfileRead:
    upload, svc = await _require_upload(contract_id, current_user, db)
    profile = await svc.get_keeper_profile(contract_id)
    if not profile:
        return KeeperProfileRead(
            who_they_are=None, who_theyre_becoming=None,
            what_you_want=None, what_you_want_known=None, advice=None,
        )
    return profile


@router.put("/contracts/{contract_id}/upload/keeper-profile", response_model=KeeperProfileRead)
async def upsert_keeper_profile(
    contract_id: UUID,
    body: KeeperProfileUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> KeeperProfileRead:
    upload, svc = await _require_upload(contract_id, current_user, db)
    profile = await svc.upsert_keeper_profile(contract_id, **body.model_dump())
    await db.commit()
    return profile
