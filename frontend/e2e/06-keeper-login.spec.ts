/**
 * Keeper magic-link login flow.
 *
 * Tests returning-keeper scenarios: logging in after the contract is LOCKED
 * and verifying the /keeper/contracts dashboard state.
 *
 * Setup: creates a fully signed contract (Maker + Keeper) entirely via API
 * so no browser is needed for fixture setup.
 */
import { test, expect } from "@playwright/test";
import * as crypto from "crypto";
import {
  getEmailVerifyToken,
  getKeeperEmailVerifyToken,
  getInviteToken,
  apiPost,
  apiGet,
  type RegistrationData,
} from "./helpers/tokens";
import { loginAsKeeper } from "./helpers/auth";

const API = process.env.API_URL ?? "http://localhost:8000/api/v1";

const MAKER_NAME = "Login Maker";
const KEEPER_NAME = "Login Keeper";
const KEEPER_FIRST = "Login";
const KEEPER_LAST = "Keeper";

let keeperEmail: string;
let makerName: string;

test.describe("Keeper magic-link login + dashboard", () => {
  test.beforeAll(async () => {
    const id = crypto.randomBytes(4).toString("hex");
    keeperEmail = `e2e-klogin-${id}@example.com`;
    makerName = MAKER_NAME;

    // 1. Maker registers + signs (fully via API)
    const regData: RegistrationData = {
      first_name: "Login",
      last_name: "Maker",
      maker_email: `e2e-mlogin-${id}@example.com`,
      keeper_name: KEEPER_NAME,
      keeper_email: keeperEmail,
      relationship: "Parent",
      path: "aware",
    };
    const makerVerifyJwt = await getEmailVerifyToken(regData);
    const reg = await apiPost<{ session_token: string; contract_id: string }>(
      "/auth/complete-registration", { token: makerVerifyJwt }
    );
    await apiPost(
      `/contracts/${reg.contract_id}/sign`,
      { typed_name: MAKER_NAME },
      reg.session_token
    );

    // 2. Get keeper invite token
    const inviteToken = await getInviteToken(keeperEmail);

    // 3. Keeper verifies email (no browser, no email sent)
    const keeperVerifyJwt = await getKeeperEmailVerifyToken({
      invite_token: inviteToken,
      first_name: KEEPER_FIRST,
      last_name: KEEPER_LAST,
      email: keeperEmail,
    });
    const keeperSession = await apiGet<{ session_token: string; contract_id: string }>(
      `/auth/keeper-verify?token=${encodeURIComponent(keeperVerifyJwt)}`
    );

    // 4. Keeper signs the contract (accept invitation)
    await apiPost(
      `/contracts/invite/${inviteToken}/accept`,
      { typed_name: KEEPER_NAME },
      keeperSession.session_token
    );
  });

  test("magic-link login redirects to /keeper/contracts", async ({ page }) => {
    await loginAsKeeper(page, keeperEmail);
    await expect(page).toHaveURL(/\/keeper\/contracts/);
  });

  test("dashboard shows LOCKED contract with maker name", async ({ page }) => {
    await loginAsKeeper(page, keeperEmail);
    await expect(page.getByText(/receiving/i)).toBeVisible({ timeout: 8_000 });
    await expect(page.getByText(new RegExp(makerName, "i"))).toBeVisible();
  });

  test("dashboard shows 'Signed on' date and 'Held for you'", async ({ page }) => {
    await loginAsKeeper(page, keeperEmail);
    await expect(page.getByText(/signed on/i)).toBeVisible({ timeout: 8_000 });
    await expect(page.getByText(/held for you/i)).toBeVisible();
  });

  test("View button navigates to /keeper/contracts/view", async ({ page }) => {
    await loginAsKeeper(page, keeperEmail);
    await page.getByRole("button", { name: /view/i }).first().click();
    await page.waitForURL(/\/keeper\/contracts\/view/, { timeout: 10_000 });
    // Contract view page shows both parties
    await expect(page.getByText(new RegExp(makerName, "i"))).toBeVisible({ timeout: 8_000 });
  });
});

test.describe("Keeper login — unsigned contract state", () => {
  let unsignedKeeperEmail: string;

  test.beforeAll(async () => {
    const id = crypto.randomBytes(4).toString("hex");
    unsignedKeeperEmail = `e2e-kunsigned-${id}@example.com`;

    // Maker signs but keeper does NOT sign — contract stays PENDING_KEEPER
    const regData: RegistrationData = {
      first_name: "Pending",
      last_name: "Maker",
      maker_email: `e2e-mpending-${id}@example.com`,
      keeper_name: "Pending Keeper",
      keeper_email: unsignedKeeperEmail,
      relationship: "Friend",
      path: "aware",
    };
    const makerVerifyJwt = await getEmailVerifyToken(regData);
    const reg = await apiPost<{ session_token: string; contract_id: string }>(
      "/auth/complete-registration", { token: makerVerifyJwt }
    );
    await apiPost(
      `/contracts/${reg.contract_id}/sign`,
      { typed_name: "Pending Maker" },
      reg.session_token
    );

    // Keeper registers account (email verify + keeper-verify) but does NOT sign
    const inviteToken = await getInviteToken(unsignedKeeperEmail);
    const keeperVerifyJwt = await getKeeperEmailVerifyToken({
      invite_token: inviteToken,
      first_name: "Pending",
      last_name: "Keeper",
      email: unsignedKeeperEmail,
    });
    // Create keeper user (no signing)
    await apiGet<{ session_token: string }>(
      `/auth/keeper-verify?token=${encodeURIComponent(keeperVerifyJwt)}`
    );
  });

  test("unsigned keeper login → dashboard shows Sign Contract button", async ({ page }) => {
    await loginAsKeeper(page, unsignedKeeperEmail);
    await expect(page.getByText(/receiving/i)).toBeVisible({ timeout: 8_000 });
    await expect(page.getByText(/pending signature/i)).toBeVisible();
    await expect(page.getByRole("button", { name: /sign contract/i })).toBeVisible();
  });

  test("Sign Contract button navigates to /keeper/contract", async ({ page }) => {
    await loginAsKeeper(page, unsignedKeeperEmail);
    await page.getByRole("button", { name: /sign contract/i }).click();
    await page.waitForURL(/\/keeper\/contract/, { timeout: 10_000 });
    await expect(page.getByText(/has created something for you/i)).toBeVisible({ timeout: 8_000 });
  });
});
