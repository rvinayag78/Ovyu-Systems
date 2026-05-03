"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { api } from "@/lib/api";

function normalize(s: string) { return s.trim().toLowerCase().normalize("NFC"); }

function SignInner() {
  const router = useRouter();
  const params = useSearchParams();
  const contractId = params.get("id") ?? "";

  const [contract, setContract] = useState<{
    id: string; path: string; status: string;
    maker_signed_at?: string; locked_at?: string;
    keeper_name?: string; tc_name?: string; relationship?: string;
  } | null>(null);
  const [makerName, setMakerName] = useState("");
  const [typedName, setTypedName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [initial, setInitial] = useState("?");

  useEffect(() => {
    if (!contractId) return;
    api.getContract(contractId).then(setContract).catch(() => setError("Contract not found."));
    const name = sessionStorage.getItem("ovyu_maker_name") ?? "";
    setMakerName(name);
    setInitial(name[0] ?? "?");
  }, [contractId]);

  const isPrivate = contract?.path === "private";
  const alreadySigned = !!contract?.maker_signed_at;
  const isLocked = contract?.status === "LOCKED";
  const nameMatch = makerName ? normalize(typedName) === normalize(makerName) : false;
  const today = new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });

  async function handleSign(e: React.FormEvent) {
    e.preventDefault();
    if (!nameMatch) return;
    setError(""); setLoading(true);
    try {
      await api.signContract(contractId, typedName);
      router.push(`/maker-contracts?id=${contractId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign failed.");
    } finally {
      setLoading(false);
    }
  }

  if (error && !contract) return (
    <div className="ovyu-page">
      <Header variant="loggedIn" initial={initial} />
      <main className="ovyu-main" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ color: "var(--ovyu-error)" }}>{error}</p>
      </main>
      <Footer />
    </div>
  );

  return (
    <div className="ovyu-page">
      <Header variant="loggedIn" initial={initial} />
      <main className="ovyu-main">
        {/* Heading */}
        <div style={{ maxWidth: 833 }}>
          <h1 style={{ fontFamily: "var(--ovyu-font-serif)", fontStyle: "italic", fontSize: "clamp(36px,4vw,64px)", margin: "0 0 12px" }}>
            Your contract.
          </h1>
          <p style={{ fontSize: 22, color: "var(--ovyu-muted)", margin: 0 }}>
            Read through carefully. This is between you, your Keeper
            {isPrivate ? ", and your Transfer Contact." : "."}
          </p>
        </div>

        <form onSubmit={handleSign} className="ovyu-contract-grid-v2">
          {/* Contract text */}
          <article className="ovyu-contract-card-v2">
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 36 }}>
              <p style={{ fontWeight: 700, fontSize: 22, color: "var(--ovyu-ink)", margin: 0 }}>Ovyu Agreement</p>
              <p style={{ fontWeight: 700, fontSize: 22, color: "var(--ovyu-gold-dark)", margin: 0 }}>Party A (Maker)</p>
              <p style={{ fontWeight: 700, fontSize: 22, color: "var(--ovyu-gold-dark)", margin: 0 }}>
                {isPrivate ? "Party B (Keeper)  Transfer Contact" : "Party B (Keeper)"}
              </p>
            </div>
            <div style={{ fontSize: 18, color: "var(--ovyu-ink-soft)", lineHeight: 1.7 }}>
              <p>Maker: {makerName || "[Your name]"}</p>
              <br />
              <p>Keeper: {contract?.keeper_name ?? "[Keeper name]"} · Relationship: {contract?.relationship ?? "[Relationship]"}</p>
              {isPrivate && <><br /><p>Transfer Contact: {contract?.tc_name ?? "[Transfer Contact name]"}</p></>}
              <br />
              {isPrivate ? (
                <p>Your Keeper is not aware of this upload. Your Transfer Contact has been designated to
                confirm the Transfer when the time comes. Your Keeper will be notified at that point.</p>
              ) : (
                <p>Your Keeper is aware of this upload and has agreed to receive it.</p>
              )}
              <br />
              <p>Access begins: Upon the Transfer{isPrivate ? ", as confirmed by the Transfer Contact" : ""}.</p>
              <p>Access duration: Lifetime unless otherwise specified.</p>
              <p>Transferable: No · Interaction limit: No limit</p>
              <br />
              <p>The Maker retains full ownership and may pause, edit, or withdraw this upload at any
              time before the Transfer is activated. The Keeper may not alter the upload in any way.</p>
            </div>
          </article>

          {/* Sign panel */}
          <aside className="ovyu-contract-sign-panel">
            {alreadySigned ? (
              <>
                <p className="ovyu-contract-sign-title">
                  {isLocked ? "Contract locked" : "You've signed"}
                </p>
                <p className="ovyu-contract-sign-desc">
                  {isLocked
                    ? "All parties have signed. This contract is active."
                    : `Signed on ${new Date(contract!.maker_signed_at!).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}. Waiting for the other party.`}
                </p>
                <div className="ovyu-field">
                  <label className="ovyu-field__label" style={{ fontSize: 20 }}>Signed by</label>
                  <div style={{
                    background: "#fff", border: "1.29px solid var(--ovyu-muted)",
                    borderRadius: 10, height: 73, display: "flex", alignItems: "center", padding: "0 13px",
                    fontSize: 18, color: "var(--ovyu-ink-soft)",
                  }}>{makerName}</div>
                </div>
                <div className="ovyu-field">
                  <label className="ovyu-field__label" style={{ fontSize: 20 }}>Date signed</label>
                  <div style={{
                    background: "#fff", border: "1.29px solid var(--ovyu-muted)",
                    borderRadius: 10, height: 73, display: "flex", alignItems: "center", padding: "0 13px",
                    fontSize: 18, color: "var(--ovyu-muted)",
                  }}>
                    {new Date(contract!.maker_signed_at!).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                  </div>
                </div>
                {isLocked && (
                  <Link
                    href="/upload/start"
                    className="ovyu-btn ovyu-btn--primary ovyu-btn--wide"
                    style={{ fontSize: 20, height: 62, display: "flex", alignItems: "center", justifyContent: "center", textDecoration: "none" }}
                  >
                    Begin my upload →
                  </Link>
                )}
              </>
            ) : (
              <>
                <p className="ovyu-contract-sign-title">Sign as Maker</p>
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
                      Name doesn&apos;t match. Type: {makerName}
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

                {isPrivate && (
                  <div className="ovyu-gold-callout">
                    Your Transfer Contact will also receive this contract to sign.
                  </div>
                )}
              </>
            )}
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

export default function SignPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: "100vh", background: "var(--ovyu-cream)" }} />}>
      <SignInner />
    </Suspense>
  );
}
