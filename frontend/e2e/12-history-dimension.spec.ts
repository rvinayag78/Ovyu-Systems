/**
 * Flow 2 — Dimension entry engine, deep test on History
 * (/upload/{contractId}/history).
 *
 * Covers: first-visit structured form + persistence, banner facts prose,
 * composer defaults + carousel, the full TEXT entry lifecycle (AI title,
 * quick tags with instant persistence, structured prompt rows), the full
 * VOICE entry lifecycle (armed → record → stop, <10s regression, save,
 * editor playback), edit/delete via the ⋯ menu, and the YOU bar.
 */
import { test, expect, type Page } from "@playwright/test";
import { loginAsMaker } from "./helpers/auth";
import { completeVoiceViaApi, createLockedMaker, getDimension, getHub, type LockedMaker } from "./helpers/flow2";
import {
  addQuickTag,
  addTextEntry,
  chip,
  entryCard,
  entryCardMenu,
  expectEditorTitleNonEmpty,
  saveEditor,
} from "./helpers/flow2-ui";

test.describe.configure({ mode: "serial" });

let m: LockedMaker;
const FULL_NAME = "Historia Maker";
const TEXT_BODY = "In 2013 I traveled to Paris with Kalee. We watched the sunrise from Montmartre and I have never forgotten it.";

test.beforeAll(async () => {
  m = await createLockedMaker({ firstName: "Historia", lastName: "Maker" });
  await completeVoiceViaApi(m);
});

async function openHistory(page: Page) {
  await loginAsMaker(page, m.makerEmail);
  await page.goto(`/upload/${m.contractId}/history`);
}

test("first visit shows structured form; save persists and shows facts banner", async ({ page }) => {
  test.setTimeout(120_000);
  await openHistory(page);
  await expect(page.getByRole("heading", { name: "History" })).toBeVisible({ timeout: 20_000 });

  // First visit (structured is null) → the form, not the entries view
  const fullName = page.getByPlaceholder("Your full name, exactly as you write it");
  await expect(fullName).toBeVisible({ timeout: 15_000 });
  await fullName.fill(FULL_NAME);
  await page.getByPlaceholder("What people actually call you").fill("Hist");
  await page.getByPlaceholder("MM/DD/YYYY").fill("04/14/1980");

  await page.getByRole("button", { name: /save and continue/i }).click();

  // Entries view with the facts prose in the banner
  await expect(page.getByText("ENTRIES", { exact: true })).toBeVisible({ timeout: 30_000 });
  await expect(page.getByText(new RegExp(FULL_NAME))).toBeVisible();
  await expect(page.getByText(/Born 04\/14\/1980/)).toBeVisible();

  // Persisted server-side
  const dim = await getDimension(m, "history");
  expect(dim.structured?.full_name).toBe(FULL_NAME);
  expect(dim.structured?.goes_by).toBe("Hist");
  expect(dim.structured?.dob).toBe("04/14/1980");
});

test("reload → edit link reopens form with persisted values", async ({ page }) => {
  await openHistory(page);
  await expect(page.getByText("ENTRIES", { exact: true })).toBeVisible({ timeout: 30_000 });
  await page.getByRole("button", { name: "edit", exact: true }).click();
  await expect(page.getByPlaceholder("Your full name, exactly as you write it")).toHaveValue(FULL_NAME, { timeout: 15_000 });
  await expect(page.getByPlaceholder("What people actually call you")).toHaveValue("Hist");
  await expect(page.getByPlaceholder("MM/DD/YYYY")).toHaveValue("04/14/1980");
  // Return to entries view
  await page.getByRole("button", { name: /save and continue/i }).click();
  await expect(page.getByText("ENTRIES", { exact: true })).toBeVisible({ timeout: 30_000 });
});

test("composer default: carousel + ♪ Voice; carousel rotates on click", async ({ page }) => {
  await openHistory(page);
  await expect(page.getByText("ADD AN ENTRY", { exact: true })).toBeVisible({ timeout: 30_000 });
  await expect(page.getByRole("button", { name: "♪ Voice" })).toBeVisible();

  // Center carousel question (26.4px) changes when the carousel is clicked
  const center = page.locator('p[style*="26.4px"]');
  await expect(center).toHaveCount(1);
  const before = await center.textContent();
  await center.click();
  await expect(center).not.toHaveText(before ?? "", { timeout: 10_000 });
});

test("TEXT entry: save → editor (AI title) → quick tags persist instantly → structured rows → list", async ({ page }) => {
  test.setTimeout(240_000);
  await openHistory(page);
  await expect(page.getByText("ADD AN ENTRY", { exact: true })).toBeVisible({ timeout: 30_000 });

  await addTextEntry(page, TEXT_BODY);
  const aiTitle = await expectEditorTitleNonEmpty(page);
  expect(aiTitle.trim().length).toBeGreaterThan(0);
  // Tag grid structure present (AI tags MAY include 2013/Kalee/Paris — tolerant)
  await expect(page.getByRole("button", { name: "+ Add Person" })).toBeVisible();
  await expect(page.getByRole("button", { name: "+ Add Year" })).toBeVisible();
  await expect(page.getByRole("button", { name: "+ Add Place" })).toBeVisible();

  // Quick tags persist immediately (each add is its own PUT)
  await addQuickTag(page, "Person", "Marguerite");
  await addQuickTag(page, "Year", "1999");
  await addQuickTag(page, "Place", "Lisbon, Portugal");

  // Reload: editor closes, entry card in the list still shows the tags
  await page.reload();
  await expect(page.getByText("ENTRIES", { exact: true })).toBeVisible({ timeout: 30_000 });
  await expect(chip(page, "Marguerite").first()).toBeVisible();
  await expect(chip(page, "1999").first()).toBeVisible();
  await expect(chip(page, "Lisbon, Portugal").first()).toBeVisible();
  // Tags render in the fixed 3-column grid
  await expect(entryCard(page, "Marguerite").locator('div[style*="grid-template-columns"]')).toHaveCount(1);

  // Server state agrees
  let dim = await getDimension(m, "history");
  expect(dim.entries).toHaveLength(1);
  expect(dim.entries[0].tags?.people).toContain("Marguerite");
  expect(dim.entries[0].tags?.years).toContain("1999");
  expect(dim.entries[0].tags?.places).toContain("Lisbon, Portugal");

  // Remove a tag → persists across reload
  await entryCardMenu(page, "Marguerite", "edit");
  await expect(page.getByText("ENTRY", { exact: true })).toBeVisible({ timeout: 15_000 });
  const removePut = page.waitForResponse(r => r.request().method() === "PUT" && /\/entries\//.test(r.url()), { timeout: 30_000 });
  await chip(page, "1999").locator("button").click();
  await expect(chip(page, "1999")).toHaveCount(0, { timeout: 10_000 });
  await removePut;
  await page.reload();
  await expect(page.getByText("ENTRIES", { exact: true })).toBeVisible({ timeout: 30_000 });
  await expect(chip(page, "1999")).toHaveCount(0);
  dim = await getDimension(m, "history");
  expect(dim.entries[0].tags?.years ?? []).not.toContain("1999");

  // Structured prompt rows ("Someone worth naming?" / "A time that mattered?")
  await entryCardMenu(page, "Marguerite", "edit");
  await expect(page.getByText("ENTRY", { exact: true })).toBeVisible({ timeout: 15_000 });
  await page.locator("#edit-call-them").fill("Mimi");
  await page.locator('label:has-text("FULL NAME")').locator("xpath=following-sibling::input").fill("Marguerite Duras");
  await page.locator('label:has-text("WHAT HAPPENED")').locator("xpath=following-sibling::input").fill("Moved");
  await page.locator('label:text-is("WHEN")').locator("xpath=following-sibling::input").fill("Summer of 2001");
  await saveEditor(page);

  // Back on the list: card with title, "Text • date" meta, composer reset
  await expect(page.getByText(/Text • \w+ \d{1,2}, \d{4}/).first()).toBeVisible();
  await expect(page.getByRole("button", { name: "♪ Voice" })).toBeVisible();
  await expect(page.locator('p[style*="26.4px"]')).toHaveCount(1);

  // Structured prompt values persisted
  dim = await getDimension(m, "history");
  expect(dim.entries[0].tags?.call_them).toBe("Mimi");
  expect(dim.entries[0].tags?.full_name).toBe("Marguerite Duras");
  expect(dim.entries[0].tags?.what_happened).toBe("Moved");
  expect(dim.entries[0].tags?.when).toBe("Summer of 2001");
  // Full name folded into people, year extracted from "when"
  expect(dim.entries[0].tags?.people).toContain("Marguerite Duras");
  expect(dim.entries[0].tags?.years).toContain("2001");
});

test("edit again: call-them / full-name / what-happened / when pre-populated", async ({ page }) => {
  await openHistory(page);
  await expect(page.getByText("ENTRIES", { exact: true })).toBeVisible({ timeout: 30_000 });
  await entryCardMenu(page, "Marguerite", "edit");
  await expect(page.getByText("ENTRY", { exact: true })).toBeVisible({ timeout: 15_000 });
  await expect(page.locator("#edit-call-them")).toHaveValue("Mimi");
  await expect(page.locator('label:has-text("FULL NAME")').locator("xpath=following-sibling::input")).toHaveValue("Marguerite Duras");
  await expect(page.locator('label:has-text("WHAT HAPPENED")').locator("xpath=following-sibling::input")).toHaveValue("Moved");
  await expect(page.locator('label:text-is("WHEN")').locator("xpath=following-sibling::input")).toHaveValue("Summer of 2001");
  await saveEditor(page);
});

test("VOICE entry: armed → record → short-take regression → ≥10s → save → editor → list", async ({ page }) => {
  test.setTimeout(300_000);
  await openHistory(page);
  await expect(page.getByText("ADD AN ENTRY", { exact: true })).toBeVisible({ timeout: 30_000 });

  // Click Voice → armed: "● Record" appears, mic NOT started (no timer)
  await page.getByRole("button", { name: "♪ Voice" }).click();
  await expect(page.getByRole("button", { name: "● Record" })).toBeVisible();
  await expect(page.getByText("ADD VOICE ENTRY", { exact: true })).toBeVisible();
  await expect(page.getByText(/^\d:\d{2}$/)).toHaveCount(0);

  // Record → "■ Stop" + running timer
  await page.getByRole("button", { name: "● Record" }).click();
  await expect(page.getByRole("button", { name: "■ Stop" })).toBeVisible();
  await expect(page.getByText(/^0:0[3-5]$/)).toBeVisible({ timeout: 15_000 });

  // Stop at <10s → warning + Record re-enabled (regression: was a dead end)
  await page.getByRole("button", { name: "■ Stop" }).click();
  await expect(page.getByText(/needs at least 10 seconds/i)).toBeVisible({ timeout: 10_000 });
  const recordAgain = page.getByRole("button", { name: "● Record" });
  await expect(recordAgain).toBeVisible();
  await expect(recordAgain).toBeEnabled();
  // Save still not possible with a short take
  await expect(page.getByRole("button", { name: "Save", exact: true })).toBeDisabled();

  // Record a real ≥10s take
  await recordAgain.click();
  await expect(page.getByText(/^0:1[2-9]$/)).toBeVisible({ timeout: 30_000 });
  await page.getByRole("button", { name: "■ Stop" }).click();

  // Save becomes actionable and dark (lavender)
  const save = page.getByRole("button", { name: "Save", exact: true });
  await expect(save).toBeEnabled({ timeout: 10_000 });
  expect(await save.evaluate(el => getComputedStyle(el).backgroundColor)).toBe("rgb(106, 77, 125)");

  // Save → S3 upload + entry created → editor opens
  await save.click();
  await expect(page.getByText("ENTRY", { exact: true })).toBeVisible({ timeout: 60_000 });
  await expect(page.getByPlaceholder("Title")).toHaveValue("Voice note");
  await expect(page.getByText(/Voice • .+ • 0:1\d/)).toBeVisible();
  // Playback controls (media URL resolves from S3)
  await expect(page.getByRole("button", { name: "Play" })).toBeVisible({ timeout: 30_000 });
  await expect(page.getByRole("button", { name: "Pause" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Stop" })).toBeVisible();

  await saveEditor(page);
  await expect(page.getByText("Voice note", { exact: true })).toBeVisible();

  // Immediate contract only — transcription/AI-tagging is async (minutes):
  // entry exists with title "Voice note", duration in meta, empty tags.
  const dim = await getDimension(m, "history");
  const voice = dim.entries.find(e => e.entry_type === "voice");
  expect(voice).toBeTruthy();
  expect(voice!.title).toBe("Voice note");
  expect(voice!.duration_s).toBeGreaterThanOrEqual(10);
  expect(voice!.media_s3_key).toBeTruthy();
  expect(voice!.tags?.people ?? []).toHaveLength(0);
});

test("delete entry via ⋯ → gone after reload", async ({ page }) => {
  await openHistory(page);
  await expect(page.getByText("ENTRIES", { exact: true })).toBeVisible({ timeout: 30_000 });
  await expect(page.getByText("Voice note", { exact: true })).toBeVisible();
  await entryCardMenu(page, "Voice note", "delete");
  await expect(page.getByText("Voice note", { exact: true })).toHaveCount(0, { timeout: 15_000 });
  await page.reload();
  await expect(page.getByText("ENTRIES", { exact: true })).toBeVisible({ timeout: 30_000 });
  await expect(page.getByText("Voice note", { exact: true })).toHaveCount(0);
  const dim = await getDimension(m, "history");
  expect(dim.entries.filter(e => e.entry_type === "voice")).toHaveLength(0);
});

test("YOU bar: expand shows 8 rows; Relationships row navigates", async ({ page }) => {
  await openHistory(page);
  await expect(page.getByText("ENTRIES", { exact: true })).toBeVisible({ timeout: 30_000 });

  // Server-side count drives the History circle: 1 remaining (text) entry
  const hub = await getHub(m);
  expect(hub.dimension_counts["history"]).toBe(1);

  await page.getByText("YOU", { exact: true }).click();
  // Expanded panel: Voice row + all 7 dimension rows
  await expect(page.getByText("Facial expressions and video coming soon.")).toBeVisible({ timeout: 10_000 });
  for (const sub of [
    "Childhood, schools, milestones, the turning points.",
    "The people who shaped you, how you love, how you fight.",
    "How you decide, process, land on answers.",
    "Catchphrases, inside jokes, the way you say things.",
    "Habits, rituals, the texture of your daily life.",
    "What you believe, what you'd stand up for. Your worldview and ideologies.",
    "What moves you. What you love, what you can't stand, what lights you up.",
  ]) {
    await expect(page.getByText(sub, { exact: true })).toBeVisible();
  }

  await page.getByRole("button").filter({ hasText: "The people who shaped you" }).click();
  await page.waitForURL(`**/upload/${m.contractId}/relationships**`, { timeout: 20_000 });
});
