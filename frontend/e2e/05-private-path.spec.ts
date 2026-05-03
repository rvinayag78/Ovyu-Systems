/**
 * Private path flow (TC-mediated contract).
 * The Keeper does not know; a Transfer Contact (TC) nominates and eventually
 * initiates the Transfer.
 * Uses /test/email-verify-token (TESTING=true required on backend).
 */
import { test, expect } from "@playwright/test";
import * as crypto from "crypto";
import { registerMaker } from "./helpers/auth";
import { getInviteToken } from "./helpers/tokens";
import type { RegistrationData } from "./helpers/tokens";

function uid() {
  return crypto.randomBytes(4).toString("hex");
}

function makeData(id: string, tcEmail: string): RegistrationData {
  return {
    first_name: "E2E",
    last_name: "Maker",
    maker_email: `e2e-maker-${id}@example.com`,
    keeper_name: "E2E Keeper",
    keeper_email: `e2e-keeper-${id}@example.com`,
    relationship: "Partner / spouse",
    path: "private",
    tc_name: "E2E TC",
    tc_email: tcEmail,
  };
}

test.describe("Private path (TC-mediated)", () => {
  test("registration with private path reaches /contract/sign", async ({ page }) => {
    const id = uid();
    await registerMaker(page, makeData(id, `e2e-tc-${id}@example.com`));
    await expect(page.locator("#sig")).toBeVisible({ timeout: 8_000 });
  });

  test("after Maker signs, TC invitation token is available", async ({ page }) => {
    const id = uid();
    const tcEmail = `e2e-tc-${id}@example.com`;
    await registerMaker(page, makeData(id, tcEmail));
    await page.locator("#sig").fill("E2E Maker");
    await page.getByRole("button", { name: /sign/i }).click();
    await page.waitForURL(/\/contracts/, { timeout: 15_000 });

    // TC invite token must exist (invitation created at registration time)
    const tcInviteToken = await getInviteToken(tcEmail);
    expect(tcInviteToken).toBeTruthy();

    await page.goto(`/invite/${tcInviteToken}`);
    // TC invite page should reference their TC role
    await expect(page.getByText(/transfer contact|tc/i)).toBeVisible({ timeout: 10_000 });
  });

  test("TC accepts nomination → You've signed confirmation", async ({ page }) => {
    const id = uid();
    const tcEmail = `e2e-tc-${id}@example.com`;
    await registerMaker(page, makeData(id, tcEmail));
    await page.locator("#sig").fill("E2E Maker");
    await page.getByRole("button", { name: /sign/i }).click();
    await page.waitForURL(/\/contracts/, { timeout: 15_000 });

    const tcInviteToken = await getInviteToken(tcEmail);
    await page.goto(`/invite/${tcInviteToken}`);
    const nameInput = page
      .getByPlaceholder(/type your full name/i)
      .or(page.getByLabel(/full name/i));
    await nameInput.fill("E2E TC");
    await page.getByRole("button", { name: /accept and sign/i }).click();
    await expect(page.getByRole("heading", { name: /you've signed/i })).toBeVisible({
      timeout: 10_000,
    });
  });
});
