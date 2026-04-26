import { test, expect } from "@playwright/test";

test.describe("Landing page", () => {
  test("shows hero and navigation links", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/ovyu/i);
    await expect(page.locator("h1")).toContainText("A bit of you");
    await expect(page.getByRole("link", { name: /begin/i })).toBeVisible();
  });

  test("Begin link goes to signup", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: /begin/i }).click();
    await expect(page).toHaveURL(/\/signup/);
    await expect(page.locator("h1")).toContainText("get started");
  });

  test("Log In link goes to login page", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: /log in/i }).click();
    await expect(page).toHaveURL(/\/login/);
  });
});
