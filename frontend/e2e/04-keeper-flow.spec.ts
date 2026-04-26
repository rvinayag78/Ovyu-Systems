/**
 * Keeper invitation flow:
 *   navigate to /invite/[token] → preview → accept → locked confirmation
 *
 * Requires a signed contract to already exist (run after 03-maker-flow or
 * via its own setup that creates a contract via the API directly).
 */
import { test, expect } from "@playwright/test";
import { insertMagicLink, upsertUser, deleteUser, getInvitationToken } from "./db";
import { execSync } from "child_process";

const MAKER_EMAIL = "ovyu_maker@protonmail.com";
const MAKER_NAME = "Ovyu Maker";
const KEEPER_EMAIL = "ovyu_keeper@proton.me";
const KEEPER_NAME = "Ovyu Keeper";

const API_BASE =
  process.env.API_URL ??
  "https://pmfg4ex4f3.execute-api.us-west-2.amazonaws.com/api/v1";

function apiPost(path: string, body: object, headers: Record<string, string> = {}) {
  const result = execSync(
    `curl -s -X POST "${API_BASE}${path}" -H "Content-Type: application/json" ${Object.entries(headers)
      .map(([k, v]) => `-H "${k}: ${v}"`)
      .join(" ")} -d '${JSON.stringify(body)}'`,
    { encoding: "utf-8", timeout: 15_000 }
  );
  return JSON.parse(result);
}

function apiGet(path: string, headers: Record<string, string> = {}) {
  const result = execSync(
    `curl -s "${API_BASE}${path}" ${Object.entries(headers)
      .map(([k, v]) => `-H "${k}: ${v}"`)
      .join(" ")}`,
    { encoding: "utf-8", timeout: 15_000 }
  );
  return JSON.parse(result);
}

let invitationToken: string;

test.describe("Keeper invitation flow", () => {
  test.beforeAll(() => {
    // Ensure maker exists, create + sign a contract via API, get invitation token
    upsertUser(MAKER_EMAIL, MAKER_NAME);

    // Get session token for maker
    const raw = insertMagicLink(MAKER_EMAIL);
    const auth = apiGet(`/auth/magic-link/verify?token=${raw}`);
    const sessionToken: string = auth.session_token;
    const authHeaders = { Authorization: `Bearer ${sessionToken}` };

    // Create contract
    const contract = apiPost(
      "/contracts",
      {
        keeper_name: KEEPER_NAME,
        keeper_email: KEEPER_EMAIL,
        relationship: "Partner / spouse",
        path: "aware",
      },
      authHeaders
    );

    // Sign contract
    apiPost(
      `/contracts/${contract.id}/sign`,
      { typed_name: MAKER_NAME },
      authHeaders
    );

    // Get invitation token from DB
    invitationToken = getInvitationToken(contract.id);
  });

  test.afterAll(() => {
    deleteUser(MAKER_EMAIL);
  });

  test("invitation preview shows maker name and keeper name", async ({ page }) => {
    await page.goto(`/invite/${invitationToken}`);
    // h1 contains "Maker would like Ovyu to be for you"
    await expect(page.getByRole("heading", { name: new RegExp(MAKER_NAME) })).toBeVisible({ timeout: 10_000 });
    await expect(page.getByText(`${KEEPER_NAME} · Keeper`)).toBeVisible();
  });

  test("accept invitation with correct name → locked confirmation", async ({ page }) => {
    await page.goto(`/invite/${invitationToken}`);
    await expect(page.getByRole("button", { name: /accept|sign/i })).toBeVisible({ timeout: 10_000 });

    const nameInput = page.getByPlaceholder(/type your full name/i)
      .or(page.getByLabel(/type.*name|full name/i));
    await nameInput.fill(KEEPER_NAME);
    await page.getByRole("button", { name: /accept and sign/i }).click();

    await expect(page).toHaveURL(/\/invite\/.*\/done/, { timeout: 10_000 });
    await expect(page.getByText(/you've signed/i)).toBeVisible({ timeout: 10_000 });
  });

  test("invalid invitation token shows 404 message", async ({ page }) => {
    await page.goto("/invite/not-a-real-token-xyz");
    await expect(page.getByText(/not found|invalid|expired/i)).toBeVisible({ timeout: 10_000 });
  });
});
