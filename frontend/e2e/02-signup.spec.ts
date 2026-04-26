import { test, expect } from "@playwright/test";
import * as crypto from "crypto";

test.describe("Signup form", () => {
  test("submit disabled when fields empty", async ({ page }) => {
    await page.goto("/signup");
    await expect(page.getByRole("button", { name: /continue/i })).toBeDisabled();
  });

  test("aware path — submits and shows check-inbox screen", async ({ page }) => {
    await page.goto("/signup");

    const uid = crypto.randomBytes(4).toString("hex");
    const makerEmail = `ovyu-e2e-${uid}@example.com`;

    await page.locator("#firstName").fill("E2E");
    await page.locator("#lastName").fill("Maker");
    await page.locator("#email").fill(makerEmail);
    await page.locator("#keeperFirst").fill("E2E");
    await page.locator("#keeperLast").fill("Keeper");
    await page.locator("#keeperEmail").fill("keeper@example.com");
    await page.locator("#keeperRel").selectOption("Partner / spouse");

    await page.getByRole("button", { name: /continue/i }).click();
    await expect(page.getByText(/check your inbox/i)).toBeVisible({ timeout: 10_000 });
    await expect(page.getByText(makerEmail)).toBeVisible();
  });

  test("private path — shows TC section", async ({ page }) => {
    await page.goto("/signup");
    await page.getByText(/no, this is something i'm doing privately/i).click();
    await expect(page.getByText("Transfer Contact")).toBeVisible();
    await expect(page.locator("#tcEmail")).toBeVisible();
  });

  test("private path — submit disabled without TC fields", async ({ page }) => {
    await page.goto("/signup");
    await page.getByText(/no, this is something i'm doing privately/i).click();

    const uid = crypto.randomBytes(4).toString("hex");
    await page.locator("#firstName").fill("E2E");
    await page.locator("#lastName").fill("Maker");
    await page.locator("#email").fill(`ovyu-e2e-${uid}@example.com`);
    await page.locator("#keeperFirst").fill("E2E");
    await page.locator("#keeperLast").fill("Keeper");
    await page.locator("#keeperEmail").fill("keeper@example.com");
    await page.locator("#keeperRel").selectOption("Child");

    // TC fields empty — button should still be disabled
    await expect(page.getByRole("button", { name: /continue/i })).toBeDisabled();
  });
});
