"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { api } from "@/lib/api";

const serif = "Georgia, serif";
const sans = "Helvetica Neue, Helvetica, Arial, sans-serif";

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [ready, setReady] = useState(false);
  const [initial, setInitial] = useState("?");

  useEffect(() => {
    const raw = sessionStorage.getItem("ovyu_pending");
    const token = sessionStorage.getItem("ovyu_reg_token");
    if (!raw || !token) {
      router.replace("/signup");
      return;
    }
    try { setInitial(JSON.parse(raw).first_name?.[0] ?? "?"); } catch { /* ok */ }
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

  return (
    <div style={{ minWidth: "1920px", background: "#f8f7f5", display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Header variant="loggedIn" initial={initial} />
      <div style={{ position: "relative", flex: 1, minHeight: "874px" }}>
        {/* Content at left:575px, top:135px (238-103) */}
        <div style={{
          position: "absolute",
          left: "575px",
          top: "135px",
          width: "770px",
          display: "flex",
          flexDirection: "column",
          gap: "47px",
          alignItems: "center",
        }}>
          {/* Purple checkmark circle */}
          <div style={{
            width: "123px", height: "123px",
            background: "#4b3c5e", borderRadius: "50%",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <span style={{ fontFamily: serif, fontStyle: "italic", fontWeight: 400, fontSize: "64px", color: "#fff" }}>✓</span>
          </div>

          {/* Text block */}
          <div style={{ display: "flex", flexDirection: "column", gap: "42px", alignItems: "center", width: "100%" }}>
            <div style={{ textAlign: "center" }}>
              <p style={{ fontFamily: serif, fontWeight: 400, fontSize: "64px", color: "#1a1a1a", margin: 0, lineHeight: "normal" }}>
                Your email is verified.
              </p>
              <p style={{ fontFamily: serif, fontStyle: "italic", fontWeight: 400, fontSize: "64px", color: "#1a1a1a", margin: 0, lineHeight: "normal" }}>
                Let&apos;s review your contract.
              </p>
            </div>

            <p style={{ fontFamily: sans, fontWeight: 400, fontSize: "22px", color: "#444", textAlign: "center", margin: 0 }}>
              Your account is set up. Read through your contract carefully, then sign to lock everything in place.
            </p>

            {error && <p style={{ fontFamily: sans, fontSize: "14px", color: "#B4372C", margin: 0, textAlign: "center" }}>{error}</p>}

            <button
              onClick={handleContinue}
              disabled={loading}
              style={{
                width: "304px", height: "48px",
                background: loading ? "#666" : "#000",
                borderRadius: "8px", border: "none",
                fontFamily: sans, fontWeight: 700, fontSize: "16px",
                color: "#f5f0e8", cursor: loading ? "not-allowed" : "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}
            >
              {loading ? "Setting up…" : "Review my contract →"}
            </button>

            <p style={{ fontFamily: sans, fontStyle: "italic", fontWeight: 400, fontSize: "16px", color: "#444", textAlign: "center", margin: 0 }}>
              Once both you and your Keeper have signed, the contract is locked and you can begin your upload.
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
