/**
 * Private path (TC-mediated contract) tests.
 *
 * In the private path, the Keeper does NOT know. A Transfer Contact (TC) is
 * nominated instead. The TC receives an invitation and must accept.
 *
 * Covers:
 * - Maker registers private path → signs → TC gets invitation
 * - TC invite page shows TC contract (not keeper contract)
 * - TC wrong name → disabled
 * - TC correct name → signs → "You've signed" confirmation
 * - TC magic-link login (mode=tc) → /activate-transfer/coming-soon
 * - Invalid TC invite → error
 */
import { test, expect } from "@playwright/test";
import * as crypto from "crypto";
import { registerMaker } from "./helpers/auth";
import { getEmailVerifyToken, getInviteToken, getMagicToken, apiPost, type RegistrationData } from "./helpers/tokens";

function uid() { return crypto.randomBytes(4).toString("hex"); }

const TC_NAME = "Transfer Contact";
const TC_FIRST = "Transfer";
const TC_LAST = "Contact";

let sharedTCToken: string;
let sharedTCEmail: string;

test.describe("Private path — TC invitation", () => {
  test.beforeAll(async () => {
    const id = uid();
    sharedTCEmail = `e2e-tc-${id}@example.com`;
    const data: RegistrationData = {
      first_name: "Private", last_name: "Maker",
      maker_email: `e2e-pm-${id}@example.com`,
      keeper_name: "Private Keeper",
      keeper_email: `e2e-pk-${id}@example.com`,
      relationship: "Partner / spouse",
      path: "private",
      tc_name: TC_NAME,
      tc_email: sharedTCEmail,
    };
    const jwt = await getEmailVerifyToken(data);
    const reg = await apiPost<{ session_token: string; contract_id: string }>(
      "/auth/complete-registration", { token: jwt }
    );
    await apiPost(`/contracts/${reg.contract_id}/sign`, { typed_name: "Private Maker" }, reg.session_token);
    sharedTCToken = await getInviteToken(sharedTCEmail);
  });

  test("TC invite token exists after maker signs (private path)", async () => {
    expect(sharedTCToken).toBeTruthy();
    expect(sharedTCToken.length).toBeGreaterThan(10);
  });

  test("TC invite page shows TC contract heading", async ({ page }) => {
    await page.goto(`/invite/${sharedTCToken}`);
    await expect(page.getByText(/transfer contact/i).first()).toBeVisible({ timeout: 10_000 });
    await expect(page.getByText(/Private Maker/i).first()).toBeVisible();
  });

  test("TC invite page shows 'Accept and sign' button (not 'keeper begin' redirect)", async ({ page }) => {
    await page.goto(`/invite/${sharedTCToken}`);
    // TC goes directly to sign page — no account setup redirect
    await expect(page.getByRole("button", { name: /accept and sign|i accept/i })).toBeVisible({ timeout: 10_000 });
  });

  test("TC wrong name → sign button disabled", async ({ page }) => {
    await page.goto(`/invite/${sharedTCToken}`);
    await page.getByPlaceholder(/your full legal name/i).fill("Wrong TC Name");
    await expect(page.getByRole("button", { name: /accept and sign|i accept/i })).toBeDisabled();
    await expect(page.getByText(/name doesn.*t match/i)).toBeVisible();
  });

  test("TC correct name → sign → 'You've signed' confirmation", async ({ page }) => {
    const id = uid();
    const tcEmail = `e2e-tcsign-${id}@example.com`;
    const data: RegistrationData = {
      first_name: "Private", last_name: "Maker",
      maker_email: `e2e-pm2-${id}@example.com`,
      keeper_name: "Private Keeper",
      keeper_email: `e2e-pk2-${id}@example.com`,
      relationship: "Child",
      path: "private",
      tc_name: TC_NAME,
      tc_email: tcEmail,
    };
    const jwt = await getEmailVerifyToken(data);
    const reg = await apiPost<{ session_token: string; contract_id: string }>(
      "/auth/complete-registration", { token: jwt }
    );
    await apiPost(`/contracts/${reg.contract_id}/sign`, { typed_name: "Private Maker" }, reg.session_token);
    const tcToken = await getInviteToken(tcEmail);

    await page.goto(`/invite/${tcToken}`);
    await page.getByPlaceholder(/your full legal name/i).fill(TC_NAME);
    await page.getByRole("button", { name: /accept and sign|i accept/i }).click();
    await expect(page.getByText(/you've signed/i)).toBeVisible({ timeout: 10_000 });
  });

  test("TC magic-link login → /activate-transfer/coming-soon", async ({ page }) => {
    const id = uid();
    const tcEmail = `e2e-tclogin-${id}@example.com`;
    // Create a contract where this email is the TC, then have them accept
    const data: RegistrationData = {
      first_name: "TCLogin", last_name: "Maker",
      maker_email: `e2e-tcm-${id}@example.com`,
      keeper_name: "TCLogin Keeper",
      keeper_email: `e2e-tck-${id}@example.com`,
      relationship: "Sibling",
      path: "private",
      tc_name: TC_NAME,
      tc_email: tcEmail,
    };
    const jwt = await getEmailVerifyToken(data);
    const reg = await apiPost<{ session_token: string; contract_id: string }>(
      "/auth/complete-registration", { token: jwt }
    );
    await apiPost(`/contracts/${reg.contract_id}/sign`, { typed_name: "TCLogin Maker" }, reg.session_token);
    const tcInviteToken = await getInviteToken(tcEmail);
    // TC accepts via browser UI to create their user account
    await page.goto(`/invite/${tcInviteToken}`);
    await page.getByPlaceholder(/your full legal name/i).fill(TC_NAME);
    await page.getByRole("button", { name: /accept and sign|i accept/i }).click();
    await expect(page.getByText(/you've signed/i)).toBeVisible({ timeout: 10_000 });

    // TC magic-link login
    const magicToken = await getMagicToken(tcEmail, "tc");
    await page.goto(`/magic-link/verify?token=${magicToken}`);
    await page.waitForURL(/\/activate-transfer/, { timeout: 15_000 });
  });

  test("invalid TC invite token → error message", async ({ page }) => {
    await page.goto("/invite/not-a-real-tc-token");
    await expect(page.getByText(/not found|invalid|expired/i)).toBeVisible({ timeout: 10_000 });
  });
});

// ── Full private path via browser (maker registration) ───────────────────────

test.describe("Private path — Maker registration via browser", () => {
  test("registerMaker with private path reaches /contract/sign", async ({ page }) => {
    const id = uid();
    const data: RegistrationData = {
      first_name: "BrowserPriv", last_name: "Maker",
      maker_email: `e2e-bpm-${id}@example.com`,
      keeper_name: "BrowserPriv Keeper",
      keeper_email: `e2e-bpk-${id}@example.com`,
      relationship: "Friend",
      path: "private",
      tc_name: TC_NAME,
      tc_email: `e2e-bptc-${id}@example.com`,
    };
    await registerMaker(page, data);
    await expect(page.locator("#sig")).toBeVisible({ timeout: 8_000 });
  });

  test("after maker signs (private path), TC invite token is available", async ({ page }) => {
    const id = uid();
    const tcEmail = `e2e-tctok-${id}@example.com`;
    const data: RegistrationData = {
      first_name: "TokPriv", last_name: "Maker",
      maker_email: `e2e-tokm-${id}@example.com`,
      keeper_name: "TokPriv Keeper",
      keeper_email: `e2e-tokk-${id}@example.com`,
      relationship: "Parent",
      path: "private",
      tc_name: TC_NAME,
      tc_email: tcEmail,
    };
    await registerMaker(page, data);
    await page.locator("#sig").fill("TokPriv Maker");
    await page.getByRole("button", { name: /sign/i }).click();
    await page.waitForURL(/\/contracts/, { timeout: 15_000 });

    const tcToken = await getInviteToken(tcEmail);
    expect(tcToken).toBeTruthy();

    // Navigate to TC invite and verify it's a TC page
    await page.goto(`/invite/${tcToken}`);
    await expect(page.getByText(/transfer contact/i).first()).toBeVisible({ timeout: 10_000 });
  });
});
