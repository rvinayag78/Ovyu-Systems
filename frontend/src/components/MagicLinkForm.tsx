"use client";

import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { api } from "@/lib/api";

const serif = "Georgia, serif";
const sans = "Helvetica Neue, Helvetica, Arial, sans-serif";

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
    : "Enter your email. We'll send you a link to sign in.";
  const btnLabel = isTC ? "Send Transfer link" : "Send me a link";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setError("");
    setLoading(true);
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
      <div style={{ minWidth: "1920px", minHeight: "100vh", background: "#f8f7f5", display: "flex", flexDirection: "column" }}>
        <Header />
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", paddingTop: "214px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "25px", alignItems: "center" }}>
            <p style={{ fontFamily: serif, fontWeight: 400, fontSize: "88px", color: "#1a1a1a", margin: 0, lineHeight: "normal" }}>
              Check your inbox.
            </p>
            <p style={{ fontFamily: sans, fontWeight: 400, fontSize: "22px", color: "#444", margin: 0, lineHeight: "normal" }}>
              If <strong>{email}</strong> is registered, you&apos;ll receive a link shortly. It expires in 15 minutes.
            </p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div style={{ minWidth: "1920px", minHeight: "100vh", background: "#f8f7f5", display: "flex", flexDirection: "column" }}>
      <Header />

      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", paddingTop: "214px" }}>
        {/* Title + subtitle */}
        <div style={{ display: "flex", flexDirection: "column", gap: "25px", alignItems: "center", marginBottom: "112px" }}>
          <p style={{ fontFamily: serif, fontWeight: 400, fontSize: "88px", color: "#1a1a1a", margin: 0, lineHeight: "normal" }}>
            {heading}
          </p>
          <p style={{ fontFamily: sans, fontWeight: 400, fontSize: "22px", color: "#444", margin: 0, lineHeight: "normal" }}>
            {sub}
          </p>
        </div>

        {/* Card */}
        <div style={{
          width: "752px",
          height: "332px",
          background: "#fff",
          border: "2px solid #e1e1e1",
          borderRadius: "12px",
          position: "relative",
        }}>
          <form
            onSubmit={handleSubmit}
            style={{
              position: "absolute",
              left: "80px",
              top: "65px",
              width: "593px",
            }}
          >
            {/* Label + input */}
            <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "6px" }}>
              <label
                htmlFor="email"
                style={{ fontFamily: sans, fontWeight: 700, fontSize: "18px", color: "#444", lineHeight: "normal" }}
              >
                Email address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                autoFocus
                style={{
                  width: "100%",
                  height: "57px",
                  border: "1px solid #888",
                  borderRadius: "10px",
                  padding: "0 10px",
                  fontFamily: sans,
                  fontWeight: 400,
                  fontSize: "16px",
                  color: "#1a1a1a",
                  background: "#fff",
                  boxSizing: "border-box",
                  outline: "none",
                }}
              />
            </div>

            {error && (
              <p style={{ fontFamily: sans, fontSize: "14px", color: "#B4372C", margin: "0 0 6px" }}>{error}</p>
            )}

            {/* Send button */}
            <button
              type="submit"
              disabled={loading || !email.trim()}
              style={{
                width: "590px",
                height: "70px",
                background: loading || !email.trim() ? "#888" : "#1a1a1a",
                borderRadius: "8px",
                border: "none",
                cursor: loading || !email.trim() ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span style={{ fontFamily: sans, fontWeight: 700, fontSize: "22px", color: "#f5f0e8" }}>
                {loading ? "Sending…" : btnLabel}
              </span>
            </button>

            {/* Hint text */}
            <p style={{
              fontFamily: sans,
              fontStyle: "oblique",
              fontSize: "16px",
              color: "#888",
              textAlign: "center",
              margin: "12px 0 0",
              lineHeight: "normal",
            }}>
              Your account is private. Only you can access your information.
            </p>
          </form>
        </div>
      </div>

      <Footer />
    </div>
  );
}
