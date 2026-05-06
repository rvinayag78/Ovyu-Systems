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
};
