/**
 * Flow 2 — Upload Hub (/upload/{contractId}).
 *
 * Voice is completed via the real API (presigned S3 PUT + /voice/complete)
 * so these specs start at an unlocked hub. Every card click asserts the
 * navigation it promises.
 */
import { test, expect, type Page } from "@playwright/test";
import { loginAsMaker } from "./helpers/auth";
import { completeVoiceViaApi, createLockedMaker, type LockedMaker } from "./helpers/flow2";

let m: LockedMaker;

const KEEPER_CARDS: Array<{ slug: string; label: string; heading: string }> = [
  { slug: "who-they-are", label: "Who they are", heading: "Who they are" },
  { slug: "who-theyre-becoming", label: "Who they're becoming", heading: "Who they are becoming" },
  { slug: "what-you-want", label: "What you want for them", heading: "What you want for them" },
  { slug: "what-you-want-known", label: "What you want them to know", heading: "What you want them to know" },
  { slug: "advice", label: "Advice", heading: "Advice" },
];

test.beforeAll(async () => {
  m = await createLockedMaker({ firstName: "Hub", lastName: "Maker" });
  await completeVoiceViaApi(m);
});

async function openHub(page: Page) {
  await loginAsMaker(page, m.makerEmail);
  await page.goto(`/upload/${m.contractId}`);
  await expect(page.getByRole("heading", { name: `For ${m.keeperName}` })).toBeVisible({ timeout: 20_000 });
}

test("hub renders heading, MESSAGES and KEEPER cards", async ({ page }) => {
  await openHub(page);
  await expect(page.getByText("MESSAGES", { exact: true })).toBeVisible();
  await expect(page.getByText(m.keeperName.toUpperCase(), { exact: true })).toBeVisible();
  // Message cards
  await expect(page.getByText("Welcome", { exact: true })).toBeVisible();
  await expect(page.getByText("For when", { exact: true })).toBeVisible();
  // All 5 keeper cards
  for (const card of KEEPER_CARDS) {
    await expect(page.getByRole("button").filter({ hasText: card.label }).first()).toBeVisible();
  }
});

test("Welcome card navigates to keeper/welcome", async ({ page }) => {
  // REAL APP BUG (staging): /upload/{id}/keeper/welcome is not served —
  // the client router's RSC fetch (keeper/welcome.txt) 404s, Next falls back
  // to a full navigation, and Amplify has no rewrite for the route → blank
  // 404 page. The Welcome recording page is unreachable on staging by any
  // path (card click or direct URL). Repro:
  //   curl -sL -o /dev/null -w "%{http_code}" \
  //     https://staging.d21q10npjg05eb.amplifyapp.com/upload/abc/keeper/welcome  → 404
  // Fix: add the Amplify rewrite rules for /upload/<*>/keeper/welcome (and
  // /upload/<*>/keeper/<*> for direct loads), then remove this fixme.
  test.fixme();
  await openHub(page);
  await page.getByRole("button").filter({ hasText: "Welcome" }).first().click();
  await page.waitForURL(`**/upload/${m.contractId}/keeper/welcome**`, { timeout: 20_000 });
  await expect(page.getByRole("heading", { name: "Welcome Message" })).toBeVisible({ timeout: 15_000 });
});

test("each keeper card navigates to its section page", async ({ page }) => {
  // REAL APP BUG (staging): ALL /upload/{id}/keeper/* pages are unreachable.
  // The client router's RSC fetch (keeper/{slug}.txt) 404s → Next falls back
  // to a full navigation → Amplify has no rewrite for 4-segment upload
  // routes → 301 to trailing slash → 404 blank page. The URL changes (so a
  // URL-only assertion would pass vacuously) but the page never renders —
  // the entire FOR KEEPER half of Flow 2 is broken for real users on
  // staging. Repro:
  //   curl -sL -o /dev/null -w "%{http_code}" \
  //     https://staging.d21q10npjg05eb.amplifyapp.com/upload/abc/keeper/who-they-are  → 404
  //   (vs /upload/abc/history → 200)
  // Fix: add Amplify rewrites for /upload/<*>/keeper/<*> and
  // /upload/<*>/keeper/welcome, then remove this fixme.
  test.fixme();
  test.setTimeout(180_000);
  await openHub(page);
  for (const card of KEEPER_CARDS) {
    await page.getByRole("button").filter({ hasText: card.label }).first().click();
    await page.waitForURL(`**/upload/${m.contractId}/keeper/${card.slug}**`, { timeout: 20_000 });
    // The page must actually render, not just change the URL
    await expect(page.getByRole("heading", { name: card.heading })).toBeVisible({ timeout: 20_000 });
    await page.goto(`/upload/${m.contractId}`);
    await expect(page.getByRole("heading", { name: `For ${m.keeperName}` })).toBeVisible({ timeout: 20_000 });
  }
});

test("back link returns to /contracts", async ({ page }) => {
  await openHub(page);
  await page.getByRole("link", { name: /your contracts/i }).click();
  await page.waitForURL("**/contracts**", { timeout: 20_000 });
});
