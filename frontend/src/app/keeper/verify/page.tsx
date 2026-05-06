"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { api } from "@/lib/api";

const sans = "Helvetica Neue, Helvetica, Arial, sans-serif";

function KeeperVerifyInner() {
  const router = useRouter();
  const params = useSearchParams();
  const [error, setError] = useState("");
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;
    const token = params.get("token");
    if (!token) { setError("No verification token provided."); return; }

    api.keeperVerify(token)
      .then(data => {
        sessionStorage.setItem("ovyu_session", data.session_token);
        sessionStorage.setItem("ovyu_contract_id", data.contract_id);
        sessionStorage.setItem("ovyu_keeper_name", data.keeper_name);
        sessionStorage.setItem("ovyu_maker_name_for_keeper", data.maker_name);
        sessionStorage.setItem("ovyu_keeper_invite_token", data.invite_token);
        router.replace("/keeper/register");
      })
      .catch(err => setError(err instanceof Error ? err.message : "Link invalid or expired."));
  }, [params, router]);

  if (error) return (
    <div style={{ minWidth: "1920px", background: "#f8f7f5", display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Header variant="loggedOut" />
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <p style={{ fontFamily: sans, fontSize: "18px", color: "#B4372C", marginBottom: "16px" }}>{error}</p>
          <a href="/" style={{ fontFamily: sans, fontSize: "14px", color: "#1a1a1a", textDecoration: "underline" }}>Return home</a>
        </div>
      </div>
      <Footer />
    </div>
  );

  return (
    <div style={{ minWidth: "1920px", background: "#f8f7f5", display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Header variant="loggedOut" />
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ fontFamily: sans, fontSize: "18px", color: "#888" }}>Verifying your email…</p>
      </div>
      <Footer />
    </div>
  );
}

export default function KeeperVerifyPage() {
  return (
    <Suspense fallback={
      <div style={{ minWidth: "1920px", background: "#f8f7f5", display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        <Header variant="loggedOut" />
        <div style={{ flex: 1 }} />
        <Footer />
      </div>
    }>
      <KeeperVerifyInner />
    </Suspense>
  );
}
