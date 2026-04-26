/**
 * Direct DB helpers for test token injection — bypasses real email flows.
 */
import { execSync } from "child_process";
import * as crypto from "crypto";
import * as fs from "fs";
import * as os from "os";
import * as path from "path";

const DB_DSN =
  "postgresql://ovyu:OvYRhKhMp35TUZOhTBjYzVVX@ovyu-dev.c76g48wwy9cb.us-west-2.rds.amazonaws.com:5432/ovyu";

function pyRun(script: string): string {
  const tmp = path.join(os.tmpdir(), `ovyu_e2e_${crypto.randomBytes(4).toString("hex")}.py`);
  fs.writeFileSync(tmp, script);
  try {
    return execSync(`python3 ${tmp}`, { encoding: "utf-8", timeout: 15_000 }).trim();
  } finally {
    fs.unlinkSync(tmp);
  }
}

export function insertMagicLink(email: string): string {
  const raw = crypto.randomBytes(24).toString("hex");
  const hash = crypto.createHash("sha256").update(raw).digest("hex");
  const expires = new Date(Date.now() + 15 * 60 * 1000).toISOString();

  pyRun(`
import asyncio, asyncpg
from datetime import datetime, timezone

expires_dt = datetime.fromisoformat(${JSON.stringify(expires)}.replace("Z", "+00:00"))

async def run():
    conn = await asyncpg.connect(${JSON.stringify(DB_DSN)})
    await conn.execute(
        """INSERT INTO magic_link_tokens
            (id, email, mode, token_hash, expires_at, used, ip_address, created_at)
            VALUES (gen_random_uuid(), $1, 'login', $2, $3, false, '127.0.0.1', now())""",
        ${JSON.stringify(email)}, ${JSON.stringify(hash)}, expires_dt)
    await conn.close()

asyncio.run(run())
`);
  return raw;
}

export function getInvitationToken(contractId: string): string {
  return pyRun(`
import asyncio, asyncpg

async def run():
    conn = await asyncpg.connect(${JSON.stringify(DB_DSN)})
    row = await conn.fetchrow(
        'SELECT token FROM invitation_tokens WHERE contract_id = $1 ORDER BY created_at DESC LIMIT 1',
        ${JSON.stringify(contractId)})
    print(row['token'])
    await conn.close()

asyncio.run(run())
`);
}

export function deleteUser(email: string): void {
  pyRun(`
import asyncio, asyncpg

async def run():
    conn = await asyncpg.connect(${JSON.stringify(DB_DSN)})
    uid = await conn.fetchval('SELECT id FROM users WHERE email = $1', ${JSON.stringify(email)})
    if uid:
        await conn.execute('DELETE FROM signatures WHERE contract_id IN (SELECT id FROM contracts WHERE maker_id = $1)', uid)
        await conn.execute('DELETE FROM invitation_tokens WHERE contract_id IN (SELECT id FROM contracts WHERE maker_id = $1)', uid)
        await conn.execute('DELETE FROM contracts WHERE maker_id = $1', uid)
    await conn.execute('DELETE FROM magic_link_tokens WHERE email = $1', ${JSON.stringify(email)})
    if uid:
        await conn.execute('DELETE FROM users WHERE id = $1', uid)
    await conn.close()

asyncio.run(run())
`);
}

export function upsertUser(email: string, fullName: string): string {
  return pyRun(`
import asyncio, asyncpg, uuid

async def run():
    conn = await asyncpg.connect(${JSON.stringify(DB_DSN)})
    existing = await conn.fetchval('SELECT id FROM users WHERE email = $1', ${JSON.stringify(email)})
    if existing:
        print(str(existing))
    else:
        uid = uuid.uuid4()
        await conn.execute(
            """INSERT INTO users (id, cognito_sub, email, full_name, email_verified, created_at)
               VALUES ($1, $2, $3, $4, true, now())""",
            uid, f'test-sub-{uid}', ${JSON.stringify(email)}, ${JSON.stringify(fullName)})
        print(str(uid))
    await conn.close()

asyncio.run(run())
`);
}
