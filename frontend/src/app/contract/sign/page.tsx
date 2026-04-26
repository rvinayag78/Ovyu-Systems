"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { api } from "@/lib/api";

function normalize(s: string) { return s.trim().toLowerCase().normalize("NFC"); }

function SignInner() {
  const router = useRouter();
  const params = useSearchParams();
  const contractId = params.get("id") ?? "";

  const [contract, setContract] = useState<{ id: string; path: string; status: string } | null>(null);
  const [makerName, setMakerName] = useState("");
  const [typedName, setTypedName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!contractId) return;
    api.getContract(contractId)
      .then(c => setContract(c))
      .catch(() => setError("Contract not found."));
    // Load maker name: magic-link flow stores it as ovyu_maker_name; registration flow stores in ovyu_pending
    const makerNameDirect = sessionStorage.getItem("ovyu_maker_name");
    if (makerNameDirect) {
      setMakerName(makerNameDirect);
    } else {
      const raw = sessionStorage.getItem("ovyu_pending");
      if (raw) {
        const p = JSON.parse(raw);
        setMakerName(`${p.first_name} ${p.last_name}`);
      }
    }
  }, [contractId]);

  const isPrivate = contract?.path === "private";
  const nameMatch = makerName ? normalize(typedName) === normalize(makerName) : false;

  async function handleSign(e: React.FormEvent) {
    e.preventDefault();
    if (!nameMatch) return;
    setError(""); setLoading(true);
    try {
      await api.signContract(contractId, typedName);
      router.push(`/contract/status?id=${contractId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign failed.");
    } finally {
      setLoading(false);
    }
  }

  if (error && !contract) return (
    <div style={{ minHeight: "100vh", background: "var(--ovyu-cream)", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <p style={{ color: "var(--ovyu-error)" }}>{error}</p>
    </div>
  );

  const today = new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });

  return (
    <div className="ovyu-page">
      <Header />
      <main className="ovyu-main">
        <div className="ovyu-page-header">
          <h1>Your contract.</h1>
          <span className="ovyu-sub">Read every line. Type your full legal name to sign.</span>
        </div>

        <form onSubmit={handleSign} className="ovyu-contract-grid">
          {/* Left — Contract text */}
          <article className="ovyu-contract-card">
            <p className="party-line">The Ovyu Contract · v1.0</p>
            <h3>Between</h3>
            <dl>
              <dt>Party A</dt><dd>{makerName || "You"} · Maker</dd>
              <dt>Party B</dt><dd>{isPrivate ? "Transfer Contact" : "Keeper"}</dd>
              <dt>Drafted</dt><dd>{today}</dd>
            </dl>

            <h3 style={{ fontSize: 22, marginTop: 20 }}>1. What Ovyu is</h3>
            <p className="contract-body">
              Ovyu is a private place where the Maker uploads their voice, photographs, written stories
              and personality for the Keeper to access at one specific moment in time: after the Maker passes.
            </p>

            <h3 style={{ fontSize: 22 }}>2. Consent</h3>
            <p className="contract-body">
              Both parties agree that this is a private, non-commercial, two-person relationship.
              Ovyu does not, and will not, share, sell, or analyse the contents of any upload.
              The Keeper may visit the upload, listen to it, read it, or speak with it for as long as they choose.
              They may also delete it at any time after the Transfer.
            </p>

            {isPrivate && (
              <>
                <h3 style={{ fontSize: 22 }}>3. Transfer Contact</h3>
                <p className="contract-body">
                  You will not see, hear, or have any access to what the Maker has uploaded.
                  Your single role is, when the time comes, to visit ovyu.com/activate-transfer
                  and confirm that the Maker has passed. We will guide you from there.
                </p>
              </>
            )}

            <p className="footnote">This is a plain-English summary. Full legal text at ovyu.com/contract/v1.</p>

            {isPrivate && (
              <div className="ovyu-callout" style={{ marginTop: 20 }}>
                <p className="ovyu-callout__body">
                  Your Transfer Contact will also receive this contract to sign.
                </p>
              </div>
            )}
          </article>

          {/* Right — Sign */}
          <aside className="ovyu-contract-card">
            <h3 style={{ fontSize: 22, marginBottom: 12 }}>Sign the contract</h3>
            <p style={{ fontSize: 14, color: "var(--ovyu-ink-soft)", marginBottom: 24 }}>
              Type your full legal name exactly as it appears above. This counts as your signature.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <div className="ovyu-field">
                <label className="ovyu-field__label" htmlFor="sig">Full legal name</label>
                <input id="sig" className={`ovyu-input${typedName && !nameMatch ? " is-error" : ""}`}
                  value={typedName} onChange={e => setTypedName(e.target.value)}
                  placeholder="Type your full name here" required />
                {typedName && !nameMatch && (
                  <span className="ovyu-field__helper is-error">
                    Name doesn&apos;t match. Type: {makerName}
                  </span>
                )}
              </div>
              <div className="ovyu-field">
                <label className="ovyu-field__label">Date</label>
                <p style={{ fontSize: 15, color: "var(--ovyu-ink-soft)", paddingTop: 4 }}>{today}</p>
              </div>
            </div>

            {error && <p className="ovyu-error-text">{error}</p>}

            <div style={{ marginTop: 24 }}>
              <button type="submit" className="ovyu-btn ovyu-btn--primary ovyu-btn--wide"
                disabled={!nameMatch || loading}>
                {loading ? "Signing…" : "Sign and continue →"}
              </button>
            </div>
          </aside>
        </form>
      </main>
      <Footer />
    </div>
  );
}

export default function SignPage() {
  return <Suspense fallback={<div style={{ minHeight: "100vh", background: "var(--ovyu-cream)" }} />}><SignInner /></Suspense>;
}
