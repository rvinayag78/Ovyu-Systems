/**
 * Flow 2 — FOR KEEPER section "Advice" (smoke).
 *
 * No structured form: the page lands directly on the entries view.
 * One text entry end-to-end.
 */
import { test, expect } from "@playwright/test";
import { loginAsMaker } from "./helpers/auth";
import { completeVoiceViaApi, createLockedMaker, getDimension, type LockedMaker } from "./helpers/flow2";
import { addTextEntry, expectEditorTitleNonEmpty, saveEditor } from "./helpers/flow2-ui";

let m: LockedMaker;

test.beforeAll(async () => {
  m = await createLockedMaker({ firstName: "Advice", lastName: "Maker" });
  await completeVoiceViaApi(m);
});

test("advice: lands on entries directly; one text entry end-to-end", async ({ page }) => {
  // REAL APP BUG (staging): /upload/{id}/keeper/* pages are unreachable
  // (blank Amplify 404 on both direct load and card click — missing
  // rewrites; see 10-upload-hub.spec.ts for the full repro). This test
  // drives the intended user path and should pass unchanged once the
  // rewrites ship — then remove this fixme.
  test.fixme();
  test.setTimeout(180_000);
  await loginAsMaker(page, m.makerEmail);
  await page.goto(`/upload/${m.contractId}`);
  await expect(page.getByRole("heading", { name: `For ${m.keeperName}` })).toBeVisible({ timeout: 20_000 });
  await page.getByRole("button").filter({ hasText: "Advice" }).first().click();
  await page.waitForURL(`**/upload/${m.contractId}/keeper/advice**`, { timeout: 20_000 });
  await expect(page.getByRole("heading", { name: "Advice" })).toBeVisible({ timeout: 20_000 });

  // No form for this section — entries view immediately
  await expect(page.getByText("ENTRIES", { exact: true })).toBeVisible({ timeout: 30_000 });
  await expect(page.getByRole("button", { name: /save and continue/i })).toHaveCount(0);

  await addTextEntry(page, "When you cannot decide, choose the option you would be proud to explain out loud to someone you respect.");
  await expectEditorTitleNonEmpty(page);
  await saveEditor(page);
  await expect(page.getByText(/Text • \w+ \d{1,2}, \d{4}/).first()).toBeVisible();

  const dim = await getDimension(m, "advice");
  expect(dim.entries).toHaveLength(1);
  expect(dim.entries[0].entry_type).toBe("text");
});
