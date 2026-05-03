import Link from "next/link";

const serif = "Georgia, serif";
const sans = "Helvetica Neue, Helvetica, Arial, sans-serif";

export default function EmailKeeper() {
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
        padding: "33px 403px", boxSizing: "border-box",
      }}>
        <p style={{
          fontFamily: sans, fontWeight: 400, fontSize: "16px", color: "#888",
          textAlign: "center", margin: 0, whiteSpace: "nowrap",
        }}>
          ovyu.com  ·  You received this because someone named you as their Keeper. If this is a mistake, you may decline.
        </p>
      </div>

      {/* Email body */}
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
          <p style={{ fontFamily: serif, fontWeight: 400, fontSize: "44px", color: "#1a1a1a", textAlign: "center", margin: 0 }}>
            Leila has created something for you.
          </p>
          <p style={{ fontFamily: sans, fontWeight: 400, fontSize: "22px", color: "#888", textAlign: "center", margin: 0 }}>
            They&apos;ve chosen you as their Keeper on Ovyu.
          </p>
        </div>

        {/* Body copy */}
        <p style={{
          width: "451px",
          fontFamily: sans, fontWeight: 400, fontSize: "18px", color: "#444",
          textAlign: "center", whiteSpace: "pre-wrap", margin: 0, lineHeight: "1.5",
        }}>
          {`Ovyu is a private platform where a person leaves a piece of themselves, their voice, stories, and memories, for one person they love. Leila chose you.\n\nBefore anything begins, you'll need to review and sign a short agreement. It explains what you're receiving, on what terms, and what it means to say yes.`}
        </p>

        {/* CTA group */}
        <div style={{ display: "flex", flexDirection: "column", gap: "14px", alignItems: "center", width: "100%" }}>
          <p style={{ fontFamily: sans, fontStyle: "italic", fontWeight: 400, fontSize: "14px", color: "#444", textAlign: "center", margin: 0 }}>
            By continuing you agree to Ovyu&apos;s Terms of Use and Privacy Policy.
          </p>
          <Link href="/prototype/contract/keeper" style={{
            width: "418px", height: "63px",
            background: "#c9a84c", borderRadius: "11px",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: sans, fontWeight: 700, fontSize: "22px", color: "#fff",
            textDecoration: "none",
          }}>
            Review and sign the agreement
          </Link>
          <p style={{ fontFamily: sans, fontStyle: "italic", fontWeight: 400, fontSize: "14px", color: "#444", textAlign: "center", margin: 0 }}>
            This button takes you back to ovyu.com to confirm your account and continue.
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
