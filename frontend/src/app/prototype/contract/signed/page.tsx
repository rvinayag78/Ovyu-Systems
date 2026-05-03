import ProtoHeader from "../../_components/ProtoHeader";
import ProtoFooter from "../../_components/ProtoFooter";
import ProtoNav from "../../_components/ProtoNav";

const serif = "Georgia, serif";
const sans = "Helvetica Neue, Helvetica, Arial, sans-serif";

function Section({ title, body, bodyWidth }: { title: string; body: string; bodyWidth?: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      <p style={{ fontFamily: sans, fontWeight: 700, fontSize: "22px", color: "#c9a84c", margin: 0 }}>{title}</p>
      <p style={{
        fontFamily: sans, fontWeight: 400, fontSize: "16px", color: "#444",
        margin: 0, lineHeight: "1.5",
        width: bodyWidth || undefined,
      }}>{body}</p>
    </div>
  );
}

export default function PrototypeContractSigned() {
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
        display: "flex",
        flexDirection: "column",
        gap: "23px",
      }}>
        {/* H1 */}
        <h1 style={{ fontFamily: serif, fontSize: "64px", color: "#1a1a1a", margin: 0, lineHeight: "normal" }}>
          <span style={{ fontWeight: 400 }}>ov</span>
          <em style={{ fontWeight: 400 }}>yu </em>
          <span style={{ fontWeight: 400 }}>Agreement</span>
        </h1>

        {/* Meta row */}
        <div style={{
          display: "flex", flexDirection: "row",
          justifyContent: "space-between",
          whiteSpace: "nowrap", width: "100%",
          alignItems: "baseline",
        }}>
          <span style={{ fontFamily: sans, fontStyle: "italic", fontWeight: 400, fontSize: "22px", color: "#1a1a1a" }}>
            Between Leila and James
          </span>
          <span style={{ fontFamily: sans, fontStyle: "italic", fontWeight: 400, fontSize: "18px", color: "#888" }}>
            Signed by Leila on Jan 23, 2026
          </span>
          <span style={{ fontFamily: sans, fontStyle: "italic", fontWeight: 400, fontSize: "18px", color: "#888" }}>
            Signed by James on Jan 24, 2026
          </span>
          <span style={{ fontFamily: sans, fontWeight: 400, fontSize: "18px", color: "#1a1a1a" }}>
            Download ⤓
          </span>
        </div>

        {/* Body card */}
        <div style={{
          background: "#fff",
          padding: "40px",
          display: "flex",
          flexDirection: "row",
          gap: "66px",
          alignItems: "flex-start",
        }}>
          {/* Left col */}
          <div style={{ width: "760px", display: "flex", flexDirection: "column", gap: "14px", flexShrink: 0 }}>
            <Section
              title="WHAT THIS IS"
              body="This is a private legacy agreement on Ovyu between Leila Ashtari (Maker) and James Harlow (Keeper). The Maker has chosen the Keeper as the sole recipient of a private digital legacy."
            />
            <Section
              title="WHAT LEILA IS LEAVING FOR JAMES."
              body="Voice recordings, video messages, written notes, and personal media uploaded to the Ovyu platform."
            />
            <Section
              title="WHEN JAMES RECEIVES IT."
              body="Access is granted after the Maker's death, once the Transfer has been activated. The Keeper will be notified and prompted to create an account."
            />
            <Section
              title="WHAT JAMES AGREES TO."
              body="To receive the legacy as described. To not share access. To understand that Ovyu is a private, one-directional platform and that no support or mediation is provided beyond Transfer."
            />
          </div>

          {/* Right col */}
          <div style={{ width: "888px", display: "flex", flexDirection: "column", gap: "21px", flexShrink: 0 }}>
            <Section
              title="WITHDRAWING."
              body="The Maker may withdraw this Agreement at any time before Transfer. The Keeper may decline at any time. Withdrawal voids the contract — no content will be transferred."
            />
            <Section
              title="WHAT OVYU DOES."
              body="Stores content securely with end-to-end encryption. Initiates the Transfer upon verified notification. Provides access to the Keeper after Transfer is confirmed. Maintains platform availability."
              bodyWidth="855px"
            />
            <Section
              title="WHAT OVYU DOES NOT DO."
              body="Ovyu does not moderate, preview, or evaluate the content left by the Maker. Ovyu does not provide grief support, legal advice, or any service beyond technical delivery of the legacy."
              bodyWidth="815px"
            />
          </div>
        </div>

        {/* Disclaimer */}
        <p style={{
          fontFamily: sans, fontStyle: "italic", fontWeight: 400,
          fontSize: "16px", color: "#888",
          textAlign: "right", whiteSpace: "nowrap", margin: 0,
        }}>
          Your digital signature carries the same intent as a handwritten signature within the Ovyu platform.
        </p>
      </div>

      <ProtoFooter />
      <ProtoNav />
    </div>
  );
}
