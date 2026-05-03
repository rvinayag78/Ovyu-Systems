/**
 * High-level auth helpers for Playwright tests.
 * Each function drives the real browser UI — no direct API calls from the test.
 */
import { Page } from "@playwright/test";
import { getEmailVerifyToken, getMagicToken, type RegistrationData } from "./tokens";

/**
 * Complete the full Maker registration flow in the browser:
 *   1. Get the email-verify token via test endpoint (no email sent)
 *   2. Navigate to /verify?token=... (auto-redirects to /register)
 *   3. Click "Review my contract →" → /plan
 *   4. Click "Start free" → /contract/sign
 *
 * After this function returns, the page is at /contract/sign ready for signing.
 * sessionStorage has ovyu_session, ovyu_maker_name, ovyu_contract_id.
 */
export async function registerMaker(page: Page, data: RegistrationData): Promise<void> {
  const token = await getEmailVerifyToken(data);
  await page.goto(`/verify?token=${token}`);
  // /verify redirects to /register
  await page.waitForURL("**/register", { timeout: 15_000 });
  await page.getByRole("button", { name: /review my contract/i }).click();
  // /register → completeRegistration → /plan
  await page.waitForURL("**/plan", { timeout: 15_000 });
  await page.getByRole("button", { name: /start free/i }).click();
  // /plan → /contract/sign
  await page.waitForURL("**/contract/sign**", { timeout: 15_000 });
}

/**
 * Log in as an existing user via magic link (no email sent).
 * After this function returns, the page is at whatever the magic-link verify
 * redirect target is (e.g. /contracts, /contract/sign).
 */
export async function loginAsMaker(page: Page, email: string): Promise<void> {
  const token = await getMagicToken(email, "login");
  await page.goto(`/magic-link/verify?token=${token}`);
  await page.waitForURL(/\/(contracts|contract\/sign|plan)/, { timeout: 15_000 });
}
