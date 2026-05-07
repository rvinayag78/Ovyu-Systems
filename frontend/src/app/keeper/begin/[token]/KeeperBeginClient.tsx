"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { api } from "@/lib/api";

const serif = "Georgia, serif";
const sans = "Helvetica Neue, Helvetica, Arial, sans-serif";

const inputStyle: React.CSSProperties = {
  height: "57px",
  background: "#fff",
  border: "1px solid #888",
  borderRadius: "10px",
  padding: "10px 14px",
  fontFamily: sans,
  fontSize: "14px",
  color: "#1a1a1a",
  boxSizing: "border-box",
  width: "100%",
  outline: "none",
};

const labelStyle: React.CSSProperties = {
  fontFamily: sans,
  fontWeight: 700,
  fontSize: "16px",
  color: "#444",
  display: "block",
  marginBottom: "8px",
};

export function KeeperBeginClient() {
  const router = useRouter();
  const paramsToken = useParams<{ token: string }>()?.token;
  // In Amplify static export, useParams returns the placeholder "_" not the real token.
  // Read from the actual URL like InviteClient does.
  const token =
    typeof window !== "undefined"
      ? window.location.pathname.split("/keeper/begin/")[1]?.split("/")[0] ?? paramsToken
      : paramsToken;

  const [makerName, setMakerName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fetchError, setFetchError] = useState("");

  useEffect(() => {
    if (!token) return;
    // Save invite token now in case user navigates away and comes back
    sessionStorage.setItem("ovyu_keeper_invite_token", token);
    api.getInvitePreview(token)
      .then(d => setMakerName(d.maker_name ?? ""))
      .catch(() => setFetchError("This invitation is invalid or has expired."));
  }, [token]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim() || !email.trim()) return;
    setError(""); setLoading(true);
    try {
      const result = await api.keeperBegin({
        invite_token: token,
        first_name: firstName.trim(),
        middle_name: middleName.trim() || undefined,
        last_name: lastName.trim(),
        email: email.trim(),
      });
      sessionStorage.setItem("ovyu_keeper_pending_email", result.email);
      router.push("/keeper/email-sent");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  if (fetchError) return (
    <div style={{ minWidth: "1920px", background: "#f8f7f5", display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Header variant="loggedOut" />
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <p style={{ fontFamily: sans, fontSize: "18px", color: "#B4372C", marginBottom: "16px" }}>{fetchError}</p>
          <a href="/" style={{ fontFamily: sans, fontSize: "14px", color: "#1a1a1a", textDecoration: "underline" }}>Return home</a>
        </div>
      </div>
      <Footer />
    </div>
  );

  return (
    <div style={{ minWidth: "1920px", background: "#f8f7f5", display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Header variant="loggedOut" />

      <div style={{ flex: 1 }}>
        <form
          onSubmit={handleSubmit}
          style={{
            margin: "239px auto 60px",
            width: "865px",
            display: "flex",
            flexDirection: "column",
            gap: "58px",
            alignItems: "center",
          }}
        >
          {/* Heading block */}
          <div style={{ textAlign: "center", width: "100%" }}>
            <p style={{
              fontFamily: serif, fontWeight: 400, fontSize: "64px",
              color: "#1a1a1a", margin: 0, lineHeight: "normal",
            }}>
              A private space, <em>just for you.</em>
            </p>
            <p style={{
              fontFamily: sans, fontWeight: 400, fontSize: "22px",
              color: "#8a6e30", margin: "16px 0 0",
            }}>
              Before you review what {makerName || "your Maker"} has set up, we&apos;ll set up your account.
            </p>
          </div>

          {/* Form grid */}
          <div style={{ position: "relative", height: "295px", width: "100%", flexShrink: 0 }}>
            {/* First name */}
            <div style={{ position: "absolute", left: 0, top: 0, width: "400px" }}>
              <label style={labelStyle}>First name</label>
              <input
                style={inputStyle}
                placeholder="First name"
                value={firstName}
                onChange={e => setFirstName(e.target.value)}
                required
              />
            </div>

            {/* Middle name */}
            <div style={{ position: "absolute", left: 0, top: "106px", width: "400px" }}>
              <label style={{ ...labelStyle, fontWeight: 400 }}>
                <span style={{ fontWeight: 700 }}>Middle name</span>{" "}
                <span style={{ color: "#888" }}>(if applicable)</span>
              </label>
              <input
                style={inputStyle}
                placeholder="Middle name(s) or N/A"
                value={middleName}
                onChange={e => setMiddleName(e.target.value)}
              />
            </div>

            {/* Last name */}
            <div style={{ position: "absolute", left: 0, top: "212px", width: "400px" }}>
              <label style={labelStyle}>Last name</label>
              <input
                style={inputStyle}
                placeholder="Last name"
                value={lastName}
                onChange={e => setLastName(e.target.value)}
                required
              />
            </div>

            {/* Email */}
            <div style={{ position: "absolute", left: "465px", top: 0, width: "400px" }}>
              <label style={labelStyle}>Your email</label>
              <input
                type="email"
                style={inputStyle}
                placeholder="you@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          {error && (
            <p style={{ fontFamily: sans, fontSize: "14px", color: "#B4372C", margin: 0, textAlign: "center" }}>{error}</p>
          )}

          {/* Submit button */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: "304px",
              height: "58px",
              background: loading ? "#666" : "#000",
              borderRadius: "8px",
              border: "none",
              fontFamily: sans,
              fontWeight: 700,
              fontSize: "16px",
              color: "#f5f0e8",
              cursor: loading ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            {loading ? "Sending…" : "Continue to verify email →"}
          </button>
        </form>
      </div>

      <Footer />
    </div>
  );
}
