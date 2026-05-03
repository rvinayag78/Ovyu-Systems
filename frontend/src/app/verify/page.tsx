"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { api } from "@/lib/api";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const sans = "Helvetica Neue, Helvetica, Arial, sans-serif";

function VerifyInner() {
  const router = useRouter();
  const params = useSearchParams();
  const [error, setError] = useState("");

  useEffect(() => {
    const token = params.get("token");
    if (!token) { setError("No token provided."); return; }
    api.verifyToken(token)
      .then(data => {
        sessionStorage.setItem("ovyu_pending", JSON.stringify(data));
        sessionStorage.setItem("ovyu_reg_token", token);
        router.replace("/register");
      })
      .catch(err => setError(err instanceof Error ? err.message : "Link invalid or expired."));
  }, [params, router]);

  if (error) return (
    <div style={{ minWidth: "1920px", background: "#f8f7f5", display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Header variant="loggedOut" />
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <p style={{ fontFamily: sans, fontSize: "18px", color: "#B4372C", marginBottom: "16px" }}>{error}</p>
          <a href="/signup" style={{ fontFamily: sans, fontSize: "14px", color: "#1a1a1a", textDecoration: "underline" }}>Start over</a>
        </div>
      </div>
      <Footer />
    </div>
  );

  return (
    <div style={{ minWidth: "1920px", background: "#f8f7f5", display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Header variant="loggedOut" />
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ fontFamily: sans, fontSize: "18px", color: "#888" }}>Verifying…</p>
      </div>
      <Footer />
    </div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense fallback={
      <div style={{ minWidth: "1920px", background: "#f8f7f5", display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        <Header variant="loggedOut" />
        <div style={{ flex: 1 }} />
        <Footer />
      </div>
    }>
      <VerifyInner />
    </Suspense>
  );
}
