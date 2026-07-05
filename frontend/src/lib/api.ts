const BASE = process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:8000";

async function req<T>(path: string, init: RequestInit = {}): Promise<T> {
  const session = typeof window !== "undefined" ? sessionStorage.getItem("ovyu_session") : null;
  const res = await fetch(`${BASE}/api/v1${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(session ? { Authorization: `Bearer ${session}` } : {}),
      ...(init.headers ?? {}),
    },
    ...init,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.detail ?? `Error ${res.status}`);
  }
  // 204 No Content has no body — calling .json() on it throws, which meant
  // every 204 endpoint (entry/person/year/place/message delete, voice
  // complete/delete) succeeded on the backend but threw on the frontend
  // before the caller's onSuccess logic ran, looking like a silent failure.
  if (res.status === 204) return undefined as T;
  return res.json();
}

export type PendingReg = {
  first_name: string; middle_name?: string; last_name: string; maker_email: string;
  keeper_name: string; keeper_email: string; relationship: string;
  path: "aware" | "private"; tc_name?: string | null; tc_email?: string | null;
};

export const api = {
  beginRegistration: (p: PendingReg) =>
    req("/auth/begin-registration", { method: "POST", body: JSON.stringify(p) }),

  verifyToken: (token: string) =>
    req<PendingReg>(`/auth/verify-token?token=${encodeURIComponent(token)}`),

  register: (p: { cognito_sub: string; email: string; full_name: string }) =>
    req("/auth/me", { method: "POST", body: JSON.stringify(p) }),

  createContract: (p: {
    keeper_name: string; keeper_email: string; relationship: string;
    path: "aware" | "private"; tc_name?: string; tc_email?: string;
  }) => req<{ id: string }>("/contracts", { method: "POST", body: JSON.stringify(p) }),

  completeRegistration: (token: string) =>
    req<{ session_token: string; contract_id: string; full_name: string }>(
      "/auth/complete-registration", { method: "POST", body: JSON.stringify({ token }) }
    ),

  listMyContracts: () =>
    req<Array<{ id: string; path: string; status: string; my_role: string; maker_name?: string; keeper_name?: string; tc_name?: string; relationship?: string; maker_signed_at?: string; locked_at?: string; invite_token?: string }>>("/contracts"),

  getContract: (id: string) =>
    req<{ id: string; path: string; status: string; maker_signed_at?: string; locked_at?: string; keeper_name?: string; tc_name?: string; relationship?: string; maker_name?: string; my_role?: string }>(`/contracts/${id}`),

  signContract: (id: string, typed_name: string) =>
    req(`/contracts/${id}/sign`, { method: "POST", body: JSON.stringify({ typed_name }) }),

  getInvitePreview: (token: string) =>
    req<{ invitee_role: "keeper" | "tc"; maker_name: string; keeper_name: string; tc_name: string; relationship: string; contract_id: string }>(`/contracts/invite/${token}`),

  acceptInvitation: (token: string, typed_name: string) =>
    req(`/contracts/invite/${token}/accept`, { method: "POST", body: JSON.stringify({ typed_name }) }),

  declineInvitation: (token: string) =>
    req(`/contracts/decline/${token}`, { method: "POST" }),

  requestMagicLink: (email: string, mode: "login" | "tc") =>
    req("/auth/request-magic-link", { method: "POST", body: JSON.stringify({ email, mode }) }),

  verifyMagicLink: (token: string) =>
    req<{ session_token: string; role: string; maker_stage: string | null; contract_id: string | null; full_name: string }>(
      `/auth/magic-link/verify?token=${encodeURIComponent(token)}`
    ),

  keeperBegin: (p: { invite_token: string; first_name: string; middle_name?: string; last_name: string; email: string }) =>
    req<{ ok: boolean; email: string }>("/auth/keeper-begin", { method: "POST", body: JSON.stringify(p) }),

  keeperVerify: (token: string) =>
    req<{ session_token: string; contract_id: string; keeper_name: string; maker_name: string; invite_token: string }>(
      `/auth/keeper-verify?token=${encodeURIComponent(token)}`
    ),

  // ── Phase 2: Upload ──────────────────────────────────────────────────────
  getUpload: (contractId: string) =>
    req<{ id: string; voice_status: string }>(`/contracts/${contractId}/upload`),

  getHub: (contractId: string) =>
    req<{
      contract_id: string; keeper_name: string; upload_id: string; voice_status: string;
      dimension_counts: Record<string, number>;
      your_life_counts: { people: number; years: number; places: number };
    }>(`/contracts/${contractId}/upload/hub`),

  getUploadProgress: (contractId: string) =>
    req<{ voice_done: boolean; you_pct: number; your_life_pct: number; for_keeper_pct: number }>(`/contracts/${contractId}/upload/progress`),

  getVoiceStatus: (contractId: string) =>
    req<{ name: string; profile: string }>(`/contracts/${contractId}/upload/voice/status`),

  getVoicePresigned: (contractId: string, voiceType: "name" | "profile") =>
    req<{ upload_id: string; presigned_url: string; s3_key: string }>(
      `/contracts/${contractId}/upload/voice/presigned?voice_type=${voiceType}`, { method: "POST" }
    ),

  completeVoice: (contractId: string, p: { upload_id: string; type: string; s3_key: string; duration_s?: number }) =>
    req(`/contracts/${contractId}/upload/voice/complete`, { method: "POST", body: JSON.stringify(p) }),

  getDimension: (contractId: string, slug: string) =>
    req<{ id: string; slug: string; structured: Record<string, unknown> | null; entries: Array<{ id: string; title?: string; body: string; entry_type: string; tags?: { people?: string[]; year?: string | null; place?: string | null }; created_at: string }> }>(`/contracts/${contractId}/upload/dimensions/${slug}`),

  upsertDimension: (contractId: string, slug: string, structured: Record<string, unknown>) =>
    req<{ id: string; slug: string; structured: Record<string, unknown> | null; entries: Array<{ id: string; title?: string; body: string; entry_type: string; tags?: { people?: string[]; year?: string | null; place?: string | null }; created_at: string }> }>(`/contracts/${contractId}/upload/dimensions/${slug}`, { method: "PUT", body: JSON.stringify({ structured }) }),

  getEntryMediaPresigned: (contractId: string, slug: string) =>
    req<{ upload_id: string; presigned_url: string; s3_key: string }>(`/contracts/${contractId}/upload/dimensions/${slug}/entries/presigned`, { method: "POST" }),

  addDimensionEntry: (contractId: string, slug: string, p: { title?: string; body: string; entry_type?: string; tags?: { people?: string[]; year?: string | null; place?: string | null }; media_s3_key?: string }) =>
    req<{ id: string; title?: string; body: string; entry_type: string; tags?: { people?: string[]; year?: string | null; place?: string | null }; created_at: string }>(`/contracts/${contractId}/upload/dimensions/${slug}/entries`, { method: "POST", body: JSON.stringify(p) }),

  updateDimensionEntry: (contractId: string, slug: string, entryId: string, p: { title?: string; body?: string; tags?: Record<string, unknown>; retag?: boolean }) =>
    req<{ id: string; title?: string; body: string; entry_type: string; tags?: { people?: string[]; year?: string | null; place?: string | null }; created_at: string }>(`/contracts/${contractId}/upload/dimensions/${slug}/entries/${entryId}`, { method: "PUT", body: JSON.stringify(p) }),

  deleteDimensionEntry: (contractId: string, slug: string, entryId: string) =>
    req(`/contracts/${contractId}/upload/dimensions/${slug}/entries/${entryId}`, { method: "DELETE" }),

  listPeople: (contractId: string) =>
    req<Array<{ id: string; name: string; role?: string; notes?: string }>>(`/contracts/${contractId}/upload/people`),

  addPerson: (contractId: string, p: { name: string; role?: string; notes?: string }) =>
    req<{ id: string; name: string; role?: string; notes?: string }>(`/contracts/${contractId}/upload/people`, { method: "POST", body: JSON.stringify(p) }),

  deletePerson: (contractId: string, personId: string) =>
    req(`/contracts/${contractId}/upload/people/${personId}`, { method: "DELETE" }),

  listYears: (contractId: string) =>
    req<Array<{ id: string; year?: number; title: string; body?: string }>>(`/contracts/${contractId}/upload/years`),

  addYear: (contractId: string, p: { year?: number; title: string; body?: string }) =>
    req<{ id: string; year?: number; title: string; body?: string }>(`/contracts/${contractId}/upload/years`, { method: "POST", body: JSON.stringify(p) }),

  deleteYear: (contractId: string, yearId: string) =>
    req(`/contracts/${contractId}/upload/years/${yearId}`, { method: "DELETE" }),

  listPlaces: (contractId: string) =>
    req<Array<{ id: string; name: string; why?: string }>>(`/contracts/${contractId}/upload/places`),

  addPlace: (contractId: string, p: { name: string; why?: string }) =>
    req<{ id: string; name: string; why?: string }>(`/contracts/${contractId}/upload/places`, { method: "POST", body: JSON.stringify(p) }),

  deletePlace: (contractId: string, placeId: string) =>
    req(`/contracts/${contractId}/upload/places/${placeId}`, { method: "DELETE" }),

  listMessages: (contractId: string) =>
    req<Array<{ id: string; type: string; trigger?: string; body: string }>>(`/contracts/${contractId}/upload/messages`),

  addMessage: (contractId: string, p: { type: string; trigger?: string; body: string }) =>
    req<{ id: string; type: string; trigger?: string; body: string }>(`/contracts/${contractId}/upload/messages`, { method: "POST", body: JSON.stringify(p) }),

  deleteMessage: (contractId: string, messageId: string) =>
    req(`/contracts/${contractId}/upload/messages/${messageId}`, { method: "DELETE" }),

  getKeeperProfile: (contractId: string) =>
    req<{ who_they_are?: string; who_theyre_becoming?: string; what_you_want?: string; what_you_want_known?: string; advice?: string }>(`/contracts/${contractId}/upload/keeper-profile`),

  saveKeeperProfile: (contractId: string, p: Record<string, string | undefined>) =>
    req(`/contracts/${contractId}/upload/keeper-profile`, { method: "PUT", body: JSON.stringify(p) }),
};
