/**
 * Flow 2 (Memory Upload) test setup helpers.
 *
 * All Flow 2 pages require a Maker with a LOCKED contract. These helpers
 * build that precondition through the real backend API (no browser), reusing
 * the /test/* token-injection endpoints — the same path the Flow 1 specs use.
 */
import * as crypto from "crypto";
import { apiGet, apiPost, getEmailVerifyToken, getInviteToken, type RegistrationData } from "./tokens";

const API = process.env.API_URL ?? "http://localhost:8000/api/v1";

export function uid(): string {
  return crypto.randomBytes(4).toString("hex");
}

export type LockedMaker = {
  makerEmail: string;
  makerFullName: string;
  keeperName: string;
  contractId: string;
  /** Maker session token (Bearer) for direct API assertions. */
  session: string;
};

/**
 * Create a Maker + aware-path contract, sign as the Maker, then accept the
 * invitation as the Keeper — leaving the contract LOCKED. Pure API, ~2s.
 */
export async function createLockedMaker(opts?: {
  firstName?: string;
  lastName?: string;
  keeperName?: string;
}): Promise<LockedMaker> {
  const id = uid();
  const firstName = opts?.firstName ?? "Flow";
  const lastName = opts?.lastName ?? `Maker${id}`;
  const keeperName = opts?.keeperName ?? `Kalee Keeper${id}`;
  const makerEmail = `e2e-f2m-${id}@example.com`;
  const keeperEmail = `e2e-f2k-${id}@example.com`;

  const data: RegistrationData = {
    first_name: firstName,
    last_name: lastName,
    maker_email: makerEmail,
    keeper_name: keeperName,
    keeper_email: keeperEmail,
    relationship: "Friend",
    path: "aware",
  };
  const jwt = await getEmailVerifyToken(data);
  const reg = await apiPost<{ session_token: string; contract_id: string; full_name: string }>(
    "/auth/complete-registration",
    { token: jwt }
  );
  // Maker signs → PENDING_KEEPER (also creates the keeper invitation token)
  await apiPost(`/contracts/${reg.contract_id}/sign`, { typed_name: `${firstName} ${lastName}` }, reg.session_token);
  // Keeper accepts via the invite token → LOCKED (accept endpoint is unauthenticated)
  const inviteToken = await getInviteToken(keeperEmail);
  await apiPost(`/contracts/invite/${inviteToken}/accept`, { typed_name: keeperName });

  return {
    makerEmail,
    makerFullName: `${firstName} ${lastName}`,
    keeperName,
    contractId: reg.contract_id,
    session: reg.session_token,
  };
}

/** Minimal valid-enough audio payload for presigned S3 PUTs (backend never decodes it). */
function fakeWebmAudio(): Buffer {
  // EBML header magic for webm + padding — S3/backends only store bytes.
  return Buffer.concat([Buffer.from([0x1a, 0x45, 0xdf, 0xa3]), crypto.randomBytes(4096)]);
}

/**
 * Mark both voice recordings (name + profile) complete through the real API:
 * presigned PUT to S3 + /voice/complete. Fast path so non-voice specs don't
 * have to re-record 2×10s in the browser every run.
 */
export async function completeVoiceViaApi(m: LockedMaker): Promise<void> {
  for (const voiceType of ["name", "profile"] as const) {
    const pres = await apiPost<{ upload_id: string; presigned_url: string; s3_key: string }>(
      `/contracts/${m.contractId}/upload/voice/presigned?voice_type=${voiceType}`,
      {},
      m.session
    );
    const put = await fetch(pres.presigned_url, {
      method: "PUT",
      body: fakeWebmAudio(),
      headers: { "Content-Type": "audio/webm" },
    });
    if (!put.ok) throw new Error(`S3 PUT for voice/${voiceType} → ${put.status}`);
    const res = await fetch(`${API}/contracts/${m.contractId}/upload/voice/complete`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${m.session}` },
      body: JSON.stringify({ upload_id: pres.upload_id, type: voiceType, s3_key: pres.s3_key, duration_s: 15 }),
    });
    if (!res.ok) throw new Error(`voice/complete (${voiceType}) → ${res.status}: ${await res.text()}`);
  }
}

export type HubData = {
  contract_id: string;
  keeper_name: string;
  upload_id: string;
  voice_status: string;
  dimension_counts: Record<string, number>;
};

export function getHub(m: LockedMaker): Promise<HubData> {
  return apiGet<HubData>(`/contracts/${m.contractId}/upload/hub`, m.session);
}

export function getVoiceStatus(m: LockedMaker): Promise<{ name: string; profile: string }> {
  return apiGet<{ name: string; profile: string }>(`/contracts/${m.contractId}/upload/voice/status`, m.session);
}

export type DimEntry = {
  id: string;
  title?: string;
  body: string;
  entry_type: string;
  tags?: {
    people?: string[]; years?: string[]; places?: string[];
    year?: string | null; place?: string | null;
    what_happened?: string | null; when?: string | null;
    call_them?: string | null; full_name?: string | null;
  };
  media_s3_key?: string | null;
  duration_s?: number | null;
  created_at: string;
};

export function getDimension(m: LockedMaker, slug: string): Promise<{ id: string; slug: string; structured: Record<string, unknown> | null; entries: DimEntry[] }> {
  return apiGet(`/contracts/${m.contractId}/upload/dimensions/${slug}`, m.session);
}

export function listMessages(m: LockedMaker): Promise<Array<{ id: string; type: string; body: string; s3_key?: string; duration_s?: number }>> {
  return apiGet(`/contracts/${m.contractId}/upload/messages`, m.session);
}
