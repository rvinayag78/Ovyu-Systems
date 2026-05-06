import { defineConfig, devices } from "@playwright/test";

// Default API_URL to the deployed Lambda so tests run without extra env setup
process.env.API_URL ??= "https://pmfg4ex4f3.execute-api.us-west-2.amazonaws.com/api/v1";

export default defineConfig({
  globalSetup: "./e2e/global-setup.ts",
  testDir: "./e2e",
  timeout: 30_000,
  retries: 1,
  workers: 1,
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    baseURL: process.env.BASE_URL ?? "https://main.d21q10npjg05eb.amplifyapp.com",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    headless: true,
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
});
