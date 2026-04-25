"use client";

import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { api } from "@/lib/api";

interface Props {
  mode: "login" | "tc";
}

export function MagicLinkForm({ mode }: Props) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  const isTC = mode === "tc";

  const heading = isTC ? "Activate Transfer." : "Welcome back.";
  const sub = isTC
    ? "Enter your email. If you've been named a Transfer Contact, we'll send you a link to begin."
    : "Enter your email and we'll send you a sign-in link.";
  const btnLabel = isTC ? "Send Transfer link →" : "Send confirmation link →";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setError(""); setLoading(true);
    try {
      await api.requestMagicLink(email.trim(), mode);
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <div className="ovyu-page">
        <Header />
        <main className="ovyu-main" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ maxWidth: 520, textAlign: "center" }}>
            <h1 style={{ fontFamily: "var(--ovyu-font-serif)", fontSize: "clamp(32px,4vw,52px)", lineHeight: 1.05, marginBottom: 20 }}>
              Check your inbox.
            </h1>
            <p style={{ fontSize: 18, color: "var(--ovyu-ink-soft)", lineHeight: 1.55, marginBottom: 12 }}>
              If <strong>{email}</strong> is registered, you'll receive a link shortly.
            </p>
            <p style={{ fontSize: 14, color: "var(--ovyu-muted)" }}>
              The link expires in 15 minutes and can only be used once.
            </p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="ovyu-page">
      <Header />
      <main className="ovyu-main" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ maxWidth: 480, width: "100%" }}>
          <div style={{ marginBottom: 40 }}>
            <h1 style={{ fontFamily: "var(--ovyu-font-serif)", fontSize: "clamp(32px,4vw,52px)", lineHeight: 1.05, marginBottom: 12 }}>
              {heading}
            </h1>
            <p style={{ fontSize: 17, color: "var(--ovyu-ink-soft)", lineHeight: 1.55 }}>{sub}</p>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="ovyu-field" style={{ marginBottom: 24 }}>
              <label className="ovyu-field__label" htmlFor="email">Email address</label>
              <input
                id="email"
                type="email"
                className="ovyu-input"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                autoFocus
              />
            </div>
            {error && <p className="ovyu-error-text" style={{ marginBottom: 16 }}>{error}</p>}
            <button
              type="submit"
              className="ovyu-btn ovyu-btn--primary"
              disabled={loading || !email.trim()}
              style={{ width: "100%" }}
            >
              {loading ? "Sending…" : btnLabel}
            </button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}
