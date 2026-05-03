/**
 * Keeper invitation acceptance flow.
 * Setup (beforeAll): creates a signed contract via API without a browser.
 * Tests drive keeper acceptance through the browser.
 * Uses /test/email-verify-token + /auth/complete-registration + /contracts/:id/sign.
 */
import { test, expect } from "@playwright/test";
import * as crypto from "crypto";
import { getEmailVerifyToken, getInviteToken } from "./helpers/tokens";
import type { RegistrationData } from "./helpers/tokens";

const API = process.env.API_URL ?? "http://localhost:8000/api/v1";

async function apiPost<T>(
  path: string,
  body: object,
  headers: Record<string, string> = {}
): Promise<T> {
  const res = await fetch(`${API}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...headers },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`POST ${path} → ${res.status}: ${await res.text()}`);
  return res.json() as Promise<T>;
}

const MAKER_NAME = "E2E Maker";
const KEEPER_NAME = "E2E Keeper";
let inviteToken: string;
let keeperEmail: string;

test.describe("Keeper invitation flow", () => {
  test.beforeAll(async () => {
    const id = crypto.randomBytes(4).toString("hex");
    keeperEmail = `e2e-keeper-${id}@example.com`;
    const makerEmail = `e2e-maker-${id}@example.com`;

    const data: RegistrationData = {
      first_name: "E2E",
      last_name: "Maker",
      maker_email: makerEmail,
      keeper_name: KEEPER_NAME,
      keeper_email: keeperEmail,
      relationship: "Partner / spouse",
      path: "aware",
    };

    // Get email-verify JWT without sending an email
    const verifyJwt = await getEmailVerifyToken(data);

    // Complete registration → creates user + contract + invitation token
    const reg = await apiPost<{ session_token: string; contract_id: string; full_name: string }>(
      "/auth/complete-registration",
      { token: verifyJwt }
    );

    // Maker signs the contract
    await apiPost(`/contracts/${reg.contract_id}/sign`, { typed_name: MAKER_NAME }, {
      Authorization: `Bearer ${reg.session_token}`,
    });

    // Retrieve the keeper's invitation token from the test endpoint
    inviteToken = await getInviteToken(keeperEmail);
  });

  test("invitation page shows maker and keeper names", async ({ page }) => {
    await page.goto(`/invite/${inviteToken}`);
    await expect(page.getByText(new RegExp(MAKER_NAME, "i"))).toBeVisible({ timeout: 10_000 });
    await expect(page.getByText(new RegExp(KEEPER_NAME, "i"))).toBeVisible({ timeout: 10_000 });
  });

  test("accept with correct name → You've signed confirmation", async ({ page }) => {
    await page.goto(`/invite/${inviteToken}`);
    const nameInput = page
      .getByPlaceholder(/type your full name/i)
      .or(page.getByLabel(/full name/i));
    await nameInput.fill(KEEPER_NAME);
    await page.getByRole("button", { name: /accept and sign/i }).click();
    await expect(page.getByRole("heading", { name: /you've signed/i })).toBeVisible({
      timeout: 10_000,
    });
  });

  test("invalid invitation token → error message", async ({ page }) => {
    await page.goto("/invite/not-a-real-token-xyz");
    await expect(page.getByText(/not found|invalid|expired/i)).toBeVisible({ timeout: 10_000 });
  });
});
