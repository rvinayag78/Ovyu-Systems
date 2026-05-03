"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { api } from "@/lib/api";

const serif = "Georgia, serif";
const sans = "Helvetica Neue, Helvetica, Arial, sans-serif";

type Contract = { id: string; path: string; status: string; maker_signed_at?: string };

const BADGE: Record<string, { bg: string; dot: string; color: string }> = {
  signed:   { bg: "#e6f4ea", dot: "#2e7d32", color: "#2e7d32" },
  pending:  { bg: "#fff8e1", dot: "#c9a84c", color: "#8a6e30" },
  notified: { bg: "#f0f0f0", dot: "#888",    color: "#555"    },
};

function StatusInner() {
  const params = useSearchParams();
  const contractId = params.get("id") ?? "";
  const [initial, setInitial] = useState("?");
  const [contract, setContract] = useState<Contract | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const name = sessionStorage.getItem("ovyu_maker_name") ?? "";
    setInitial(name[0]?.toUpperCase() ?? "?");
    if (!contractId) return;
    const poll = () => api.getContract(contractId).then(setContract).catch(() => setError("Contract not found."));
    poll();
    const interval = setInterval(poll, 5000);
    return () => clearInterval(interval);
  }, [contractId]);

  if (error) return (
    <div style={{ minWidth: "1920px", background: "#f8f7f5", display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Header variant="loggedIn" initial={initial} />
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ fontFamily: sans, fontSize: "18px", color: "#B4372C" }}>{error}</p>
      </div>
      <Footer />
    </div>
  );

  if (!contract) return (
    <div style={{ minWidth: "1920px", background: "#f8f7f5", display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Header variant="loggedIn" initial={initial} />
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ fontFamily: sans, fontSize: "18px", color: "#888" }}>Loading…</p>
      </div>
      <Footer />
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
    <div style={{ minWidth: "1920px", background: "#f8f7f5", display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Header variant="loggedIn" initial={initial} />

      <div style={{ position: "relative", flex: 1, minHeight: "874px" }}>
        <div style={{ position: "absolute", left: "58px", top: "40px", width: "1804px", display: "flex", flexDirection: "column", gap: "32px" }}>
          {/* Title */}
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <h1 style={{ fontFamily: serif, fontStyle: "italic", fontWeight: 400, fontSize: "64px", color: "#1a1a1a", margin: 0 }}>
              Contract status.
            </h1>
            <p style={{ fontFamily: sans, fontWeight: 400, fontSize: "22px", color: "#888", margin: 0 }}>{sub}</p>
          </div>

          {/* Table */}
          <div style={{ background: "#fff", border: "2px solid #e1e1e1", borderRadius: "12px", overflow: "hidden" }}>
            {/* Header row */}
            <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 2fr", padding: "18px 32px", borderBottom: "2px solid #e1e1e1", background: "#f8f7f5" }}>
              {["Party", "Role", "Status", "Date"].map(h => (
                <span key={h} style={{ fontFamily: sans, fontWeight: 700, fontSize: "16px", color: "#888", textTransform: "uppercase", letterSpacing: "0.05em" }}>{h}</span>
              ))}
            </div>
            {rows.map((row, i) => (
              <div key={row.party} style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 2fr", padding: "24px 32px", borderBottom: i < rows.length - 1 ? "1px solid #e1e1e1" : "none", alignItems: "center" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                  <span style={{ fontFamily: sans, fontWeight: 700, fontSize: "18px", color: "#1a1a1a" }}>{row.party}</span>
                  {row.detail && <small style={{ fontFamily: sans, fontSize: "14px", color: "#888" }}>{row.detail}</small>}
                </div>
                <span style={{ fontFamily: sans, fontSize: "16px", color: "#444" }}>{row.role}</span>
                <span style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "6px 14px", background: BADGE[row.status].bg, borderRadius: "100px", width: "fit-content", fontFamily: sans, fontSize: "14px", fontWeight: 700, color: BADGE[row.status].color }}>
                  <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: BADGE[row.status].dot, flexShrink: 0 }} />
                  {row.label}
                </span>
                <span style={{ fontFamily: sans, fontSize: "16px", color: "#888" }}>{row.date}</span>
              </div>
            ))}
          </div>

          {isLocked ? (
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <Link href="/plan" style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "62px", padding: "0 40px", background: "#1a1a1a", borderRadius: "8px", fontFamily: sans, fontWeight: 700, fontSize: "20px", color: "#f5f0e8", textDecoration: "none" }}>
                Continue to upload →
              </Link>
            </div>
          ) : (
            <p style={{ fontFamily: sans, fontSize: "18px", color: "#888", margin: 0, maxWidth: "640px" }}>
              We&apos;ll email you when {isPrivate ? "your Transfer Contact" : "they"} responds.
              You don&apos;t need to do anything in the meantime.
            </p>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default function StatusPage() {
  return (
    <Suspense fallback={
      <div style={{ minWidth: "1920px", background: "#f8f7f5", display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        <Header variant="loggedIn" initial="?" />
        <div style={{ flex: 1 }} />
        <Footer />
      </div>
    }>
      <StatusInner />
    </Suspense>
  );
}
