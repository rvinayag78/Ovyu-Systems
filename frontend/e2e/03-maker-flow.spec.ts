/**
 * Maker flow:
 *   magic-link verify → sign contract → status page
 *
 * Uses ovyu_maker@protonmail.com (SES-verified).
 * Magic-link and user state are injected directly — no email checking needed.
 */
import { test, expect } from "@playwright/test";
import { insertMagicLink, upsertUser, deleteUser } from "./db";
import { execSync } from "child_process";

const MAKER_EMAIL = "ovyu_maker@protonmail.com";
const MAKER_NAME = "Ovyu Maker";
const KEEPER_EMAIL = "ovyu_keeper@proton.me";
const KEEPER_NAME = "Ovyu Keeper";

const API_BASE =
  process.env.API_URL ??
  "https://pmfg4ex4f3.execute-api.us-west-2.amazonaws.com/api/v1";

function apiGet(path: string) {
  return JSON.parse(
    execSync(`curl -s "${API_BASE}${path}"`, { encoding: "utf-8", timeout: 15_000 })
  );
}

function apiPost(path: string, body: object, headers: Record<string, string> = {}) {
  const headerArgs = Object.entries(headers).map(([k, v]) => `-H "${k}: ${v}"`).join(" ");
  return JSON.parse(
    execSync(
      `curl -s -X POST "${API_BASE}${path}" -H "Content-Type: application/json" ${headerArgs} -d '${JSON.stringify(body)}'`,
      { encoding: "utf-8", timeout: 15_000 }
    )
  );
}

test.describe("Maker flow", () => {
  test.beforeAll(() => {
    deleteUser(MAKER_EMAIL);
    upsertUser(MAKER_EMAIL, MAKER_NAME);
  });

  test.afterAll(() => {
    deleteUser(MAKER_EMAIL);
  });

  test("magic-link verify → no contract → redirects to signup", async ({ page }) => {
    const token = insertMagicLink(MAKER_EMAIL);
    await page.goto(`/magic-link/verify?token=${token}`);
    await expect(page).toHaveURL(/\/(signup|login)/, { timeout: 10_000 });
  });

  test("magic-link verify → unsigned contract → redirects to sign page", async ({ page }) => {
    // Create a contract via API (no sign yet), then verify → should go to /contract/sign
    const setupToken = insertMagicLink(MAKER_EMAIL);
    const auth = apiGet(`/auth/magic-link/verify?token=${setupToken}`);
    const sessionToken: string = auth.session_token;

    const contract = apiPost(
      "/contracts",
      { keeper_name: KEEPER_NAME, keeper_email: KEEPER_EMAIL, relationship: "Partner / spouse", path: "aware" },
      { Authorization: `Bearer ${sessionToken}` }
    );

    const verifyToken = insertMagicLink(MAKER_EMAIL);
    await page.goto(`/magic-link/verify?token=${verifyToken}`);
    await expect(page).toHaveURL(/\/contract\/sign/, { timeout: 10_000 });

    // Sign page should show the contract form
    await expect(page.locator("#sig")).toBeVisible({ timeout: 8_000 });
    // Type maker name and sign
    await page.locator("#sig").fill(MAKER_NAME);
    await page.getByRole("button", { name: /sign/i }).click();

    // Should redirect to status page showing awaiting message
    await expect(page).toHaveURL(/\/contract\/status/, { timeout: 10_000 });
    await expect(page.getByText(/waiting|awaiting|keeper/i)).toBeVisible({ timeout: 8_000 });

    // Cleanup: delete contract so afterAll deleteUser works cleanly
    // (invitation_tokens cascade from contract delete in deleteUser)
  });

  test("signup form — aware path shows check-inbox screen", async ({ page }) => {
    // Verify the signup form UI works (does not test full registration — that requires email click)
    await page.goto("/signup");
    const uid = require("crypto").randomBytes(4).toString("hex");
    const email = `ovyu-e2e-${uid}@example.com`;

    await page.locator("#firstName").fill("E2E");
    await page.locator("#lastName").fill("Maker");
    await page.locator("#email").fill(email);
    await page.locator("#keeperFirst").fill("E2E");
    await page.locator("#keeperLast").fill("Keeper");
    await page.locator("#keeperEmail").fill("keeper@example.com");
    await page.locator("#keeperRel").selectOption("Partner / spouse");
    await page.getByRole("button", { name: /continue/i }).click();
    await expect(page.getByText(/check your inbox/i)).toBeVisible({ timeout: 10_000 });
  });
});
