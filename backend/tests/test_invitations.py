"""Tests for invitation preview and accept flows."""
import uuid
from tests.conftest import KEEPER_FULL_NAME


async def _signed_contract(test_contract, test_user, auth_headers, client, db):
    """Helper: sign the contract and return the invitation token raw value."""
    await client.post(
        f"/contracts/{test_contract['id']}/sign",
        json={"typed_name": test_user["full_name"]},
        headers=auth_headers,
    )
    row = await db.fetchrow(
        "SELECT token FROM invitation_tokens WHERE contract_id = $1",
        uuid.UUID(test_contract["id"]),
    )
    return row["token"]


async def test_invite_preview_valid(test_contract, test_user, auth_headers, client, db):
    inv_token = await _signed_contract(test_contract, test_user, auth_headers, client, db)
    resp = await client.get(f"/contracts/invite/{inv_token}")
    assert resp.status_code == 200
    data = resp.json()
    assert data["maker_name"] == test_user["full_name"]
    assert data["invitee_role"] == "keeper"
    assert data["keeper_name"] == KEEPER_FULL_NAME


async def test_invite_preview_invalid_token(client):
    resp = await client.get("/contracts/invite/not-a-real-token")
    assert resp.status_code == 404


async def test_accept_invitation_valid(test_contract, test_user, auth_headers, client, db):
    inv_token = await _signed_contract(test_contract, test_user, auth_headers, client, db)
    resp = await client.post(
        f"/contracts/invite/{inv_token}/accept",
        json={"typed_name": KEEPER_FULL_NAME},
    )
    assert resp.status_code == 200
    data = resp.json()
    assert data["status"] == "LOCKED"
    assert data["locked_at"] is not None


async def test_accept_invitation_wrong_name(test_contract, test_user, auth_headers, client, db):
    inv_token = await _signed_contract(test_contract, test_user, auth_headers, client, db)
    resp = await client.post(
        f"/contracts/invite/{inv_token}/accept",
        json={"typed_name": "Wrong Person"},
    )
    assert resp.status_code == 422


async def test_accept_invitation_single_use(test_contract, test_user, auth_headers, client, db):
    inv_token = await _signed_contract(test_contract, test_user, auth_headers, client, db)
    await client.post(
        f"/contracts/invite/{inv_token}/accept",
        json={"typed_name": KEEPER_FULL_NAME},
    )
    # Second accept should fail
    resp = await client.post(
        f"/contracts/invite/{inv_token}/accept",
        json={"typed_name": KEEPER_FULL_NAME},
    )
    assert resp.status_code == 404


async def test_maker_stage_after_sign(test_contract, test_user, auth_headers, client, db):
    """After maker signs, magic-link verify should return awaiting_other stage."""
    import hashlib, secrets
    from datetime import datetime, timedelta, timezone

    await client.post(
        f"/contracts/{test_contract['id']}/sign",
        json={"typed_name": test_user["full_name"]},
        headers=auth_headers,
    )
    raw = secrets.token_urlsafe(32)
    await db.execute(
        """INSERT INTO magic_link_tokens
               (id, email, mode, token_hash, expires_at, used, ip_address, created_at)
           VALUES (gen_random_uuid(), $1, 'login', $2, $3, false, '127.0.0.1', now())""",
        test_user["email"],
        hashlib.sha256(raw.encode()).hexdigest(),
        datetime.now(timezone.utc) + timedelta(minutes=15),
    )
    resp = await client.get(f"/auth/magic-link/verify?token={raw}")
    assert resp.status_code == 200
    assert resp.json()["maker_stage"] == "awaiting_other"


async def test_maker_stage_after_lock(test_contract, test_user, auth_headers, client, db):
    """After contract locks (keeper accepts), stage should be ready_to_upload."""
    import hashlib, secrets
    from datetime import datetime, timedelta, timezone

    inv_token = await _signed_contract(test_contract, test_user, auth_headers, client, db)
    await client.post(
        f"/contracts/invite/{inv_token}/accept",
        json={"typed_name": KEEPER_FULL_NAME},
    )
    raw = secrets.token_urlsafe(32)
    await db.execute(
        """INSERT INTO magic_link_tokens
               (id, email, mode, token_hash, expires_at, used, ip_address, created_at)
           VALUES (gen_random_uuid(), $1, 'login', $2, $3, false, '127.0.0.1', now())""",
        test_user["email"],
        hashlib.sha256(raw.encode()).hexdigest(),
        datetime.now(timezone.utc) + timedelta(minutes=15),
    )
    resp = await client.get(f"/auth/magic-link/verify?token={raw}")
    assert resp.status_code == 200
    assert resp.json()["maker_stage"] == "ready_to_upload"
