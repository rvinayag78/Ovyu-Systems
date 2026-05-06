/**
 * Keeper dashboard (/contracts) — login + all states.
 *
 * Covers:
 * - Signed keeper: magic-link login → /contracts
 * - Dashboard shows correct state: "Held for you", "Signed on", View + Download
 * - View button → /keeper/contracts/view (contract view page)
 * - Contract view shows both parties + print button
 * - Unsigned keeper: dashboard shows "Pending signature" + "Sign Contract" button
 * - Sign Contract button → /keeper/contract
 * - Keeper header: shows keeper initial in avatar
 * - Keeper account page accessible via dropdown
 * - Keeper logout → /logged-out
 * - Back button after keeper login doesn't expose /magic-link/verify
 */
import { test, expect } from "@playwright/test";
import * as crypto from "crypto";
import { loginAsKeeper } from "./helpers/auth";
import {
  getEmailVerifyToken,
  getKeeperEmailVerifyToken,
  getInviteToken,
  apiPost,
  apiGet,
  type RegistrationData,
} from "./helpers/tokens";

function uid() { return crypto.randomBytes(4).toString("hex"); }

// ── Signed keeper (LOCKED contract) ──────────────────────────────────────────

test.describe("Keeper dashboard — LOCKED contract", () => {
  let keeperEmail: string;
  const MAKER_NAME = "Lock Maker";
  const KEEPER_NAME = "Lock Keeper";

  test.beforeAll(async () => {
    const id = uid();
    keeperEmail = `e2e-klock-${id}@example.com`;
    const data: RegistrationData = {
      first_name: "Lock", last_name: "Maker",
      maker_email: `e2e-mlock-${id}@example.com`,
      keeper_name: KEEPER_NAME,
      keeper_email: keeperEmail,
      relationship: "Partner / spouse", path: "aware",
    };
    const mJwt = await getEmailVerifyToken(data);
    const reg = await apiPost<{ session_token: string; contract_id: string }>(
      "/auth/complete-registration", { token: mJwt }
    );
    await apiPost(`/contracts/${reg.contract_id}/sign`, { typed_name: MAKER_NAME }, reg.session_token);

    const inviteToken = await getInviteToken(keeperEmail);
    const kJwt = await getKeeperEmailVerifyToken({
      invite_token: inviteToken, first_name: "Lock",
      last_name: "Keeper", email: keeperEmail,
    });
    const kSession = await apiGet<{ session_token: string }>(
      `/auth/keeper-verify?token=${encodeURIComponent(kJwt)}`
    );
    await apiPost(
      `/contracts/invite/${inviteToken}/accept`,
      { typed_name: KEEPER_NAME },
      kSession.session_token
    );
  });

  test("magic-link login → /contracts", async ({ page }) => {
    await loginAsKeeper(page, keeperEmail);
    await expect(page).toHaveURL(/\/contracts/);
  });

  test("back button after login does NOT expose /magic-link/verify", async ({ page }) => {
    await loginAsKeeper(page, keeperEmail);
    await page.goBack();
    await expect(page).not.toHaveURL(/\/magic-link\/verify/);
  });

  test("dashboard shows RECEIVING section with maker name", async ({ page }) => {
    await loginAsKeeper(page, keeperEmail);
    await expect(page.getByText(/receiving/i)).toBeVisible({ timeout: 8_000 });
    await expect(page.getByText(new RegExp(MAKER_NAME, "i"))).toBeVisible();
  });

  test("dashboard shows 'Signed on' date", async ({ page }) => {
    await loginAsKeeper(page, keeperEmail);
    await expect(page.getByText(/signed on/i)).toBeVisible({ timeout: 8_000 });
  });

  test("dashboard shows 'Held for you'", async ({ page }) => {
    await loginAsKeeper(page, keeperEmail);
    await expect(page.getByText(/held for you/i)).toBeVisible({ timeout: 8_000 });
  });

  test("View button navigates to /keeper/contracts/view", async ({ page }) => {
    await loginAsKeeper(page, keeperEmail);
    await page.getByRole("button", { name: /^view$/i }).click();
    await expect(page).toHaveURL(/\/keeper\/contracts\/view/, { timeout: 10_000 });
  });

  test("contract view page shows both parties and agreement text", async ({ page }) => {
    await loginAsKeeper(page, keeperEmail);
    await page.getByRole("button", { name: /^view$/i }).click();
    await page.waitForURL(/\/keeper\/contracts\/view/, { timeout: 10_000 });
    await expect(page.getByText(/ovyu agreement/i)).toBeVisible({ timeout: 8_000 });
    await expect(page.getByText(new RegExp(MAKER_NAME, "i")).first()).toBeVisible();
    await expect(page.getByText(new RegExp(KEEPER_NAME, "i")).first()).toBeVisible();
  });

  test("Download button on dashboard is visible", async ({ page }) => {
    await loginAsKeeper(page, keeperEmail);
    await expect(page.getByRole("button", { name: /download/i })).toBeVisible({ timeout: 8_000 });
  });

  test("keeper avatar shows first letter of keeper name", async ({ page }) => {
    await loginAsKeeper(page, keeperEmail);
    // "Lock Keeper" → initial L
    await expect(page.getByLabel("Account menu")).toContainText("L", { timeout: 8_000 });
  });

  test("keeper dropdown Contact → /contact", async ({ page }) => {
    await loginAsKeeper(page, keeperEmail);
    await page.getByLabel("Account menu").click();
    await page.getByRole("menuitem", { name: /^contact$/i }).click();
    await expect(page).toHaveURL(/\/contact/);
    await expect(page.getByText(/contact\./i)).toBeVisible({ timeout: 8_000 });
  });

  test("keeper dropdown Log Out → /logged-out", async ({ page }) => {
    await loginAsKeeper(page, keeperEmail);
    await page.getByLabel("Account menu").click();
    await page.getByRole("menuitem", { name: /log out/i }).click();
    await expect(page).toHaveURL(/\/logged-out/, { timeout: 8_000 });
  });
});

// ── Unsigned keeper (PENDING_KEEPER contract) ─────────────────────────────────

test.describe("Keeper dashboard — unsigned contract", () => {
  let keeperEmail: string;
  const MAKER_NAME = "Pending Maker";
  const KEEPER_NAME = "Pending Keeper";

  test.beforeAll(async () => {
    const id = uid();
    keeperEmail = `e2e-kunsigned-${id}@example.com`;
    const data: RegistrationData = {
      first_name: "Pending", last_name: "Maker",
      maker_email: `e2e-munsigned-${id}@example.com`,
      keeper_name: KEEPER_NAME,
      keeper_email: keeperEmail,
      relationship: "Friend", path: "aware",
    };
    const mJwt = await getEmailVerifyToken(data);
    const reg = await apiPost<{ session_token: string; contract_id: string }>(
      "/auth/complete-registration", { token: mJwt }
    );
    await apiPost(`/contracts/${reg.contract_id}/sign`, { typed_name: MAKER_NAME }, reg.session_token);

    // Keeper creates account (verify) but does NOT sign
    const inviteToken = await getInviteToken(keeperEmail);
    const kJwt = await getKeeperEmailVerifyToken({
      invite_token: inviteToken, first_name: "Pending",
      last_name: "Keeper", email: keeperEmail,
    });
    await apiGet<{ session_token: string }>(
      `/auth/keeper-verify?token=${encodeURIComponent(kJwt)}`
    );
  });

  test("unsigned keeper login → /contracts", async ({ page }) => {
    await loginAsKeeper(page, keeperEmail);
    await expect(page).toHaveURL(/\/contracts/);
  });

  test("unsigned contract shows 'Pending signature'", async ({ page }) => {
    await loginAsKeeper(page, keeperEmail);
    await expect(page.getByText(/pending signature/i)).toBeVisible({ timeout: 8_000 });
  });

  test("unsigned contract shows 'Sign Contract' button", async ({ page }) => {
    await loginAsKeeper(page, keeperEmail);
    await expect(page.getByRole("button", { name: /sign contract/i })).toBeVisible({ timeout: 8_000 });
  });

  test("Sign Contract button → /keeper/contract", async ({ page }) => {
    await loginAsKeeper(page, keeperEmail);
    await page.getByRole("button", { name: /sign contract/i }).click();
    await page.waitForURL(/\/keeper\/contract/, { timeout: 10_000 });
    await expect(page.getByText(new RegExp(MAKER_NAME, "i"))).toBeVisible({ timeout: 8_000 });
  });
});
