"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { YouBar } from "@/components/YouBar";
import { api } from "@/lib/api";

const serif = "Georgia, serif";
const sans = "Helvetica Neue, Helvetica, Arial, sans-serif";

type ContractRow = {
  id: string; path: string; status: string; my_role: string;
  maker_name?: string; keeper_name?: string; tc_name?: string;
  relationship?: string; maker_signed_at?: string; locked_at?: string;
  voice_status?: string;
};

function fmtDate(iso?: string) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function MakerRow({ c, voiceComplete }: { c: ContractRow; voiceComplete?: boolean }) {
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
          <Link href={voiceComplete ? `/upload/${c.id}` : `/keeper/contracts/view?id=${c.id}`} style={{
            fontFamily: sans, fontStyle: "italic", fontWeight: 400, fontSize: "18px", color: "#1a1a1a",
            textDecoration: "underline",
          }}>
            {voiceComplete ? "Upload" : "View Contract"}
          </Link>
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
            <button
              onClick={() => window.open(`/keeper/contracts/view?id=${c.id}&print=1`, "_blank")}
              style={{ fontFamily: sans, fontWeight: 700, fontSize: "18px", color: "#1a1a1a", background: "none", border: "none", cursor: "pointer", padding: 0 }}
            >
              Download ⤓
            </button>
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
  const [voiceCompleteMap, setVoiceCompleteMap] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const name = sessionStorage.getItem("ovyu_maker_name") ?? sessionStorage.getItem("ovyu_keeper_name") ?? "";
    setInitial(name[0]?.toUpperCase() ?? "?");

    api.listMyContracts()
      .then(async (cs) => {
        setContracts(cs);

        // Fetch voice status for locked maker contracts
        const makerContracts = cs.filter(c => c.my_role === "maker" && c.status === "LOCKED");
        const voiceMap: Record<string, boolean> = {};
        for (const c of makerContracts) {
          try {
            const status = await api.getVoiceStatus(c.id);
            voiceMap[c.id] = !!status.name && !!status.profile;
          } catch {
            voiceMap[c.id] = false;
          }
        }
        setVoiceCompleteMap(voiceMap);
      })
      .catch(() => setError("Could not load contracts."))
      .finally(() => setLoading(false));
  }, []);

  const making = contracts.filter(c => c.my_role === "maker");
  const receiving = contracts.filter(c => c.my_role === "keeper");
  const tc = contracts.filter(c => c.my_role === "tc");

  // Check if any locked maker contract has voice complete
  const voiceIsComplete = making.some(c => c.status === "LOCKED" && voiceCompleteMap[c.id]);

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
            ) : (
              <>
                {making.map(c => <MakerRow key={c.id} c={c} voiceComplete={voiceCompleteMap[c.id]} />)}
                {/* "Start a new contract" row — always shown */}
                <div style={{
                  width: "1700px", height: "100px",
                  border: "1px solid #888", borderRadius: "8px",
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
                {/* "Ready to begin?" CTA — shown for the first LOCKED contract without voice complete */}
                {!voiceIsComplete && (() => {
                  const locked = making.find(c => c.status === "LOCKED");
                  if (!locked) return null;
                  return (
                    <div style={{ display: "flex", justifyContent: "flex-end" }}>
                      <Link href="/upload/_/voice/name" onClick={() => sessionStorage.setItem("ovyu_contract_id", locked.id)} style={{
                        display: "flex", alignItems: "center", justifyContent: "center",
                        width: "345px", height: "48px",
                        background: "#1a1a1a", borderRadius: "8px",
                        fontFamily: sans, fontSize: "16px", color: "#f5f0e8",
                        textDecoration: "none",
                      }}>
                        <em style={{ fontWeight: 300, fontStyle: "italic" }}>Ready to begin?</em>
                        &nbsp;Start with your voice →
                      </Link>
                    </div>
                  );
                })()}
              </>
            )}
          </div>

          {/* Receiving section — only shown when there are receiving contracts */}
          {receiving.length > 0 && (
            <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
              <p style={{ fontFamily: sans, fontWeight: 700, fontSize: "18px", color: "#c9a84c", margin: 0 }}>RECEIVING</p>
              {receiving.map(c => <KeeperRow key={c.id} c={c} />)}
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

      {/* Hint text above locked YOU bar — only show when voice not complete */}
      {!voiceIsComplete && (
        <div style={{ paddingLeft: "50px", paddingBottom: "12px" }}>
          <p style={{
            fontFamily: sans, fontStyle: "oblique", fontSize: "16px", color: "#888", margin: 0, lineHeight: "normal",
          }}>
            Complete your voice recording to unlock your profile.
          </p>
        </div>
      )}

      <YouBar
        voiceComplete={voiceIsComplete}
        onDimensionClick={(dimension) => {
          // On contracts page, dimension clicks don't navigate anywhere
          // This is just to enable the interaction for consistency
        }}
      />

      <Footer />
    </div>
  );
}
