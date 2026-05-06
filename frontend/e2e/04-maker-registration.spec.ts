/**
 * Maker registration + contract signing flow.
 *
 * Covers:
 * - Email verify → register page → contract → sign → /contracts dashboard
 * - Back button after verify doesn't expose the verify page
 * - Name mismatch keeps Sign button disabled
 * - Correct name enables signing
 * - Idempotency: re-registering same email returns existing contract
 */
import { test, expect } from "@playwright/test";
import * as crypto from "crypto";
import { registerMaker } from "./helpers/auth";
import { getEmailVerifyToken, apiPost, type RegistrationData } from "./helpers/tokens";

function uid() { return crypto.randomBytes(4).toString("hex"); }

test.describe("Maker email verification", () => {
  test("verify token → /register shows 'email verified' state", async ({ page }) => {
    const id = uid();
    const data: RegistrationData = {
      first_name: "E2E", last_name: "Maker",
      maker_email: `e2e-mreg-${id}@example.com`,
      keeper_name: "E2E Keeper",
      keeper_email: `e2e-kreg-${id}@example.com`,
      relationship: "Partner / spouse", path: "aware",
    };
    const token = await getEmailVerifyToken(data);
    await page.goto(`/verify?token=${token}`);
    await page.waitForURL("**/register", { timeout: 15_000 });
    await expect(page.getByText(/email.*verified|verified.*email/i)).toBeVisible({ timeout: 8_000 });
  });

  test("back button after verify does NOT return to /verify page", async ({ page }) => {
    const id = uid();
    const data: RegistrationData = {
      first_name: "Back", last_name: "Test",
      maker_email: `e2e-back-${id}@example.com`,
      keeper_name: "Back Keeper",
      keeper_email: `e2e-backk-${id}@example.com`,
      relationship: "Child", path: "aware",
    };
    const token = await getEmailVerifyToken(data);
    // Navigate to an intermediate page first
    await page.goto("/signup");
    // Then verify (replaces history entry)
    await page.goto(`/verify?token=${token}`);
    await page.waitForURL("**/register", { timeout: 15_000 });
    // Go back — should land on /signup, NOT /verify
    await page.goBack();
    await expect(page).not.toHaveURL(/\/verify/);
  });

  test("invalid verify token → error or redirect", async ({ page }) => {
    await page.goto("/verify?token=not-a-real-token");
    // Should show error or redirect to signup — not crash
    await page.waitForLoadState("networkidle");
    const url = page.url();
    // Either shows an error page or redirects to signup
    const hasError = await page.getByText(/invalid|expired|error/i).isVisible().catch(() => false);
    const redirectedToSignup = url.includes("/signup");
    expect(hasError || redirectedToSignup).toBeTruthy();
  });
});

test.describe("Maker contract signing", () => {
  test("register → review → contract → sign button visible", async ({ page }) => {
    const id = uid();
    const data: RegistrationData = {
      first_name: "Sign", last_name: "Test",
      maker_email: `e2e-msign-${id}@example.com`,
      keeper_name: "Sign Keeper",
      keeper_email: `e2e-ksign-${id}@example.com`,
      relationship: "Sibling", path: "aware",
    };
    await registerMaker(page, data);
    // Now at /contract/sign
    await expect(page).toHaveURL(/\/contract\/sign/, { timeout: 8_000 });
    await expect(page.locator("#sig")).toBeVisible({ timeout: 8_000 });
  });

  test("wrong name keeps Sign button disabled", async ({ page }) => {
    const id = uid();
    const data: RegistrationData = {
      first_name: "Correct", last_name: "Name",
      maker_email: `e2e-mname-${id}@example.com`,
      keeper_name: "Name Keeper",
      keeper_email: `e2e-kname-${id}@example.com`,
      relationship: "Child", path: "aware",
    };
    await registerMaker(page, data);
    await page.locator("#sig").fill("Wrong Name Completely");
    await expect(page.getByRole("button", { name: /sign/i })).toBeDisabled();
  });

  test("correct name enables Sign button", async ({ page }) => {
    const id = uid();
    const data: RegistrationData = {
      first_name: "Full", last_name: "Maker",
      maker_email: `e2e-mcorr-${id}@example.com`,
      keeper_name: "Corr Keeper",
      keeper_email: `e2e-kcorr-${id}@example.com`,
      relationship: "Friend", path: "aware",
    };
    await registerMaker(page, data);
    await page.locator("#sig").fill("Full Maker");
    await expect(page.getByRole("button", { name: /sign/i })).toBeEnabled();
  });

  test("sign → redirects to /contracts dashboard", async ({ page }) => {
    const id = uid();
    const data: RegistrationData = {
      first_name: "Signed", last_name: "Maker",
      maker_email: `e2e-msigned-${id}@example.com`,
      keeper_name: "Signed Keeper",
      keeper_email: `e2e-ksigned-${id}@example.com`,
      relationship: "Partner / spouse", path: "aware",
    };
    await registerMaker(page, data);
    await page.locator("#sig").fill("Signed Maker");
    await page.getByRole("button", { name: /sign/i }).click();
    await page.waitForURL(/\/contracts/, { timeout: 15_000 });
    await expect(page.getByText(/making/i)).toBeVisible({ timeout: 8_000 });
  });
});

test.describe("Maker idempotency", () => {
  test("re-registering same email returns the same contract_id", async () => {
    const id = uid();
    const data: RegistrationData = {
      first_name: "Idem", last_name: "Maker",
      maker_email: `e2e-idem-${id}@example.com`,
      keeper_name: "Idem Keeper",
      keeper_email: `e2e-idemk-${id}@example.com`,
      relationship: "Parent", path: "aware",
    };
    const jwt1 = await getEmailVerifyToken(data);
    const reg1 = await apiPost<{ contract_id: string }>("/auth/complete-registration", { token: jwt1 });
    const jwt2 = await getEmailVerifyToken(data);
    const reg2 = await apiPost<{ contract_id: string }>("/auth/complete-registration", { token: jwt2 });
    expect(reg2.contract_id).toBe(reg1.contract_id);
  });
});
