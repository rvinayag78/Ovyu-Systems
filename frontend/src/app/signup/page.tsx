"use client";

import { useState } from "react";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { api } from "@/lib/api";

const RELATIONSHIPS = ["Partner / spouse", "Child", "Parent", "Sibling", "Close friend", "Other"];

export default function NewContractPage() {
  const [path, setPath] = useState<"aware" | "private">("aware");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [keeperFirst, setKeeperFirst] = useState("");
  const [keeperLast, setKeeperLast] = useState("");
  const [keeperEmail, setKeeperEmail] = useState("");
  const [keeperRel, setKeeperRel] = useState("");
  const [tcFirst, setTcFirst] = useState("");
  const [tcLast, setTcLast] = useState("");
  const [tcEmail, setTcEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const isPrivate = path === "private";
  const canSubmit = firstName && lastName && email && keeperFirst && keeperLast && keeperEmail && keeperRel
    && (!isPrivate || (tcFirst && tcLast && tcEmail));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    setError(""); setLoading(true);
    try {
      await api.beginRegistration({
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        maker_email: email.trim(),
        keeper_name: `${keeperFirst.trim()} ${keeperLast.trim()}`,
        keeper_email: keeperEmail.trim(),
        relationship: keeperRel,
        path,
        tc_name: isPrivate ? `${tcFirst.trim()} ${tcLast.trim()}` : undefined,
        tc_email: isPrivate ? tcEmail.trim() : undefined,
      });
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
              We sent a verification link to <strong>{email}</strong>.
              Click it to confirm your email and continue.
            </p>
            <p style={{ fontSize: 14, color: "var(--ovyu-muted)" }}>
              The link expires in 24 hours. Check your spam folder if you don&apos;t see it.
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
      <main className="ovyu-main">
        <div className="ovyu-page-header">
          <h1>Let&apos;s get started.</h1>
          <span className="ovyu-sub">
            Tell us about yourself and the one person you&apos;d like Ovyu to be for.
          </span>
        </div>

        <form onSubmit={handleSubmit} className="ovyu-form-grid">
          {/* Left — About you */}
          <section className="ovyu-form-section">
            <p className="ovyu-section-label">About you</p>

            <div className="ovyu-field">
              <label className="ovyu-field__label" htmlFor="firstName">First name</label>
              <input id="firstName" className="ovyu-input" value={firstName} onChange={e => setFirstName(e.target.value)} placeholder="First name" required />
            </div>
            <div className="ovyu-field">
              <label className="ovyu-field__label" htmlFor="lastName">Last name</label>
              <input id="lastName" className="ovyu-input" value={lastName} onChange={e => setLastName(e.target.value)} placeholder="Last name" required />
            </div>
            <div className="ovyu-field">
              <label className="ovyu-field__label" htmlFor="email">Your email</label>
              <span className="ovyu-field__helper">We&apos;ll send a verification link before going further.</span>
              <input id="email" type="email" className="ovyu-input" value={email} onChange={e => setEmail(e.target.value)} placeholder="rae@example.com" required />
            </div>
          </section>

          {/* Right — Who is this for */}
          <section className="ovyu-form-section">
            <p className="ovyu-section-label">Who is this for?</p>

            <div className="ovyu-field">
              <label className="ovyu-field__label">Does the Keeper know about this?</label>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {(["aware", "private"] as const).map(v => (
                  <button key={v} type="button"
                    className={`ovyu-checkcard${path === v ? " is-selected" : ""}`}
                    onClick={() => setPath(v)}
                  >
                    <span className="ovyu-checkcard__dot">
                      {path === v && <span className="ovyu-checkcard__dot-fill" />}
                    </span>
                    {v === "aware" ? "Yes, they know and we're doing this together." : "No, this is something I'm doing privately for them."}
                  </button>
                ))}
              </div>
            </div>

            <div className="ovyu-field">
              <label className="ovyu-field__label" htmlFor="keeperFirst">Their first name</label>
              <input id="keeperFirst" className="ovyu-input" value={keeperFirst} onChange={e => setKeeperFirst(e.target.value)} placeholder="First name" required />
            </div>
            <div className="ovyu-field">
              <label className="ovyu-field__label" htmlFor="keeperLast">Their last name</label>
              <input id="keeperLast" className="ovyu-input" value={keeperLast} onChange={e => setKeeperLast(e.target.value)} placeholder="Last name" required />
            </div>
            <div className="ovyu-field">
              <label className="ovyu-field__label" htmlFor="keeperEmail">Their email</label>
              <span className="ovyu-field__helper">
                {isPrivate ? "We will not contact them now. We need this to deliver Ovyu at the Transfer." : "They'll receive a contract to review and sign."}
              </span>
              <input id="keeperEmail" type="email" className="ovyu-input" value={keeperEmail} onChange={e => setKeeperEmail(e.target.value)} placeholder="sam@example.com" required />
            </div>
            <div className="ovyu-field">
              <label className="ovyu-field__label" htmlFor="keeperRel">Your relationship to them</label>
              <div className="ovyu-select">
                <select id="keeperRel" className={`ovyu-select__native${!keeperRel ? " is-empty" : ""}`}
                  value={keeperRel} onChange={e => setKeeperRel(e.target.value)} required>
                  <option value="" disabled>Select relationship</option>
                  {RELATIONSHIPS.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
                <span className="ovyu-select__chev" aria-hidden="true">⌄</span>
              </div>
            </div>
          </section>

          {/* TC block — private path only */}
          {isPrivate && (
            <>
              <div style={{ gridColumn: "1 / -1", height: 3, background: "var(--ovyu-border)" }} />
              <section className="ovyu-form-section" style={{ gridColumn: "1 / -1" }}>
                <p className="ovyu-section-label">Transfer Contact</p>
                <div className="ovyu-callout">
                  <p className="ovyu-callout__body">
                    Because your Keeper is not aware, we need someone you trust to confirm the Transfer
                    when you pass. They will not have access to your upload.
                  </p>
                </div>
              </section>
              <section className="ovyu-form-section">
                <div className="ovyu-field">
                  <label className="ovyu-field__label" htmlFor="tcFirst">Their first name</label>
                  <input id="tcFirst" className="ovyu-input" value={tcFirst} onChange={e => setTcFirst(e.target.value)} placeholder="First name" required />
                </div>
                <div className="ovyu-field">
                  <label className="ovyu-field__label" htmlFor="tcLast">Their last name</label>
                  <input id="tcLast" className="ovyu-input" value={tcLast} onChange={e => setTcLast(e.target.value)} placeholder="Last name" required />
                </div>
              </section>
              <section className="ovyu-form-section">
                <div className="ovyu-field">
                  <label className="ovyu-field__label" htmlFor="tcEmail">Their email</label>
                  <span className="ovyu-field__helper">They&apos;ll receive a contract describing only their role.</span>
                  <input id="tcEmail" type="email" className="ovyu-input" value={tcEmail} onChange={e => setTcEmail(e.target.value)} placeholder="jordan@example.com" required />
                </div>
              </section>
            </>
          )}

          <div style={{ gridColumn: "1 / -1", display: "flex", justifyContent: "flex-end", marginTop: 24 }}>
            {error && <p className="ovyu-error-text" style={{ marginRight: "auto" }}>{error}</p>}
            <button type="submit" className="ovyu-btn ovyu-btn--primary" disabled={loading || !canSubmit}>
              {loading ? "Sending…" : "Continue to verify email →"}
            </button>
          </div>
        </form>
      </main>
      <Footer />
    </div>
  );
}
