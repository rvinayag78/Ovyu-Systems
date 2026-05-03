"use client";

import { useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { api } from "@/lib/api";

const sans = "Helvetica Neue, Helvetica, Arial, sans-serif";

const STAGE_ROUTES: Record<string, (contractId: string | null) => string> = {
  no_contract: () => "/signup",
  unsigned: (id) => id ? `/contract/sign?id=${id}` : "/signup",
  awaiting_other: () => "/contracts",
  ready_to_upload: () => "/contracts",
  active: () => "/contracts",
};

export function VerifyClient() {
  const params = useSearchParams();
  const router = useRouter();
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;
    const token = params.get("token");
    if (!token) { router.replace("/login"); return; }

    api.verifyMagicLink(token).then(result => {
      sessionStorage.setItem("ovyu_session", result.session_token);
      sessionStorage.setItem("ovyu_role", result.role);
      if (result.full_name) sessionStorage.setItem("ovyu_maker_name", result.full_name);
      if (result.contract_id) sessionStorage.setItem("ovyu_contract_id", result.contract_id);

      if (result.role === "tc") {
        router.replace("/activate-transfer/coming-soon");
        return;
      }
      if (result.role === "keeper") {
        router.replace("/contracts");
        return;
      }

      const stage = result.maker_stage ?? "no_contract";
      const dest = STAGE_ROUTES[stage]?.(result.contract_id) ?? "/signup";
      router.replace(dest);
    }).catch(() => {
      router.replace("/login?error=invalid_link");
    });
  }, [params, router]);

  return (
    <div style={{ minWidth: "1920px", background: "#f8f7f5", display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Header variant="loggedOut" />
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ fontFamily: sans, fontSize: "18px", color: "#888" }}>Signing you in…</p>
      </div>
      <Footer />
    </div>
  );
}
