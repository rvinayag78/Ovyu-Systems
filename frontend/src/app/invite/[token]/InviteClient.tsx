"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { api } from "@/lib/api";

function normalize(s: string) { return s.trim().toLowerCase().normalize("NFC"); }

type Preview = { invitee_role: "keeper" | "tc"; maker_name: string; keeper_name: string; tc_name: string; relationship: string; contract_id: string };

export function InviteClient() {
  const paramsToken = useParams<{ token: string }>()?.token;
  const token = typeof window !== "undefined"
    ? window.location.pathname.split("/invite/")[1]?.split("/")[0] ?? paramsToken
    : paramsToken;

  const [preview, setPreview] = useState<Preview | null>(null);
  const [fetchError, setFetchError] = useState("");
  const [typedName, setTypedName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [accepted, setAccepted] = useState(false);

  useEffect(() => {
    if (!token || token === "_") return;
    api.getInvitePreview(token)
      .then(d => setPreview(d as Preview))
      .catch(err => setFetchError(err instanceof Error ? err.message : "Invalid or expired invitation."));
  }, [token]);

  if (fetchError) return (
    <div className="ovyu-page"><Header />
      <main className="ovyu-main" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <p style={{ color: "var(--ovyu-error)", marginBottom: 12 }}>{fetchError}</p>
          <a href="/" style={{ fontSize: 14, textDecoration: "underline" }}>Return home</a>
        </div>
      </main><Footer />
    </div>
  );

  if (!preview) return (
    <div className="ovyu-page"><Header />
      <main className="ovyu-main" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ color: "var(--ovyu-muted)" }}>Loading invitation…</p>
      </main><Footer />
    </div>
  );

  const isKeeper = preview.invitee_role === "keeper";
  const canonicalName = isKeeper ? preview.keeper_name : preview.tc_name;
  const nameMatch = canonicalName ? normalize(typedName) === normalize(canonicalName) : false;
  const today = new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });

  async function handleAccept(e: React.FormEvent) {
    e.preventDefault();
    if (!nameMatch) return;
    setError(""); setLoading(true);
    try {
      await api.acceptInvitation(token, typedName);
      setAccepted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Acceptance failed.");
    } finally {
      setLoading(false);
    }
  }

  // ── TC Signed confirmation (Figma 142:770) ──────────────────
  if (accepted && !isKeeper) return (
    <div className="ovyu-page">
      <Header />
      <main className="ovyu-main" style={{ display: "flex", alignItems: "flex-start", justifyContent: "center" }}>
        <div className="ovyu-confirm">
          <div className="ovyu-confirm-circle">✓</div>
          <h1 style={{ fontStyle: "italic" }}>You&apos;ve signed.</h1>
          <p>The contract between you and {preview.maker_name} is now in place.</p>
          <div className="ovyu-confirm__divider" />
          <div className="ovyu-tc-what-happens">
            <p className="ovyu-tc-what-happens__title">What happens when the time comes</p>
            <p className="ovyu-tc-what-happens__body">
              When {preview.maker_name} passes, you will need to go to{" "}
              <strong>ovyu.com/activate-transfer</strong>. There you will submit evidence of their
              passing and confirm the details for their Keeper. Once you do that, we take it from there.
            </p>
            <p className="ovyu-tc-what-happens__body" style={{ marginTop: 8 }}>
              There is no deadline. Do this when you are ready and able.
            </p>
          </div>
        </div>
      </main>
      <p style={{ textAlign: "center", fontStyle: "italic", fontSize: 14, color: "var(--ovyu-muted)", padding: "0 24px 40px" }}>
        You will always be the one to decide when you are ready. Nothing happens without your confirmation.
      </p>
      <Footer />
    </div>
  );

  // ── Keeper Signed confirmation (Figma 141:701) ─────────────
  if (accepted && isKeeper) return (
    <div className="ovyu-page">
      <Header />
      <main className="ovyu-main" style={{ display: "flex", alignItems: "flex-start", justifyContent: "center" }}>
        <div className="ovyu-confirm">
          <div className="ovyu-confirm-circle">✓</div>
          <h1 style={{ fontStyle: "italic" }}>You&apos;ve signed.</h1>
          <p>The contract between you and {preview.maker_name} is now in place.</p>
          <div className="ovyu-confirm__divider" />
          <div className="ovyu-tc-what-happens">
            <p className="ovyu-tc-what-happens__title">What happens when the time comes</p>
            <p className="ovyu-tc-what-happens__body">
              When {preview.maker_name} passes, you will need to go to{" "}
              <strong>ovyu.com/activate-transfer</strong>. Once the Transfer is activated, you will
              be prompted to create an account and access what {preview.maker_name} left for you.
              You will always be the one to decide when you are ready.
            </p>
          </div>
        </div>
      </main>
      <p style={{ textAlign: "center", fontStyle: "italic", fontSize: 14, color: "var(--ovyu-muted)", padding: "0 24px 40px" }}>
        You will always be the one to decide when you are ready to access this. Nothing happens without your confirmation.
      </p>
      <Footer />
    </div>
  );

  // ── TC Contract page (Figma 141:577) ────────────────────────
  if (!isKeeper) return (
    <div className="ovyu-page">
      <Header />
      <main className="ovyu-main">
        <div style={{ maxWidth: 833, marginBottom: 32 }}>
          <h1 style={{ fontFamily: "var(--ovyu-font-serif)", fontStyle: "italic", fontSize: "clamp(36px,4vw,50px)", margin: "0 0 12px" }}>
            {preview.maker_name} has named you as their Transfer Contact.
          </h1>
          <p style={{ fontSize: 22, color: "var(--ovyu-muted)", margin: 0 }}>
            Read through the contract below. By signing, you accept the responsibility of initiating the Transfer when the time comes.
          </p>
        </div>

        <form onSubmit={handleAccept} className="ovyu-contract-grid-v2">
          {/* Contract text */}
          <article className="ovyu-contract-card-v2">
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 36 }}>
              <p style={{ fontWeight: 700, fontSize: 22, color: "var(--ovyu-ink)", margin: 0 }}>Ovyu Transfer Contact Agreement</p>
              <p style={{ fontWeight: 700, fontSize: 22, color: "var(--ovyu-gold-dark)", margin: 0 }}>Party A (Maker)</p>
              <p style={{ fontWeight: 700, fontSize: 22, color: "var(--ovyu-gold-dark)", margin: 0 }}>Party B (Keeper) &nbsp; Transfer Contact</p>
            </div>
            <div style={{ fontSize: 18, color: "var(--ovyu-ink-soft)", lineHeight: 1.7 }}>
              <p>Maker: {preview.maker_name}</p>
              <br />
              <p>Keeper: {preview.keeper_name} · Relationship: {preview.relationship}</p>
              <br />
              <p>Transfer Contact: {preview.tc_name}</p>
              <br />
              <p>By signing this agreement, you confirm that you:</p>
              <br />
              <ul style={{ paddingLeft: 24, display: "flex", flexDirection: "column", gap: 10 }}>
                <li>Understand that the Maker has created a private upload on Ovyu for their named Keeper.</li>
                <li>Accept the responsibility of notifying Ovyu when the Maker passes, by providing evidence of passing (such as a death certificate or official notice).</li>
                <li>Will confirm the Keeper&apos;s name and email at the time of notification so the Transfer can be delivered.</li>
                <li>All information you provide is handled with strict confidentiality and used solely to facilitate the Transfer.</li>
              </ul>
              <br />
              <p><em><strong>If you decline, the Maker will be notified. You can always accept later if the Maker re-sends the invitation.</strong></em></p>
            </div>
          </article>

          {/* Sign panel */}
          <aside className="ovyu-contract-sign-panel">
            <p className="ovyu-contract-sign-title">Accept and sign</p>
            <p className="ovyu-contract-sign-desc">
              By signing, you confirm you have read and accept this responsibility.
            </p>

            <div className="ovyu-field">
              <label className="ovyu-field__label" style={{ fontSize: 20 }}>Full legal name</label>
              <input
                className={`ovyu-input${typedName && !nameMatch ? " is-error" : ""}`}
                value={typedName}
                onChange={e => setTypedName(e.target.value)}
                placeholder="Type your full name"
                style={{ fontSize: 18, height: 73 }}
                required
              />
              {typedName && !nameMatch && (
                <span className="ovyu-field__helper is-error">
                  Name doesn&apos;t match. Type: {canonicalName}
                </span>
              )}
            </div>

            <div className="ovyu-field">
              <label className="ovyu-field__label" style={{ fontSize: 20 }}>Date</label>
              <div style={{
                background: "#fff", border: "1.29px solid var(--ovyu-muted)",
                borderRadius: 10, height: 73, display: "flex", alignItems: "center", padding: "0 13px",
                fontSize: 18, color: "var(--ovyu-muted)",
              }}>{today}</div>
            </div>

            {error && <p className="ovyu-error-text">{error}</p>}

            <button
              type="submit"
              className="ovyu-btn ovyu-btn--primary ovyu-btn--wide"
              disabled={!nameMatch || loading}
              style={{ fontSize: 20, height: 62 }}
            >
              {loading ? "Signing…" : "I accept and sign →"}
            </button>

            <div className="ovyu-gold-callout" style={{ fontSize: 15, padding: "12px 20px" }}>
              The Maker will be notified when you accept and sign.
            </div>
          </aside>
        </form>

        <p className="ovyu-contract-footnote">
          Your digital signature carries the same intent as a handwritten signature within the Ovyu platform.
        </p>
      </main>
      <Footer />
    </div>
  );

  // ── Keeper Contract page (Figma 141:649) ────────────────────
  return (
    <div className="ovyu-page">
      <Header />
      <main className="ovyu-main">
        <div style={{ maxWidth: 833, marginBottom: 32 }}>
          <h1 style={{ fontFamily: "var(--ovyu-font-serif)", fontStyle: "italic", fontSize: "clamp(36px,4vw,64px)", margin: "0 0 12px" }}>
            {preview.maker_name} has created something for you.
          </h1>
          <p style={{ fontSize: 22, color: "var(--ovyu-muted)", margin: 0 }}>
            Review the agreement below. Take your time. Sign only if you&apos;re ready to accept.
          </p>
        </div>

        <form onSubmit={handleAccept} className="ovyu-contract-grid-v2">
          {/* Contract text */}
          <article className="ovyu-contract-card-v2">
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 36 }}>
              <p style={{ fontWeight: 700, fontSize: 22, color: "var(--ovyu-ink)", margin: 0 }}>Ovyu Agreement</p>
              <p style={{ fontWeight: 700, fontSize: 22, color: "var(--ovyu-gold-dark)", margin: 0 }}>Party A (Maker)</p>
              <p style={{ fontWeight: 700, fontSize: 22, color: "var(--ovyu-gold-dark)", margin: 0 }}>Party B (Keeper)</p>
            </div>
            <div style={{ fontSize: 18, color: "var(--ovyu-ink-soft)", lineHeight: 1.7 }}>
              <p>Maker: {preview.maker_name}</p>
              <br />
              <p>Keeper: {preview.keeper_name}</p>
              <br />
              <p>Relationship: {preview.relationship}</p>
              <br />
              <p>By accepting, you agree to receive the Maker&apos;s upload upon the Transfer. You understand
              that the upload is the personal creation of the Maker and may not be altered, shared, or transferred.</p>
              <br />
              <p>Access begins: Upon the Transfer.</p>
              <p>Access duration: Lifetime unless specified.</p>
              <br />
              <p>You may withdraw your acceptance at any time before the Transfer is activated.</p>
              <p>Ovyu stores all data securely and uses it solely to deliver this upload to you. No data is shared or sold.</p>
            </div>
          </article>

          {/* Sign panel */}
          <aside className="ovyu-contract-sign-panel">
            <p className="ovyu-contract-sign-title">Sign as Keeper</p>
            <p className="ovyu-contract-sign-desc">
              By signing, you confirm you have read and agree to the terms on this page.
            </p>

            <div className="ovyu-field">
              <label className="ovyu-field__label" style={{ fontSize: 20 }}>Full legal name</label>
              <input
                className={`ovyu-input${typedName && !nameMatch ? " is-error" : ""}`}
                value={typedName}
                onChange={e => setTypedName(e.target.value)}
                placeholder="Type your full name"
                style={{ fontSize: 18, height: 73 }}
                required
              />
              {typedName && !nameMatch && (
                <span className="ovyu-field__helper is-error">
                  Name doesn&apos;t match. Type: {canonicalName}
                </span>
              )}
            </div>

            <div className="ovyu-field">
              <label className="ovyu-field__label" style={{ fontSize: 20 }}>Date</label>
              <div style={{
                background: "#fff", border: "1.29px solid var(--ovyu-muted)",
                borderRadius: 10, height: 73, display: "flex", alignItems: "center", padding: "0 13px",
                fontSize: 18, color: "var(--ovyu-muted)",
              }}>{today}</div>
            </div>

            {error && <p className="ovyu-error-text">{error}</p>}

            <button
              type="submit"
              className="ovyu-btn ovyu-btn--primary ovyu-btn--wide"
              disabled={!nameMatch || loading}
              style={{ fontSize: 20, height: 62 }}
            >
              {loading ? "Signing…" : "Sign and continue →"}
            </button>
          </aside>
        </form>

        <p className="ovyu-contract-footnote">
          Your digital signature carries the same intent as a handwritten signature within the Ovyu platform.
        </p>
      </main>
      <Footer />
    </div>
  );
}
