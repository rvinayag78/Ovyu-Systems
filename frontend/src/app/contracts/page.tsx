"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
        <div style={{ position: "relative", width: "50px", height: "50px", flexShrink: 0 }}>
          <div style={{
            position: "absolute", top: "-21.6%", left: "-21.6%", right: "-21.6%", bottom: "-21.6%",
            background: "#4b3c5e", borderRadius: "50%",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <span style={{ fontFamily: serif, fontWeight: 400, fontSize: "32px", color: "#fff" }}>M</span>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "9px" }}>
          <p style={{ fontFamily: sans, fontWeight: 700, fontSize: "16px", color: "#6a4d7d", margin: 0 }}>MAKER</p>
          <p style={{ fontFamily: serif, fontWeight: 700, fontSize: "30px", color: "#1a1a1a", margin: 0 }}>For {keeperName}</p>
        </div>
      </div>

      {/* Middle / Right */}
      {isLocked ? (
        voiceComplete ? (
          <>
            {/* Voice complete: Signed on + View Contract grouped center, Upload right */}
            <div style={{ display: "flex", alignItems: "center", gap: "40px", fontFamily: sans, fontStyle: "italic", fontWeight: 400, fontSize: "18px", flexShrink: 0, whiteSpace: "nowrap" }}>
              <span style={{ color: "#888" }}>Signed on {lockedDate}</span>
              <Link href={`/keeper/contracts/view?id=${c.id}`} style={{ color: "#1a1a1a", textDecoration: "none" }}>
                View Contract
              </Link>
            </div>
            <Link href={`/upload/${c.id}`} prefetch={false} onClick={() => sessionStorage.setItem('ovyu_contract_id', c.id)} style={{
              display: "flex", alignItems: "center", gap: "10px", flexShrink: 0,
              fontFamily: sans, fontWeight: 700, fontSize: "18px", color: "#1a1a1a",
              textDecoration: "none", textTransform: "uppercase",
            }}>
              Upload
              <svg width="15" height="26" viewBox="0 0 15 26" fill="none">
                <path d="M1 1L14 13L1 25" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
          </>
        ) : (
          <>
            {/* Voice not complete: Signed on center, View Contract right — 3 separate justify-between items */}
            <span style={{ fontFamily: sans, fontStyle: "italic", fontWeight: 400, fontSize: "18px", color: "#888", flexShrink: 0, whiteSpace: "nowrap" }}>
              Signed on {lockedDate}
            </span>
            <Link href={`/keeper/contracts/view?id=${c.id}`} style={{
              fontFamily: sans, fontStyle: "italic", fontWeight: 400, fontSize: "18px", color: "#1a1a1a",
              textDecoration: "none", flexShrink: 0, whiteSpace: "nowrap",
            }}>
              View Contract
            </Link>
          </>
        )
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
  const router = useRouter();
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
            voiceMap[c.id] = status.name === "complete" && status.profile === "complete";
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
  const lockedContractId = making.find(c => c.status === "LOCKED")?.id;

  return (
    <div style={{ width: "1920px", background: "#f8f7f5", display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Header variant="loggedIn" initial={initial} />

      <div style={{ flex: 1, paddingTop: "78px" }}>
        <div style={{
          width: "1700px",
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          gap: "50px",
          paddingBottom: "50px",
        }}>
          <h1 style={{
            fontFamily: serif, fontStyle: "italic", fontWeight: 400,
            fontSize: "64px", color: "#1a1a1a",
            margin: 0, lineHeight: "normal",
          }}>Your contracts</h1>

          {error && <p style={{ fontFamily: sans, fontSize: "18px", color: "#B4372C", margin: 0 }}>{error}</p>}

              {/* Making section */}
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
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
                  display: "flex", alignItems: "center", gap: "57px",
                  paddingLeft: "55px", paddingRight: "55px", boxSizing: "border-box",
                }}>
                  {/* 40px cross icon per Figma 2004:1572 */}
                  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" style={{ flexShrink: 0 }}>
                    <line x1="20" y1="0" x2="20" y2="40" stroke="#888" strokeWidth="2.5"/>
                    <line x1="0" y1="20" x2="40" y2="20" stroke="#888" strokeWidth="2.5"/>
                  </svg>
                  <Link href="/signup" style={{
                    fontFamily: sans, fontWeight: 700, fontSize: "22px",
                    color: "#888", textDecoration: "none", whiteSpace: "nowrap",
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
                      <button
                        onClick={async () => {
                          sessionStorage.setItem("ovyu_contract_id", locked.id);
                          try {
                            const status = await api.getVoiceStatus(locked.id);
                            const target = status.name !== "complete"
                              ? `/upload/${locked.id}/voice/name`
                              : `/upload/${locked.id}/voice/profile`;
                            router.push(target);
                          } catch {
                            router.push(`/upload/${locked.id}/voice/name`);
                          }
                        }}
                        style={{
                          display: "flex", alignItems: "center", justifyContent: "center",
                          width: "345px", height: "48px",
                          background: "#1a1a1a", borderRadius: "8px",
                          border: "none", cursor: "pointer",
                          fontFamily: sans, fontSize: "16px", color: "#f5f0e8",
                        }}
                      >
                        <em style={{ fontWeight: 300, fontStyle: "italic" }}>Ready to begin?</em>
                        &nbsp;Start with your voice →
                      </button>
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
        contractId={lockedContractId}
      />

      <Footer />
    </div>
  );
}
