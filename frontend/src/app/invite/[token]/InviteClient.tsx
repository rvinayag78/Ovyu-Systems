"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { api } from "@/lib/api";

const serif = "Georgia, serif";
const sans = "Helvetica Neue, Helvetica, Arial, sans-serif";

function normalize(s: string) { return s.trim().toLowerCase().normalize("NFC"); }

type Preview = {
  invitee_role: "keeper" | "tc";
  maker_name: string;
  keeper_name: string;
  tc_name: string;
  relationship: string;
  contract_id: string;
};

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

export function InviteClient() {
  const paramsToken = useParams<{ token: string }>()?.token;
  const token =
    typeof window !== "undefined"
      ? window.location.pathname.split("/invite/")[1]?.split("/")[0] ?? paramsToken
      : paramsToken;

  const [preview, setPreview] = useState<Preview | null>(null);
  const [fetchError, setFetchError] = useState("");
  const [typedName, setTypedName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [accepted, setAccepted] = useState(false);

  useEffect(() => {
    if (!token || token === "_") return;
    api
      .getInvitePreview(token)
      .then((d) => setPreview(d as Preview))
      .catch((err) =>
        setFetchError(err instanceof Error ? err.message : "Invalid or expired invitation.")
      );
  }, [token]);

  // ── Error / loading states ────────────────────────────────────────────────
  if (fetchError) return (
    <div style={{ minWidth: "1920px", background: "#f8f7f5", display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Header variant="loggedOut" />
      <div style={{ position: "relative", flex: 1, minHeight: "877px" }}>
        <div style={{ position: "absolute", left: "395px", top: "250px", textAlign: "center" }}>
          <p style={{ fontFamily: sans, fontSize: "18px", color: "#B4372C", marginBottom: "12px" }}>{fetchError}</p>
          <a href="/" style={{ fontFamily: sans, fontSize: "14px", color: "#000", textDecoration: "underline" }}>Return home</a>
        </div>
      </div>
      <Footer />
    </div>
  );

  if (!preview) return (
    <div style={{ minWidth: "1920px", background: "#f8f7f5", display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Header variant="loggedOut" />
      <div style={{ position: "relative", flex: 1, minHeight: "877px" }}>
        <p style={{ position: "absolute", left: "395px", top: "250px", fontFamily: sans, fontSize: "18px", color: "#888" }}>
          Loading invitation…
        </p>
      </div>
      <Footer />
    </div>
  );

  const isKeeper = preview.invitee_role === "keeper";
  const canonicalName = isKeeper ? preview.keeper_name : preview.tc_name;
  const nameMatch = canonicalName ? normalize(typedName) === normalize(canonicalName) : false;
  const today = new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });

  async function handleAccept(e: React.FormEvent) {
    e.preventDefault();
    if (!nameMatch) return;
    setError("");
    setLoading(true);
    try {
      await api.acceptInvitation(token, typedName);
      setAccepted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Acceptance failed.");
    } finally {
      setLoading(false);
    }
  }

  // ── Signed confirmation (Keeper or TC) ───────────────────────────────────
  // Prototype: keeper-signed/page.tsx + tc-signed/page.tsx
  // Card: left 395px, top 67px (170–103), 1130×687px
  if (accepted) return (
    <div style={{ minWidth: "1920px", background: "#f8f7f5", display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Header variant="loggedOut" />
      <div style={{ position: "relative", flex: 1, minHeight: "920px" }}>

        {/* Confirmation card: prototype left:395, top:170 → top:67 after header */}
        <div style={{
          position: "absolute",
          left: "395px",
          top: "67px",
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
          {/* Gold checkmark circle: 123×123px */}
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

          {/* H1 + subtitle */}
          <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: "8px" }}>
            <h1 style={{
              fontFamily: serif, fontStyle: "italic", fontWeight: 400,
              fontSize: "64px", color: "#1a1a1a", margin: 0, whiteSpace: "nowrap",
            }}>
              You&apos;ve signed.
            </h1>
            <p style={{
              fontFamily: sans, fontWeight: 400, fontSize: "22px",
              color: "#888", margin: 0, whiteSpace: "nowrap",
            }}>
              The contract between you and {preview.maker_name} is now in place.
            </p>
          </div>

          {/* Divider: 500×5px */}
          <div style={{ width: "500px", height: "5px", background: "#d9d9d9", flexShrink: 0 }} />

          {/* Gold callout: 934px wide */}
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
            {isKeeper ? (
              <p style={{ fontFamily: sans, fontWeight: 400, fontSize: "18px", color: "#444", margin: 0, lineHeight: "1.5" }}>
                When {preview.maker_name} passes, you will need to go to{" "}
                <strong style={{ color: "#4472c4" }}>ovyu.com/activate-transfer</strong>. Once the
                Transfer is activated, you will be prompted to create an account and access what{" "}
                {preview.maker_name} left for you. You will always be the one to decide when you are
                ready.
              </p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <p style={{ fontFamily: sans, fontWeight: 400, fontSize: "18px", color: "#444", margin: 0, lineHeight: "1.5" }}>
                  When {preview.maker_name} passes, you will need to go to{" "}
                  <strong style={{ color: "#4472c4" }}>ovyu.com/activate-transfer</strong>. There you
                  will submit evidence of their passing and confirm the details for their Keeper. Once
                  you do that, we take it from there.
                </p>
                <p style={{ fontFamily: sans, fontWeight: 400, fontSize: "18px", color: "#444", margin: 0, lineHeight: "1.5" }}>
                  There is no deadline. Do this when you are ready and able.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer note: prototype top:917 → 814 after header */}
        <p style={{
          position: "absolute", left: "68px", top: "814px",
          fontFamily: sans, fontStyle: "italic", fontWeight: 400,
          fontSize: "16px", color: "#888", whiteSpace: "nowrap", margin: 0,
        }}>
          You will always be the one to decide when you are ready to access this. Nothing happens without your confirmation.
        </p>
      </div>
      <Footer />
    </div>
  );

  // ── Contract page (Keeper or TC) ─────────────────────────────────────────
  // Prototype: contract/keeper/page.tsx + contract/tc-sign/page.tsx
  // Grid: left:58, top:40 (143–103), cols 1130+613, gap 49
  return (
    <div style={{ minWidth: "1920px", background: "#f8f7f5", display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Header variant="loggedOut" />
      <form onSubmit={handleAccept} style={{ position: "relative", flex: 1, minHeight: "800px" }}>
        <div style={{
          position: "absolute",
          left: "58px",
          top: "40px",
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
              {isKeeper ? "Your contract." : "Your agreement."}
            </h1>
            <p style={{ fontFamily: sans, fontWeight: 400, fontSize: "22px", color: "#888", margin: 0 }}>
              {isKeeper
                ? "Read through carefully. This is between you and the Maker."
                : "Read through carefully. This describes your role as Transfer Contact."}
            </p>
          </div>

          <div /> {/* grid spacer — sign panel sits in row 2 col 2 */}

          {/* Contract card: 1130×580px */}
          <div style={{
            width: "1130px", height: "580px",
            background: "#fff", border: "2px solid #e1e1e1", borderRadius: "15px",
            padding: "60px", display: "flex", flexDirection: "column", justifyContent: "space-between",
            boxSizing: "border-box",
          }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px", width: "354px" }}>
              <p style={{ fontFamily: sans, fontWeight: 700, fontSize: "22px", color: "#000", margin: 0 }}>
                {isKeeper ? "Ovyu Agreement" : "Ovyu Transfer Contact Agreement"}
              </p>
              <p style={{ fontFamily: sans, fontWeight: 700, fontSize: "22px", color: "#8a6e30", margin: 0 }}>
                Party A (Maker): {preview.maker_name}
              </p>
              <p style={{ fontFamily: sans, fontWeight: 700, fontSize: "22px", color: "#8a6e30", margin: 0 }}>
                {isKeeper
                  ? `Party B (Keeper): ${preview.keeper_name}`
                  : `Party C (Transfer Contact): ${preview.tc_name}`}
              </p>
            </div>

            {/* Body text: width 890px, lineHeight 1.5 */}
            <div style={{
              fontFamily: sans, fontWeight: 400, fontSize: "18px",
              color: "#444", width: "890px", lineHeight: "1.5",
            }}>
              {isKeeper ? (
                <>
                  <p style={{ margin: 0 }}>{preview.maker_name} and {preview.keeper_name} have entered into this Agreement on Ovyu, a private digital legacy platform.</p>
                  <br />
                  <p style={{ margin: 0 }}>{preview.maker_name} is leaving personal media — voice recordings, video messages, written notes, and other content — for {preview.keeper_name} to receive following {preview.maker_name}&apos;s death.</p>
                  <br />
                  <p style={{ margin: 0 }}>{preview.keeper_name} agrees to receive this content and to honour the terms of this Agreement.</p>
                  <br />
                  <p style={{ margin: 0 }}>Access Duration: Indefinite, beginning at the time of Transfer.</p>
                  <p style={{ margin: 0 }}>Transferable: No. This Agreement is non-transferable.</p>
                  <br />
                  <p style={{ margin: 0 }}>All content is encrypted and stored privately. Only {preview.keeper_name} will have access after Transfer is activated.</p>
                </>
              ) : (
                <>
                  <p style={{ margin: 0 }}>As Transfer Contact, you agree to one responsibility: when {preview.maker_name} passes, you will notify Ovyu.</p>
                  <br />
                  <p style={{ margin: 0 }}>You will go to ovyu.com/activate-transfer and submit evidence of their passing. You will confirm the Keeper&apos;s name and email. After that, Ovyu takes over.</p>
                  <br />
                  <p style={{ margin: 0 }}>You will not see or access any of {preview.maker_name}&apos;s content. You will not know what the Keeper receives. Your role begins and ends with that single notification.</p>
                  <br />
                  <p style={{ margin: 0 }}>There is no deadline. You can notify Ovyu whenever you are ready and able.</p>
                  <br />
                  <p style={{ margin: 0 }}>A copy of this agreement will be sent to your email for your records.</p>
                </>
              )}
            </div>
          </div>

          {/* Signing panel: 613×580px, padding 50 44 31 52 */}
          <div style={{
            width: "613px", height: "580px",
            background: "#fff", border: "2px solid #e1e1e1", borderRadius: "15px",
            padding: "50px 44px 31px 52px",
            display: "flex", flexDirection: "column", gap: "20px",
            boxSizing: "border-box",
          }}>
            <p style={{ fontFamily: serif, fontWeight: 700, fontSize: "28px", color: "#000", margin: 0 }}>
              {isKeeper ? "Sign as Keeper" : "Sign as Transfer Contact"}
            </p>
            <p style={{ fontFamily: sans, fontWeight: 400, fontSize: "20px", color: "#888", margin: 0 }}>
              {isKeeper
                ? "By signing, you confirm you have read and agree to the terms on this page."
                : "By signing, you confirm you understand your role as described on this page."}
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <label style={{ fontFamily: sans, fontWeight: 700, fontSize: "20px", color: "#444" }}>Full legal name</label>
              <input
                value={typedName}
                onChange={(e) => setTypedName(e.target.value)}
                placeholder="Your full legal name"
                style={{
                  ...inputStyle,
                  border: typedName && !nameMatch ? "1px solid #B4372C" : "1px solid #888",
                }}
                required
              />
              {typedName && !nameMatch && (
                <span style={{ fontFamily: sans, fontSize: "13px", color: "#B4372C" }}>
                  Name doesn&apos;t match. Type: {canonicalName}
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

            {error && (
              <p style={{ fontFamily: sans, fontSize: "14px", color: "#B4372C", margin: 0 }}>{error}</p>
            )}

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
              {loading ? "Signing…" : isKeeper ? "Sign and continue →" : "I accept and sign →"}
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
