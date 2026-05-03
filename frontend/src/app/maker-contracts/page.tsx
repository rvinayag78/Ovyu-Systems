"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { api } from "@/lib/api";

type Contract = {
  id: string; path: string; status: string;
  maker_signed_at?: string; keeper_name?: string; tc_name?: string;
};

function MakerContractsInner() {
  const params = useSearchParams();
  const contractId = params.get("id") ?? sessionStorage.getItem("ovyu_contract_id") ?? "";

  const [contract, setContract] = useState<Contract | null>(null);
  const [error, setError] = useState("");
  const [initial, setInitial] = useState("?");

  useEffect(() => {
    const name = sessionStorage.getItem("ovyu_maker_name") ?? "";
    setInitial(name[0] ?? "?");

    if (!contractId) return;
    const poll = () =>
      api.getContract(contractId).then(setContract).catch(() => setError("Contract not found."));
    poll();
    const interval = setInterval(poll, 5000);
    return () => clearInterval(interval);
  }, [contractId]);

  if (error) return (
    <div className="ovyu-page">
      <Header variant="loggedIn" initial={initial} />
      <main className="ovyu-main">
        <p style={{ color: "var(--ovyu-error)" }}>{error}</p>
      </main>
      <Footer />
    </div>
  );

  const makerSigned = !!contract?.maker_signed_at;
  const keeperName = contract?.keeper_name ?? "your Keeper";

  const sentDate = contract?.maker_signed_at
    ? new Date(contract.maker_signed_at).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
    : null;

  return (
    <div className="ovyu-page">
      <Header variant="loggedIn" initial={initial} />
      <main className="ovyu-main">
        <div style={{ maxWidth: 1700 }}>
          <h1 className="ovyu-contracts-title" style={{
            fontFamily: "var(--ovyu-font-serif)", fontStyle: "italic",
            fontSize: "clamp(36px,4vw,64px)", color: "var(--ovyu-ink)", marginBottom: 50,
          }}>
            Your contracts
          </h1>

          <div className="ovyu-contracts-section">
            <p className="ovyu-contracts-eyebrow">Making</p>

            {!contract ? (
              <p style={{ color: "var(--ovyu-muted)", fontSize: 18 }}>Loading…</p>
            ) : (
              <div className="ovyu-contract-row">
                <div className="ovyu-contract-row__inner">
                  <div className="ovyu-contract-row__left">
                    <div className="ovyu-contract-row__avatar" />
                    <div className="ovyu-contract-row__meta">
                      <p className="ovyu-contract-row__role">Maker</p>
                      <p className="ovyu-contract-row__name">For {keeperName}</p>
                    </div>
                  </div>

                  {makerSigned ? (
                    <>
                      <span className="ovyu-contract-row__status">
                        Contract sent {sentDate}
                      </span>
                      <span className="ovyu-contract-row__status">Pending</span>
                    </>
                  ) : (
                    <>
                      <span className="ovyu-contract-row__status">Pending Status</span>
                      <Link
                        href={`/contract/sign?id=${contractId}`}
                        className="ovyu-contract-row__action"
                      >
                        Sign Contract
                      </Link>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>

          {makerSigned && (
            <p style={{ marginTop: 32, fontSize: 14, color: "var(--ovyu-muted)", maxWidth: 640 }}>
              We&apos;ll email you when{" "}
              {contract?.path === "private" ? "your Transfer Contact" : "your Keeper"} responds.
              You don&apos;t need to do anything in the meantime.
            </p>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default function MakerContractsPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: "100vh", background: "var(--ovyu-cream)" }} />}>
      <MakerContractsInner />
    </Suspense>
  );
}
