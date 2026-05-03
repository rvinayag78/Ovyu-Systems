"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { api } from "@/lib/api";

const RELATIONSHIPS = [
  "Partner / spouse", "Child", "Parent", "Sibling", "Close friend", "Other",
];

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
    <div className="ovyu-page">
      <Header />
      <main className="ovyu-main">
        <div className="ovyu-page-header">
          <h1><em>Let&apos;s </em>get started.</h1>
          <span className="ovyu-sub">A little about you and who this is for.</span>
        </div>

        <form onSubmit={handleSubmit} className="ovyu-begin-form">
          {/* Row 1 — About You */}
          <p className="ovyu-section-label">About You</p>
          <div className="ovyu-begin-row">
            <Field label="First name" placeholder="First name"
              value={firstName} onChange={setFirstName} required />
            <Field
              label={<>Middle name <span style={{ fontWeight: 400, color: "var(--ovyu-muted)" }}>(if applicable)</span></>}
              placeholder="Middle name(s) or N/A"
              value={middleName} onChange={setMiddleName} />
            <Field label="Last name" placeholder="Last name"
              value={lastName} onChange={setLastName} required />
            <Field label="Your email" placeholder="you@example.com" type="email"
              value={email} onChange={setEmail} required />
          </div>

          <div className="ovyu-begin-divider" />

          {/* Row 2 — Keeper */}
          <div className="ovyu-begin-keeper-grid">
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <Field label="Keeper's full name" placeholder="First, middle, and last name"
                value={keeperName} onChange={setKeeperName} required />
              <Field label="Keeper's email" placeholder="email@example.com" type="email"
                value={keeperEmail} onChange={setKeeperEmail} required />
            </div>

            <div>
              <div className="ovyu-field">
                <label className="ovyu-field__label">Your relationship to them</label>
                <div className="ovyu-select">
                  <select
                    className={`ovyu-select__native${!keeperRel ? " is-empty" : ""}`}
                    value={keeperRel}
                    onChange={e => setKeeperRel(e.target.value)}
                    required
                  >
                    <option value="" disabled>Select Relationship</option>
                    {RELATIONSHIPS.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                  <span className="ovyu-select__chev" aria-hidden="true">⌄</span>
                </div>
              </div>
            </div>

            <div className="ovyu-begin-awareness">
              <p className="ovyu-begin-awareness-label">Does the Keeper know about this?</p>
              <label className="ovyu-begin-checkbox-row">
                <button type="button"
                  className={`ovyu-begin-checkbox${!privately ? " is-checked" : ""}`}
                  onClick={() => setPrivately(false)}
                  aria-pressed={!privately}
                >
                  {!privately && "✓"}
                </button>
                Yes, they know and we&apos;re doing this together.
              </label>
              <label className="ovyu-begin-checkbox-row">
                <button type="button"
                  className={`ovyu-begin-checkbox${privately ? " is-checked" : ""}`}
                  onClick={() => setPrivately(true)}
                  aria-pressed={privately}
                >
                  {privately && "✓"}
                </button>
                No, this is something I&apos;m doing privately.
              </label>
            </div>
          </div>

          {/* TC callout — private path only */}
          {privately && (
            <div className="ovyu-tc-callout">
              <div className="ovyu-tc-callout__header">
                <p className="ovyu-tc-callout__title">Transfer Contact</p>
                <p className="ovyu-tc-callout__desc">
                  Because your Keeper isn&apos;t aware, we need someone you trust to confirm the
                  Transfer when the time comes. They will have no access to your upload.
                </p>
              </div>
              <div className="ovyu-tc-callout__fields">
                <div style={{ flex: 1 }}>
                  <Field label="Their name" placeholder="Full name"
                    value={tcName} onChange={setTcName} required />
                </div>
                <div style={{ flex: 1 }}>
                  <Field label="Their email" placeholder="you@example.com" type="email"
                    value={tcEmail} onChange={setTcEmail} required />
                </div>
              </div>
            </div>
          )}

          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 48, alignItems: "center", gap: 24 }}>
            {error && <p className="ovyu-error-text">{error}</p>}
            <button
              type="submit"
              className="ovyu-btn ovyu-btn--primary"
              disabled={loading || !canSubmit}
            >
              {loading ? "Sending…" : "Continue to verify email →"}
            </button>
          </div>
        </form>
      </main>
      <Footer />
    </div>
  );
}

function Field({
  label, placeholder, type = "text", value, onChange, required,
}: {
  label: React.ReactNode; placeholder: string; type?: string;
  value: string; onChange: (v: string) => void; required?: boolean;
}) {
  return (
    <div className="ovyu-field">
      <label className="ovyu-field__label">{label}</label>
      <input
        className="ovyu-input"
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
        required={required}
      />
    </div>
  );
}
