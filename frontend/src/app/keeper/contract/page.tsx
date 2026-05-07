"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { api } from "@/lib/api";

const serif = "Georgia, serif";
const sans = "Helvetica Neue, Helvetica, Arial, sans-serif";

const inputStyle: React.CSSProperties = {
  height: "74px",
  background: "#fff",
  border: "1px solid #888",
  borderRadius: "10px",
  padding: "14px",
  fontFamily: sans,
  fontSize: "16px",
  color: "#1a1a1a",
  boxSizing: "border-box",
  width: "100%",
  outline: "none",
};

function normalize(s: string) { return s.trim().toLowerCase().normalize("NFC"); }

export default function KeeperContractPage() {
  const router = useRouter();

  const [keeperName, setKeeperName] = useState("");
  const [makerName, setMakerName] = useState("");
  const [relationship, setRelationship] = useState("");
  const [initial, setInitial] = useState("?");
  const [inviteToken, setInviteToken] = useState("");
  const [ready, setReady] = useState(false);
  const [typedName, setTypedName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [accepted, setAccepted] = useState(false);

  useEffect(() => {
    const storedKeeperName = sessionStorage.getItem("ovyu_keeper_name") ?? "";
    const storedMakerName = sessionStorage.getItem("ovyu_maker_name_for_keeper") ?? "";
    const storedContractId = sessionStorage.getItem("ovyu_contract_id") ?? "";
    const storedInviteToken = sessionStorage.getItem("ovyu_keeper_invite_token") ?? "";

    if (!storedKeeperName || !storedContractId || !storedInviteToken) {
      router.replace("/contracts");
      return;
    }

    setKeeperName(storedKeeperName);
    setMakerName(storedMakerName);
    setInviteToken(storedInviteToken);
    setInitial(storedKeeperName[0]?.toUpperCase() ?? "?");
    setReady(true);

    // Load relationship in background without blocking render
    api.getContract(storedContractId)
      .then(c => { if (c.relationship) setRelationship(c.relationship); })
      .catch(() => {});
  }, [router]);

  const nameMatch = keeperName ? normalize(typedName) === normalize(keeperName) : false;
  const today = new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });

  async function handleSign(e: React.FormEvent) {
    e.preventDefault();
    if (!nameMatch || !inviteToken) return;
    setError(""); setLoading(true);
    try {
      await api.acceptInvitation(inviteToken, typedName);
      setAccepted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Signing failed.");
    } finally {
      setLoading(false);
    }
  }

  if (!ready) return (
    <div style={{ minWidth: "1920px", background: "#f8f7f5", display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Header variant="loggedIn" initial={initial} />
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ fontFamily: sans, fontSize: "18px", color: "#888" }}>Loading…</p>
      </div>
      <Footer />
    </div>
  );

  // Signed confirmation
  if (accepted) return (
    <div style={{ minWidth: "1920px", background: "#f8f7f5", display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Header variant="loggedIn" initial={initial} />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", paddingTop: "67px", paddingBottom: "60px", gap: "40px" }}>
        <div style={{
          width: "1130px",
          height: "687px",
          background: "#fff",
          border: "2px solid #e1e1e1",
          borderRadius: "15px",
          padding: "60px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "space-between",
          boxSizing: "border-box",
        }}>
          <div style={{
            width: "123px", height: "123px",
            background: "#fef3e2",
            border: "3px solid #c9a84c",
            borderRadius: "50%",
            display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0,
          }}>
            <span style={{ fontFamily: serif, fontWeight: 700, fontSize: "64px", color: "#c9a84c" }}>✓</span>
          </div>

          <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: "8px" }}>
            <h1 style={{ fontFamily: serif, fontStyle: "italic", fontWeight: 400, fontSize: "64px", color: "#1a1a1a", margin: 0, whiteSpace: "nowrap" }}>
              You&apos;ve signed.
            </h1>
            <p style={{ fontFamily: sans, fontWeight: 400, fontSize: "22px", color: "#888", margin: 0, whiteSpace: "nowrap" }}>
              The contract between you and {makerName} is now in place.
            </p>
            <a
              href="/contracts"
              style={{
                marginTop: "12px",
                fontFamily: sans, fontWeight: 700, fontSize: "16px",
                color: "#fff", background: "#000", borderRadius: "8px",
                padding: "12px 24px", textDecoration: "none", display: "inline-block",
                width: "fit-content",
              }}
            >
              View your contracts →
            </a>
          </div>

          <div style={{ width: "500px", height: "5px", background: "#d9d9d9", flexShrink: 0 }} />

          <div style={{
            width: "934px",
            background: "#fef3e2",
            border: "2px solid #c9a84c",
            borderRadius: "20px",
            padding: "48px 42px",
            display: "flex", flexDirection: "column", gap: "29px",
            boxSizing: "border-box",
          }}>
            <p style={{ fontFamily: sans, fontWeight: 700, fontSize: "20px", color: "#444", margin: 0 }}>
              What happens when the time comes
            </p>
            <p style={{ fontFamily: sans, fontWeight: 400, fontSize: "18px", color: "#444", margin: 0, lineHeight: "1.5" }}>
              When {makerName} passes, you will need to go to{" "}
              <strong style={{ color: "#4472c4" }}>ovyu.com/activate-transfer</strong>. Once the
              Transfer is activated, you will be prompted to create an account and access what{" "}
              {makerName} left for you. You will always be the one to decide when you are ready.
            </p>
          </div>
        </div>

        <p style={{
          fontFamily: sans, fontStyle: "italic", fontWeight: 400,
          fontSize: "16px", color: "#888", margin: 0, textAlign: "center",
        }}>
          You will always be the one to decide when you are ready to access this. Nothing happens without your confirmation.
        </p>
      </div>
      <Footer />
    </div>
  );

  // Contract signing form
  return (
    <div style={{ minWidth: "1920px", background: "#f8f7f5", display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Header variant="loggedIn" initial={initial} />
      <form onSubmit={handleSign} style={{ flex: 1 }}>
        <div style={{
          margin: "40px auto 40px",
          width: "1804px",
          display: "grid",
          gridTemplateColumns: "1130px 613px",
          columnGap: "49px",
          rowGap: "42px",
        }}>
          {/* H1 + subtitle */}
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <h1 style={{
              fontFamily: serif, fontStyle: "italic", fontWeight: 400,
              fontSize: "64px", color: "#1a1a1a", margin: 0, lineHeight: "normal",
            }}>
              {makerName} has created something for you.
            </h1>
            <p style={{ fontFamily: sans, fontWeight: 400, fontSize: "22px", color: "#888", margin: 0 }}>
              Review the agreement below. Take your time. Sign only if you&apos;re ready to accept.
            </p>
          </div>

          <div />

          {/* Contract card */}
          <div style={{
            width: "1130px", height: "580px",
            background: "#fff", border: "2px solid #e1e1e1", borderRadius: "15px",
            padding: "60px", display: "flex", flexDirection: "column", justifyContent: "space-between",
            boxSizing: "border-box",
          }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <p style={{ fontFamily: sans, fontWeight: 700, fontSize: "22px", color: "#000", margin: 0 }}>
                Ovyu Agreement
              </p>
              <p style={{ fontFamily: sans, fontWeight: 700, fontSize: "22px", color: "#8a6e30", margin: 0 }}>
                Party A (Maker): {makerName}
              </p>
              <p style={{ fontFamily: sans, fontWeight: 700, fontSize: "22px", color: "#8a6e30", margin: 0 }}>
                Party B (Keeper): {keeperName}
              </p>
            </div>

            <div style={{ fontFamily: sans, fontWeight: 400, fontSize: "18px", color: "#444", lineHeight: "1.5" }}>
              <p style={{ margin: "0 0 16px" }}>Maker: {makerName}</p>
              <p style={{ margin: "0 0 16px" }}>Keeper: {keeperName}</p>
              {relationship && <p style={{ margin: "0 0 16px" }}>Relationship: {relationship}</p>}
              <p style={{ margin: "0 0 16px" }}>By accepting, you agree to receive the Maker&apos;s upload upon the Transfer. You understand that the upload is the personal creation of the Maker and may not be altered, shared, or transferred.</p>
              <p style={{ margin: "0 0 4px" }}>Access begins: Upon the Transfer.</p>
              <p style={{ margin: "0 0 16px" }}>Access duration: Lifetime unless specified.</p>
              <p style={{ margin: "0 0 4px" }}>You may withdraw your acceptance at any time before the Transfer is activated.</p>
              <p style={{ margin: 0 }}>Ovyu stores all data securely and uses it solely to deliver this upload to you. No data is shared or sold.</p>
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
            <p style={{ fontFamily: serif, fontWeight: 700, fontSize: "28px", color: "#000", margin: 0 }}>
              Sign as Keeper
            </p>
            <p style={{ fontFamily: sans, fontWeight: 400, fontSize: "20px", color: "#888", margin: 0 }}>
              By signing, you confirm you have read and agree to the terms on this page.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <label style={{ fontFamily: sans, fontWeight: 700, fontSize: "20px", color: "#444" }}>Full legal name</label>
              <input
                value={typedName}
                onChange={e => setTypedName(e.target.value)}
                placeholder="Your full legal name"
                style={{
                  ...inputStyle,
                  border: typedName && !nameMatch ? "1px solid #B4372C" : "1px solid #888",
                }}
                required
              />
              {typedName && !nameMatch && (
                <span style={{ fontFamily: sans, fontSize: "13px", color: "#B4372C" }}>
                  Name doesn&apos;t match. Type: {keeperName}
                </span>
              )}
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <label style={{ fontFamily: sans, fontWeight: 700, fontSize: "20px", color: "#444" }}>Date</label>
              <div style={{
                height: "74px", background: "#fff", border: "1px solid #888",
                borderRadius: "10px", padding: "14px", fontFamily: sans,
                fontSize: "16px", color: "#888", boxSizing: "border-box",
                display: "flex", alignItems: "center",
              }}>
                {today}
              </div>
            </div>

            {error && <p style={{ fontFamily: sans, fontSize: "14px", color: "#B4372C", margin: 0 }}>{error}</p>}

            <button
              type="submit"
              disabled={!nameMatch || loading}
              style={{
                height: "62px",
                background: !nameMatch || loading ? "#666" : "#000",
                borderRadius: "8px", border: "none", width: "100%",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontFamily: sans, fontWeight: 700, fontSize: "20px",
                color: "#f5f0e8",
                cursor: !nameMatch || loading ? "not-allowed" : "pointer",
              }}
            >
              {loading ? "Signing…" : "Sign and continue →"}
            </button>
          </div>

          {/* Footnote */}
          <p style={{
            fontFamily: sans, fontStyle: "italic", fontWeight: 400,
            fontSize: "16px", color: "#888", whiteSpace: "nowrap", margin: 0,
          }}>
            Your digital signature carries the same intent as a handwritten signature within the Ovyu platform.
          </p>
        </div>
      </form>
      <Footer />
    </div>
  );
}
