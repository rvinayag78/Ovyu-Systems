"""Tests for /contracts endpoints."""
import uuid


async def test_create_contract_aware(test_user, auth_headers, client, db):
    resp = await client.post("/contracts", json={
        "keeper_name": "Sam Keeper",
        "keeper_email": "sam@example.com",
        "relationship": "Partner / spouse",
        "path": "aware",
    }, headers=auth_headers)
    assert resp.status_code == 201
    data = resp.json()
    assert data["path"] == "aware"
    assert data["status"] == "PENDING_KEEPER"
    # cleanup
    cid = uuid.UUID(data["id"])
    await db.execute("DELETE FROM invitation_tokens WHERE contract_id = $1", cid)
    await db.execute("DELETE FROM contracts WHERE id = $1", cid)


async def test_create_contract_private(test_user, auth_headers, client, db):
    resp = await client.post("/contracts", json={
        "keeper_name": "Sam Keeper",
        "keeper_email": "sam@example.com",
        "relationship": "Child",
        "path": "private",
        "tc_name": "Jordan Lee",
        "tc_email": "jordan@example.com",
    }, headers=auth_headers)
    assert resp.status_code == 201
    data = resp.json()
    assert data["path"] == "private"
    assert data["status"] == "PENDING_TC"
    cid = uuid.UUID(data["id"])
    await db.execute("DELETE FROM invitation_tokens WHERE contract_id = $1", cid)
    await db.execute("DELETE FROM contracts WHERE id = $1", cid)


async def test_create_contract_private_missing_tc(test_user, auth_headers, client):
    resp = await client.post("/contracts", json={
        "keeper_name": "Sam Keeper",
        "keeper_email": "sam@example.com",
        "relationship": "Child",
        "path": "private",
        # tc_email intentionally omitted
    }, headers=auth_headers)
    assert resp.status_code == 422


async def test_create_contract_unauthenticated(client):
    resp = await client.post("/contracts", json={
        "keeper_name": "Sam", "keeper_email": "sam@example.com",
        "relationship": "Child", "path": "aware",
    })
    assert resp.status_code == 401


async def test_get_contract_owner(test_contract, auth_headers, client):
    resp = await client.get(f"/contracts/{test_contract['id']}", headers=auth_headers)
    assert resp.status_code == 200
    assert resp.json()["id"] == test_contract["id"]


async def test_get_contract_forbidden(test_contract, db, client):
    # Different user — create a second user and get their headers
    import hashlib, secrets
    from datetime import timedelta, timezone
    from datetime import datetime
    uid2 = uuid.uuid4()
    email2 = f"other-{uid2}@example.com"
    await db.execute(
        """INSERT INTO users (id, cognito_sub, email, full_name, email_verified, created_at)
           VALUES ($1, $2, $3, 'Other User', true, now())""",
        uid2, f"sub-{uid2}", email2,
    )
    raw = secrets.token_urlsafe(32)
    await db.execute(
        """INSERT INTO magic_link_tokens
               (id, email, mode, token_hash, expires_at, used, ip_address, created_at)
           VALUES (gen_random_uuid(), $1, 'login', $2, $3, false, '127.0.0.1', now())""",
        email2, hashlib.sha256(raw.encode()).hexdigest(),
        datetime.now(timezone.utc) + timedelta(minutes=15),
    )
    token_resp = await client.get(f"/auth/magic-link/verify?token={raw}")
    other_token = token_resp.json()["session_token"]
    other_headers = {"Authorization": f"Bearer {other_token}"}

    resp = await client.get(f"/contracts/{test_contract['id']}", headers=other_headers)
    assert resp.status_code == 403

    # cleanup
    await db.execute("DELETE FROM magic_link_tokens WHERE email = $1", email2)
    await db.execute("DELETE FROM users WHERE id = $1", uid2)


async def test_sign_contract_valid(test_contract, test_user, auth_headers, client):
    resp = await client.post(
        f"/contracts/{test_contract['id']}/sign",
        json={"typed_name": test_user["full_name"]},
        headers=auth_headers,
    )
    assert resp.status_code == 200
    data = resp.json()
    assert data["maker_signed_at"] is not None


async def test_sign_contract_wrong_name(test_contract, auth_headers, client):
    resp = await client.post(
        f"/contracts/{test_contract['id']}/sign",
        json={"typed_name": "Definitely Not My Name"},
        headers=auth_headers,
    )
    assert resp.status_code == 422


async def test_sign_contract_double_sign(test_contract, test_user, auth_headers, client, db):
    # Sign once
    await client.post(
        f"/contracts/{test_contract['id']}/sign",
        json={"typed_name": test_user["full_name"]},
        headers=auth_headers,
    )
    # Sign again — should 409
    resp = await client.post(
        f"/contracts/{test_contract['id']}/sign",
        json={"typed_name": test_user["full_name"]},
        headers=auth_headers,
    )
    assert resp.status_code == 409
