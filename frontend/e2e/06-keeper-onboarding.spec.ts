/**
 * Keeper aware-path onboarding — full flow + edge cases.
 *
 * Covers:
 * - /invite/{token} redirects to /keeper/begin/{token} for keepers
 * - /keeper/begin shows maker name, requires all fields
 * - Account setup → /keeper/email-sent
 * - Email verify → /keeper/register (email verified page)
 * - Back button after verify does NOT expose /keeper/verify
 * - /keeper/register → /keeper/contract
 * - Contract page shows maker name, keeper name
 * - Wrong name → Sign button disabled
 * - Correct name → Sign and continue → "You've signed" confirmation
 * - "View your contracts →" → /keeper/contracts dashboard
 * - Invalid invite token → error message
 * - Invalid verify token → error message
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

function uid() { return crypto.randomBytes(4).toString("hex"); }

const MAKER_FIRST = "Onboard";
const MAKER_LAST = "Maker";
const MAKER_NAME = `${MAKER_FIRST} ${MAKER_LAST}`;
const KEEPER_FIRST = "Onboard";
const KEEPER_LAST = "Keeper";
const KEEPER_NAME = `${KEEPER_FIRST} ${KEEPER_LAST}`;

let sharedInviteToken: string;

test.describe("Keeper aware-path onboarding", () => {
  test.beforeAll(async () => {
    const id = uid();
    const data: RegistrationData = {
      first_name: MAKER_FIRST, last_name: MAKER_LAST,
      maker_email: `e2e-km-shared-${id}@example.com`,
      keeper_name: KEEPER_NAME,
      keeper_email: `e2e-kk-shared-${id}@example.com`,
      relationship: "Partner / spouse", path: "aware",
    };
    const jwt = await getEmailVerifyToken(data);
    const reg = await apiPost<{ session_token: string; contract_id: string }>(
      "/auth/complete-registration", { token: jwt }
    );
    await apiPost(`/contracts/${reg.contract_id}/sign`, { typed_name: MAKER_NAME }, reg.session_token);
    sharedInviteToken = await getInviteToken(`e2e-kk-shared-${id}@example.com`);
    // Store email for later tests
    (global as Record<string, string>).__sharedKeeperEmail = `e2e-kk-shared-${id}@example.com`;
  });

  // ── Invite redirect ─────────────────────────────────────────────────────────

  test("/invite/{token} redirects keeper to /keeper/begin/{token}", async ({ page }) => {
    await page.goto(`/invite/${sharedInviteToken}`);
    await page.waitForURL(/\/keeper\/begin\//, { timeout: 10_000 });
    expect(page.url()).toContain(`/keeper/begin/${sharedInviteToken}`);
  });

  // ── Keeper begin page ───────────────────────────────────────────────────────

  test("keeper begin page shows maker name in subtitle", async ({ page }) => {
    await page.goto(`/keeper/begin/${sharedInviteToken}`);
    await expect(page.getByText(new RegExp(MAKER_NAME, "i"))).toBeVisible({ timeout: 8_000 });
    await expect(page.getByText(/just for you/i)).toBeVisible();
  });

  test("form with only first + last but no email does not navigate on submit", async ({ page }) => {
    await page.goto(`/keeper/begin/${sharedInviteToken}`);
    await page.getByPlaceholder("First name").fill("Test");
    await page.getByPlaceholder("Last name").fill("Keeper");
    // No email — submit should not navigate
    await page.getByRole("button", { name: /continue to verify email/i }).click();
    await expect(page).toHaveURL(/\/keeper\/begin\//);
  });

  test("filling all required fields and submitting → /keeper/email-sent", async ({ page }) => {
    const id = uid();
    const email = `e2e-kes-${id}@example.com`;
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

  // ── Email verification ──────────────────────────────────────────────────────

  test("email verify link → /keeper/register shows 'email is verified'", async ({ page }) => {
    const id = uid();
    const jwt = await getKeeperEmailVerifyToken({
      invite_token: sharedInviteToken,
      first_name: KEEPER_FIRST, last_name: KEEPER_LAST,
      email: `e2e-kev-${id}@example.com`,
    });
    await page.goto(`/keeper/verify?token=${jwt}`);
    await page.waitForURL("**/keeper/register", { timeout: 10_000 });
    await expect(page.getByText(/your email is verified/i)).toBeVisible();
    await expect(page.getByText(/let.s review your contract/i)).toBeVisible();
  });

  test("back button after /keeper/verify does NOT return to /keeper/verify", async ({ page }) => {
    const id = uid();
    const jwt = await getKeeperEmailVerifyToken({
      invite_token: sharedInviteToken,
      first_name: KEEPER_FIRST, last_name: KEEPER_LAST,
      email: `e2e-kback-${id}@example.com`,
    });
    // Land on email-sent first so it's in history
    await page.goto("/keeper/email-sent");
    // Verify replaces the history entry
    await page.goto(`/keeper/verify?token=${jwt}`);
    await page.waitForURL("**/keeper/register", { timeout: 10_000 });
    await page.goBack();
    // Should be on /keeper/email-sent, NOT /keeper/verify
    await expect(page).not.toHaveURL(/\/keeper\/verify/);
  });

  // ── Contract page ───────────────────────────────────────────────────────────

  test("'Review my contract' CTA → /keeper/contract shows contract", async ({ page }) => {
    const id = uid();
    const jwt = await getKeeperEmailVerifyToken({
      invite_token: sharedInviteToken,
      first_name: KEEPER_FIRST, last_name: KEEPER_LAST,
      email: `e2e-kcon-${id}@example.com`,
    });
    await page.goto(`/keeper/verify?token=${jwt}`);
    await page.waitForURL("**/keeper/register", { timeout: 10_000 });
    await page.getByRole("button", { name: /review my contract/i }).click();
    await page.waitForURL("**/keeper/contract", { timeout: 10_000 });
    await expect(page.getByText(new RegExp(MAKER_NAME, "i"))).toBeVisible({ timeout: 8_000 });
    await expect(page.getByText(new RegExp(KEEPER_NAME, "i"))).toBeVisible();
  });

  test("wrong keeper name → Sign and continue button disabled", async ({ page }) => {
    const id = uid();
    const jwt = await getKeeperEmailVerifyToken({
      invite_token: sharedInviteToken,
      first_name: KEEPER_FIRST, last_name: KEEPER_LAST,
      email: `e2e-kwrong-${id}@example.com`,
    });
    await page.goto(`/keeper/verify?token=${jwt}`);
    await page.waitForURL("**/keeper/register", { timeout: 10_000 });
    await page.getByRole("button", { name: /review my contract/i }).click();
    await page.waitForURL("**/keeper/contract", { timeout: 10_000 });

    await page.getByPlaceholder(/your full legal name/i).fill("Totally Wrong Name");
    await expect(page.getByRole("button", { name: /sign and continue/i })).toBeDisabled();
    await expect(page.getByText(/name doesn.*t match/i)).toBeVisible();
  });

  test("correct keeper name → Sign and continue button enabled", async ({ page }) => {
    const id = uid();
    const jwt = await getKeeperEmailVerifyToken({
      invite_token: sharedInviteToken,
      first_name: KEEPER_FIRST, last_name: KEEPER_LAST,
      email: `e2e-kcorrect-${id}@example.com`,
    });
    await page.goto(`/keeper/verify?token=${jwt}`);
    await page.waitForURL("**/keeper/register", { timeout: 10_000 });
    await page.getByRole("button", { name: /review my contract/i }).click();
    await page.waitForURL("**/keeper/contract", { timeout: 10_000 });

    await page.getByPlaceholder(/your full legal name/i).fill(KEEPER_NAME);
    await expect(page.getByRole("button", { name: /sign and continue/i })).toBeEnabled();
  });

  // ── Full happy path ─────────────────────────────────────────────────────────

  test("full happy path → You've signed confirmation", async ({ page }) => {
    const id = uid();
    const keeperEmail = `e2e-khappy-${id}@example.com`;
    // Create fresh maker + contract for signing (shared token is reusable for non-signing steps only)
    const freshData: RegistrationData = {
      first_name: "Happy", last_name: "Maker",
      maker_email: `e2e-mhappy-${id}@example.com`,
      keeper_name: KEEPER_NAME,
      keeper_email: keeperEmail,
      relationship: "Child", path: "aware",
    };
    const mJwt = await getEmailVerifyToken(freshData);
    const reg = await apiPost<{ session_token: string; contract_id: string }>(
      "/auth/complete-registration", { token: mJwt }
    );
    await apiPost(`/contracts/${reg.contract_id}/sign`, { typed_name: "Happy Maker" }, reg.session_token);
    const freshToken = await getInviteToken(keeperEmail);

    await registerKeeper(page, {
      inviteToken: freshToken,
      firstName: KEEPER_FIRST, lastName: KEEPER_LAST,
      email: keeperEmail, keeperFullName: KEEPER_NAME,
    });

    await expect(page.getByText(/you've signed/i)).toBeVisible({ timeout: 8_000 });
    await expect(page.getByText(/happy maker/i).first()).toBeVisible();
  });

  test("after signing → 'View your contracts' link → /keeper/contracts shows LOCKED", async ({ page }) => {
    const id = uid();
    const keeperEmail = `e2e-kpost-${id}@example.com`;
    const freshData: RegistrationData = {
      first_name: "Post", last_name: "Maker",
      maker_email: `e2e-mpost-${id}@example.com`,
      keeper_name: KEEPER_NAME,
      keeper_email: keeperEmail,
      relationship: "Sibling", path: "aware",
    };
    const mJwt = await getEmailVerifyToken(freshData);
    const reg = await apiPost<{ session_token: string; contract_id: string }>(
      "/auth/complete-registration", { token: mJwt }
    );
    await apiPost(`/contracts/${reg.contract_id}/sign`, { typed_name: "Post Maker" }, reg.session_token);
    const freshToken = await getInviteToken(keeperEmail);

    await registerKeeper(page, {
      inviteToken: freshToken,
      firstName: KEEPER_FIRST, lastName: KEEPER_LAST,
      email: keeperEmail, keeperFullName: KEEPER_NAME,
    });

    await page.getByRole("link", { name: /view your contracts/i }).click();
    await page.waitForURL("**/keeper/contracts", { timeout: 10_000 });
    await expect(page.getByText(/receiving/i)).toBeVisible();
    await expect(page.getByText(/Post Maker/i)).toBeVisible();
    await expect(page.getByText(/signed on/i)).toBeVisible();
    await expect(page.getByText(/held for you/i)).toBeVisible();
  });

  // ── Error states ────────────────────────────────────────────────────────────

  test("invalid invite token on /keeper/begin → error message", async ({ page }) => {
    await page.goto("/keeper/begin/bad-token-xyz");
    await expect(page.getByText(/invalid|expired/i)).toBeVisible({ timeout: 10_000 });
  });

  test("invalid invite token on /invite → error message", async ({ page }) => {
    await page.goto("/invite/bad-token-xyz");
    await expect(page.getByText(/not found|invalid|expired/i)).toBeVisible({ timeout: 10_000 });
  });

  test("invalid verify token on /keeper/verify → error message", async ({ page }) => {
    await page.goto("/keeper/verify?token=not-a-real-jwt");
    await expect(page.getByText(/invalid|expired|error/i)).toBeVisible({ timeout: 10_000 });
  });
});
