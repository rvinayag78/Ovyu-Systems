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
        {/* H1 + subtitle — 50px per Figma frame 141:577 */}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <h1 style={{
            fontFamily: serif, fontStyle: "italic", fontWeight: 400,
            fontSize: "50px", color: "#1a1a1a", margin: 0, lineHeight: "normal",
          }}>Leila Ashtari has named you as their Transfer Contact.</h1>
          <p style={{ fontFamily: sans, fontWeight: 400, fontSize: "22px", color: "#888", margin: 0 }}>
            Read through the contract below. By signing, you accept the responsibility of initiating the Transfer when the time comes.
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
            <p style={{ fontFamily: sans, fontWeight: 700, fontSize: "22px", color: "#000", margin: 0 }}>Ovyu Transfer Contact Agreement</p>
            <p style={{ fontFamily: sans, fontWeight: 700, fontSize: "22px", color: "#8a6e30", margin: 0 }}>Party A (Maker): Leila Ashtari</p>
            <p style={{ fontFamily: sans, fontWeight: 700, fontSize: "22px", color: "#8a6e30", margin: 0 }}>Party B (Keeper): James Harlow</p>
            <p style={{ fontFamily: sans, fontWeight: 700, fontSize: "22px", color: "#8a6e30", margin: 0 }}>Transfer Contact: Marcus Chen</p>
          </div>
          <div style={{ fontFamily: sans, fontWeight: 400, fontSize: "18px", color: "#444", width: "1011px", lineHeight: "1.5" }}>
            <p style={{ margin: "0 0 12px 0" }}>As Transfer Contact, you are agreeing to the following responsibilities:</p>
            <ul style={{ margin: 0, paddingLeft: "24px", display: "flex", flexDirection: "column", gap: "8px" }}>
              <li>When Leila Ashtari passes, go to <strong>ovyu.com/activate-transfer</strong> to begin the process.</li>
              <li>Submit evidence of their passing so Ovyu can verify the Transfer.</li>
              <li>Confirm the Keeper&apos;s name and contact details at that time.</li>
              <li>Once submitted, Ovyu will notify James Harlow and handle everything from there.</li>
            </ul>
            <br />
            <p style={{ margin: 0, fontStyle: "italic", fontWeight: 700 }}>
              If you decline, Leila Ashtari will need to nominate a new Transfer Contact.
            </p>
          </div>
        </div>

        {/* Signing panel */}
        <div style={{
          width: "613px",
          background: "#fff", border: "2px solid #e1e1e1", borderRadius: "15px",
          padding: "50px 44px 31px 52px",
          display: "flex", flexDirection: "column", gap: "20px",
          boxSizing: "border-box",
        }}>
          <p style={{ fontFamily: serif, fontWeight: 700, fontSize: "28px", color: "#000", margin: 0 }}>Accept and sign</p>
          <p style={{ fontFamily: sans, fontWeight: 400, fontSize: "20px", color: "#888", margin: 0 }}>
            By signing, you confirm you have read and accept this responsibility.
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
          <Link href="/prototype/contract/tc-signed" style={{
            height: "62px", background: "#000", borderRadius: "8px", textDecoration: "none",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: sans, fontWeight: 700, fontSize: "20px", color: "#f5f0e8",
          }}>
            I accept and sign →
          </Link>

          {/* Gold callout — Figma frame 141:577 */}
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
