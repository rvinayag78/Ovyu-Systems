/**
 * Keeper aware-path onboarding flow.
 *
 * New Keeper flow (since the invite page now redirects to account setup):
 *   /invite/{token}       → redirect → /keeper/begin/{token}
 *   /keeper/begin/{token} → fill form → /keeper/email-sent
 *   /keeper/verify        → (email stubbed) → /keeper/register
 *   /keeper/register      → click CTA → /keeper/contract
 *   /keeper/contract      → sign → "You've signed." confirmation
 *   → /keeper/contracts   → dashboard shows LOCKED contract
 *
 * Uses /test/keeper-email-verify-token (TESTING=true required on backend).
 */
import { test, expect } from "@playwright/test";
import * as crypto from "crypto";
import {
  getEmailVerifyToken,
  getKeeperEmailVerifyToken,
  getInviteToken,
  apiPost,
  type RegistrationData,
} from "./helpers/tokens";
import { registerKeeper } from "./helpers/auth";

const API = process.env.API_URL ?? "http://localhost:8000/api/v1";

const MAKER_NAME = "E2E Maker";
const KEEPER_NAME = "E2E Keeper";
const KEEPER_FIRST = "E2E";
const KEEPER_LAST = "Keeper";

let sharedInviteToken: string;

// ── Shared setup: create maker + sign contract ────────────────────────────────
// The shared inviteToken is used only for non-signing tests (redirect check, page
// content, form fill). Tests that actually sign create their own fresh contract.

test.describe("Keeper aware-path onboarding flow", () => {
  test.beforeAll(async () => {
    const id = crypto.randomBytes(4).toString("hex");
    const keeperEmail = `e2e-k-shared-${id}@example.com`;

    const data: RegistrationData = {
      first_name: "E2E",
      last_name: "Maker",
      maker_email: `e2e-m-shared-${id}@example.com`,
      keeper_name: KEEPER_NAME,
      keeper_email: keeperEmail,
      relationship: "Partner / spouse",
      path: "aware",
    };

    const verifyJwt = await getEmailVerifyToken(data);
    const reg = await apiPost<{ session_token: string; contract_id: string }>(
      "/auth/complete-registration", { token: verifyJwt }
    );
    await apiPost(
      `/contracts/${reg.contract_id}/sign`,
      { typed_name: MAKER_NAME },
      reg.session_token
    );
    sharedInviteToken = await getInviteToken(keeperEmail);
  });

  // ── Redirect tests ────────────────────────────────────────────────────────

  test("invite link for keeper redirects to /keeper/begin/{token}", async ({ page }) => {
    await page.goto(`/invite/${sharedInviteToken}`);
    await page.waitForURL(/\/keeper\/begin\//, { timeout: 10_000 });
    expect(page.url()).toContain(`/keeper/begin/${sharedInviteToken}`);
  });

  // ── Keeper begin page ─────────────────────────────────────────────────────

  test("keeper begin page shows maker name in subtitle", async ({ page }) => {
    await page.goto(`/keeper/begin/${sharedInviteToken}`);
    await expect(page.getByText(new RegExp(MAKER_NAME, "i"))).toBeVisible({ timeout: 8_000 });
    await expect(page.getByText(/just for you/i)).toBeVisible();
  });

  test("Continue button is enabled only when required fields are filled", async ({ page }) => {
    await page.goto(`/keeper/begin/${sharedInviteToken}`);
    const btn = page.getByRole("button", { name: /continue to verify email/i });
    // Partially filled — first + last but no email
    await page.getByPlaceholder("First name").fill("Test");
    await page.getByPlaceholder("Last name").fill("Keeper");
    // Form uses required + handleSubmit early-return guard, not disabled attr
    // so we verify the form does NOT navigate when email is missing
    await btn.click();
    // Still on the same page (no redirect)
    await expect(page).toHaveURL(/\/keeper\/begin\//);
  });

  test("account setup form submits and shows email-sent page", async ({ page }) => {
    const id = crypto.randomBytes(4).toString("hex");
    const email = `e2e-ks-${id}@example.com`;

    await page.goto(`/keeper/begin/${sharedInviteToken}`);
    await page.getByPlaceholder("First name").fill(KEEPER_FIRST);
    await page.getByPlaceholder("Last name").fill(KEEPER_LAST);
    await page.getByPlaceholder("you@example.com").fill(email);
    await page.getByRole("button", { name: /continue to verify email/i }).click();

    await page.waitForURL("**/keeper/email-sent", { timeout: 10_000 });
    await expect(page.getByText(/check your email/i)).toBeVisible();
    await expect(page.getByText(email)).toBeVisible();
    await expect(page.getByText(/expires in 24 hours/i)).toBeVisible();
  });

  // ── Email verification ────────────────────────────────────────────────────

  test("email verification link → /keeper/register with verified message", async ({ page }) => {
    const id = crypto.randomBytes(4).toString("hex");
    const email = `e2e-kv-${id}@example.com`;

    const verifyJwt = await getKeeperEmailVerifyToken({
      invite_token: sharedInviteToken,
      first_name: KEEPER_FIRST,
      last_name: KEEPER_LAST,
      email,
    });

    await page.goto(`/keeper/verify?token=${verifyJwt}`);
    await page.waitForURL("**/keeper/register", { timeout: 10_000 });
    await expect(page.getByText(/your email is verified/i)).toBeVisible();
    await expect(page.getByText(/review your contract/i)).toBeVisible();
  });

  // ── Contract signing ──────────────────────────────────────────────────────

  test("wrong keeper name keeps Sign button disabled", async ({ page }) => {
    const id = crypto.randomBytes(4).toString("hex");
    const email = `e2e-kwrong-${id}@example.com`;

    const verifyJwt = await getKeeperEmailVerifyToken({
      invite_token: sharedInviteToken,
      first_name: KEEPER_FIRST,
      last_name: KEEPER_LAST,
      email,
    });
    await page.goto(`/keeper/verify?token=${verifyJwt}`);
    await page.waitForURL("**/keeper/register", { timeout: 10_000 });
    await page.getByRole("button", { name: /review my contract/i }).click();
    await page.waitForURL("**/keeper/contract", { timeout: 10_000 });

    await page.getByPlaceholder(/your full legal name/i).fill("Wrong Name Entirely");
    const signBtn = page.getByRole("button", { name: /sign and continue/i });
    await expect(signBtn).toBeDisabled();
    await expect(page.getByText(/name doesn.*t match/i)).toBeVisible();
  });

  test("correct name enables Sign button", async ({ page }) => {
    const id = crypto.randomBytes(4).toString("hex");
    const email = `e2e-kcorr-${id}@example.com`;

    const verifyJwt = await getKeeperEmailVerifyToken({
      invite_token: sharedInviteToken,
      first_name: KEEPER_FIRST,
      last_name: KEEPER_LAST,
      email,
    });
    await page.goto(`/keeper/verify?token=${verifyJwt}`);
    await page.waitForURL("**/keeper/register", { timeout: 10_000 });
    await page.getByRole("button", { name: /review my contract/i }).click();
    await page.waitForURL("**/keeper/contract", { timeout: 10_000 });

    await page.getByPlaceholder(/your full legal name/i).fill(KEEPER_NAME);
    await expect(page.getByRole("button", { name: /sign and continue/i })).toBeEnabled();
  });

  // ── Full happy path (creates its own contract so token is not shared) ─────

  test("full happy path: account setup → email verify → register → contract → You've signed", async ({ page }) => {
    const id = crypto.randomBytes(4).toString("hex");
    const keeperEmail = `e2e-kfull-${id}@example.com`;
    const makerEmail = `e2e-mfull-${id}@example.com`;

    // Set up: maker registers + signs via API
    const regData: RegistrationData = {
      first_name: "Full",
      last_name: "Maker",
      maker_email: makerEmail,
      keeper_name: KEEPER_NAME,
      keeper_email: keeperEmail,
      relationship: "Child",
      path: "aware",
    };
    const verifyJwt = await getEmailVerifyToken(regData);
    const reg = await apiPost<{ session_token: string; contract_id: string }>(
      "/auth/complete-registration", { token: verifyJwt }
    );
    await apiPost(
      `/contracts/${reg.contract_id}/sign`,
      { typed_name: "Full Maker" },
      reg.session_token
    );
    const freshToken = await getInviteToken(keeperEmail);

    // Keeper goes through full browser flow
    await registerKeeper(page, {
      inviteToken: freshToken,
      firstName: KEEPER_FIRST,
      lastName: KEEPER_LAST,
      email: keeperEmail,
      keeperFullName: KEEPER_NAME,
    });

    // Confirmation page visible
    await expect(page.getByText(/you've signed/i)).toBeVisible({ timeout: 8_000 });
    await expect(page.getByText(/full maker/i)).toBeVisible();
    await expect(page.getByRole("link", { name: /view your contracts/i })).toBeVisible();
  });

  test("after signing → /keeper/contracts shows LOCKED contract", async ({ page }) => {
    const id = crypto.randomBytes(4).toString("hex");
    const keeperEmail = `e2e-kdash-${id}@example.com`;
    const makerEmail = `e2e-mdash-${id}@example.com`;

    const regData: RegistrationData = {
      first_name: "Dash",
      last_name: "Maker",
      maker_email: makerEmail,
      keeper_name: KEEPER_NAME,
      keeper_email: keeperEmail,
      relationship: "Sibling",
      path: "aware",
    };
    const verifyJwt = await getEmailVerifyToken(regData);
    const reg = await apiPost<{ session_token: string; contract_id: string }>(
      "/auth/complete-registration", { token: verifyJwt }
    );
    await apiPost(
      `/contracts/${reg.contract_id}/sign`,
      { typed_name: "Dash Maker" },
      reg.session_token
    );
    const freshToken = await getInviteToken(keeperEmail);

    await registerKeeper(page, {
      inviteToken: freshToken,
      firstName: KEEPER_FIRST,
      lastName: KEEPER_LAST,
      email: keeperEmail,
      keeperFullName: KEEPER_NAME,
    });

    // Navigate to dashboard via the confirmation link
    await page.getByRole("link", { name: /view your contracts/i }).click();
    await page.waitForURL("**/keeper/contracts", { timeout: 10_000 });

    await expect(page.getByText(/receiving/i)).toBeVisible();
    await expect(page.getByText(/Dash Maker/i)).toBeVisible();
    await expect(page.getByText(/signed on/i)).toBeVisible();
    await expect(page.getByText(/held for you/i)).toBeVisible();
  });

  // ── Error states ──────────────────────────────────────────────────────────

  test("invalid invite token on keeper begin → error message", async ({ page }) => {
    await page.goto("/keeper/begin/not-a-real-token-xyz");
    await expect(
      page.getByText(/invalid|expired/i)
    ).toBeVisible({ timeout: 10_000 });
  });

  test("invalid invite token on invite page → error message", async ({ page }) => {
    await page.goto("/invite/not-a-real-token-xyz");
    await expect(
      page.getByText(/not found|invalid|expired/i)
    ).toBeVisible({ timeout: 10_000 });
  });
});
