/**
 * Maker magic-link login + contracts dashboard.
 *
 * Tests the /contracts page from the Maker's perspective across the 3 states:
 *   State 1: Maker has not yet signed (PENDING_KEEPER but maker_signed_at is null)
 *   State 2: Maker signed, waiting for Keeper/TC (PENDING_KEEPER / PENDING_TC)
 *   State 3: Both parties signed (LOCKED) — shows "Signed on" + UPLOAD button
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
import { loginAsMaker } from "./helpers/auth";

// ── State 2: Maker signed, keeper pending ─────────────────────────────────────

test.describe("Maker dashboard — awaiting keeper signature (State 2)", () => {
  let makerEmail: string;

  test.beforeAll(async () => {
    const id = crypto.randomBytes(4).toString("hex");
    makerEmail = `e2e-maker-state2-${id}@example.com`;

    const regData: RegistrationData = {
      first_name: "State2",
      last_name: "Maker",
      maker_email: makerEmail,
      keeper_name: "State2 Keeper",
      keeper_email: `e2e-keeper-state2-${id}@example.com`,
      relationship: "Partner / spouse",
      path: "aware",
    };
    const verifyJwt = await getEmailVerifyToken(regData);
    const reg = await apiPost<{ session_token: string; contract_id: string }>(
      "/auth/complete-registration", { token: verifyJwt }
    );
    // Maker signs — contract is now PENDING_KEEPER
    await apiPost(
      `/contracts/${reg.contract_id}/sign`,
      { typed_name: "State2 Maker" },
      reg.session_token
    );
  });

  test("magic-link login → /contracts dashboard", async ({ page }) => {
    await loginAsMaker(page, makerEmail);
    await expect(page).toHaveURL(/\/contracts/);
  });

  test("dashboard shows MAKING section with keeper name", async ({ page }) => {
    await loginAsMaker(page, makerEmail);
    await expect(page.getByText(/making/i)).toBeVisible({ timeout: 8_000 });
    await expect(page.getByText(/State2 Keeper/i)).toBeVisible();
  });

  test("dashboard shows 'Pending' status when keeper has not signed", async ({ page }) => {
    await loginAsMaker(page, makerEmail);
    await expect(page.getByText(/pending/i)).toBeVisible({ timeout: 8_000 });
  });
});

// ── State 3: Both signed (LOCKED) ────────────────────────────────────────────

test.describe("Maker dashboard — contract locked (State 3)", () => {
  let makerEmail: string;
  let keeperEmail: string;

  test.beforeAll(async () => {
    const id = crypto.randomBytes(4).toString("hex");
    makerEmail = `e2e-maker-locked-${id}@example.com`;
    keeperEmail = `e2e-keeper-locked-${id}@example.com`;

    const regData: RegistrationData = {
      first_name: "Locked",
      last_name: "Maker",
      maker_email: makerEmail,
      keeper_name: "Locked Keeper",
      keeper_email: keeperEmail,
      relationship: "Child",
      path: "aware",
    };
    const makerVerifyJwt = await getEmailVerifyToken(regData);
    const reg = await apiPost<{ session_token: string; contract_id: string }>(
      "/auth/complete-registration", { token: makerVerifyJwt }
    );
    await apiPost(
      `/contracts/${reg.contract_id}/sign`,
      { typed_name: "Locked Maker" },
      reg.session_token
    );

    // Keeper signs via API
    const inviteToken = await getInviteToken(keeperEmail);
    const keeperVerifyJwt = await getKeeperEmailVerifyToken({
      invite_token: inviteToken,
      first_name: "Locked",
      last_name: "Keeper",
      email: keeperEmail,
    });
    const keeperSession = await apiGet<{ session_token: string }>(
      `/auth/keeper-verify?token=${encodeURIComponent(keeperVerifyJwt)}`
    );
    await apiPost(
      `/contracts/invite/${inviteToken}/accept`,
      { typed_name: "Locked Keeper" },
      keeperSession.session_token
    );
  });

  test("locked contract shows 'Signed on' date", async ({ page }) => {
    await loginAsMaker(page, makerEmail);
    await expect(page.getByText(/signed on/i)).toBeVisible({ timeout: 8_000 });
  });

  test("locked contract shows View Contract link", async ({ page }) => {
    await loginAsMaker(page, makerEmail);
    await expect(page.getByRole("link", { name: /view contract/i })).toBeVisible({ timeout: 8_000 });
  });

  test("locked contract shows UPLOAD link/button", async ({ page }) => {
    await loginAsMaker(page, makerEmail);
    await expect(page.getByText(/upload/i)).toBeVisible({ timeout: 8_000 });
  });
});

// ── Maker idempotency: re-registration returns existing contract ──────────────

test.describe("Maker idempotency", () => {
  test("registering twice with same email returns existing contract, not a duplicate", async ({ page }) => {
    const id = crypto.randomBytes(4).toString("hex");
    const makerEmail = `e2e-idem-${id}@example.com`;

    const regData: RegistrationData = {
      first_name: "Idem",
      last_name: "Maker",
      maker_email: makerEmail,
      keeper_name: "Idem Keeper",
      keeper_email: `e2e-idem-keeper-${id}@example.com`,
      relationship: "Sibling",
      path: "aware",
    };

    // First registration
    const jwt1 = await getEmailVerifyToken(regData);
    const reg1 = await apiPost<{ session_token: string; contract_id: string }>(
      "/auth/complete-registration", { token: jwt1 }
    );

    // Second registration with same email (same payload → same JWT secret)
    const jwt2 = await getEmailVerifyToken(regData);
    const reg2 = await apiPost<{ session_token: string; contract_id: string }>(
      "/auth/complete-registration", { token: jwt2 }
    );

    // Must return the same contract — no duplicates
    expect(reg2.contract_id).toBe(reg1.contract_id);
  });
});
