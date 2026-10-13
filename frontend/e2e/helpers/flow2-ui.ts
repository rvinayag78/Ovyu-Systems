/**
 * Flow 2 shared browser actions — real clicks against the real staging app.
 */
import { Page, expect } from "@playwright/test";

/**
 * Drive the "Start recording" script pages (voice/name, voice/profile,
 * keeper/welcome): record past the 10s minimum, stop, tick the confirm
 * checkbox, and click "Save and continue →".
 * Relies on Chromium's fake media device (see playwright.config.ts).
 */
export async function recordScriptPageAndSave(page: Page): Promise<void> {
  // These pages are statically exported: the button exists before React
  // hydrates, so a single click can land on dead HTML. Re-click until the
  // recording state (Pause button) actually appears.
  await expect(async () => {
    await page.getByRole("button", { name: /start recording/i }).click();
    await expect(page.getByRole("button", { name: /pause recording/i })).toBeVisible({ timeout: 3_000 });
  }).toPass({ timeout: 45_000 });
  // Timer renders mm:ss ("00:12") — wait for ≥12s on the real clock so the
  // computed duration is safely over the 10s minimum.
  await expect(page.getByText(/00:1[2-9]/)).toBeVisible({ timeout: 30_000 });
  await page.getByRole("button", { name: /pause recording/i }).click();
  const checkbox = page.locator('input[type="checkbox"]');
  await expect(checkbox).toBeEnabled({ timeout: 10_000 });
  await checkbox.check();
  const save = page.getByRole("button", { name: /save and continue/i });
  await expect(save).toBeEnabled();
  await save.click();
}

/**
 * From a dimension/section ENTRIES view: switch the composer to Text, type
 * the body, save, and wait for the entry editor to open (synchronous AI
 * triangulation on the backend — can take a while).
 * Leaves the page inside the entry editor.
 */
export async function addTextEntry(page: Page, body: string): Promise<void> {
  await page.getByRole("button", { name: "✎ Text" }).click();
  const textarea = page.getByPlaceholder("Start typing here…");
  await expect(textarea).toBeVisible();
  await textarea.fill(body);
  await page.getByRole("button", { name: "Save", exact: true }).click();
  // Editor opens after the backend responds (Bedrock Haiku call is sync)
  await expect(page.getByText("ENTRY", { exact: true })).toBeVisible({ timeout: 60_000 });
}

/** Editor must be open. Asserts the AI/fallback title is non-empty. */
export async function expectEditorTitleNonEmpty(page: Page): Promise<string> {
  const title = page.getByPlaceholder("Title");
  await expect(title).toBeVisible();
  await expect(title).not.toHaveValue("", { timeout: 15_000 });
  return title.inputValue();
}

/**
 * In the entry editor: add a quick tag via the + Add buttons (instant PUT).
 *
 * Waits for the PUT to complete before returning. NOTE: this pacing matters —
 * each add fires its own fire-and-forget PUT carrying the FULL tags object,
 * so back-to-back adds create overlapping PUTs where the last one to ARRIVE
 * wins. Machine-speed adds reproducibly lose tags (latent app race; see the
 * e2e report). A human's natural pacing serializes them, as does this wait.
 */
export async function addQuickTag(page: Page, kind: "Person" | "Year" | "Place", value: string): Promise<void> {
  await page.getByRole("button", { name: `+ Add ${kind}` }).click();
  const placeholder = kind === "Person" ? "Name" : kind === "Year" ? "Year" : "City, Country";
  const input = page.getByPlaceholder(placeholder, { exact: true });
  await input.fill(value);
  const putDone = page.waitForResponse(
    r => r.request().method() === "PUT" && /\/entries\//.test(r.url()),
    { timeout: 30_000 }
  );
  await input.press("Enter");
  // Chip appears once the optimistic state lands (chip span text includes the × button)
  await expect(chip(page, value).first()).toBeVisible({ timeout: 10_000 });
  await putDone;
}

/** Tag chip span(s) containing `label` — works in both the editor and the list cards. */
export function chip(page: Page, label: string) {
  return page.locator("span").filter({ hasText: label });
}

/** Close the editor with its bottom lavender Save (returns to ENTRIES list). */
export async function saveEditor(page: Page): Promise<void> {
  await page.getByRole("button", { name: "Save", exact: true }).click();
  await expect(page.getByText("ENTRIES", { exact: true })).toBeVisible({ timeout: 30_000 });
}

/** The entry-list card containing `text` (cards are the position:relative divs). */
export function entryCard(page: Page, cardText: string) {
  return page
    .getByText(cardText)
    .first()
    .locator('xpath=ancestor::div[contains(@style, "position: relative")][1]');
}

/** Open the ⋯ menu of the entry card containing `text` and click an item. */
export async function entryCardMenu(page: Page, cardText: string, item: "edit" | "delete"): Promise<void> {
  await entryCard(page, cardText).locator('button:has-text("⋯")').click();
  await page.getByRole("button", { name: item === "edit" ? "✎ edit" : "× delete" }).click();
}
