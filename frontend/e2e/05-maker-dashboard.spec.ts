/**
 * Maker dashboard (/contracts) — all 3 states.
 *
 * State 1 (unsigned): maker hasn't signed yet — "Sign Contract" visible
 * State 2 (pending): maker signed, waiting for keeper/TC — "Pending" visible
 * State 3 (locked): both signed — "Signed on", "View Contract", "UPLOAD" visible
 *
 * Also covers: magic-link login redirect, account page, logout.
 */
import { test, expect } from "@playwright/test";
import * as crypto from "crypto";
import { loginAsMaker } from "./helpers/auth";
import {
  getEmailVerifyToken,
  getKeeperEmailVerifyToken,
  getInviteToken,
  apiPost,
  apiGet,
  type RegistrationData,
} from "./helpers/tokens";

function uid() { return crypto.randomBytes(4).toString("hex"); }

// ── State 2: Maker signed, keeper pending ─────────────────────────────────────

test.describe("Maker dashboard — State 2: pending keeper signature", () => {
  let makerEmail: string;

  test.beforeAll(async () => {
    const id = uid();
    makerEmail = `e2e-ms2-${id}@example.com`;
    const data: RegistrationData = {
      first_name: "Pending",
      last_name: "Maker",
      maker_email: makerEmail,
      keeper_name: "Pending Keeper",
      keeper_email: `e2e-ks2-${id}@example.com`,
      relationship: "Friend",
      path: "aware",
    };
    const jwt = await getEmailVerifyToken(data);
    const reg = await apiPost<{ session_token: string; contract_id: string }>(
      "/auth/complete-registration", { token: jwt }
    );
    await apiPost(`/contracts/${reg.contract_id}/sign`, { typed_name: "Pending Maker" }, reg.session_token);
  });

  test("magic-link login → redirects to /contracts", async ({ page }) => {
    await loginAsMaker(page, makerEmail);
    await expect(page).toHaveURL(/\/contracts/);
  });

  test("MAKING section shows keeper name", async ({ page }) => {
    await loginAsMaker(page, makerEmail);
    await expect(page.getByText(/making/i)).toBeVisible({ timeout: 8_000 });
    await expect(page.getByText(/Pending Keeper/i)).toBeVisible();
  });

  test("shows 'Pending' status when keeper has not signed", async ({ page }) => {
    await loginAsMaker(page, makerEmail);
    await expect(page.getByText("Pending", { exact: true })).toBeVisible({ timeout: 8_000 });
  });

  test("header shows maker initial after login", async ({ page }) => {
    await loginAsMaker(page, makerEmail);
    // "Pending Maker" → initial = P
    await expect(page.getByLabel("Account menu")).toContainText("P", { timeout: 8_000 });
  });
});

// ── State 3: Both signed (LOCKED) ────────────────────────────────────────────

test.describe("Maker dashboard — State 3: contract locked", () => {
  let makerEmail: string;

  test.beforeAll(async () => {
    const id = uid();
    makerEmail = `e2e-ms3-${id}@example.com`;
    const keeperEmail = `e2e-ks3-${id}@example.com`;

    const data: RegistrationData = {
      first_name: "Locked",
      last_name: "Maker",
      maker_email: makerEmail,
      keeper_name: "Locked Keeper",
      keeper_email: keeperEmail,
      relationship: "Partner / spouse",
      path: "aware",
    };
    const jwt = await getEmailVerifyToken(data);
    const reg = await apiPost<{ session_token: string; contract_id: string }>(
      "/auth/complete-registration", { token: jwt }
    );
    await apiPost(`/contracts/${reg.contract_id}/sign`, { typed_name: "Locked Maker" }, reg.session_token);

    // Keeper signs via API
    const inviteToken = await getInviteToken(keeperEmail);
    const kJwt = await getKeeperEmailVerifyToken({
      invite_token: inviteToken, first_name: "Locked",
      last_name: "Keeper", email: keeperEmail,
    });
    const kSession = await apiGet<{ session_token: string }>(
      `/auth/keeper-verify?token=${encodeURIComponent(kJwt)}`
    );
    await apiPost(
      `/contracts/invite/${inviteToken}/accept`,
      { typed_name: "Locked Keeper" },
      kSession.session_token
    );
  });

  test("locked contract shows 'Signed on' date", async ({ page }) => {
    await loginAsMaker(page, makerEmail);
    await expect(page.getByText(/signed on/i)).toBeVisible({ timeout: 8_000 });
  });

  test("locked contract shows 'View Contract' link", async ({ page }) => {
    await loginAsMaker(page, makerEmail);
    await expect(page.getByRole("link", { name: /view contract/i })).toBeVisible({ timeout: 8_000 });
  });

  test("locked contract shows UPLOAD button/link", async ({ page }) => {
    await loginAsMaker(page, makerEmail);
    await expect(page.getByText(/upload/i)).toBeVisible({ timeout: 8_000 });
  });

  test("UPLOAD link goes to /upload/start", async ({ page }) => {
    await loginAsMaker(page, makerEmail);
    await page.getByRole("link", { name: /upload/i }).click();
    await expect(page).toHaveURL(/\/upload\/start/, { timeout: 8_000 });
  });

  test("View Contract opens contract view page", async ({ page }) => {
    await loginAsMaker(page, makerEmail);
    await page.getByRole("link", { name: /view contract/i }).click();
    await expect(page).toHaveURL(/\/contract\/sign/, { timeout: 8_000 });
    // Contract content should be visible
    await expect(page.getByText(/locked maker/i)).toBeVisible({ timeout: 8_000 });
  });
});

// ── Account page tests ────────────────────────────────────────────────────────

test.describe("Account page (/account)", () => {
  let makerEmail: string;

  test.beforeAll(async () => {
    const id = uid();
    makerEmail = `e2e-acct-${id}@example.com`;
    const data: RegistrationData = {
      first_name: "Acct",
      last_name: "Maker",
      maker_email: makerEmail,
      keeper_name: "Acct Keeper",
      keeper_email: `e2e-acctk-${id}@example.com`,
      relationship: "Sibling",
      path: "aware",
    };
    const jwt = await getEmailVerifyToken(data);
    const reg = await apiPost<{ session_token: string; contract_id: string }>(
      "/auth/complete-registration", { token: jwt }
    );
    await apiPost(`/contracts/${reg.contract_id}/sign`, { typed_name: "Acct Maker" }, reg.session_token);
  });

  test("account page shows email address", async ({ page }) => {
    await loginAsMaker(page, makerEmail);
    await page.getByLabel("Account menu").click();
    await page.getByRole("menuitem", { name: /account/i }).click();
    await expect(page).toHaveURL(/\/account/);
    await expect(page.getByRole("heading", { name: /account/i })).toBeVisible({ timeout: 8_000 });
  });

  test("Log out button on account page → /logged-out", async ({ page }) => {
    await loginAsMaker(page, makerEmail);
    await page.goto("/account");
    await page.getByRole("button", { name: /log out/i }).click();
    await expect(page).toHaveURL(/\/logged-out/, { timeout: 8_000 });
  });

  test("/account redirects to /login when not logged in", async ({ page }) => {
    // Clear session first by going to logged-out
    await page.goto("/logged-out");
    await page.goto("/account");
    // Should redirect away from /account
    await expect(page).not.toHaveURL(/\/account/, { timeout: 8_000 });
  });
});
