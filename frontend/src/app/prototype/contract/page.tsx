import Link from "next/link";
import ProtoHeader from "../_components/ProtoHeader";
import ProtoFooter from "../_components/ProtoFooter";
import ProtoNav from "../_components/ProtoNav";

const serif = "Georgia, serif";
const sans = "Helvetica Neue, Helvetica, Arial, sans-serif";

function SigningPanel({
  title,
  description,
  signLabel,
  signLink,
  extraBelow,
}: {
  title: string;
  description: string;
  signLabel: string;
  signLink: string;
  extraBelow?: React.ReactNode;
}) {
  return (
    <div style={{
      width: "613px",
      height: "580px",
      background: "#fff",
      border: "2px solid #e1e1e1",
      borderRadius: "15px",
      padding: "50px 44px 31px 52px",
      display: "flex",
      flexDirection: "column",
      gap: "20px",
      boxSizing: "border-box",
    }}>
      <p style={{ fontFamily: serif, fontWeight: 700, fontSize: "28px", color: "#000", margin: 0 }}>{title}</p>
      <p style={{ fontFamily: sans, fontWeight: 400, fontSize: "20px", color: "#888", margin: 0 }}>{description}</p>

      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        <label style={{ fontFamily: sans, fontWeight: 700, fontSize: "20px", color: "#444" }}>Full legal name</label>
        <input readOnly placeholder="Your full legal name" style={{
          height: "74px",
          background: "#fff",
          border: "1px solid #888",
          borderRadius: "10px",
          padding: "14px",
          fontFamily: sans,
          fontSize: "16px",
          color: "#888",
          boxSizing: "border-box",
          width: "100%",
        }} />
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        <label style={{ fontFamily: sans, fontWeight: 700, fontSize: "20px", color: "#444" }}>Date</label>
        <input readOnly defaultValue="2026-05-03" style={{
          height: "74px",
          background: "#fff",
          border: "1px solid #888",
          borderRadius: "10px",
          padding: "14px",
          fontFamily: sans,
          fontSize: "16px",
          color: "#888",
          boxSizing: "border-box",
          width: "100%",
        }} />
      </div>

      <Link href={signLink} style={{
        height: "62px",
        background: "#000",
        borderRadius: "8px",
        textDecoration: "none",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: sans,
        fontWeight: 700,
        fontSize: "20px",
        color: "#f5f0e8",
      }}>
        {signLabel}
      </Link>

      {extraBelow}
    </div>
  );
}

export default function PrototypeContract() {
  return (
    <div style={{
      width: "1920px",
      height: "1080px",
      background: "#f8f7f5",
      position: "relative",
      overflow: "hidden",
    }}>
      <ProtoHeader variant="loggedin" />

      {/* Contract content */}
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
        {/* Row 1: header text */}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <h1 style={{
            fontFamily: serif,
            fontStyle: "italic",
            fontWeight: 400,
            fontSize: "64px",
            color: "#1a1a1a",
            margin: 0,
            lineHeight: "normal",
          }}>Your contract.</h1>
          <p style={{
            fontFamily: sans,
            fontWeight: 400,
            fontSize: "22px",
            color: "#888",
            margin: 0,
          }}>Read through carefully. This is between you and your Keeper.</p>
        </div>

        {/* Row 1 col 2: empty */}
        <div />

        {/* Row 2 col 1: Contract card */}
        <div style={{
          width: "1130px",
          height: "580px",
          background: "#fff",
          border: "2px solid #e1e1e1",
          borderRadius: "15px",
          padding: "60px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          boxSizing: "border-box",
        }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px", width: "354px" }}>
            <p style={{ fontFamily: sans, fontWeight: 700, fontSize: "22px", color: "#000", margin: 0 }}>Ovyu Agreement</p>
            <p style={{ fontFamily: sans, fontWeight: 700, fontSize: "22px", color: "#8a6e30", margin: 0 }}>Party A (Maker)</p>
            <p style={{ fontFamily: sans, fontWeight: 700, fontSize: "22px", color: "#8a6e30", margin: 0 }}>Party B (Keeper)</p>
          </div>
          <div style={{
            fontFamily: sans,
            fontWeight: 400,
            fontSize: "18px",
            color: "#444",
            width: "890px",
            lineHeight: "1.5",
            whiteSpace: "pre-wrap",
          }}>
{`[Maker: Leila Ashtari] and [Keeper: James Harlow] have entered into this Agreement on Ovyu, a private digital legacy platform.

[Maker] is leaving personal media — voice recordings, video messages, written notes, and other content — for [Keeper] to receive following [Maker]'s death.

[Keeper] agrees to receive this content and to honour the terms of this Agreement.

Access Duration: Indefinite, beginning at the time of Transfer.
Transferable: No. This Agreement is non-transferable.

[Maker] retains full ownership of all content until death. [Maker] may modify or withdraw this Agreement at any time before Transfer.

All content is encrypted and stored privately. Only [Keeper] will have access after Transfer is activated.`}
          </div>
        </div>

        {/* Row 2 col 2: Signing panel */}
        <SigningPanel
          title="Sign as Maker"
          description="By signing, you confirm you have read and agree to the terms on this page."
          signLabel="Sign and continue →"
          signLink="/prototype/contracts"
        />

        {/* Row 3: Legal note */}
        <p style={{
          fontFamily: sans,
          fontStyle: "italic",
          fontWeight: 400,
          fontSize: "16px",
          color: "#888",
          whiteSpace: "nowrap",
          margin: 0,
        }}>
          Your digital signature carries the same intent as a handwritten signature within the Ovyu platform.
        </p>
      </div>

      <ProtoFooter />
      <ProtoNav />
    </div>
  );
}
