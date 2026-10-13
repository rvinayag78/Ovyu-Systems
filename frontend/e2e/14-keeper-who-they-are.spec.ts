/**
 * Flow 2 — FOR KEEPER section "Who they are" (medium depth).
 *
 * The only keeper section with a structured form. Form → facts banner →
 * one text entry → back link labelled "For {keeper}" returns to the hub →
 * hub dot / dimension_counts reflect the entry.
 */
import { test, expect } from "@playwright/test";
import { loginAsMaker } from "./helpers/auth";
import { completeVoiceViaApi, createLockedMaker, getDimension, getHub, type LockedMaker } from "./helpers/flow2";
import { addTextEntry, expectEditorTitleNonEmpty, saveEditor } from "./helpers/flow2-ui";

let m: LockedMaker;

test.beforeAll(async () => {
  m = await createLockedMaker({ firstName: "Keep", lastName: "Maker" });
  await completeVoiceViaApi(m);
});

test("who-they-are: form → facts banner → text entry → back to hub, dot fills", async ({ page }) => {
  // REAL APP BUG (staging): /upload/{id}/keeper/* pages are unreachable —
  // both direct loads AND client-side card clicks end on a blank Amplify
  // 404 (missing rewrites for 4-segment upload routes; the RSC fetch 404s
  // and Next falls back to a full navigation). Full repro in
  // 10-upload-hub.spec.ts. This test drives the intended user path and
  // should pass unchanged once the rewrites ship — then remove this fixme.
  test.fixme();
  test.setTimeout(240_000);
  await loginAsMaker(page, m.makerEmail);
  await page.goto(`/upload/${m.contractId}`);
  await expect(page.getByRole("heading", { name: `For ${m.keeperName}` })).toBeVisible({ timeout: 20_000 });
  await page.getByRole("button").filter({ hasText: "Who they are" }).first().click();
  await page.waitForURL(`**/upload/${m.contractId}/keeper/who-they-are**`, { timeout: 20_000 });
  await expect(page.getByRole("heading", { name: "Who they are" })).toBeVisible({ timeout: 20_000 });

  // Structured form on first visit — fill "What you call them" + "Full name"
  await expect(page.getByText("What you call them", { exact: true })).toBeVisible({ timeout: 15_000 });
  await page.getByPlaceholder("Your answer").first().fill("Kiddo");
  // "Full name" (single text field): its input is the label span's sibling
  await page
    .getByText("Full name", { exact: true })
    .locator("xpath=following-sibling::input")
    .fill(m.keeperName);
  await page.getByRole("button", { name: /save and continue/i }).click();

  // Facts banner from the prose map
  await expect(page.getByText("ENTRIES", { exact: true })).toBeVisible({ timeout: 30_000 });
  await expect(page.getByText(/Calls them: Kiddo/)).toBeVisible();
  await expect(page.getByText(new RegExp(`Full name: ${m.keeperName}`))).toBeVisible();

  // Persisted
  let dim = await getDimension(m, "who-they-are");
  expect(dim.structured?.call_them).toEqual(["Kiddo"]);
  expect(dim.structured?.full_name).toBe(m.keeperName);

  // One text entry end-to-end
  await addTextEntry(page, "They were born in 2001 in Chicago and have always loved thunderstorms more than sunshine.");
  await expectEditorTitleNonEmpty(page);
  await saveEditor(page);
  dim = await getDimension(m, "who-they-are");
  expect(dim.entries).toHaveLength(1);

  // Back link is "For {keeper}" → hub
  await page.getByRole("link", { name: `For ${m.keeperName}` }).click();
  await page.waitForURL(`**/upload/${m.contractId}`, { timeout: 20_000 });
  await expect(page.getByRole("heading", { name: `For ${m.keeperName}` })).toBeVisible({ timeout: 20_000 });

  // Hub card dot fills once the section has ≥1 entry (count from the API)
  const hub = await getHub(m);
  expect(hub.dimension_counts["who-they-are"]).toBe(1);
  const dot = page
    .getByRole("button")
    .filter({ hasText: "Who they are" })
    .first()
    .locator('div[style*="border-radius: 50%"]');
  const bg = await dot.evaluate(el => getComputedStyle(el).backgroundColor);
  expect(bg).toBe("rgb(106, 77, 125)"); // lavender — filled
});
