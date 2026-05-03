import Link from "next/link";

const serif = "Georgia, serif";
const sans = "Helvetica Neue, Helvetica, Arial, sans-serif";

export default function EmailTCSignedTC() {
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
          textAlign: "center", margin: 0,
        }}>
          ovyu.com · This is a transactional email sent because you signed as a Transfer Contact.
        </p>
      </div>

      {/* Email body — centered, top 256px, width 801px, gap 45px */}
      <div style={{
        position: "absolute",
        left: "50%",
        top: "256px",
        transform: "translateX(-50%)",
        width: "801px",
        display: "flex",
        flexDirection: "column",
        gap: "45px",
        alignItems: "center",
        textAlign: "center",
        lineHeight: 0,
        fontStyle: "normal",
      }}>
        {/* Title group */}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px", width: "100%" }}>
          <p style={{
            fontFamily: serif, fontStyle: "italic", fontWeight: 400,
            fontSize: "44px", color: "#1a1a1a", textAlign: "center", margin: 0, lineHeight: "normal",
          }}>
            Thank you for signing.
          </p>
          <p style={{ fontFamily: sans, fontWeight: 400, fontSize: "22px", color: "#444", textAlign: "center", margin: 0, lineHeight: "normal" }}>
            Leila has been notified.
          </p>
        </div>

        {/* Long body copy — 5 paragraphs, 647px wide */}
        <div style={{
          width: "647px",
          fontFamily: sans, fontWeight: 400, fontSize: "18px", color: "#444",
          textAlign: "center", whiteSpace: "pre-wrap", lineHeight: "normal",
          display: "flex", flexDirection: "column", gap: "18px",
        }}>
          <p style={{ margin: 0 }}>
            You&apos;ve agreed to one thing: when Leila passes, you&apos;ll let Ovyu know. That&apos;s what activates the transfer to James.
          </p>
          <p style={{ margin: 0 }}>
            You won&apos;t see what Leila is leaving. You won&apos;t be involved in what James receives. Your role begins and ends with that one notification.
          </p>
          <p style={{ margin: 0 }}>
            Leila is recording a welcome message for James that will play when the transfer begins. You don&apos;t need to explain anything to James, or speak with them at all. Once you&apos;ve notified Ovyu, we take it from there.
          </p>
          <p style={{ margin: 0 }}>
            A copy of what you signed is attached to this email. Please save it. You won&apos;t have an Ovyu account, so this is your record.
          </p>
          <p style={{ margin: 0 }}>
            Until Leila passes, there&apos;s nothing you need to do.
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
