"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { api } from "@/lib/api";

type Contract = {
  id: string; path: string; status: string;
  maker_name?: string; keeper_name?: string;
  maker_signed_at?: string; locked_at?: string;
};

function KeeperContractsInner() {
  const params = useSearchParams();
  const contractId = params.get("id") ?? sessionStorage.getItem("ovyu_contract_id") ?? "";

  const [contract, setContract] = useState<Contract | null>(null);
  const [error, setError] = useState("");
  const [initial, setInitial] = useState("?");

  useEffect(() => {
    const name = sessionStorage.getItem("ovyu_maker_name") ?? "";
    setInitial(name[0]?.toUpperCase() ?? "?");

    if (!contractId) return;
    api.getContract(contractId)
      .then(d => setContract(d as Contract))
      .catch(() => setError("Contract not found."));
  }, [contractId]);

  const isLocked = contract?.status === "LOCKED";
  const makerName = contract?.maker_name ?? "your Maker";

  const signedDate = contract?.locked_at
    ? new Date(contract.locked_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    : null;

  return (
    <div className="ovyu-page">
      <Header variant="loggedIn" initial={initial} />
      <main className="ovyu-main">
        <div style={{ maxWidth: 1700 }}>
          <h1 style={{
            fontFamily: "var(--ovyu-font-serif)", fontStyle: "italic",
            fontSize: "clamp(36px,4vw,64px)", color: "var(--ovyu-ink)", marginBottom: 50,
          }}>
            Your contracts
          </h1>

          {/* Making section — empty for keepers but shown for symmetry with Figma */}
          <div className="ovyu-contracts-section" style={{ marginBottom: 40 }}>
            <p className="ovyu-contracts-eyebrow">Making</p>
            <div style={{
              border: "1px solid var(--ovyu-muted)", borderRadius: 10,
              padding: "28px 36px", display: "flex", alignItems: "center", gap: 20,
              cursor: "default",
            }}>
              <span style={{ fontSize: 22, color: "var(--ovyu-muted)", lineHeight: 1 }}>+</span>
              <span style={{ fontWeight: 700, fontSize: 16, textTransform: "uppercase", color: "var(--ovyu-ink)", letterSpacing: "0.05em" }}>
                Start a new contract
              </span>
            </div>
          </div>

          {/* Receiving section */}
          <div className="ovyu-contracts-section">
            <p className="ovyu-contracts-eyebrow">Receiving</p>

            {error ? (
              <p style={{ color: "var(--ovyu-error)", fontSize: 18 }}>{error}</p>
            ) : !contract ? (
              <p style={{ color: "var(--ovyu-muted)", fontSize: 18 }}>Loading…</p>
            ) : (
              <div className="ovyu-keeper-row">
                <div className="ovyu-keeper-row__inner">
                  <div className="ovyu-keeper-row__left">
                    <p className="ovyu-keeper-row__label">KEEPER</p>
                    <p className="ovyu-keeper-row__from">From {makerName}</p>
                  </div>

                  {isLocked ? (
                    <>
                      <span className="ovyu-keeper-row__status">Signed on {signedDate}</span>
                      <span className="ovyu-keeper-row__status">Held for you</span>
                      <div style={{ display: "flex", gap: 64, alignItems: "center" }}>
                        <Link
                          href={`/keeper/contracts/view?id=${contractId}`}
                          className="ovyu-keeper-row__action"
                        >
                          View
                        </Link>
                        <button
                          onClick={() => window.print()}
                          className="ovyu-keeper-row__action"
                        >
                          Download ⤓
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <span className="ovyu-keeper-row__status" style={{ fontStyle: "italic" }}>Pending signature</span>
                      <Link
                        href="/"
                        className="ovyu-keeper-row__action"
                      >
                        Sign Contract
                      </Link>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default function KeeperContractsPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: "100vh", background: "var(--ovyu-cream)" }} />}>
      <KeeperContractsInner />
    </Suspense>
  );
}
