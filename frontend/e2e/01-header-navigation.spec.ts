/**
 * Header navigation + dropdown tests.
 *
 * Covers:
 * - OVYU wordmark → home page (logged out and logged in)
 * - Activate Transfer link → /activate-transfer
 * - Log In button → /login
 * - Logged-in avatar click → dropdown with Account / Contact / Log Out
 * - Each dropdown item navigates correctly
 * - Log Out clears session and shows /logged-out
 * - Clicking outside dropdown closes it
 */
import { test, expect } from "@playwright/test";
import { getMagicToken } from "./helpers/tokens";
import {
  getEmailVerifyToken,
  apiPost,
  type RegistrationData,
} from "./helpers/tokens";
import * as crypto from "crypto";

// ── Helper: log in a maker via magic link and land on /contracts ──────────────
async function loginMaker(page: import("@playwright/test").Page): Promise<void> {
  const id = crypto.randomBytes(4).toString("hex");
  const makerEmail = `e2e-header-${id}@example.com`;

  const data: RegistrationData = {
    first_name: "Header",
    last_name: "Maker",
    maker_email: makerEmail,
    keeper_name: "Header Keeper",
    keeper_email: `e2e-header-k-${id}@example.com`,
    relationship: "Partner / spouse",
    path: "aware",
  };
  const verifyJwt = await getEmailVerifyToken(data);
  const reg = await apiPost<{ session_token: string; contract_id: string }>(
    "/auth/complete-registration", { token: verifyJwt }
  );
  await apiPost(`/contracts/${reg.contract_id}/sign`, { typed_name: "Header Maker" }, reg.session_token);

  const magicToken = await getMagicToken(makerEmail, "login");
  await page.goto(`/magic-link/verify?token=${magicToken}`);
  await page.waitForURL(/\/contracts/, { timeout: 15_000 });
}

// ── Logged-out header ─────────────────────────────────────────────────────────

test.describe("Header — logged out", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("OVYU wordmark links to home page", async ({ page }) => {
    // Navigate away first
    await page.goto("/login");
    await page.getByRole("link", { name: "ovyu home" }).click();
    // Home page URL ends with "/" (root)
    await expect(page).toHaveURL(/\/$/, { timeout: 8_000 });
    await expect(page.getByRole("heading", { name: /a bit/i })).toBeVisible({ timeout: 8_000 });
  });

  test("Activate Transfer link goes to /activate-transfer", async ({ page }) => {
    await page.getByRole("link", { name: /activate transfer/i }).click();
    await expect(page).toHaveURL(/\/activate-transfer/);
    // Use heading role to avoid matching the header nav link (strict mode)
    await expect(page.getByRole("heading", { name: /activate transfer/i })).toBeVisible({ timeout: 8_000 });
  });

  test("Log In button goes to /login", async ({ page }) => {
    await page.getByRole("link", { name: /log in/i }).click();
    await expect(page).toHaveURL(/\/login/);
    await expect(page.getByText(/welcome back/i)).toBeVisible({ timeout: 8_000 });
  });

  test("no avatar/dropdown visible when logged out", async ({ page }) => {
    await expect(page.getByLabel("Account menu")).not.toBeVisible();
  });
});

// ── Logged-in header ──────────────────────────────────────────────────────────

test.describe("Header — logged in (avatar + dropdown)", () => {
  test("OVYU wordmark links to home page", async ({ page }) => {
    await loginMaker(page);
    // Navigate away from home
    await expect(page).toHaveURL(/\/contracts/);
    await page.getByRole("link", { name: "ovyu home" }).click();
    // Home page URL ends with "/" (root)
    await expect(page).toHaveURL(/\/$/, { timeout: 8_000 });
    await expect(page.getByRole("heading", { name: /a bit/i })).toBeVisible({ timeout: 8_000 });
  });

  test("Activate Transfer still works when logged in", async ({ page }) => {
    await loginMaker(page);
    await page.getByRole("link", { name: /activate transfer/i }).click();
    await expect(page).toHaveURL(/\/activate-transfer/);
  });

  test("avatar button is visible and shows the user initial", async ({ page }) => {
    await loginMaker(page);
    const avatar = page.getByLabel("Account menu");
    await expect(avatar).toBeVisible({ timeout: 8_000 });
    await expect(avatar).toContainText("H"); // "Header" Maker → initial H
  });

  test("clicking avatar opens dropdown with Account, Contact, Log Out", async ({ page }) => {
    await loginMaker(page);
    await page.getByLabel("Account menu").click();
    await expect(page.getByRole("menu")).toBeVisible({ timeout: 5_000 });
    await expect(page.getByRole("menuitem", { name: /account/i })).toBeVisible();
    await expect(page.getByRole("menuitem", { name: /contact/i })).toBeVisible();
    await expect(page.getByRole("menuitem", { name: /log out/i })).toBeVisible();
  });

  test("clicking outside dropdown closes it", async ({ page }) => {
    await loginMaker(page);
    await page.getByLabel("Account menu").click();
    await expect(page.getByRole("menu")).toBeVisible();
    // Click somewhere else on the page
    await page.locator("body").click({ position: { x: 100, y: 400 } });
    await expect(page.getByRole("menu")).not.toBeVisible({ timeout: 3_000 });
  });

  test("dropdown Account item → /account page", async ({ page }) => {
    await loginMaker(page);
    await page.getByLabel("Account menu").click();
    await page.getByRole("menuitem", { name: /^account$/i }).click();
    await expect(page).toHaveURL(/\/account/);
    // Use heading role to avoid strict mode violation with other "account" text
    await expect(page.getByRole("heading", { name: /account/i })).toBeVisible({ timeout: 8_000 });
  });

  test("dropdown Contact item → /contact page", async ({ page }) => {
    await loginMaker(page);
    await page.getByLabel("Account menu").click();
    await page.getByRole("menuitem", { name: /^contact$/i }).click();
    await expect(page).toHaveURL(/\/contact/);
    await expect(page.getByText(/contact\./i)).toBeVisible({ timeout: 8_000 });
  });

  test("dropdown Log Out → /logged-out and session cleared", async ({ page }) => {
    await loginMaker(page);
    await page.getByLabel("Account menu").click();
    await page.getByRole("menuitem", { name: /log out/i }).click();
    await expect(page).toHaveURL(/\/logged-out/, { timeout: 8_000 });
    await expect(page.getByText(/you're logged out/i)).toBeVisible({ timeout: 8_000 });
    // Verify session is cleared — home page (always loggedOut) shows Log In button
    await page.goto("/");
    await expect(page.getByRole("link", { name: /log in/i })).toBeVisible({ timeout: 5_000 });
  });
});
