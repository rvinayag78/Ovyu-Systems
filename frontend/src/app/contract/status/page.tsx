"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { api } from "@/lib/api";

type Contract = { id: string; path: string; status: string; maker_signed_at?: string };

function StatusInner() {
  const router = useRouter();
  const params = useSearchParams();
  const contractId = params.get("id") ?? "";

  const [contract, setContract] = useState<Contract | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!contractId) return;
    const poll = () => api.getContract(contractId).then(setContract).catch(() => setError("Contract not found."));
    poll();
    const interval = setInterval(poll, 5000);
    return () => clearInterval(interval);
  }, [contractId]);

  if (error) return (
    <div style={{ minHeight: "100vh", background: "var(--ovyu-cream)", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <p style={{ color: "var(--ovyu-error)" }}>{error}</p>
    </div>
  );
  if (!contract) return (
    <div style={{ minHeight: "100vh", background: "var(--ovyu-cream)", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <p style={{ color: "var(--ovyu-muted)" }}>Loading…</p>
    </div>
  );

  const isPrivate = contract.path === "private";
  const isLocked = contract.status === "LOCKED";
  const signedDate = contract.maker_signed_at
    ? new Date(contract.maker_signed_at).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
    : new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });

  const sub = isLocked
    ? "Both parties have signed. Your contract is now locked."
    : isPrivate
      ? "You've signed. Your Transfer Contact has been emailed."
      : "You've signed. We're waiting on your Keeper.";

  type Row = { party: string; detail: string; role: string; status: "signed" | "pending" | "notified"; label: string; date: string };
  const rows: Row[] = [
    { party: "Maker (you)", detail: "You signed the contract", role: "Party A", status: "signed", label: "Signed", date: signedDate },
    ...(isPrivate ? [
      { party: "Transfer Contact", detail: "", role: "Party B", status: isLocked ? "signed" as const : "pending" as const, label: isLocked ? "Signed" : "Pending", date: isLocked ? signedDate : `Invitation sent ${signedDate}` },
      { party: "Keeper", detail: "", role: "Designated", status: "notified" as const, label: "Notified at Transfer", date: "Will receive Transfer email" },
    ] : [
      { party: "Keeper", detail: "", role: "Party B", status: isLocked ? "signed" as const : "pending" as const, label: isLocked ? "Signed" : "Pending", date: isLocked ? signedDate : `Invitation sent ${signedDate}` },
    ]),
  ];

  return (
    <div className="ovyu-page">
      <Header />
      <main className="ovyu-main">
        <div className="ovyu-page-header">
          <h1>Contract status.</h1>
          <span className="ovyu-sub">{sub}</span>
        </div>

        <div className="ovyu-table">
          <div className="ovyu-table__head">
            <span>Party</span><span>Role</span><span>Status</span><span>Date</span>
          </div>
          {rows.map(row => (
            <div key={row.party} className="ovyu-table__row">
              <span className="ovyu-table__party">
                {row.party}
                {row.detail && <small>{row.detail}</small>}
              </span>
              <span>{row.role}</span>
              <span className={`ovyu-statusbadge ovyu-statusbadge--${row.status}`}>
                <span className={`ovyu-statusdot ovyu-statusdot--${row.status}`} />
                {row.label}
              </span>
              <span className="ovyu-table__date">{row.date}</span>
            </div>
          ))}
        </div>

        {isLocked ? (
          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 32 }}>
            <Link href="/plan" className="ovyu-btn ovyu-btn--primary">Continue to upload →</Link>
          </div>
        ) : (
          <p className="ovyu-muted-text" style={{ marginTop: 24, maxWidth: 640 }}>
            We&apos;ll email you when {isPrivate ? "your Transfer Contact" : "they"} responds.
            You don&apos;t need to do anything in the meantime.
          </p>
        )}
      </main>
      <Footer />
    </div>
  );
}

export default function StatusPage() {
  return <Suspense fallback={<div style={{ minHeight: "100vh", background: "var(--ovyu-cream)" }} />}><StatusInner /></Suspense>;
}
