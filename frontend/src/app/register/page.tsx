"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { api } from "@/lib/api";
import type { PendingReg } from "@/lib/api";

export default function RegisterPage() {
  const router = useRouter();
  const [pending, setPending] = useState<PendingReg | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const raw = sessionStorage.getItem("ovyu_pending");
    if (!raw) { router.replace("/signup"); return; }
    setPending(JSON.parse(raw));
  }, [router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!pending) return;
    const regToken = sessionStorage.getItem("ovyu_reg_token");
    if (!regToken) { setError("Registration token missing. Please click the email link again."); return; }
    setError(""); setLoading(true);
    try {
      const result = await api.completeRegistration(regToken);
      sessionStorage.setItem("ovyu_session", result.session_token);
      sessionStorage.setItem("ovyu_maker_name", result.full_name);
      sessionStorage.removeItem("ovyu_reg_token");
      router.push(`/contract/sign?id=${result.contract_id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed.");
    } finally {
      setLoading(false);
    }
  }

  if (!pending) return null;

  return (
    <div className="ovyu-page">
      <Header />
      <main className="ovyu-main" style={{ maxWidth: 560 }}>
        <div className="ovyu-page-header">
          <h1>Your email is verified.</h1>
          <span className="ovyu-sub">Review your details and continue to sign the contract.</span>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div className="ovyu-field">
            <label className="ovyu-field__label">Your name</label>
            <input className="ovyu-input" value={`${pending.first_name} ${pending.last_name}`} readOnly style={{ opacity: 0.6 }} />
          </div>
          <div className="ovyu-field">
            <label className="ovyu-field__label">Your email</label>
            <input className="ovyu-input" value={pending.maker_email} readOnly style={{ opacity: 0.6 }} />
          </div>
          <div className="ovyu-field">
            <label className="ovyu-field__label">Keeper</label>
            <input className="ovyu-input" value={`${pending.keeper_name} · ${pending.keeper_email}`} readOnly style={{ opacity: 0.6 }} />
          </div>
          {error && <p className="ovyu-error-text">{error}</p>}
          <div style={{ marginTop: 8 }}>
            <button type="submit" className="ovyu-btn ovyu-btn--primary"
              disabled={loading}>
              {loading ? "Setting up…" : "Continue to contract →"}
            </button>
          </div>
        </form>
      </main>
      <Footer />
    </div>
  );
}
