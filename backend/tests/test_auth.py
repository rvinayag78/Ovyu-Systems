"""Tests for /auth endpoints."""
import hashlib
import secrets
import uuid
from datetime import datetime, timedelta, timezone


async def test_begin_registration_aware(client):
    resp = await client.post("/auth/begin-registration", json={
        "first_name": "Rae", "last_name": "Test",
        "maker_email": f"maker-{uuid.uuid4()}@example.com",
        "keeper_name": "Sam Jones", "keeper_email": "sam@example.com",
        "relationship": "Partner / spouse", "path": "aware",
    })
    assert resp.status_code == 200
    assert resp.json()["detail"] == "Verification email sent"


async def test_begin_registration_private(client):
    resp = await client.post("/auth/begin-registration", json={
        "first_name": "Rae", "last_name": "Test",
        "maker_email": f"maker-{uuid.uuid4()}@example.com",
        "keeper_name": "Sam Jones", "keeper_email": "sam@example.com",
        "relationship": "Partner / spouse", "path": "private",
        "tc_name": "Jordan Lee", "tc_email": "jordan@example.com",
    })
    assert resp.status_code == 200


async def test_begin_registration_missing_fields(client):
    resp = await client.post("/auth/begin-registration", json={"first_name": "Rae"})
    assert resp.status_code == 422
    fields = [e["loc"][-1] for e in resp.json()["detail"]]
    assert "maker_email" in fields
    assert "keeper_name" in fields


async def test_begin_registration_invalid_email(client):
    resp = await client.post("/auth/begin-registration", json={
        "first_name": "Rae", "last_name": "Test",
        "maker_email": "not-an-email",
        "keeper_name": "Sam", "keeper_email": "sam@example.com",
        "relationship": "Child", "path": "aware",
    })
    assert resp.status_code == 422


async def test_verify_token_valid(client):
    # Build a token via begin-registration, then decode it via verify-token
    email = f"maker-{uuid.uuid4()}@example.com"
    await client.post("/auth/begin-registration", json={
        "first_name": "Rae", "last_name": "Test",
        "maker_email": email,
        "keeper_name": "Sam Jones", "keeper_email": "sam@example.com",
        "relationship": "Partner / spouse", "path": "aware",
    })
    # Build the token directly using the same function the backend uses
    from jose import jwt as jose_jwt
    import os
    secret = os.getenv("EMAIL_VERIFICATION_SECRET", "dev-secret-change-in-production")
    payload = {
        "first_name": "Rae", "last_name": "Test", "maker_email": email,
        "keeper_name": "Sam Jones", "keeper_email": "sam@example.com",
        "relationship": "Partner / spouse", "path": "aware",
        "tc_name": None, "tc_email": None,
        "exp": datetime.now(timezone.utc) + timedelta(hours=24),
        "iat": datetime.now(timezone.utc), "purpose": "email_verify",
    }
    token = jose_jwt.encode(payload, secret, algorithm="HS256")
    resp = await client.get(f"/auth/verify-token?token={token}")
    assert resp.status_code == 200
    data = resp.json()
    assert data["maker_email"] == email
    assert data["path"] == "aware"


async def test_verify_token_invalid(client):
    resp = await client.get("/auth/verify-token?token=garbage")
    assert resp.status_code == 400


async def test_request_magic_link_unknown_email_anti_enum(client):
    """Unknown email must still return 200 — never reveal registration status."""
    resp = await client.post("/auth/request-magic-link", json={
        "email": f"nobody-{uuid.uuid4()}@example.com", "mode": "login",
    })
    assert resp.status_code == 200
    assert "inbox" in resp.json()["detail"].lower()


async def test_request_magic_link_known_user(db, test_user, client):
    resp = await client.post("/auth/request-magic-link", json={
        "email": test_user["email"], "mode": "login",
    })
    assert resp.status_code == 200
    # Token should have been written to DB
    row = await db.fetchrow(
        "SELECT * FROM magic_link_tokens WHERE email = $1 ORDER BY created_at DESC LIMIT 1",
        test_user["email"],
    )
    assert row is not None
    assert not row["used"]


async def test_verify_magic_link_valid(db, test_user, client):
    raw = secrets.token_urlsafe(32)
    token_hash = hashlib.sha256(raw.encode()).hexdigest()
    await db.execute(
        """INSERT INTO magic_link_tokens
               (id, email, mode, token_hash, expires_at, used, ip_address, created_at)
           VALUES (gen_random_uuid(), $1, 'login', $2, $3, false, '127.0.0.1', now())""",
        test_user["email"],
        token_hash,
        datetime.now(timezone.utc) + timedelta(minutes=15),
    )
    resp = await client.get(f"/auth/magic-link/verify?token={raw}")
    assert resp.status_code == 200
    data = resp.json()
    assert "session_token" in data
    assert data["role"] == "maker"
    assert data["maker_stage"] == "no_contract"


async def test_verify_magic_link_single_use(db, test_user, client):
    raw = secrets.token_urlsafe(32)
    token_hash = hashlib.sha256(raw.encode()).hexdigest()
    await db.execute(
        """INSERT INTO magic_link_tokens
               (id, email, mode, token_hash, expires_at, used, ip_address, created_at)
           VALUES (gen_random_uuid(), $1, 'login', $2, $3, false, '127.0.0.1', now())""",
        test_user["email"], token_hash,
        datetime.now(timezone.utc) + timedelta(minutes=15),
    )
    await client.get(f"/auth/magic-link/verify?token={raw}")  # first use
    resp = await client.get(f"/auth/magic-link/verify?token={raw}")  # second use
    assert resp.status_code == 404


async def test_verify_magic_link_expired(db, test_user, client):
    raw = secrets.token_urlsafe(32)
    token_hash = hashlib.sha256(raw.encode()).hexdigest()
    await db.execute(
        """INSERT INTO magic_link_tokens
               (id, email, mode, token_hash, expires_at, used, ip_address, created_at)
           VALUES (gen_random_uuid(), $1, 'login', $2, $3, false, '127.0.0.1', now())""",
        test_user["email"], token_hash,
        datetime.now(timezone.utc) - timedelta(minutes=1),  # already expired
    )
    resp = await client.get(f"/auth/magic-link/verify?token={raw}")
    assert resp.status_code == 410


async def test_me_authenticated(test_user, auth_headers, client):
    resp = await client.get("/auth/me", headers=auth_headers)
    assert resp.status_code == 200
    data = resp.json()
    assert data["email"] == test_user["email"]


async def test_me_unauthenticated(client):
    resp = await client.get("/auth/me")
    assert resp.status_code == 401
