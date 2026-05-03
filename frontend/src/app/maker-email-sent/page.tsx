"use client";

import { useEffect, useState } from "react";

const serif = "Georgia, serif";
const sans = "Helvetica Neue, Helvetica, Arial, sans-serif";

export default function MakerEmailSentPage() {
  const [email, setEmail] = useState("");

  useEffect(() => {
    const stored = sessionStorage.getItem("ovyu_pending_email");
    if (stored) setEmail(stored);
  }, []);

  return (
    <div style={{ minWidth: "1920px", background: "#f8f7f5", display: "flex", flexDirection: "column", minHeight: "100vh", alignItems: "center", justifyContent: "center" }}>
      {/* Email preview card */}
      <div style={{ width: "600px", boxShadow: "0 4px 32px rgba(0,0,0,0.12)", borderRadius: "8px", overflow: "hidden" }}>
        {/* Black header band */}
        <div style={{ background: "#1a1a1a", padding: "32px 48px", display: "flex", alignItems: "center" }}>
          <span style={{ fontFamily: serif, fontWeight: 700, fontSize: "64px", color: "#fff" }}>
            ov<em>yu</em>
          </span>
        </div>

        {/* Email body */}
        <div style={{ background: "#fff", padding: "48px" }}>
          <h1 style={{ fontFamily: serif, fontWeight: 400, fontSize: "32px", color: "#1a1a1a", margin: "0 0 16px" }}>
            <em>Confirm</em> your email address
          </h1>
          <p style={{ fontFamily: sans, fontSize: "18px", color: "#444", margin: "0 0 16px" }}>
            You&apos;re one step away from starting your Ovyu.
          </p>
          <p style={{ fontFamily: sans, fontSize: "16px", color: "#444", lineHeight: "1.6", margin: "0 0 24px" }}>
            Click the button below to verify your email. This link expires in 24 hours.
            If you didn&apos;t create an Ovyu account, you can safely ignore this email.
            {email && (
              <> We sent it to <strong>{email}</strong>.</>
            )}
          </p>
          <p style={{ fontFamily: sans, fontSize: "13px", color: "#888", margin: "0 0 24px" }}>
            By continuing you agree to Ovyu&apos;s Terms of Use and Privacy Policy.
          </p>
          <button
            disabled
            title="Check your actual inbox and click the link in the email"
            style={{
              display: "block", width: "100%", height: "56px",
              background: "#c9a84c", border: "none", borderRadius: "8px",
              fontFamily: sans, fontWeight: 700, fontSize: "18px", color: "#fff",
              cursor: "not-allowed", opacity: 0.7, marginBottom: "24px",
            }}
          >
            Verify my email
          </button>
          <p style={{ fontFamily: sans, fontSize: "13px", color: "#888", margin: 0 }}>
            Check your inbox for the real link. This page is a preview of the email we sent.
          </p>
        </div>

        {/* Footer band */}
        <div style={{ background: "#1a1a1a", padding: "20px 48px", fontFamily: sans, fontSize: "13px", color: "#888", textAlign: "center" }}>
          ovyu.com &nbsp;·&nbsp; This is a transactional email. You are receiving this because you created an account.
        </div>
      </div>
    </div>
  );
}
