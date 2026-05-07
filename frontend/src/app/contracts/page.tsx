"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { api } from "@/lib/api";

const serif = "Georgia, serif";
const sans = "Helvetica Neue, Helvetica, Arial, sans-serif";

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
    <div style={{
      width: "1700px", height: "100px",
      background: "#efeaf2",
      display: "flex", alignItems: "center", justifyContent: "space-between",
      paddingLeft: "55px", paddingRight: "55px",
      boxSizing: "border-box",
    }}>
      {/* Left — avatar + meta */}
      <div style={{ width: "452px", display: "flex", flexDirection: "row", gap: "40px", alignItems: "center" }}>
        <div style={{
          width: "50px", height: "50px",
          background: "#4b3c5e", borderRadius: "50%",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <span style={{ fontFamily: serif, fontWeight: 400, fontSize: "28px", color: "#fff" }}>M</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "9px" }}>
          <p style={{ fontFamily: sans, fontWeight: 700, fontSize: "16px", color: "#6a4d7d", margin: 0 }}>MAKER</p>
          <p style={{ fontFamily: serif, fontWeight: 700, fontSize: "30px", color: "#1a1a1a", margin: 0 }}>For {keeperName}</p>
        </div>
      </div>

      {/* Middle / Right */}
      {isLocked ? (
        <>
          <span style={{ fontFamily: sans, fontStyle: "italic", fontWeight: 400, fontSize: "18px", color: "#888" }}>
            Signed on {lockedDate}
          </span>
          <Link href={`/contract/sign?id=${c.id}`} style={{
            fontFamily: sans, fontStyle: "italic", fontWeight: 400, fontSize: "18px", color: "#1a1a1a",
            textDecoration: "underline",
          }}>
            View Contract
          </Link>
          <div style={{ display: "flex", flexDirection: "row", gap: "12px", alignItems: "center" }}>
            <Link href="/upload/start" style={{
              fontFamily: sans, fontWeight: 700, fontSize: "18px", color: "#1a1a1a", textDecoration: "none",
            }}>
              UPLOAD
            </Link>
            <span style={{ fontSize: "18px" }}>→</span>
          </div>
        </>
      ) : makerSigned ? (
        <>
          <span style={{ fontFamily: sans, fontStyle: "italic", fontWeight: 400, fontSize: "18px", color: "#888" }}>
            Contract sent {sentDate}
          </span>
          <span style={{ fontFamily: sans, fontStyle: "italic", fontWeight: 400, fontSize: "18px", color: "#888" }}>
            Pending
          </span>
        </>
      ) : (
        <>
          <span style={{ fontFamily: sans, fontStyle: "italic", fontWeight: 400, fontSize: "18px", color: "#888" }}>
            Pending Status
          </span>
          <Link href={`/contract/sign?id=${c.id}`} style={{
            fontFamily: sans, fontWeight: 700, fontSize: "18px", color: "#1a1a1a", textDecoration: "none",
          }}>
            Sign Contract
          </Link>
        </>
      )}
    </div>
  );
}

function KeeperRow({ c }: { c: ContractRow }) {
  const isLocked = c.status === "LOCKED";
  const makerName = c.maker_name ?? "Maker";
  const signedDate = fmtDate(c.locked_at);

  return (
    <div style={{
      width: "1700px", height: "100px",
      background: "#eceee5",
      display: "flex", alignItems: "center", justifyContent: "space-between",
      paddingLeft: "55px", paddingRight: "55px",
      boxSizing: "border-box",
    }}>
      <div style={{ display: "flex", flexDirection: "column", gap: "9px" }}>
        <p style={{ fontFamily: sans, fontWeight: 700, fontSize: "16px", color: "#4a6640", margin: 0 }}>KEEPER</p>
        <p style={{ fontFamily: serif, fontWeight: 700, fontSize: "30px", color: "#1a1a1a", margin: 0 }}>From {makerName}</p>
      </div>

      {isLocked ? (
        <>
          <span style={{ fontFamily: sans, fontStyle: "italic", fontWeight: 400, fontSize: "18px", color: "#888" }}>
            Signed on {signedDate}
          </span>
          <span style={{ fontFamily: sans, fontStyle: "italic", fontWeight: 400, fontSize: "18px", color: "#888" }}>
            Held for you
          </span>
          <div style={{ display: "flex", gap: "48px", alignItems: "center" }}>
            <Link href={`/keeper/contracts/view?id=${c.id}`} style={{
              fontFamily: sans, fontWeight: 700, fontSize: "18px", color: "#1a1a1a",
              textDecoration: "underline",
            }}>
              View
            </Link>
            <Link href={`/keeper/contracts/view?id=${c.id}&print=1`} style={{
              fontFamily: sans, fontWeight: 700, fontSize: "18px", color: "#1a1a1a",
              textDecoration: "none",
            }}>
              Download ⤓
            </Link>
          </div>
        </>
      ) : (
        <>
          <span style={{ fontFamily: sans, fontStyle: "italic", fontWeight: 400, fontSize: "18px", color: "#888" }}>
            Pending signature
          </span>
          <span style={{ fontFamily: sans, fontStyle: "italic", fontWeight: 400, fontSize: "18px", color: "#888" }}>—</span>
        </>
      )}
    </div>
  );
}

function TcRow({ c }: { c: ContractRow }) {
  const makerName = c.maker_name ?? "Maker";
  const signedDate = fmtDate(c.locked_at);

  return (
    <div style={{
      width: "1700px", height: "100px",
      background: "#f5f0e8",
      display: "flex", alignItems: "center", justifyContent: "space-between",
      paddingLeft: "55px", paddingRight: "55px",
      boxSizing: "border-box",
    }}>
      <div style={{ display: "flex", flexDirection: "column", gap: "9px" }}>
        <p style={{ fontFamily: sans, fontWeight: 700, fontSize: "16px", color: "#c9a84c", margin: 0 }}>TRANSFER CONTACT</p>
        <p style={{ fontFamily: serif, fontWeight: 700, fontSize: "30px", color: "#1a1a1a", margin: 0 }}>For {makerName}</p>
      </div>
      <span style={{ fontFamily: sans, fontStyle: "italic", fontWeight: 400, fontSize: "18px", color: "#888" }}>
        {c.status === "LOCKED" ? `Active since ${signedDate}` : "Pending"}
      </span>
    </div>
  );
}

export default function ContractsPage() {
  const [contracts, setContracts] = useState<ContractRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [initial, setInitial] = useState("?");

  useEffect(() => {
    const name = sessionStorage.getItem("ovyu_maker_name") ?? sessionStorage.getItem("ovyu_keeper_name") ?? "";
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
    <div style={{ minWidth: "1920px", background: "#f8f7f5", display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Header variant="loggedIn" initial={initial} />

      <div style={{ flex: 1, paddingTop: "78px", paddingBottom: "80px" }}>
        <div style={{
          width: "1700px",
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          gap: "50px",
        }}>
          <h1 style={{
            fontFamily: serif, fontStyle: "italic", fontWeight: 400,
            fontSize: "64px", color: "#1a1a1a",
            margin: 0, lineHeight: "normal",
          }}>Your contracts</h1>

          {error && <p style={{ fontFamily: sans, fontSize: "18px", color: "#B4372C", margin: 0 }}>{error}</p>}

          {/* Making section */}
          <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
            <p style={{ fontFamily: sans, fontWeight: 700, fontSize: "18px", color: "#c9a84c", margin: 0 }}>MAKING</p>
            {loading ? (
              <p style={{ fontFamily: sans, fontSize: "18px", color: "#888", margin: 0 }}>Loading…</p>
            ) : making.length === 0 ? (
              <div style={{
                width: "1700px", height: "100px",
                border: "1px solid #888", borderRadius: "10px",
                display: "flex", alignItems: "center", gap: "20px",
                paddingLeft: "55px", boxSizing: "border-box",
              }}>
                <span style={{ fontFamily: sans, fontSize: "22px", color: "#888" }}>+</span>
                <Link href="/signup" style={{
                  fontFamily: sans, fontWeight: 700, fontSize: "16px",
                  textTransform: "uppercase", color: "#1a1a1a",
                  letterSpacing: "0.05em", textDecoration: "none",
                }}>
                  Start a new contract
                </Link>
              </div>
            ) : (
              making.map(c => <MakerRow key={c.id} c={c} />)
            )}
          </div>

          {/* Receiving section */}
          {(receiving.length > 0 || !loading) && (
            <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
              <p style={{ fontFamily: sans, fontWeight: 700, fontSize: "18px", color: "#c9a84c", margin: 0 }}>RECEIVING</p>
              {loading ? (
                <p style={{ fontFamily: sans, fontSize: "18px", color: "#888", margin: 0 }}>Loading…</p>
              ) : receiving.length === 0 ? (
                <p style={{ fontFamily: sans, fontStyle: "italic", fontSize: "16px", color: "#888", margin: 0 }}>
                  No contracts received yet.
                </p>
              ) : (
                receiving.map(c => <KeeperRow key={c.id} c={c} />)
              )}
            </div>
          )}

          {/* Transfer Contact section */}
          {tc.length > 0 && (
            <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
              <p style={{ fontFamily: sans, fontWeight: 700, fontSize: "18px", color: "#c9a84c", margin: 0 }}>TRANSFER CONTACT</p>
              {tc.map(c => <TcRow key={c.id} c={c} />)}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
