/**
 * Flow 2 — Second YOU dimension smoke test (Relationships).
 *
 * One text entry end-to-end through the same engine — proves the dimension
 * pages are truly dimension-agnostic (form → entries → editor → list).
 */
import { test, expect } from "@playwright/test";
import { loginAsMaker } from "./helpers/auth";
import { completeVoiceViaApi, createLockedMaker, getDimension, type LockedMaker } from "./helpers/flow2";
import { addTextEntry, expectEditorTitleNonEmpty, saveEditor } from "./helpers/flow2-ui";

let m: LockedMaker;

test.beforeAll(async () => {
  m = await createLockedMaker({ firstName: "Rel", lastName: "Maker" });
  await completeVoiceViaApi(m);
});

test("relationships: form → one text entry end-to-end", async ({ page }) => {
  test.setTimeout(180_000);
  await loginAsMaker(page, m.makerEmail);
  await page.goto(`/upload/${m.contractId}/relationships`);
  await expect(page.getByRole("heading", { name: "Relationships" })).toBeVisible({ timeout: 20_000 });

  // First visit → structured form. Fill one field and continue.
  const status = page.locator('label, span').filter({ hasText: "Relationship status" });
  await expect(status.first()).toBeVisible({ timeout: 15_000 });
  await page.getByPlaceholder("Your answer").first().fill("Married");
  await page.getByRole("button", { name: /save and continue/i }).click();
  await expect(page.getByText("ENTRIES", { exact: true })).toBeVisible({ timeout: 30_000 });
  await expect(page.getByText(/Relationship status: Married/)).toBeVisible();

  // Text entry through the shared composer
  await addTextEntry(page, "In 2015 my brother Tomas and I hiked across Iceland together and finally learned to argue kindly.");
  await expectEditorTitleNonEmpty(page);
  await saveEditor(page);
  await expect(page.getByText(/Text • \w+ \d{1,2}, \d{4}/).first()).toBeVisible();

  // Persisted server-side in the relationships dimension
  const dim = await getDimension(m, "relationships");
  expect(dim.structured?.relationship_status).toBe("Married");
  expect(dim.entries).toHaveLength(1);
  expect(dim.entries[0].entry_type).toBe("text");
  expect(dim.entries[0].body).toContain("Tomas");
});
