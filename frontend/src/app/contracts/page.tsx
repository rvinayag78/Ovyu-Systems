"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { api } from "@/lib/api";

type ContractRow = {
  id: string; path: string; status: string; my_role: string;
  maker_name?: string; keeper_name?: string; tc_name?: string;
  relationship?: string; maker_signed_at?: string; locked_at?: string;
};

function fmtDate(iso?: string) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function MakerRow({ c }: { c: ContractRow }) {
  const makerSigned = !!c.maker_signed_at;
  const isLocked = c.status === "LOCKED";
  const sentDate = fmtDate(c.maker_signed_at);
  const lockedDate = fmtDate(c.locked_at) || sentDate;
  const keeperName = c.keeper_name ?? "Keeper";

  return (
    <div className="ovyu-contract-row">
      <div className="ovyu-contract-row__inner">
        <div className="ovyu-contract-row__left">
          <div className="ovyu-contract-row__avatar" />
          <div className="ovyu-contract-row__meta">
            <p className="ovyu-contract-row__role">Maker</p>
            <p className="ovyu-contract-row__name">For {keeperName}</p>
          </div>
        </div>

        {isLocked ? (
          <>
            <span className="ovyu-contract-row__status">Signed on {lockedDate}</span>
            <Link
              href={`/contract/sign?id=${c.id}`}
              className="ovyu-contract-row__action"
              style={{ color: "var(--ovyu-ink-soft)", textDecoration: "underline" }}
            >
              View Contract
            </Link>
            <Link
              href="/upload/start"
              className="ovyu-contract-row__action"
              style={{ fontWeight: 700, letterSpacing: "0.05em", textDecoration: "none" }}
            >
              UPLOAD →
            </Link>
          </>
        ) : makerSigned ? (
          <>
            <span className="ovyu-contract-row__status">Contract sent {sentDate}</span>
            <span className="ovyu-contract-row__status">Pending</span>
          </>
        ) : (
          <>
            <span className="ovyu-contract-row__status">Pending Status</span>
            <Link href={`/contract/sign?id=${c.id}`} className="ovyu-contract-row__action">
              Sign Contract
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

function KeeperRow({ c }: { c: ContractRow }) {
  const isLocked = c.status === "LOCKED";
  const makerName = c.maker_name ?? "Maker";
  const signedDate = fmtDate(c.locked_at);

  return (
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
            <div style={{ display: "flex", gap: 48, alignItems: "center" }}>
              <Link href={`/keeper/contracts/view?id=${c.id}`} className="ovyu-keeper-row__action">
                View
              </Link>
              <button onClick={() => window.print()} className="ovyu-keeper-row__action">
                Download ⤓
              </button>
            </div>
          </>
        ) : (
          <>
            <span className="ovyu-keeper-row__status" style={{ fontStyle: "italic" }}>Pending signature</span>
            <span className="ovyu-keeper-row__status">—</span>
          </>
        )}
      </div>
    </div>
  );
}

function TcRow({ c }: { c: ContractRow }) {
  const makerName = c.maker_name ?? "Maker";
  const signedDate = fmtDate(c.locked_at);

  return (
    <div className="ovyu-contract-row" style={{ background: "#f5f0e8" }}>
      <div className="ovyu-contract-row__inner">
        <div className="ovyu-contract-row__left">
          <div className="ovyu-contract-row__meta">
            <p className="ovyu-contract-row__role" style={{ color: "var(--ovyu-gold-dark)" }}>TRANSFER CONTACT</p>
            <p className="ovyu-contract-row__name">For {makerName}</p>
          </div>
        </div>
        <span className="ovyu-contract-row__status">
          {c.status === "LOCKED" ? `Active since ${signedDate}` : "Pending"}
        </span>
      </div>
    </div>
  );
}

export default function ContractsPage() {
  const [contracts, setContracts] = useState<ContractRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [initial, setInitial] = useState("?");

  useEffect(() => {
    const name = sessionStorage.getItem("ovyu_maker_name") ?? "";
    setInitial(name[0]?.toUpperCase() ?? "?");

    api.listMyContracts()
      .then(setContracts)
      .catch(() => setError("Could not load contracts."))
      .finally(() => setLoading(false));
  }, []);

  const making = contracts.filter(c => c.my_role === "maker");
  const receiving = contracts.filter(c => c.my_role === "keeper");
  const tc = contracts.filter(c => c.my_role === "tc");

  return (
    <div className="ovyu-page">
      <Header variant="loggedIn" initial={initial} />
      <main className="ovyu-main ovyu-main--contracts">
        <div style={{ width: "100%" }}>
          <h1 style={{
            fontFamily: "var(--ovyu-font-serif)", fontStyle: "italic",
            fontSize: 64, color: "var(--ovyu-ink)", marginBottom: 50,
          }}>
            Your contracts
          </h1>

          {error && <p style={{ color: "var(--ovyu-error)", marginBottom: 24 }}>{error}</p>}

          {/* Making section */}
          <div className="ovyu-contracts-section" style={{ marginBottom: 48 }}>
            <p className="ovyu-contracts-eyebrow">Making</p>
            {loading ? (
              <p style={{ color: "var(--ovyu-muted)", fontSize: 18 }}>Loading…</p>
            ) : making.length === 0 ? (
              <div style={{
                border: "1px solid var(--ovyu-muted)", borderRadius: 10,
                padding: "28px 36px", display: "flex", alignItems: "center", gap: 20,
              }}>
                <span style={{ fontSize: 22, color: "var(--ovyu-muted)" }}>+</span>
                <Link
                  href="/signup"
                  style={{ fontWeight: 700, fontSize: 16, textTransform: "uppercase", color: "var(--ovyu-ink)", letterSpacing: "0.05em", textDecoration: "none" }}
                >
                  Start a new contract
                </Link>
              </div>
            ) : (
              <>
                {making.map(c => <MakerRow key={c.id} c={c} />)}
              </>
            )}
          </div>

          {/* Receiving section */}
          {(receiving.length > 0 || !loading) && (
            <div className="ovyu-contracts-section" style={{ marginBottom: 48 }}>
              <p className="ovyu-contracts-eyebrow">Receiving</p>
              {loading ? (
                <p style={{ color: "var(--ovyu-muted)", fontSize: 18 }}>Loading…</p>
              ) : receiving.length === 0 ? (
                <p style={{ color: "var(--ovyu-muted)", fontSize: 16, fontStyle: "italic" }}>
                  No contracts received yet.
                </p>
              ) : (
                receiving.map(c => <KeeperRow key={c.id} c={c} />)
              )}
            </div>
          )}

          {/* Transfer Contact section */}
          {tc.length > 0 && (
            <div className="ovyu-contracts-section">
              <p className="ovyu-contracts-eyebrow">Transfer Contact</p>
              {tc.map(c => <TcRow key={c.id} c={c} />)}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
