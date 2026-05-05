/**
 * Runs once before every `npx playwright test` invocation.
 * Wipes all DB data via the /test/wipe endpoint so each run starts clean.
 * Requires TESTING=true on the backend.
 */

const API = process.env.API_URL ?? "http://localhost:8000/api/v1";

export default async function globalSetup() {
  console.log("\n[globalSetup] Wiping test database via API...");
  try {
    const res = await fetch(`${API}/test/wipe`, { method: "DELETE" });
    if (res.ok) {
      const data = await res.json() as { deleted: Record<string, number> };
      const summary = Object.entries(data.deleted)
        .filter(([, n]) => n > 0)
        .map(([t, n]) => `${t}:${n}`)
        .join(", ");
      console.log(`[globalSetup] Wiped: ${summary || "nothing"}`);
    } else {
      console.warn(`[globalSetup] /test/wipe returned ${res.status} — ensure TESTING=true on backend`);
    }
  } catch (err) {
    console.warn("[globalSetup] Could not reach backend:", String(err));
  }
  console.log("[globalSetup] Done.\n");
}
