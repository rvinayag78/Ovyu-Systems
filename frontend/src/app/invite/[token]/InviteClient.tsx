"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { api } from "@/lib/api";

function normalize(s: string) { return s.trim().toLowerCase().normalize("NFC"); }

type Preview = { invitee_role: "keeper" | "tc"; maker_name: string; keeper_name: string; tc_name: string; relationship: string; contract_id: string };

export function InviteClient() {
  const { token } = useParams<{ token: string }>();
  const router = useRouter();
  const [preview, setPreview] = useState<Preview | null>(null);
  const [fetchError, setFetchError] = useState("");
  const [typedName, setTypedName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token || token === "_") return;
    api.getInvitePreview(token)
      .then(d => setPreview(d as Preview))
      .catch(err => setFetchError(err instanceof Error ? err.message : "Invalid or expired invitation."));
  }, [token]);

  if (fetchError) return (
    <div style={{ minHeight: "100vh", background: "var(--ovyu-cream)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ textAlign: "center" }}>
        <p style={{ color: "var(--ovyu-error)", marginBottom: 12 }}>{fetchError}</p>
        <a href="/" style={{ fontSize: 14, textDecoration: "underline" }}>Return home</a>
      </div>
    </div>
  );

  if (!preview) return (
    <div style={{ minHeight: "100vh", background: "var(--ovyu-cream)", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <p style={{ color: "var(--ovyu-muted)" }}>Loading invitation…</p>
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
      router.push(`/invite/${token}/done?maker=${encodeURIComponent(preview!.maker_name)}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Acceptance failed.");
    } finally {
      setLoading(false);
    }
  }

  const pageTitle = isKeeper
    ? `${preview.maker_name} would like Ovyu to be for you.`
    : `${preview.maker_name} has named you their Transfer Contact.`;

  const pageSub = isKeeper
    ? "This is the agreement that will govern what Ovyu holds, who can access it, and when."
    : "This means: when they pass, you'll confirm it to us. You will not see what they uploaded — that is for their Keeper alone.";

  return (
    <div className="ovyu-page">
      <Header />
      <main className="ovyu-main">
        <div className="ovyu-page-header">
          <h1 style={{ maxWidth: 900 }}>{pageTitle}</h1>
          <span className="ovyu-sub">{pageSub}</span>
        </div>

        <form onSubmit={handleAccept} className="ovyu-contract-grid">
          {/* Left — Contract text */}
          <article className="ovyu-contract-card">
            <p className="party-line">The Ovyu Contract · v1.0</p>
            <h3>Between</h3>
            <dl>
              <dt>Party A</dt><dd>{preview.maker_name} · Maker</dd>
              <dt>Party B</dt><dd>{canonicalName} · {isKeeper ? "Keeper" : "Transfer Contact"}</dd>
              {preview.relationship && <><dt>Relationship</dt><dd>{preview.relationship}</dd></>}
              <dt>Drafted</dt><dd>{today}</dd>
            </dl>

            {isKeeper ? (
              <>
                <h3 style={{ fontSize: 22, marginTop: 16 }}>1. What Ovyu is</h3>
                <p className="contract-body">
                  Ovyu is a private place where {preview.maker_name} (the Maker) has uploaded their voice,
                  photographs, written stories and personality for you (the Keeper) to access at one specific
                  moment: after the Maker passes.
                </p>
                <h3 style={{ fontSize: 22 }}>2. Consent</h3>
                <p className="contract-body">
                  Both parties agree this is a private, non-commercial, two-person relationship. Ovyu does not
                  share, sell, or analyse any upload. You may access the upload, listen to it, read it for as
                  long as you choose. You may delete it at any time after the Transfer.
                </p>
                <p className="footnote">You may withdraw your acceptance at any time before the Transfer is activated.</p>
              </>
            ) : (
              <>
                <h3 style={{ fontSize: 22, marginTop: 16 }}>Your role as Transfer Contact</h3>
                <p className="contract-body">
                  You will not see, hear, or have any access to what {preview.maker_name} has uploaded.
                  Your single role is, when the time comes, to visit ovyu.com/activate-transfer and confirm
                  that {preview.maker_name} has passed. We will guide you from there.
                </p>
                <p className="contract-body">By signing, you confirm that you:</p>
                <ol style={{ paddingLeft: 20, margin: "0 0 16px", display: "flex", flexDirection: "column", gap: 10 }}>
                  {[
                    `Understand that ${preview.maker_name} has created a private upload on Ovyu for their named Keeper.`,
                    "Accept the responsibility of notifying Ovyu when the Maker passes, by providing evidence of passing.",
                    "Will confirm the Keeper's name and email at the time of notification.",
                    "Will not access, alter, or share any content of the upload.",
                    "All information you provide is handled with strict confidentiality.",
                  ].map((c, i) => <li key={i} style={{ fontSize: 15, lineHeight: 1.55, color: "var(--ovyu-ink-soft)" }}>{c}</li>)}
                </ol>
                <p className="footnote">If you decline, {preview.maker_name} will be notified.</p>
              </>
            )}
          </article>

          {/* Right — Sign */}
          <aside className="ovyu-contract-card">
            <h3 style={{ fontSize: 22, marginBottom: 12 }}>Your decision</h3>
            <p style={{ fontSize: 14, color: "var(--ovyu-ink-soft)", marginBottom: 24 }}>
              {preview.maker_name} signed this contract. By signing below you confirm you understand and agree.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <div className="ovyu-field">
                <label className="ovyu-field__label" htmlFor="sig">Full legal name</label>
                <input id="sig" className={`ovyu-input${typedName && !nameMatch ? " is-error" : ""}`}
                  value={typedName} onChange={e => setTypedName(e.target.value)}
                  placeholder="Type your full name here" required />
                {typedName && !nameMatch && (
                  <span className="ovyu-field__helper is-error">
                    Name doesn&apos;t match. Type: {canonicalName}
                  </span>
                )}
              </div>
              <div className="ovyu-field">
                <label className="ovyu-field__label">Date</label>
                <p style={{ fontSize: 15, color: "var(--ovyu-ink-soft)", paddingTop: 4 }}>{today}</p>
              </div>
            </div>

            {error && <p className="ovyu-error-text">{error}</p>}

            <div style={{ marginTop: 24, display: "flex", flexDirection: "column", gap: 12 }}>
              <button type="submit" className="ovyu-btn ovyu-btn--primary ovyu-btn--wide"
                disabled={!nameMatch || loading}>
                {loading ? "Signing…" : "I accept and sign"}
              </button>
              <button type="button" className="ovyu-btn ovyu-btn--outline ovyu-btn--wide"
                onClick={() => router.push("/")}>
                Decline
              </button>
            </div>
          </aside>
        </form>
      </main>
      <Footer />
    </div>
  );
}
