/**
 * Token injection helpers — call the backend /test/* endpoints.
 * These only work when the backend is started with TESTING=true.
 *
 * No direct DB access, no Python scripts, no hardcoded DSNs.
 */

const API = process.env.API_URL ?? "http://localhost:8000/api/v1";

async function post<T>(path: string, body: object): Promise<T> {
  const res = await fetch(`${API}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`POST ${path} → ${res.status}: ${text}`);
  }
  return res.json() as Promise<T>;
}

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${API}${path}`);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`GET ${path} → ${res.status}: ${text}`);
  }
  return res.json() as Promise<T>;
}

export type RegistrationData = {
  first_name: string;
  middle_name?: string;
  last_name: string;
  maker_email: string;
  keeper_name: string;
  keeper_email: string;
  relationship: string;
  path: "aware" | "private";
  tc_name?: string;
  tc_email?: string;
};

/** Get the email-verification JWT that would be sent to the Maker's inbox. */
export async function getEmailVerifyToken(data: RegistrationData): Promise<string> {
  const r = await post<{ token: string }>("/test/email-verify-token", data);
  return r.token;
}

/** Create a magic-link token in the DB and return the raw token string. */
export async function getMagicToken(email: string, mode = "login"): Promise<string> {
  const r = await post<{ token: string }>("/test/magic-token", { email, mode });
  return r.token;
}

/** Return the most recent unused invitation token for the given invitee email. */
export async function getInviteToken(inviteeEmail: string): Promise<string> {
  const r = await get<{ token: string }>(
    `/test/invite-token?email=${encodeURIComponent(inviteeEmail)}`
  );
  return r.token;
}

export type KeeperBeginData = {
  invite_token: string;
  first_name: string;
  middle_name?: string;
  last_name: string;
  email: string;
};

/** Return the keeper email-verification JWT without actually sending the email. */
export async function getKeeperEmailVerifyToken(data: KeeperBeginData): Promise<string> {
  const r = await post<{ token: string }>("/test/keeper-email-verify-token", data);
  return r.token;
}

/** Direct API call helpers for programmatic test setup (no browser). */
export async function apiPost<T>(
  path: string,
  body: object,
  authToken?: string
): Promise<T> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (authToken) headers["Authorization"] = `Bearer ${authToken}`;
  const res = await fetch(`${API}${path}`, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`POST ${path} → ${res.status}: ${await res.text()}`);
  return res.json() as Promise<T>;
}

export async function apiGet<T>(path: string, authToken?: string): Promise<T> {
  const headers: Record<string, string> = {};
  if (authToken) headers["Authorization"] = `Bearer ${authToken}`;
  const res = await fetch(`${API}${path}`, { headers });
  if (!res.ok) throw new Error(`GET ${path} → ${res.status}: ${await res.text()}`);
  return res.json() as Promise<T>;
}
