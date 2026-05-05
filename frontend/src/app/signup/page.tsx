"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
  padding: "0 10px",
  fontFamily: sans,
  fontWeight: 400,
  fontSize: "14px",
  color: "#1a1a1a",
  boxSizing: "border-box",
  width: "100%",
  outline: "none",
};

const RELATIONSHIPS = [
  "Partner / spouse", "Child", "Parent", "Sibling", "Close friend", "Other",
];

function LabeledInput({ label, placeholder, type = "text", value, onChange, width = 400 }: {
  label: string; placeholder: string; type?: string;
  value: string; onChange: (v: string) => void; width?: number;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px", width: `${width}px` }}>
      <label style={{ fontFamily: sans, fontWeight: 700, fontSize: "16px", color: "#444" }}>{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
        style={inputStyle}
      />
    </div>
  );
}

export default function SignupPage() {
  const router = useRouter();
  const [privately, setPrivately] = useState(false);

  const [firstName, setFirstName]     = useState("");
  const [middleName, setMiddleName]   = useState("");
  const [lastName, setLastName]       = useState("");
  const [email, setEmail]             = useState("");

  const [keeperName, setKeeperName]   = useState("");
  const [keeperEmail, setKeeperEmail] = useState("");
  const [keeperRel, setKeeperRel]     = useState("");

  const [tcName, setTcName]           = useState("");
  const [tcEmail, setTcEmail]         = useState("");

  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState("");

  const canSubmit =
    firstName && lastName && email &&
    keeperName && keeperEmail && keeperRel &&
    (!privately || (tcName && tcEmail));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    setError(""); setLoading(true);
    try {
      await api.beginRegistration({
        first_name: firstName.trim(),
        middle_name: middleName.trim() || undefined,
        last_name: lastName.trim(),
        maker_email: email.trim(),
        keeper_name: keeperName.trim(),
        keeper_email: keeperEmail.trim(),
        relationship: keeperRel,
        path: privately ? "private" : "aware",
        tc_name: privately ? tcName.trim() : undefined,
        tc_email: privately ? tcEmail.trim() : undefined,
      });
      sessionStorage.setItem("ovyu_pending_email", email.trim());
      router.push("/maker-email-sent");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ minWidth: "1920px", background: "#f8f7f5", display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Header variant="loggedOut" />
      <form onSubmit={handleSubmit} style={{ flex: 1 }}>
        <div style={{ position: "relative", margin: "138px auto 100px", width: "1800px", minHeight: "756px" }}>

          {/* H1 */}
          <div style={{ position: "absolute", top: "9px" }}>
            <h1 style={{ fontFamily: serif, fontSize: "64px", color: "#1a1a1a", whiteSpace: "nowrap", margin: 0, lineHeight: "normal" }}>
              <em style={{ fontWeight: 400 }}>Let&apos;s </em>
              <span style={{ fontStyle: "normal", fontWeight: 400 }}>get started.</span>
            </h1>
          </div>

          {/* Subtitle */}
          <div style={{ position: "absolute", top: "80px" }}>
            <p style={{ fontFamily: sans, fontWeight: 400, fontSize: "22px", color: "#444", margin: 0 }}>
              A little about you and who this is for.
            </p>
          </div>

          {/* Section label */}
          <div style={{ position: "absolute", top: "150px" }}>
            <p style={{ fontFamily: sans, fontWeight: 700, fontSize: "18px", color: "#c9a84c", margin: 0 }}>About You</p>
          </div>

          {/* Row 1 — 4 inputs */}
          <div style={{ position: "absolute", top: "185px" }}>
            <div style={{ position: "absolute", left: "0px" }}>
              <LabeledInput label="First name" placeholder="First name" value={firstName} onChange={setFirstName} />
            </div>
            <div style={{ position: "absolute", left: "414px" }}>
              <LabeledInput label="Middle name (if applicable)" placeholder="Middle name(s) or N/A" value={middleName} onChange={setMiddleName} />
            </div>
            <div style={{ position: "absolute", left: "828px" }}>
              <LabeledInput label="Last name" placeholder="Last name" value={lastName} onChange={setLastName} />
            </div>
            <div style={{ position: "absolute", left: "1242px" }}>
              <LabeledInput label="Your email" placeholder="you@example.com" type="email" value={email} onChange={setEmail} />
            </div>
          </div>

          {/* Divider */}
          <div style={{ position: "absolute", top: "317px", width: "1800px", height: "3px", background: "#e1e1e1" }} />

          {/* Keeper name */}
          <div style={{ position: "absolute", top: "351px", left: "0px" }}>
            <LabeledInput label="Keeper's full name" placeholder="First, middle, and last name" value={keeperName} onChange={setKeeperName} />
          </div>
          {/* Keeper email */}
          <div style={{ position: "absolute", top: "453px", left: "0px" }}>
            <LabeledInput label="Keeper's email" placeholder="email@example.com" type="email" value={keeperEmail} onChange={setKeeperEmail} />
          </div>

          {/* Relationship */}
          <div style={{ position: "absolute", top: "351px", left: "414px", display: "flex", flexDirection: "column", gap: "8px", width: "247px" }}>
            <label style={{ fontFamily: sans, fontWeight: 700, fontSize: "16px", color: "#444" }}>Your relationship to them</label>
            <div style={{ position: "relative", height: "57px" }}>
              <select
                value={keeperRel}
                onChange={e => setKeeperRel(e.target.value)}
                required
                style={{
                  ...inputStyle,
                  height: "57px",
                  appearance: "none",
                  paddingRight: "32px",
                  color: keeperRel ? "#1a1a1a" : "#888",
                  borderRadius: "8px",
                }}
              >
                <option value="" disabled>Select Relationship</option>
                {RELATIONSHIPS.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
              <span style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: "#888", fontSize: "14px" }}>⌄</span>
            </div>
          </div>

          {/* Awareness checkboxes */}
          <div style={{ position: "absolute", top: "351px", left: "696px" }}>
            <p style={{ fontFamily: sans, fontWeight: 700, fontSize: "16px", color: "#444", margin: "0 0 12px 0" }}>
              Does the Keeper know about this?
            </p>
            <div
              style={{ display: "flex", flexDirection: "row", gap: "10px", alignItems: "center", marginBottom: "12px", cursor: "pointer" }}
              onClick={() => setPrivately(false)}
            >
              <div style={{
                width: "24px", height: "24px",
                background: !privately ? "#444" : "#fff",
                border: privately ? "1px solid #888" : "none",
                borderRadius: "4px", flexShrink: 0,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontFamily: sans, fontSize: "14px", color: "#f5f0e8",
              }}>{!privately ? "✓" : ""}</div>
              <span style={{ fontFamily: sans, fontWeight: 400, fontSize: "14px", color: "#444" }}>
                Yes, they know and we&apos;re doing this together.
              </span>
            </div>
            <div
              style={{ display: "flex", flexDirection: "row", gap: "10px", alignItems: "center", cursor: "pointer" }}
              onClick={() => setPrivately(true)}
            >
              <div style={{
                width: "24px", height: "24px",
                background: privately ? "#444" : "#fff",
                border: !privately ? "1px solid #888" : "none",
                borderRadius: "4px", flexShrink: 0,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontFamily: sans, fontSize: "14px", color: "#f5f0e8",
              }}>{privately ? "✓" : ""}</div>
              <span style={{ fontFamily: sans, fontWeight: 400, fontSize: "14px", color: "#444" }}>
                No, this is something I&apos;m doing privately.
              </span>
            </div>
          </div>

          {/* TC Callout — starts right below checkboxes, extends to right edge (1800px) */}
          {privately && (
            <div style={{
              position: "absolute", left: "696px", top: "451px",
              width: "1104px", background: "#f5edd6",
              border: "1.667px solid #c9a84c", borderRadius: "13px",
              padding: "20px 30px", display: "flex", flexDirection: "column",
              gap: "14px", boxSizing: "border-box",
            }}>
              <p style={{ fontFamily: sans, fontWeight: 700, fontSize: "20px", color: "#444", margin: 0 }}>Transfer Contact</p>
              <p style={{ fontFamily: sans, fontStyle: "italic", fontWeight: 400, fontSize: "14px", color: "#000", margin: 0 }}>
                The person who will let Ovyu know when you pass. They do not need to know about Ovyu now.
              </p>
              <div style={{ display: "flex", flexDirection: "row", gap: "45px" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px", flex: 1 }}>
                  <label style={{ fontFamily: sans, fontWeight: 700, fontSize: "16px", color: "#444" }}>Their name</label>
                  <input placeholder="Full name" value={tcName} onChange={e => setTcName(e.target.value)} style={inputStyle} />
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px", flex: 1 }}>
                  <label style={{ fontFamily: sans, fontWeight: 700, fontSize: "16px", color: "#444" }}>Their email</label>
                  <input type="email" placeholder="you@example.com" value={tcEmail} onChange={e => setTcEmail(e.target.value)} style={inputStyle} />
                </div>
              </div>
            </div>
          )}

          {/* Error + Continue button — bottom of page, right-aligned */}
          <div style={{ position: "absolute", left: "1496px", top: "710px", display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "8px" }}>
            {error && <p style={{ fontFamily: sans, fontSize: "14px", color: "#B4372C", margin: 0 }}>{error}</p>}
            <button
              type="submit"
              disabled={loading || !canSubmit}
              style={{
                width: "304px", height: "48px",
                background: loading || !canSubmit ? "#666" : "#000",
                borderRadius: "8px", border: "none",
                fontFamily: sans, fontWeight: 700, fontSize: "16px",
                color: "#f5f0e8", cursor: loading || !canSubmit ? "not-allowed" : "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}
            >
              {loading ? "Sending…" : "Continue to verify email →"}
            </button>
          </div>
        </div>

      </form>
      <Footer />
    </div>
  );
}
