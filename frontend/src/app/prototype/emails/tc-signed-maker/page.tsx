import Link from "next/link";

const serif = "Georgia, serif";
const sans = "Helvetica Neue, Helvetica, Arial, sans-serif";

export default function EmailTCSignedMaker() {
  return (
    <div style={{
      minHeight: "900px",
      background: "#f8f7f5",
      position: "relative",
    }}>
      {/* Email header */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0,
        height: "184px", background: "#000",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <div style={{ width: "164px", textAlign: "center" }}>
          <span style={{ fontFamily: serif, fontWeight: 700, fontSize: "64px", color: "#fff" }}>ov</span>
          <em style={{ fontFamily: serif, fontWeight: 700, fontSize: "64px", color: "#fff" }}>yu</em>
        </div>
      </div>

      {/* Email footer */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0,
        height: "84px", background: "#d9d9d9",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <p style={{
          fontFamily: sans, fontWeight: 400, fontSize: "16px", color: "#888",
          textAlign: "center", margin: 0, whiteSpace: "nowrap",
        }}>
          ovyu.com  ·  This is a transactional email sent because your Transfer Contact completed the contract.
        </p>
      </div>

      {/* Email body — centered, top 254px, width 565px, gap 58px */}
      <div style={{
        position: "absolute",
        left: "50%",
        top: "254px",
        transform: "translateX(-50%)",
        width: "565px",
        display: "flex",
        flexDirection: "column",
        gap: "58px",
        alignItems: "center",
      }}>
        {/* Title group */}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px", width: "100%" }}>
          <p style={{
            fontFamily: serif, fontStyle: "italic", fontWeight: 400,
            fontSize: "44px", color: "#1a1a1a", textAlign: "center", margin: 0,
          }}>
            Your contract is locked.
          </p>
          <p style={{ fontFamily: sans, fontWeight: 400, fontSize: "22px", color: "#444", textAlign: "center", margin: 0 }}>
            Marcus has signed. You&apos;re ready to begin.
          </p>
        </div>

        {/* Body copy */}
        <p style={{
          width: "451px",
          fontFamily: sans, fontWeight: 400, fontSize: "18px", color: "#444",
          textAlign: "center", whiteSpace: "pre-wrap", margin: 0, lineHeight: "1.5",
        }}>
          {`Everything is in place. When you're ready, start with a welcome message to James — a short video or voice recording that will be the first thing they receive.\n\nYou can take as long as you need. Come back whenever you like. There's no deadline.`}
        </p>

        {/* CTA group */}
        <div style={{ display: "flex", flexDirection: "column", gap: "14px", alignItems: "center", width: "100%" }}>
          <p style={{ fontFamily: sans, fontStyle: "italic", fontWeight: 400, fontSize: "14px", color: "#444", textAlign: "center", margin: 0 }}>
            By continuing you agree to Ovyu&apos;s Terms of Use and Privacy Policy.
          </p>
          <Link href="/prototype/plan" style={{
            width: "418px", height: "63px",
            background: "#c9a84c", borderRadius: "11px",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: sans, fontWeight: 700, fontSize: "22px", color: "#fff",
            textDecoration: "none",
          }}>
            Begin my upload
          </Link>
          <p style={{ fontFamily: sans, fontStyle: "italic", fontWeight: 400, fontSize: "14px", color: "#444", textAlign: "center", margin: 0 }}>
            You can return to your upload at any time by logging in to ovyu.com.
          </p>
        </div>
      </div>

      {/* Back nav */}
      <div style={{ position: "fixed", bottom: "20px", right: "20px", zIndex: 9999 }}>
        <Link href="/prototype" style={{
          background: "rgba(0,0,0,0.85)", borderRadius: "8px", padding: "8px 16px",
          fontFamily: sans, fontSize: "12px", color: "#f5f0e8", textDecoration: "none",
        }}>← Back to prototype</Link>
      </div>
    </div>
  );
}
