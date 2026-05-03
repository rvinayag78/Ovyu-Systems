"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { api } from "@/lib/api";

const serif = "Georgia, serif";
const sans = "Helvetica Neue, Helvetica, Arial, sans-serif";

function normalize(s: string) { return s.trim().toLowerCase().normalize("NFC"); }

const inputStyle: React.CSSProperties = {
  height: "74px", background: "#fff", border: "1px solid #888", borderRadius: "10px",
  padding: "14px", fontFamily: sans, fontSize: "16px", color: "#1a1a1a",
  boxSizing: "border-box", width: "100%", outline: "none",
};

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
      router.push("/contracts");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign failed.");
    } finally {
      setLoading(false);
    }
  }

  if (error && !contract) return (
    <div style={{ minWidth: "1920px", background: "#f8f7f5", display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Header variant="loggedIn" initial={initial} />
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ fontFamily: sans, fontSize: "18px", color: "#B4372C" }}>{error}</p>
      </div>
      <Footer />
    </div>
  );

  return (
    <div style={{ minWidth: "1920px", background: "#f8f7f5", display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Header variant="loggedIn" initial={initial} />

      <div style={{ position: "relative", flex: 1, minHeight: "874px" }}>
        {/* Content grid at left:58px, top:40px (143-103) */}
        <form
          onSubmit={handleSign}
          style={{
            position: "absolute",
            left: "58px",
            top: "40px",
            width: "1804px",
            display: "grid",
            gridTemplateColumns: "1130px 613px",
            columnGap: "49px",
            rowGap: "42px",
          }}
        >
          {/* Title row — col 1 */}
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <h1 style={{
              fontFamily: serif, fontStyle: "italic", fontWeight: 400,
              fontSize: "64px", color: "#1a1a1a", margin: 0, lineHeight: "normal",
            }}>Your contract.</h1>
            <p style={{ fontFamily: sans, fontWeight: 400, fontSize: "22px", color: "#888", margin: 0 }}>
              Read through carefully. This is between you, your Keeper
              {isPrivate ? ", and your Transfer Contact." : "."}
            </p>
          </div>

          {/* Title row — col 2 (empty) */}
          <div />

          {/* Contract card */}
          <div style={{
            width: "1130px", height: "580px",
            background: "#fff", border: "2px solid #e1e1e1", borderRadius: "15px",
            padding: "60px", display: "flex", flexDirection: "column", justifyContent: "space-between",
            boxSizing: "border-box",
          }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px", width: "354px" }}>
              <p style={{ fontFamily: sans, fontWeight: 700, fontSize: "22px", color: "#000", margin: 0 }}>Ovyu Agreement</p>
              <p style={{ fontFamily: sans, fontWeight: 700, fontSize: "22px", color: "#8a6e30", margin: 0 }}>Party A (Maker)</p>
              <p style={{ fontFamily: sans, fontWeight: 700, fontSize: "22px", color: "#8a6e30", margin: 0 }}>
                {isPrivate ? "Party B (Keeper)  Transfer Contact" : "Party B (Keeper)"}
              </p>
            </div>
            <div style={{ fontFamily: sans, fontWeight: 400, fontSize: "18px", color: "#444", width: "890px", lineHeight: "1.5" }}>
              <p style={{ margin: "0 0 8px" }}>Maker: {makerName || "[Your name]"}</p>
              <p style={{ margin: "0 0 8px" }}>Keeper: {contract?.keeper_name ?? "[Keeper name]"} · Relationship: {contract?.relationship ?? "[Relationship]"}</p>
              {isPrivate && <p style={{ margin: "0 0 8px" }}>Transfer Contact: {contract?.tc_name ?? "[Transfer Contact name]"}</p>}
              {isPrivate ? (
                <p style={{ margin: "0 0 8px" }}>Your Keeper is not aware of this upload. Your Transfer Contact has been designated to confirm the Transfer when the time comes. Your Keeper will be notified at that point.</p>
              ) : (
                <p style={{ margin: "0 0 8px" }}>Your Keeper is aware of this upload and has agreed to receive it.</p>
              )}
              <p style={{ margin: "0 0 4px" }}>Access begins: Upon the Transfer{isPrivate ? ", as confirmed by the Transfer Contact" : ""}.</p>
              <p style={{ margin: "0 0 4px" }}>Access duration: Lifetime unless otherwise specified.</p>
              <p style={{ margin: "0 0 8px" }}>Transferable: No · Interaction limit: No limit</p>
              <p style={{ margin: 0 }}>The Maker retains full ownership and may pause, edit, or withdraw this upload at any time before the Transfer is activated. The Keeper may not alter the upload in any way.</p>
            </div>
          </div>

          {/* Sign panel */}
          <div style={{
            width: "613px", height: "580px",
            background: "#fff", border: "2px solid #e1e1e1", borderRadius: "15px",
            padding: "50px 44px 31px 52px",
            display: "flex", flexDirection: "column", gap: "20px",
            boxSizing: "border-box",
          }}>
            {alreadySigned ? (
              <>
                <p style={{ fontFamily: serif, fontWeight: 700, fontSize: "28px", color: "#000", margin: 0 }}>
                  {isLocked ? "Contract locked" : "You've signed"}
                </p>
                <p style={{ fontFamily: sans, fontWeight: 400, fontSize: "20px", color: "#888", margin: 0 }}>
                  {isLocked
                    ? "All parties have signed. This contract is active."
                    : `Signed on ${new Date(contract!.maker_signed_at!).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}. Waiting for the other party.`}
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  <label style={{ fontFamily: sans, fontWeight: 700, fontSize: "20px", color: "#444" }}>Signed by</label>
                  <div style={{ ...inputStyle, height: "74px", display: "flex", alignItems: "center", color: "#888" }}>{makerName}</div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  <label style={{ fontFamily: sans, fontWeight: 700, fontSize: "20px", color: "#444" }}>Date signed</label>
                  <div style={{ ...inputStyle, height: "74px", display: "flex", alignItems: "center", color: "#888" }}>
                    {new Date(contract!.maker_signed_at!).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                  </div>
                </div>
                {isLocked && (
                  <Link
                    href="/upload/start"
                    style={{
                      height: "62px", background: "#000", borderRadius: "8px", textDecoration: "none",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontFamily: sans, fontWeight: 700, fontSize: "20px", color: "#f5f0e8",
                    }}
                  >
                    Begin my upload →
                  </Link>
                )}
              </>
            ) : (
              <>
                <p style={{ fontFamily: serif, fontWeight: 700, fontSize: "28px", color: "#000", margin: 0 }}>Sign as Maker</p>
                <p style={{ fontFamily: sans, fontWeight: 400, fontSize: "20px", color: "#888", margin: 0 }}>
                  By signing, you confirm you have read and agree to the terms on this page.
                </p>

                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  <label style={{ fontFamily: sans, fontWeight: 700, fontSize: "20px", color: "#444" }}>Full legal name</label>
                  <input
                    value={typedName}
                    onChange={e => setTypedName(e.target.value)}
                    placeholder="Type your full name"
                    style={{
                      ...inputStyle,
                      border: typedName && !nameMatch ? "1px solid #B4372C" : "1px solid #888",
                    }}
                    required
                  />
                  {typedName && !nameMatch && (
                    <span style={{ fontFamily: sans, fontSize: "13px", color: "#B4372C" }}>
                      Name doesn&apos;t match. Type: {makerName}
                    </span>
                  )}
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  <label style={{ fontFamily: sans, fontWeight: 700, fontSize: "20px", color: "#444" }}>Date</label>
                  <div style={{ ...inputStyle, height: "74px", display: "flex", alignItems: "center", color: "#888" }}>{today}</div>
                </div>

                {error && <p style={{ fontFamily: sans, fontSize: "14px", color: "#B4372C", margin: 0 }}>{error}</p>}

                <button
                  type="submit"
                  disabled={!nameMatch || loading}
                  style={{
                    height: "62px", background: !nameMatch || loading ? "#666" : "#000",
                    borderRadius: "8px", border: "none",
                    fontFamily: sans, fontWeight: 700, fontSize: "20px", color: "#f5f0e8",
                    cursor: !nameMatch || loading ? "not-allowed" : "pointer",
                  }}
                >
                  {loading ? "Signing…" : "Sign and continue →"}
                </button>

                {isPrivate && (
                  <div style={{
                    background: "#f5edd6", border: "1px solid #c9a84c", borderRadius: "8px",
                    padding: "14px 20px", fontFamily: sans, fontSize: "14px", color: "#444",
                  }}>
                    Your Transfer Contact will also receive this contract to sign.
                  </div>
                )}
              </>
            )}
          </div>

          {/* Footnote */}
          <p style={{
            fontFamily: sans, fontStyle: "italic", fontWeight: 400,
            fontSize: "16px", color: "#888", margin: 0,
          }}>
            Your digital signature carries the same intent as a handwritten signature within the Ovyu platform.
          </p>
        </form>
      </div>

      <Footer />
    </div>
  );
}

export default function SignPage() {
  return (
    <Suspense fallback={
      <div style={{ minWidth: "1920px", background: "#f8f7f5", display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        <Header variant="loggedIn" initial="?" />
        <div style={{ flex: 1 }} />
        <Footer />
      </div>
    }>
      <SignInner />
    </Suspense>
  );
}
