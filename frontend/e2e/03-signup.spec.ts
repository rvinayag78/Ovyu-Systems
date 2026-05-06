/**
 * Signup form tests (/signup).
 *
 * Covers:
 * - Home page → Begin button → signup
 * - Aware path: form fill + submit → email-sent screen
 * - Private path: TC section appears, required fields enforced
 * - Relationship dropdown options
 * - Submit disabled without all required fields
 */
import { test, expect } from "@playwright/test";
import * as crypto from "crypto";

test.describe("Home page → Signup", () => {
  test("Begin button on home page goes to /signup", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: /begin/i }).click();
    await expect(page).toHaveURL(/\/signup/);
  });

  test("home page shows 'A bit of you' heading", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText(/a bit of you/i)).toBeVisible({ timeout: 8_000 });
  });
});

test.describe("Signup form — aware path", () => {
  test("submits and shows 'Check your inbox' with the entered email", async ({ page }) => {
    const uid = crypto.randomBytes(4).toString("hex");
    const makerEmail = `e2e-signup-${uid}@example.com`;

    await page.goto("/signup");
    await page.getByPlaceholder("First name").fill("E2E");
    await page.getByPlaceholder("Last name").fill("Maker");
    await page.getByPlaceholder("you@example.com").fill(makerEmail);
    await page.getByPlaceholder("First, middle, and last name").fill("E2E Keeper");
    await page.getByPlaceholder("email@example.com").fill(`keeper-${uid}@example.com`);
    await page.locator("select").selectOption("Partner / spouse");

    await page.getByRole("button", { name: /continue/i }).click();

    await expect(page.getByText(/check your inbox/i)).toBeVisible({ timeout: 10_000 });
    await expect(page.getByText(makerEmail)).toBeVisible();
  });

  test("Continue is disabled when required fields are empty", async ({ page }) => {
    await page.goto("/signup");
    await expect(page.getByRole("button", { name: /continue/i })).toBeDisabled();
  });

  test("Continue requires all fields to be filled", async ({ page }) => {
    const uid = crypto.randomBytes(4).toString("hex");
    await page.goto("/signup");
    // Fill only maker fields, leave keeper blank
    await page.getByPlaceholder("First name").fill("E2E");
    await page.getByPlaceholder("Last name").fill("Maker");
    await page.getByPlaceholder("you@example.com").fill(`e2e-signup-${uid}@example.com`);
    // Keeper fields empty — button should stay disabled
    await expect(page.getByRole("button", { name: /continue/i })).toBeDisabled();
  });
});

test.describe("Signup form — private path", () => {
  test("selecting private path shows TC section", async ({ page }) => {
    await page.goto("/signup");
    await page.getByText(/no, this is something i'm doing privately/i).click();
    await expect(page.getByText(/transfer contact/i)).toBeVisible({ timeout: 5_000 });
    await expect(page.getByPlaceholder("you@example.com").last()).toBeVisible();
  });

  test("private path requires TC fields — disabled without them", async ({ page }) => {
    const uid = crypto.randomBytes(4).toString("hex");
    await page.goto("/signup");
    await page.getByText(/no, this is something i'm doing privately/i).click();

    await page.getByPlaceholder("First name").fill("E2E");
    await page.getByPlaceholder("Last name").fill("Maker");
    await page.getByPlaceholder("you@example.com").first().fill(`e2e-signup-priv-${uid}@example.com`);
    await page.getByPlaceholder("First, middle, and last name").fill("E2E Keeper");
    await page.getByPlaceholder("email@example.com").fill(`keeper-priv-${uid}@example.com`);
    await page.locator("select").selectOption("Child");
    // TC fields still empty
    await expect(page.getByRole("button", { name: /continue/i })).toBeDisabled();
  });

  test("private path submits when all fields including TC are filled", async ({ page }) => {
    const uid = crypto.randomBytes(4).toString("hex");
    const makerEmail = `e2e-priv-${uid}@example.com`;

    await page.goto("/signup");
    await page.getByText(/no, this is something i'm doing privately/i).click();

    await page.getByPlaceholder("First name").fill("E2E");
    await page.getByPlaceholder("Last name").fill("Maker");
    await page.getByPlaceholder("you@example.com").first().fill(makerEmail);
    await page.getByPlaceholder("First, middle, and last name").fill("E2E Keeper");
    await page.getByPlaceholder("email@example.com").fill(`keeper-priv-${uid}@example.com`);
    await page.locator("select").selectOption("Sibling");

    // TC fields
    await page.getByPlaceholder("Full name").fill("E2E TC Person");
    await page.getByPlaceholder("you@example.com").last().fill(`tc-${uid}@example.com`);

    await page.getByRole("button", { name: /continue/i }).click();
    await expect(page.getByText(/check your inbox/i)).toBeVisible({ timeout: 10_000 });
    await expect(page.getByText(makerEmail)).toBeVisible();
  });
});
