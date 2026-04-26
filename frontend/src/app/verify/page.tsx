"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { api } from "@/lib/api";

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
    <div style={{ minHeight: "100vh", background: "var(--ovyu-cream)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ textAlign: "center", maxWidth: 400 }}>
        <p style={{ color: "var(--ovyu-error)", marginBottom: 16 }}>{error}</p>
        <a href="/contract/new" style={{ fontSize: 14, color: "var(--ovyu-ink)", textDecoration: "underline" }}>Start over</a>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: "var(--ovyu-cream)", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <p style={{ color: "var(--ovyu-muted)" }}>Verifying…</p>
    </div>
  );
}

export default function VerifyPage() {
  return <Suspense fallback={<div style={{ minHeight: "100vh", background: "var(--ovyu-cream)" }} />}><VerifyInner /></Suspense>;
}
