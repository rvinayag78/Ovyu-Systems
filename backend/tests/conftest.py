"""
Shared fixtures. Tests run against the live deployed API with direct DB access
to inject tokens/users without needing real email flows.

Real test identities (SES-verified):
  MAKER_EMAIL = ovyu_maker@protonmail.com
  KEEPER_EMAIL = ovyu_keeper@proton.me
"""
import hashlib
import os
import secrets
import uuid
from datetime import datetime, timedelta, timezone

import asyncpg
import pytest_asyncio
import httpx

API = os.getenv(
    "OVYU_API_URL",
    "https://pmfg4ex4f3.execute-api.us-west-2.amazonaws.com/api/v1",
)
DB_DSN = (
    "postgresql://ovyu:OvYRhKhMp35TUZOhTBjYzVVX"
    "@ovyu-dev.c76g48wwy9cb.us-west-2.rds.amazonaws.com:5432/ovyu"
)

# Real SES-verified identities used for end-to-end email delivery tests
MAKER_EMAIL = "ovyu_maker@protonmail.com"
KEEPER_EMAIL = "ovyu_keeper@proton.me"
MAKER_FULL_NAME = "Ovyu Maker"
KEEPER_FULL_NAME = "Ovyu Keeper"


# ── DB pool ───────────────────────────────────────────────────────────────────

@pytest_asyncio.fixture(scope="session")
async def db():
    pool = await asyncpg.create_pool(DB_DSN, min_size=1, max_size=3)
    yield pool
    await pool.close()


@pytest_asyncio.fixture(scope="session")
async def client():
    async with httpx.AsyncClient(base_url=API, timeout=20) as c:
        yield c


# ── Ephemeral test user (random email, no real mail needed) ───────────────────

@pytest_asyncio.fixture()
async def test_user(db):
    """Insert a disposable user row; clean up after each test."""
    uid = uuid.uuid4()
    email = f"ovyu-test-{uid}@example.com"
    full_name = "Test Maker"
    await db.execute(
        """INSERT INTO users (id, cognito_sub, email, full_name, email_verified, created_at)
           VALUES ($1, $2, $3, $4, true, now())""",
        uid, f"test-sub-{uid}", email, full_name,
    )
    yield {"id": str(uid), "email": email, "full_name": full_name}
    await _delete_user(db, uid, email)


async def _delete_user(db, uid, email):
    await db.execute("DELETE FROM signatures WHERE user_id = $1", uid)
    await db.execute(
        """DELETE FROM invitation_tokens WHERE contract_id IN
           (SELECT id FROM contracts WHERE maker_id = $1)""", uid)
    await db.execute("DELETE FROM contracts WHERE maker_id = $1", uid)
    await db.execute("DELETE FROM magic_link_tokens WHERE email = $1", email)
    await db.execute("DELETE FROM users WHERE id = $1", uid)


# ── Named test users (real SES-verified emails) ───────────────────────────────

@pytest_asyncio.fixture(scope="session")
async def maker_user(db):
    """
    Upsert the real Maker test account. Session-scoped — reused across tests.
    NOT deleted after tests so the account persists for manual testing too.
    """
    existing = await db.fetchrow(
        "SELECT id, email, full_name FROM users WHERE email = $1", MAKER_EMAIL
    )
    if existing:
        yield {"id": str(existing["id"]), "email": existing["email"],
               "full_name": existing["full_name"]}
        return
    uid = uuid.uuid4()
    await db.execute(
        """INSERT INTO users (id, cognito_sub, email, full_name, email_verified, created_at)
           VALUES ($1, $2, $3, $4, true, now())""",
        uid, f"test-sub-maker", MAKER_EMAIL, MAKER_FULL_NAME,
    )
    yield {"id": str(uid), "email": MAKER_EMAIL, "full_name": MAKER_FULL_NAME}


# ── Auth header factory ───────────────────────────────────────────────────────

async def _make_auth_headers(db, client, email: str) -> dict:
    """Insert a magic-link token into the DB and exchange it for a session JWT."""
    raw = secrets.token_urlsafe(32)
    token_hash = hashlib.sha256(raw.encode()).hexdigest()
    await db.execute(
        """INSERT INTO magic_link_tokens
               (id, email, mode, token_hash, expires_at, used, ip_address, created_at)
           VALUES (gen_random_uuid(), $1, 'login', $2, $3, false, '127.0.0.1', now())""",
        email, token_hash,
        datetime.now(timezone.utc) + timedelta(minutes=15),
    )
    resp = await client.get(f"/auth/magic-link/verify?token={raw}")
    assert resp.status_code == 200, f"auth setup failed: {resp.text}"
    return {"Authorization": f"Bearer {resp.json()['session_token']}"}


@pytest_asyncio.fixture()
async def auth_headers(db, test_user, client):
    return await _make_auth_headers(db, client, test_user["email"])


@pytest_asyncio.fixture(scope="session")
async def maker_auth_headers(db, maker_user, client):
    return await _make_auth_headers(db, client, maker_user["email"])


# ── Contract fixture ──────────────────────────────────────────────────────────

@pytest_asyncio.fixture()
async def test_contract(db, test_user, auth_headers, client):
    """Create an aware-path contract; clean up after test."""
    resp = await client.post(
        "/contracts",
        json={
            "keeper_name": KEEPER_FULL_NAME,
            "keeper_email": KEEPER_EMAIL,
            "relationship": "Partner / spouse",
            "path": "aware",
        },
        headers=auth_headers,
    )
    assert resp.status_code == 201, f"contract setup failed: {resp.text}"
    contract = resp.json()
    yield contract
    cid = uuid.UUID(contract["id"])
    await db.execute("DELETE FROM signatures WHERE contract_id = $1", cid)
    await db.execute("DELETE FROM invitation_tokens WHERE contract_id = $1", cid)
    await db.execute("DELETE FROM contracts WHERE id = $1", cid)
