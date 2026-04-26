/**
 * Runs before every `npx playwright test` invocation.
 * Deletes all rows tied to the test email addresses so each run starts clean.
 */
import { execSync } from "child_process";
import * as fs from "fs";
import * as os from "os";
import * as path from "path";
import * as crypto from "crypto";

const DB_DSN =
  "postgresql://ovyu:OvYRhKhMp35TUZOhTBjYzVVX@ovyu-dev.c76g48wwy9cb.us-west-2.rds.amazonaws.com:5432/ovyu";

const TEST_EMAILS = [
  "ovyu_maker@protonmail.com",
  "ovyu_keeper@proton.me",
];

function pyRun(script: string): void {
  const tmp = path.join(os.tmpdir(), `ovyu_setup_${crypto.randomBytes(4).toString("hex")}.py`);
  fs.writeFileSync(tmp, script);
  try {
    execSync(`python3 ${tmp}`, { encoding: "utf-8", timeout: 20_000 });
  } finally {
    fs.unlinkSync(tmp);
  }
}

export default async function globalSetup() {
  console.log("\n[globalSetup] Cleaning test data for:", TEST_EMAILS.join(", "));
  pyRun(`
import asyncio, asyncpg

TEST_EMAILS = ${JSON.stringify(TEST_EMAILS)}

async def run():
    conn = await asyncpg.connect(${JSON.stringify(DB_DSN)})
    for email in TEST_EMAILS:
        uid = await conn.fetchval('SELECT id FROM users WHERE email = $1', email)
        if uid:
            await conn.execute(
                'DELETE FROM signatures WHERE contract_id IN (SELECT id FROM contracts WHERE maker_id = $1)', uid)
            await conn.execute(
                'DELETE FROM invitation_tokens WHERE contract_id IN (SELECT id FROM contracts WHERE maker_id = $1)', uid)
            await conn.execute('DELETE FROM contracts WHERE maker_id = $1', uid)
            await conn.execute('DELETE FROM users WHERE id = $1', uid)
        await conn.execute('DELETE FROM magic_link_tokens WHERE email = $1', email)
    await conn.close()

asyncio.run(run())
`);
  console.log("[globalSetup] Done.\n");
}
