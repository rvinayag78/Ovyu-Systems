/**
 * Login page + Activate Transfer page tests.
 *
 * Covers:
 * - Login page renders correctly
 * - Submitting email shows "Check your inbox"
 * - Empty email does not submit
 * - Activate Transfer page renders correctly
 * - Submitting TC email shows confirmation
 * - Account page: shows email, logout works
 * - /logged-out page: shows logout message + log back in link
 */
import { test, expect } from "@playwright/test";
import * as crypto from "crypto";

// ── /login ─────────────────────────────────────────────────────────────────────

test.describe("Login page (/login)", () => {
  test("shows 'Welcome back' heading and email input", async ({ page }) => {
    await page.goto("/login");
    await expect(page.getByText(/welcome back/i)).toBeVisible({ timeout: 8_000 });
    await expect(page.getByRole("textbox")).toBeVisible();
  });

  test("submit with email → shows Check your inbox", async ({ page }) => {
    const uid = crypto.randomBytes(4).toString("hex");
    await page.goto("/login");
    await page.getByRole("textbox").fill(`e2e-login-${uid}@example.com`);
    await page.getByRole("button", { name: /send/i }).click();
    await expect(page.getByText(/check your inbox/i)).toBeVisible({ timeout: 10_000 });
  });

  test("submit with empty email does not navigate away", async ({ page }) => {
    await page.goto("/login");
    await page.getByRole("button", { name: /send/i }).click();
    // Still on login page
    await expect(page).toHaveURL(/\/login/);
  });
});

// ── /activate-transfer ─────────────────────────────────────────────────────────

test.describe("Activate Transfer page (/activate-transfer)", () => {
  test("shows 'Activate Transfer' heading and email input", async ({ page }) => {
    await page.goto("/activate-transfer");
    await expect(page.getByText(/activate transfer/i)).toBeVisible({ timeout: 8_000 });
    await expect(page.getByRole("textbox")).toBeVisible();
  });

  test("submit with email → shows Check your inbox", async ({ page }) => {
    const uid = crypto.randomBytes(4).toString("hex");
    await page.goto("/activate-transfer");
    await page.getByRole("textbox").fill(`e2e-tc-${uid}@example.com`);
    await page.getByRole("button", { name: /send/i }).click();
    await expect(page.getByText(/check your inbox/i)).toBeVisible({ timeout: 10_000 });
  });

  test("submit with empty email does not navigate away", async ({ page }) => {
    await page.goto("/activate-transfer");
    await page.getByRole("button", { name: /send/i }).click();
    await expect(page).toHaveURL(/\/activate-transfer/);
  });
});

// ── /logged-out ────────────────────────────────────────────────────────────────

test.describe("Logged-out page (/logged-out)", () => {
  test("shows logout confirmation and Log back in button", async ({ page }) => {
    await page.goto("/logged-out");
    await expect(page.getByText(/you're logged out/i)).toBeVisible({ timeout: 8_000 });
    await expect(page.getByRole("link", { name: /log back in/i })).toBeVisible();
  });

  test("Log back in goes to /login", async ({ page }) => {
    await page.goto("/logged-out");
    await page.getByRole("link", { name: /log back in/i }).click();
    await expect(page).toHaveURL(/\/login/);
  });
});

// ── /contact ─────────────────────────────────────────────────────────────────

test.describe("Contact page (/contact)", () => {
  test("shows Contact heading and email address", async ({ page }) => {
    await page.goto("/contact");
    await expect(page.getByText(/contact\./i)).toBeVisible({ timeout: 8_000 });
    await expect(page.getByRole("link", { name: /contactovyu@gmail\.com/i })).toBeVisible();
  });
});
