import Link from "next/link";
import ProtoHeader from "../../_components/ProtoHeader";
import ProtoFooter from "../../_components/ProtoFooter";
import ProtoNav from "../../_components/ProtoNav";

const serif = "Georgia, serif";
const sans = "Helvetica Neue, Helvetica, Arial, sans-serif";

export default function PrototypeContractKeeper() {
  return (
    <div style={{
      width: "1920px",
      height: "1080px",
      background: "#f8f7f5",
      position: "relative",
      overflow: "hidden",
    }}>
      <ProtoHeader variant="loggedin" />

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
        {/* H1 + subtitle — Figma frame 141:649 */}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <h1 style={{
            fontFamily: serif, fontStyle: "italic", fontWeight: 400,
            fontSize: "64px", color: "#1a1a1a", margin: 0, lineHeight: "normal",
          }}>Leila Ashtari has created something for you.</h1>
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
            <p style={{ fontFamily: sans, fontWeight: 700, fontSize: "22px", color: "#000", margin: 0 }}>Ovyu Agreement</p>
            <p style={{ fontFamily: sans, fontWeight: 700, fontSize: "22px", color: "#8a6e30", margin: 0 }}>Party A (Maker): Leila Ashtari</p>
            <p style={{ fontFamily: sans, fontWeight: 700, fontSize: "22px", color: "#8a6e30", margin: 0 }}>Party B (Keeper): James Harlow</p>
          </div>
          <div style={{ fontFamily: sans, fontWeight: 400, fontSize: "18px", color: "#444", width: "1011px", lineHeight: "1.5" }}>
            <p style={{ margin: 0 }}>Leila Ashtari and James Harlow have entered into this Agreement on Ovyu, a private digital legacy platform.</p>
            <br />
            <p style={{ margin: 0 }}>Leila Ashtari is leaving personal media — voice recordings, video messages, written notes, and other content — for James Harlow to receive following Leila Ashtari&apos;s death.</p>
            <br />
            <p style={{ margin: 0 }}>James Harlow agrees to receive this content and to honour the terms of this Agreement.</p>
            <br />
            <p style={{ margin: 0 }}>Access Duration: Indefinite, beginning at the time of Transfer. This Agreement is non-transferable.</p>
            <br />
            <p style={{ margin: 0 }}>All content is encrypted and stored privately. Only James Harlow will have access after Transfer is activated.</p>
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
          <p style={{ fontFamily: serif, fontWeight: 700, fontSize: "28px", color: "#000", margin: 0 }}>Sign as Keeper</p>
          <p style={{ fontFamily: sans, fontWeight: 400, fontSize: "20px", color: "#888", margin: 0 }}>
            By signing, you confirm you have read and agree to the terms on this page.
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
            <input readOnly defaultValue="May 4, 2026" style={{
              height: "74px", background: "#fff", border: "1px solid #888", borderRadius: "10px",
              padding: "14px", fontFamily: sans, fontSize: "16px", color: "#888", boxSizing: "border-box", width: "100%",
            }} />
          </div>
          <Link href="/prototype/contract/keeper-signed" style={{
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
