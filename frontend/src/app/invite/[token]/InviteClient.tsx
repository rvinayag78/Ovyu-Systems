"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
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
  const router = useRouter();
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
  const redirectedRef = useRef(false);

  useEffect(() => {
    if (!token || token === "_") return;
    api
      .getInvitePreview(token)
      .then((d) => {
        const preview = d as Preview;
        // Keeper with no existing session → redirect to account setup
        if (preview.invitee_role === "keeper" && !sessionStorage.getItem("ovyu_session")) {
          if (redirectedRef.current) return;
          redirectedRef.current = true;
          sessionStorage.setItem("ovyu_keeper_invite_token", token);
          router.replace(`/keeper/begin/${token}`);
          return;
        }
        setPreview(preview);
      })
      .catch((err) =>
        setFetchError(err instanceof Error ? err.message : "Invalid or expired invitation.")
      );
  }, [token, router]);

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
  const keeperInitial = preview.keeper_name?.[0]?.toUpperCase() ?? "?";

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
          {/* Gold checkmark circle */}
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
            {isKeeper && (
              <a href="/keeper/contracts" style={{
                marginTop: "12px",
                fontFamily: sans, fontWeight: 700, fontSize: "16px",
                color: "#fff", background: "#000", borderRadius: "8px",
                padding: "12px 24px", textDecoration: "none", display: "inline-block",
                width: "fit-content",
              }}>
                View your contracts →
              </a>
            )}
          </div>

          {/* Divider */}
          <div style={{ width: "500px", height: "5px", background: "#d9d9d9", flexShrink: 0 }} />

          {/* Gold callout */}
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

        {/* Footer note */}
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

  // ── Contract page — KEEPER (Figma: "Contract (Keeper Not Signed)" 141:649) ──
  if (isKeeper) return (
    <div style={{ minWidth: "1920px", background: "#f8f7f5", display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Header variant="loggedIn" initial={keeperInitial} />
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

          {/* H1 + subtitle — 64px, Georgia Italic */}
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <h1 style={{
              fontFamily: serif, fontStyle: "italic", fontWeight: 400,
              fontSize: "64px", color: "#1a1a1a", margin: 0, lineHeight: "normal",
            }}>
              {preview.maker_name} has created something for you.
            </h1>
            <p style={{ fontFamily: sans, fontWeight: 400, fontSize: "22px", color: "#888", margin: 0 }}>
              Review the agreement below. Take your time. Sign only if you&apos;re ready to accept.
            </p>
          </div>

          <div /> {/* grid spacer */}

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
                Party A (Maker): {preview.maker_name}
              </p>
              <p style={{ fontFamily: sans, fontWeight: 700, fontSize: "22px", color: "#8a6e30", margin: 0 }}>
                Party B (Keeper): {preview.keeper_name}
              </p>
            </div>

            <div style={{
              fontFamily: sans, fontWeight: 400, fontSize: "18px",
              color: "#444", width: "1011px", lineHeight: "1.5",
              whiteSpace: "pre-wrap",
            }}>
              <p style={{ margin: "0 0 16px" }}>Maker: {preview.maker_name}</p>
              <p style={{ margin: "0 0 16px" }}>Keeper: {preview.keeper_name}</p>
              <p style={{ margin: "0 0 16px" }}>Relationship: {preview.relationship}</p>
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

  // ── Contract page — TC (Figma: "Contract (Transfer Contact)" 141:577) ──────
  return (
    <div style={{ minWidth: "1920px", background: "#f8f7f5", display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Header variant="loggedOut" />
      <form onSubmit={handleAccept} style={{ position: "relative", flex: 1, minHeight: "900px" }}>
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

          {/* H1 + subtitle — 50px, Georgia Italic */}
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <h1 style={{
              fontFamily: serif, fontStyle: "italic", fontWeight: 400,
              fontSize: "50px", color: "#1a1a1a", margin: 0, lineHeight: "normal",
            }}>
              {preview.maker_name} has named you as their Transfer Contact.
            </h1>
            <p style={{ fontFamily: sans, fontWeight: 400, fontSize: "22px", color: "#888", margin: 0 }}>
              Read through the contract below. By signing, you accept the responsibility of initiating the Transfer when the time comes.
            </p>
          </div>

          <div /> {/* grid spacer */}

          {/* Contract card */}
          <div style={{
            width: "1130px", height: "580px",
            background: "#fff", border: "2px solid #e1e1e1", borderRadius: "15px",
            padding: "60px", display: "flex", flexDirection: "column", justifyContent: "space-between",
            boxSizing: "border-box",
          }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <p style={{ fontFamily: sans, fontWeight: 700, fontSize: "22px", color: "#000", margin: 0 }}>
                Ovyu Transfer Contact Agreement
              </p>
              <p style={{ fontFamily: sans, fontWeight: 700, fontSize: "22px", color: "#8a6e30", margin: 0 }}>
                Party A (Maker): {preview.maker_name}
              </p>
              <p style={{ fontFamily: sans, fontWeight: 700, fontSize: "22px", color: "#8a6e30", margin: 0 }}>
                Party B (Keeper): {preview.keeper_name}
              </p>
              <p style={{ fontFamily: sans, fontWeight: 700, fontSize: "22px", color: "#8a6e30", margin: 0 }}>
                Transfer Contact: {preview.tc_name}
              </p>
            </div>

            <div style={{
              fontFamily: sans, fontWeight: 400, fontSize: "18px",
              color: "#444", width: "1011px", lineHeight: "1.5",
            }}>
              <p style={{ margin: "0 0 12px 0" }}>As Transfer Contact, you are agreeing to the following responsibilities:</p>
              <ul style={{ margin: 0, paddingLeft: "24px", display: "flex", flexDirection: "column", gap: "8px" }}>
                <li>When {preview.maker_name} passes, go to <strong>ovyu.com/activate-transfer</strong> to begin the process.</li>
                <li>Submit evidence of their passing so Ovyu can verify the Transfer.</li>
                <li>Confirm the Keeper&apos;s name and contact details at that time.</li>
                <li>Once submitted, Ovyu will notify {preview.keeper_name} and handle everything from there.</li>
              </ul>
              <br />
              <p style={{ margin: 0, fontStyle: "italic", fontWeight: 700 }}>
                If you decline, {preview.maker_name} will need to nominate a new Transfer Contact.
              </p>
            </div>
          </div>

          {/* Sign panel */}
          <div style={{
            width: "613px",
            background: "#fff", border: "2px solid #e1e1e1", borderRadius: "15px",
            padding: "50px 44px 31px 52px",
            display: "flex", flexDirection: "column", gap: "20px",
            boxSizing: "border-box",
          }}>
            <p style={{ fontFamily: serif, fontWeight: 700, fontSize: "28px", color: "#000", margin: 0 }}>
              Accept and sign
            </p>
            <p style={{ fontFamily: sans, fontWeight: 400, fontSize: "20px", color: "#888", margin: 0 }}>
              By signing, you confirm you have read and accept this responsibility.
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
              {loading ? "Signing…" : "I accept and sign →"}
            </button>

            {/* Gold callout — TC only */}
            <div style={{
              background: "#fef3e2",
              border: "2px solid #c9a84c",
              borderRadius: "12px",
              padding: "20px 24px",
              boxSizing: "border-box",
            }}>
              <p style={{ fontFamily: sans, fontWeight: 400, fontSize: "16px", color: "#8a6e30", margin: 0, lineHeight: "1.5" }}>
                The Maker will be notified when you accept and sign.
              </p>
            </div>
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
