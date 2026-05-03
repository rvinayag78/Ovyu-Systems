import Link from "next/link";
import ProtoHeader from "../../_components/ProtoHeader";
import ProtoFooter from "../../_components/ProtoFooter";
import ProtoNav from "../../_components/ProtoNav";

const serif = "Georgia, serif";
const sans = "Helvetica Neue, Helvetica, Arial, sans-serif";

export default function PrototypeContractTCSign() {
  return (
    <div style={{
      width: "1920px",
      height: "1080px",
      background: "#f8f7f5",
      position: "relative",
      overflow: "hidden",
    }}>
      <ProtoHeader variant="loggedout" />

      <div style={{
        position: "absolute",
        left: "58px",
        top: "143px",
        width: "1804px",
        display: "grid",
        gridTemplateColumns: "1130px 613px",
        columnGap: "49px",
        rowGap: "42px",
      }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <h1 style={{
            fontFamily: serif, fontStyle: "italic", fontWeight: 400,
            fontSize: "64px", color: "#1a1a1a", margin: 0, lineHeight: "normal",
          }}>Your agreement.</h1>
          <p style={{ fontFamily: sans, fontWeight: 400, fontSize: "22px", color: "#888", margin: 0 }}>
            Read through carefully. This describes your role as Transfer Contact.
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
          <div style={{ display: "flex", flexDirection: "column", gap: "8px", width: "354px" }}>
            <p style={{ fontFamily: sans, fontWeight: 700, fontSize: "22px", color: "#000", margin: 0 }}>Ovyu Agreement</p>
            <p style={{ fontFamily: sans, fontWeight: 700, fontSize: "22px", color: "#8a6e30", margin: 0 }}>Party A (Maker): Leila Ashtari</p>
            <p style={{ fontFamily: sans, fontWeight: 700, fontSize: "22px", color: "#8a6e30", margin: 0 }}>Party C (Transfer Contact): You</p>
          </div>
          <div style={{ fontFamily: sans, fontWeight: 400, fontSize: "18px", color: "#444", width: "890px", lineHeight: "1.5", whiteSpace: "pre-wrap" }}>
{`As Transfer Contact, you agree to one responsibility: when Leila passes, you will notify Ovyu.

You will go to ovyu.com/activate-transfer and submit evidence of their passing. You will confirm the Keeper's name and email. After that, Ovyu takes over.

You will not see or access any of Leila's content. You will not know what the Keeper receives. Your role begins and ends with that single notification.

There is no deadline. You can notify Ovyu whenever you are ready and able.

A copy of this agreement will be sent to your email for your records.`}
          </div>
        </div>

        {/* Signing panel */}
        <div style={{
          width: "613px", height: "580px",
          background: "#fff", border: "2px solid #e1e1e1", borderRadius: "15px",
          padding: "50px 44px 31px 52px",
          display: "flex", flexDirection: "column", gap: "20px",
          boxSizing: "border-box",
        }}>
          <p style={{ fontFamily: serif, fontWeight: 700, fontSize: "28px", color: "#000", margin: 0 }}>Sign as Transfer Contact</p>
          <p style={{ fontFamily: sans, fontWeight: 400, fontSize: "20px", color: "#888", margin: 0 }}>
            By signing, you confirm you understand your role as described on this page.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <label style={{ fontFamily: sans, fontWeight: 700, fontSize: "20px", color: "#444" }}>Full legal name</label>
            <input readOnly placeholder="Your full legal name" style={{
              height: "74px", background: "#fff", border: "1px solid #888", borderRadius: "10px",
              padding: "14px", fontFamily: sans, fontSize: "16px", color: "#888", boxSizing: "border-box", width: "100%",
            }} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <label style={{ fontFamily: sans, fontWeight: 700, fontSize: "20px", color: "#444" }}>Date</label>
            <input readOnly defaultValue="2026-05-03" style={{
              height: "74px", background: "#fff", border: "1px solid #888", borderRadius: "10px",
              padding: "14px", fontFamily: sans, fontSize: "16px", color: "#888", boxSizing: "border-box", width: "100%",
            }} />
          </div>
          <Link href="/prototype/contract/tc-signed" style={{
            height: "62px", background: "#000", borderRadius: "8px", textDecoration: "none",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: sans, fontWeight: 700, fontSize: "20px", color: "#f5f0e8",
          }}>
            Sign and continue →
          </Link>
        </div>

        <p style={{
          fontFamily: sans, fontStyle: "italic", fontWeight: 400,
          fontSize: "16px", color: "#888", whiteSpace: "nowrap", margin: 0,
        }}>
          Your digital signature carries the same intent as a handwritten signature within the Ovyu platform.
        </p>
      </div>

      <ProtoFooter />
      <ProtoNav />
    </div>
  );
}
