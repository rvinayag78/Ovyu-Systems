"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import type { PendingReg } from "@/lib/api";

export default function RegisterPage() {
  const router = useRouter();
  const [pending, setPending] = useState<PendingReg | null>(null);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const raw = sessionStorage.getItem("ovyu_pending");
    if (!raw) { router.replace("/contract/new"); return; }
    setPending(JSON.parse(raw));
  }, [router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!pending || password.length < 8) return;
    setError(""); setLoading(true);
    try {
      // Cognito sign-up + sign-in, then create contract
      // For now redirect to contract creation — wired up when Cognito is live
      router.push("/contract/sign?demo=1");
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
          <h1>Create your account.</h1>
          <span className="ovyu-sub">Your email is verified. Set a password to continue.</span>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div className="ovyu-field">
            <label className="ovyu-field__label">Email</label>
            <input className="ovyu-input" value={pending.maker_email} readOnly style={{ opacity: 0.6 }} />
          </div>
          <div className="ovyu-field">
            <label className="ovyu-field__label" htmlFor="password">Password</label>
            <span className="ovyu-field__helper">At least 8 characters.</span>
            <input id="password" type="password" className="ovyu-input" value={password}
              onChange={e => setPassword(e.target.value)} placeholder="••••••••" required minLength={8} />
          </div>
          {error && <p className="ovyu-error-text">{error}</p>}
          <div style={{ marginTop: 8 }}>
            <button type="submit" className="ovyu-btn ovyu-btn--primary"
              disabled={loading || password.length < 8}>
              {loading ? "Creating account…" : "Create account and review contract →"}
            </button>
          </div>
        </form>
      </main>
      <Footer />
    </div>
  );
}
