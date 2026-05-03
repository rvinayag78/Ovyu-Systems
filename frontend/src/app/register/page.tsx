"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { api } from "@/lib/api";

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const raw = sessionStorage.getItem("ovyu_pending");
    const token = sessionStorage.getItem("ovyu_reg_token");
    if (!raw || !token) {
      router.replace("/signup");
      return;
    }
    setReady(true);
  }, [router]);

  async function handleContinue() {
    const regToken = sessionStorage.getItem("ovyu_reg_token");
    if (!regToken) { setError("Registration token missing. Please click the email link again."); return; }
    setError(""); setLoading(true);
    try {
      const result = await api.completeRegistration(regToken);
      sessionStorage.setItem("ovyu_session", result.session_token);
      sessionStorage.setItem("ovyu_maker_name", result.full_name);
      sessionStorage.setItem("ovyu_contract_id", result.contract_id);
      sessionStorage.removeItem("ovyu_reg_token");
      router.push("/plan");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed.");
    } finally {
      setLoading(false);
    }
  }

  if (!ready) return null;

  const initial = (() => {
    const raw = sessionStorage.getItem("ovyu_pending");
    if (!raw) return "?";
    try { return JSON.parse(raw).first_name?.[0] ?? "?"; } catch { return "?"; }
  })();

  return (
    <div className="ovyu-page">
      <Header variant="loggedIn" initial={initial} />
      <main className="ovyu-main" style={{ display: "flex", justifyContent: "center" }}>
        <div className="ovyu-verified">
          <div className="ovyu-verified__badge">✓</div>

          <div style={{ display: "flex", flexDirection: "column", gap: 42, alignItems: "center" }}>
            <h1 className="ovyu-verified__heading">
              Your email is verified.<br />
              <em>Let&apos;s review your contract.</em>
            </h1>
            <p className="ovyu-verified__body">
              You&apos;ll read through the terms you set, sign as the Maker, and then your Keeper
              will be invited to review and sign. Your upload doesn&apos;t begin until both of you
              have signed.
            </p>
            {error && <p className="ovyu-error-text">{error}</p>}
            <button
              className="ovyu-btn ovyu-btn--primary"
              onClick={handleContinue}
              disabled={loading}
              style={{ minWidth: 304 }}
            >
              {loading ? "Setting up…" : "Review my contract →"}
            </button>
            <p className="ovyu-verified__note">
              You can log in any time at ovyu.com with a link sent to your email.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
