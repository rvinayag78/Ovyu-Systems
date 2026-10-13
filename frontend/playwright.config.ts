import { defineConfig, devices } from "@playwright/test";

// Defaults target the STAGING environment; override via env for other envs.
process.env.API_URL ??= "https://2ernd7cxbe.execute-api.us-west-2.amazonaws.com/api/v1";

export default defineConfig({
  globalSetup: "./e2e/global-setup.ts",
  testDir: "./e2e",
  timeout: 60_000,
  retries: 1,
  workers: 1,
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    baseURL: process.env.BASE_URL ?? "https://staging.d21q10npjg05eb.amplifyapp.com",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    headless: true,
    // The Flow 2 UI is a fixed 1920px design — a smaller viewport forces
    // horizontal scrolling for every click.
    viewport: { width: 1920, height: 1080 },
  },
  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 1920, height: 1080 },
        // Fake mic so getUserMedia + MediaRecorder work headlessly and
        // produce real audio data (Flow 2 voice recording tests).
        launchOptions: {
          args: [
            "--use-fake-ui-for-media-stream",
            "--use-fake-device-for-media-stream",
          ],
        },
      },
    },
  ],
});
