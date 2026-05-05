"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { api } from "@/lib/api";

const serif = "Georgia, serif";
const sans = "Helvetica Neue, Helvetica, Arial, sans-serif";

type Contract = {
  id: string; path: string; status: string; my_role: string;
  maker_name?: string; keeper_name?: string; tc_name?: string;
  relationship?: string; maker_signed_at?: string; locked_at?: string;
  invite_token?: string;
};

function fmt(iso?: string) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

export default function KeeperContractsPage() {
  const router = useRouter();
  const [initial, setInitial] = useState("?");
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const keeperName = sessionStorage.getItem("ovyu_keeper_name") ?? "";
    setInitial(keeperName[0]?.toUpperCase() ?? "?");

    api.listMyContracts()
      .then(data => setContracts(data as Contract[]))
      .catch(() => setError("Failed to load contracts."))
      .finally(() => setLoading(false));
  }, []);

  const makingContracts = contracts.filter(c => c.my_role === "maker");
  const receivingContracts = contracts.filter(c => c.my_role === "keeper");

  function handleSignContract(c: Contract) {
    if (c.invite_token) {
      sessionStorage.setItem("ovyu_keeper_invite_token", c.invite_token);
    }
    if (c.maker_name) sessionStorage.setItem("ovyu_maker_name_for_keeper", c.maker_name);
    router.push("/keeper/contract");
  }

  function handleView(c: Contract) {
    sessionStorage.setItem("ovyu_contract_id", c.id);
    router.push(`/keeper/contracts/view?id=${c.id}`);
  }

  function handleDownload(c: Contract) {
    sessionStorage.setItem("ovyu_contract_id", c.id);
    router.push(`/keeper/contracts/view?id=${c.id}`);
  }

  return (
    <div style={{ minWidth: "1920px", background: "#f8f7f5", display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Header variant="loggedIn" initial={initial} />

      <div style={{ position: "relative", flex: 1, minHeight: "874px" }}>
        {/* Title: left 110px, top 165px */}
        <h1 style={{
          position: "absolute", left: "110px", top: "165px",
          fontFamily: serif, fontStyle: "italic", fontWeight: 400,
          fontSize: "64px", color: "#1a1a1a", margin: 0,
        }}>
          Your contracts
        </h1>

        {/* MAKING section label */}
        <p style={{
          position: "absolute", left: "110px", top: "289px",
          fontFamily: sans, fontWeight: 700, fontSize: "18px",
          color: "#c9a84c", textTransform: "uppercase", margin: 0,
        }}>
          Making
        </p>

        {/* Start a new contract button */}
        <a
          href="/signup"
          style={{
            position: "absolute", left: "110px", top: "323px",
            width: "1700px", height: "100px",
            border: "1px solid #888", borderRadius: "10px",
            display: "flex", alignItems: "center", gap: "30px",
            padding: "0 55px",
            textDecoration: "none", boxSizing: "border-box",
            background: "#f8f7f5",
          }}
        >
          <span style={{ fontFamily: sans, fontSize: "25px", color: "#1a1a1a", fontWeight: 300 }}>+</span>
          <span style={{
            fontFamily: sans, fontWeight: 700, fontSize: "16px",
            color: "#1a1a1a", textTransform: "uppercase",
          }}>
            Start a new contract
          </span>
        </a>

        {/* Maker contracts (if any) */}
        {makingContracts.map((c, i) => (
          <div
            key={c.id}
            style={{
              position: "absolute", left: "110px",
              top: `${443 + i * 108}px`,
              width: "1700px", height: "100px",
              background: "#f0ede8",
              borderRadius: "4px",
              display: "flex", alignItems: "center",
              padding: "0 55px", boxSizing: "border-box",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: "6px", width: "440px" }}>
              <span style={{ fontFamily: sans, fontWeight: 700, fontSize: "16px", color: "#888", textTransform: "uppercase" }}>
                MAKER
              </span>
              <span style={{ fontFamily: serif, fontWeight: 700, fontSize: "30px", color: "#1a1a1a" }}>
                For {c.keeper_name}
              </span>
            </div>
            <span style={{ fontFamily: sans, fontStyle: "italic", fontSize: "18px", color: "#888", marginLeft: "auto" }}>
              {c.status === "LOCKED" ? `Signed on ${fmt(c.locked_at)}` : "Pending Keeper signature"}
            </span>
          </div>
        ))}

        {/* RECEIVING section */}
        {(() => {
          const baseTop = 443 + makingContracts.length * 108 + 60;
          return (
            <>
              <p style={{
                position: "absolute", left: "110px", top: `${baseTop}px`,
                fontFamily: sans, fontWeight: 700, fontSize: "18px",
                color: "#c9a84c", textTransform: "uppercase", margin: 0,
              }}>
                Receiving
              </p>

              {loading && (
                <p style={{
                  position: "absolute", left: "110px", top: `${baseTop + 34}px`,
                  fontFamily: sans, fontSize: "16px", color: "#888", margin: 0,
                }}>
                  Loading…
                </p>
              )}

              {error && (
                <p style={{
                  position: "absolute", left: "110px", top: `${baseTop + 34}px`,
                  fontFamily: sans, fontSize: "16px", color: "#B4372C", margin: 0,
                }}>
                  {error}
                </p>
              )}

              {!loading && !error && receivingContracts.length === 0 && (
                <p style={{
                  position: "absolute", left: "110px", top: `${baseTop + 34}px`,
                  fontFamily: sans, fontStyle: "italic", fontSize: "16px", color: "#888", margin: 0,
                }}>
                  No contracts yet.
                </p>
              )}

              {receivingContracts.map((c, i) => {
                const isLocked = c.status === "LOCKED";
                return (
                  <div
                    key={c.id}
                    style={{
                      position: "absolute", left: "110px",
                      top: `${baseTop + 34 + i * 108}px`,
                      width: "1700px", height: "100px",
                      background: "#eceee5",
                      display: "flex", alignItems: "center",
                      padding: "18px 55px", boxSizing: "border-box",
                    }}
                  >
                    <div style={{ display: "flex", flexDirection: "column", gap: "9px", width: "440px" }}>
                      <span style={{ fontFamily: sans, fontWeight: 700, fontSize: "16px", color: "#5c6b4a" }}>
                        KEEPER
                      </span>
                      <span style={{ fontFamily: serif, fontWeight: 700, fontSize: "30px", color: "#1a1a1a" }}>
                        From {c.maker_name}
                      </span>
                    </div>

                    <span style={{
                      fontFamily: sans, fontStyle: "italic", fontSize: "18px",
                      color: "#888", marginLeft: "auto",
                    }}>
                      {isLocked ? `Signed on ${fmt(c.locked_at)}` : "Pending signature"}
                    </span>

                    {isLocked ? (
                      <div style={{ display: "flex", gap: "64px", marginLeft: "64px" }}>
                        <span style={{ fontFamily: sans, fontStyle: "italic", fontSize: "18px", color: "#888" }}>
                          Held for you
                        </span>
                        <button
                          onClick={() => handleView(c)}
                          style={{ fontFamily: sans, fontStyle: "italic", fontSize: "18px", color: "#1a1a1a", background: "none", border: "none", cursor: "pointer", padding: 0 }}
                        >
                          View
                        </button>
                        <button
                          onClick={() => handleDownload(c)}
                          style={{ fontFamily: sans, fontStyle: "italic", fontSize: "18px", color: "#1a1a1a", background: "none", border: "none", cursor: "pointer", padding: 0 }}
                        >
                          Download ⤓
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleSignContract(c)}
                        style={{
                          fontFamily: sans, fontStyle: "italic", fontSize: "18px",
                          color: "#1a1a1a", background: "none", border: "none",
                          cursor: "pointer", padding: 0, marginLeft: "64px",
                        }}
                      >
                        Sign Contract
                      </button>
                    )}
                  </div>
                );
              })}
            </>
          );
        })()}
      </div>

      <Footer />
    </div>
  );
}
