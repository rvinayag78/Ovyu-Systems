/**
 * Flow 2 — Welcome message recording (keeper/welcome).
 *
 * Record ≥10s with the fake mic → confirm → save → back on the hub with the
 * Welcome dot filled; the message itself is asserted through the API
 * (persisted with an s3_key and a duration).
 */
import { test, expect } from "@playwright/test";
import { loginAsMaker } from "./helpers/auth";
import { completeVoiceViaApi, createLockedMaker, listMessages, type LockedMaker } from "./helpers/flow2";
import { recordScriptPageAndSave } from "./helpers/flow2-ui";

let m: LockedMaker;

test.beforeAll(async () => {
  m = await createLockedMaker({ firstName: "Welcome", lastName: "Maker" });
  await completeVoiceViaApi(m);
});

test("record welcome message → saved, hub dot filled", async ({ page }) => {
  // REAL APP BUG (staging): the keeper/welcome route returns 404 (no Amplify
  // rewrite; RSC fetch 404s too) — the Welcome recording page is unreachable,
  // so this whole flow cannot run. See 10-upload-hub.spec.ts for the repro.
  // Remove this fixme once the rewrite for /upload/<*>/keeper/welcome ships.
  test.fixme();
  test.setTimeout(240_000);
  await loginAsMaker(page, m.makerEmail);
  await page.goto(`/upload/${m.contractId}/keeper/welcome`);
  await expect(page.getByRole("heading", { name: "Welcome Message" })).toBeVisible({ timeout: 20_000 });
  // Back link is labelled after the Keeper
  await expect(page.getByRole("link", { name: `For ${m.keeperName}` })).toBeVisible();

  await recordScriptPageAndSave(page);

  // Save returns to the hub
  await page.waitForURL(`**/upload/${m.contractId}`, { timeout: 30_000 });
  await expect(page.getByRole("heading", { name: `For ${m.keeperName}` })).toBeVisible({ timeout: 20_000 });

  // Functional consequence: welcome message persisted with audio + duration
  const messages = await listMessages(m);
  const welcome = messages.find(msg => msg.type === "welcome");
  expect(welcome).toBeTruthy();
  expect(welcome!.s3_key).toBeTruthy();
  expect(welcome!.duration_s).toBeGreaterThanOrEqual(10);

  // UI consequence survives a reload: the Welcome dot is filled (lavender)
  await page.reload();
  await expect(page.getByRole("heading", { name: `For ${m.keeperName}` })).toBeVisible({ timeout: 20_000 });
  const dot = page
    .getByRole("button")
    .filter({ hasText: "Welcome" })
    .first()
    .locator('div[style*="border-radius: 50%"]');
  await expect(dot).toHaveCount(1);
  const bg = await dot.evaluate(el => getComputedStyle(el).backgroundColor);
  expect(bg).toBe("rgb(106, 77, 125)"); // tokens.color.lavender — filled
});
