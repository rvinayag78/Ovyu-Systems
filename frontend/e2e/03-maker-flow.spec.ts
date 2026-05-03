/**
 * Maker registration + contract signing flow.
 * Uses /test/email-verify-token (TESTING=true required on backend).
 * Each test uses fresh unique emails — no fixed test accounts needed.
 */
import { test, expect } from "@playwright/test";
import * as crypto from "crypto";
import { registerMaker } from "./helpers/auth";
import { getInviteToken } from "./helpers/tokens";
import type { RegistrationData } from "./helpers/tokens";

function uid() {
  return crypto.randomBytes(4).toString("hex");
}

test.describe("Maker registration + signing (aware path)", () => {
  test("full registration flow lands on /contract/sign with signature input", async ({ page }) => {
    const id = uid();
    const data: RegistrationData = {
      first_name: "E2E",
      last_name: "Maker",
      maker_email: `e2e-maker-${id}@example.com`,
      keeper_name: "E2E Keeper",
      keeper_email: `e2e-keeper-${id}@example.com`,
      relationship: "Partner / spouse",
      path: "aware",
    };
    await registerMaker(page, data);
    await expect(page.locator("#sig")).toBeVisible({ timeout: 8_000 });
  });

  test("sign contract → /contracts shows active Making section", async ({ page }) => {
    const id = uid();
    const data: RegistrationData = {
      first_name: "E2E",
      last_name: "Maker",
      maker_email: `e2e-maker-${id}@example.com`,
      keeper_name: "E2E Keeper",
      keeper_email: `e2e-keeper-${id}@example.com`,
      relationship: "Partner / spouse",
      path: "aware",
    };
    await registerMaker(page, data);
    await page.locator("#sig").fill("E2E Maker");
    await page.getByRole("button", { name: /sign/i }).click();
    await page.waitForURL(/\/contracts/, { timeout: 15_000 });
    await expect(page.getByText(/making/i)).toBeVisible({ timeout: 8_000 });
  });

  test("sign contract → keeper accepts invitation → You've signed confirmation", async ({ page }) => {
    const id = uid();
    const keeperEmail = `e2e-keeper-${id}@example.com`;
    const data: RegistrationData = {
      first_name: "E2E",
      last_name: "Maker",
      maker_email: `e2e-maker-${id}@example.com`,
      keeper_name: "E2E Keeper",
      keeper_email: keeperEmail,
      relationship: "Partner / spouse",
      path: "aware",
    };
    await registerMaker(page, data);
    await page.locator("#sig").fill("E2E Maker");
    await page.getByRole("button", { name: /sign/i }).click();
    await page.waitForURL(/\/contracts/, { timeout: 15_000 });

    const inviteToken = await getInviteToken(keeperEmail);
    await page.goto(`/invite/${inviteToken}`);
    const nameInput = page
      .getByPlaceholder(/type your full name/i)
      .or(page.getByLabel(/full name/i));
    await nameInput.fill("E2E Keeper");
    await page.getByRole("button", { name: /accept and sign/i }).click();
    await expect(page.getByRole("heading", { name: /you've signed/i })).toBeVisible({
      timeout: 10_000,
    });
  });
});
