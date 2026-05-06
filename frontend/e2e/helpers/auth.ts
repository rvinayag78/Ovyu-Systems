/**
 * High-level auth helpers for Playwright tests.
 * Each function drives the real browser UI — no direct API calls from the test.
 */
import { Page } from "@playwright/test";
import {
  getEmailVerifyToken,
  getKeeperEmailVerifyToken,
  getMagicToken,
  type RegistrationData,
} from "./tokens";

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
 * Complete the full Keeper onboarding flow in the browser:
 *   1. Navigate to /keeper/begin/{inviteToken}
 *   2. Fill account setup form (firstName, lastName, email)
 *   3. Submit → /keeper/email-sent
 *   4. Stub the verification email: get JWT from /test/keeper-email-verify-token
 *   5. Navigate to /keeper/verify?token=... → /keeper/register
 *   6. Click "Review my contract →" → /keeper/contract
 *   7. Type keeperFullName and click "Sign and continue →"
 *
 * After this function returns, the page shows "You've signed." confirmation.
 * sessionStorage has ovyu_session (keeper), ovyu_keeper_name, ovyu_contract_id,
 * ovyu_keeper_invite_token.
 */
export async function registerKeeper(
  page: Page,
  opts: {
    inviteToken: string;
    firstName: string;
    lastName: string;
    email: string;
    keeperFullName: string;
  }
): Promise<void> {
  // 1. Account setup form
  await page.goto(`/keeper/begin/${opts.inviteToken}`);
  await page.waitForURL(`**/keeper/begin/${opts.inviteToken}`, { timeout: 10_000 });
  await page.getByPlaceholder("First name").fill(opts.firstName);
  await page.getByPlaceholder("Last name").fill(opts.lastName);
  await page.getByPlaceholder("you@example.com").fill(opts.email);
  await page.getByRole("button", { name: /continue to verify email/i }).click();
  await page.waitForURL("**/keeper/email-sent", { timeout: 10_000 });

  // 2. Stub email click — get JWT directly from test endpoint
  const verifyJwt = await getKeeperEmailVerifyToken({
    invite_token: opts.inviteToken,
    first_name: opts.firstName,
    last_name: opts.lastName,
    email: opts.email,
  });

  // 3. Simulate clicking the verification link
  await page.goto(`/keeper/verify?token=${verifyJwt}`);
  await page.waitForURL("**/keeper/register", { timeout: 10_000 });

  // 4. Proceed to contract review
  await page.getByRole("button", { name: /review my contract/i }).click();
  await page.waitForURL("**/keeper/contract", { timeout: 10_000 });

  // 5. Sign with the correct full name
  await page.getByPlaceholder(/your full legal name/i).fill(opts.keeperFullName);
  await page.getByRole("button", { name: /sign and continue/i }).click();
  // Confirmation renders on the same page
  await page.waitForSelector("text=You've signed", { timeout: 10_000 });
}

/**
 * Log in as an existing Maker via magic link (no email sent).
 * After this function returns, the page is at the maker's post-login destination
 * (/contracts, /contract/sign, etc.)
 */
export async function loginAsMaker(page: Page, email: string): Promise<void> {
  const token = await getMagicToken(email, "login");
  await page.goto(`/magic-link/verify?token=${token}`);
  await page.waitForURL(/\/(contracts|contract\/sign|plan)/, { timeout: 15_000 });
}

/**
 * Log in as an existing Keeper via magic link (no email sent).
 * After this function returns, the page is at /contracts.
 */
export async function loginAsKeeper(page: Page, email: string): Promise<void> {
  const token = await getMagicToken(email, "login");
  await page.goto(`/magic-link/verify?token=${token}`);
  await page.waitForURL(/\/contracts/, { timeout: 15_000 });
}
