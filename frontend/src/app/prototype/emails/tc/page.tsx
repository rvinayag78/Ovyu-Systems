import Link from "next/link";

const serif = "Georgia, serif";
const sans = "Helvetica Neue, Helvetica, Arial, sans-serif";

export default function EmailTC() {
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
          ovyu.com  ·  You received this because Leila named you as their Transfer Contact. If this is a mistake, you may decline.
        </p>
      </div>

      {/* Email body — left: 200px, top: 235px per spec */}
      <div style={{
        position: "absolute",
        left: "200px",
        top: "235px",
        display: "flex",
        flexDirection: "column",
        gap: "20px",
        alignItems: "center",
        justifyContent: "center",
      }}>
        {/* Heading */}
        <p style={{
          fontFamily: serif, fontWeight: 400, fontSize: "44px", color: "#1a1a1a",
          textAlign: "center", whiteSpace: "nowrap", margin: 0,
        }}>
          Leila has chosen you as their Transfer Contact.
        </p>

        {/* Subheading */}
        <p style={{
          fontFamily: sans, fontWeight: 400, fontSize: "22px", color: "#888",
          textAlign: "center", whiteSpace: "nowrap", margin: 0,
        }}>
          This comes with a responsibility. Please read carefully.
        </p>

        {/* Body copy */}
        <p style={{
          width: "960px",
          fontFamily: sans, fontWeight: 400, fontSize: "18px", color: "#444",
          whiteSpace: "pre-wrap", margin: 0, lineHeight: "1.5",
        }}>
          {`Leila is using Ovyu to leave a piece of themselves for someone they love. They have named you as their Transfer Contact, the person responsible for initiating the Transfer when the time comes.\n\nAs Transfer Contact, your role is specific:`}
        </p>

        {/* Responsibility callout box */}
        <div style={{
          width: "1100px", height: "167px",
          background: "#f5edd6",
          border: "3px solid #c9a84c",
          borderRadius: "27px",
          padding: "35px 206px 33px 157px",
          boxSizing: "border-box",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <div style={{
            fontFamily: sans, fontWeight: 400, fontSize: "18px", color: "#444",
            whiteSpace: "nowrap", lineHeight: "1.6",
          }}>
            <p style={{ margin: "0 0 18px 0" }}>1.  When Leila passes, provide Ovyu with evidence of their passing (such as a death certificate or official notice).</p>
            <p style={{ margin: "0 0 18px 0" }}>2.  Confirm the Keeper&apos;s name and email so we can reach them.</p>
            <p style={{ margin: 0 }}>3.  You have all the time you need.</p>
          </div>
        </div>

        {/* Legal note */}
        <p style={{ fontFamily: sans, fontStyle: "italic", fontWeight: 400, fontSize: "14px", color: "#444", textAlign: "center", margin: 0 }}>
          By continuing you agree to Ovyu&apos;s Terms of Use and Privacy Policy.
        </p>

        {/* CTA button */}
        <Link href="/prototype/contract/tc-sign" style={{
          width: "500px", height: "63px",
          background: "#c9a84c", borderRadius: "11px",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontFamily: sans, fontWeight: 700, fontSize: "22px", color: "#fff",
          textDecoration: "none",
        }}>
          Review the contract and accept this role
        </Link>

        {/* Button note */}
        <p style={{
          width: "756px",
          fontFamily: sans, fontStyle: "italic", fontWeight: 400, fontSize: "14px", color: "#444",
          textAlign: "center", margin: 0,
        }}>
          This button takes you to ovyu.com where you can read the full contract and sign.
        </p>
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
