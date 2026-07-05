/**
 * Flow 2 — Voice gating.
 *
 * A fresh Maker with a LOCKED contract must record their voice (name, then
 * profile) before the Upload Hub unlocks. Recording uses Chromium's fake
 * media device — real getUserMedia + MediaRecorder, real S3 upload, real
 * voice_status transition in the DB (asserted via API).
 */
import { test, expect } from "@playwright/test";
import { loginAsMaker } from "./helpers/auth";
import { apiPost } from "./helpers/tokens";
import { createLockedMaker, getVoiceStatus, type LockedMaker } from "./helpers/flow2";
import { recordScriptPageAndSave } from "./helpers/flow2-ui";

let m: LockedMaker;

test.beforeAll(async () => {
  m = await createLockedMaker({ firstName: "Gating", lastName: "Maker" });
  // Warm the uploads row: a fresh maker's FIRST hub load fires three API
  // calls in parallel (hub, messages, voice/status) and each lazily
  // get-or-creates the uploads row — the losers of that insert race 500
  // (real backend bug, pinned by the fixme test below). One serialized call
  // here creates the row so the gating tests measure gating, not the race.
  await getVoiceStatus(m);
});

test("REAL BUG: fresh maker's first parallel upload API calls race on uploads-row creation (500)", async () => {
  // get_or_create_upload (backend/app/services/upload_service.py) does
  // SELECT-then-INSERT without handling the unique-violation, so when the
  // hub page fires /upload/hub, /upload/messages and /upload/voice/status
  // concurrently for a maker with no uploads row yet, one of them 500s.
  // User impact: on the very first visit to the Upload Hub the voice-gating
  // redirect randomly doesn't happen (voice/status 500 is swallowed), or the
  // hub/messages fail to load. Fix: catch IntegrityError and re-select (or
  // INSERT ... ON CONFLICT DO NOTHING), then remove this fixme.
  test.fixme();
  const fresh = await createLockedMaker({ firstName: "Race", lastName: "Maker" });
  const API = process.env.API_URL!;
  const results = await Promise.all(
    ["upload/hub", "upload/messages", "upload/voice/status"].map(p =>
      fetch(`${API}/contracts/${fresh.contractId}/${p}`, {
        headers: { Authorization: `Bearer ${fresh.session}` },
      }).then(r => r.status)
    )
  );
  expect(results).toEqual([200, 200, 200]);
});

test("voice pending: /upload/{id} redirects to voice/name", async ({ page }) => {
  await loginAsMaker(page, m.makerEmail);
  await page.goto(`/upload/${m.contractId}`);
  await page.waitForURL(`**/upload/${m.contractId}/voice/name**`, { timeout: 20_000 });
  await expect(page.getByRole("heading", { name: "Your name" })).toBeVisible();
  // Functional state: backend says both recordings are pending
  const vs = await getVoiceStatus(m);
  expect(vs.name).not.toBe("complete");
  expect(vs.profile).not.toBe("complete");
});

test("record name (≥10s) → profile → hub unlocks", async ({ page }) => {
  test.setTimeout(300_000);
  // Idempotent under retry: reset any partial recording from a failed attempt
  await apiPost(`/test/reset-voice/${m.contractId}`, {});

  await loginAsMaker(page, m.makerEmail);
  await page.goto(`/upload/${m.contractId}/voice/name`);
  await expect(page.getByRole("heading", { name: "Your name" })).toBeVisible({ timeout: 15_000 });

  // Checkbox is disabled until a ≥10s recording exists
  await expect(page.locator('input[type="checkbox"]')).toBeDisabled();

  await recordScriptPageAndSave(page);

  // Save navigates to voice/profile; name recording persisted in the backend
  await page.waitForURL(`**/upload/${m.contractId}/voice/profile**`, { timeout: 30_000 });
  const afterName = await getVoiceStatus(m);
  expect(afterName.name).toBe("complete");
  expect(afterName.profile).not.toBe("complete");

  // Profile page: same recording contract
  await recordScriptPageAndSave(page);
  await page.waitForURL("**/contracts**", { timeout: 30_000 });
  const afterProfile = await getVoiceStatus(m);
  expect(afterProfile.name).toBe("complete");
  expect(afterProfile.profile).toBe("complete");

  // Hub now loads without redirecting, YOU bar unlocked (no 🔒)
  await page.goto(`/upload/${m.contractId}`);
  await expect(page.getByRole("heading", { name: `For ${m.keeperName}` })).toBeVisible({ timeout: 20_000 });
  expect(page.url()).toContain(`/upload/${m.contractId}`);
  expect(page.url()).not.toContain("/voice/");
  await expect(page.getByText("🔒")).toHaveCount(0);
});
