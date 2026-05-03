import ProtoHeader from "../../_components/ProtoHeader";
import ProtoFooter from "../../_components/ProtoFooter";
import ProtoNav from "../../_components/ProtoNav";

const serif = "Georgia, serif";
const sans = "Helvetica Neue, Helvetica, Arial, sans-serif";

export default function PrototypeTCSigned() {
  return (
    <div style={{
      width: "1920px",
      height: "1080px",
      background: "#f8f7f5",
      position: "relative",
      overflow: "hidden",
    }}>
      <ProtoHeader variant="loggedout" />

      {/* Main card */}
      <div style={{
        position: "absolute",
        left: "395px",
        top: "170px",
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
        }}>
          <span style={{ fontFamily: serif, fontWeight: 700, fontSize: "64px", color: "#c9a84c" }}>✓</span>
        </div>

        <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: "8px" }}>
          <h1 style={{
            fontFamily: serif, fontStyle: "italic", fontWeight: 400,
            fontSize: "64px", color: "#1a1a1a", margin: 0, whiteSpace: "nowrap",
          }}>You&apos;ve signed.</h1>
          <p style={{
            fontFamily: sans, fontWeight: 400, fontSize: "22px", color: "#888",
            margin: 0, whiteSpace: "nowrap",
          }}>The contract between you and Leila is now in place.</p>
        </div>

        <div style={{ width: "500px", height: "5px", background: "#d9d9d9" }} />

        {/* Callout box */}
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
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <p style={{ fontFamily: sans, fontWeight: 400, fontSize: "18px", color: "#444", margin: 0, lineHeight: "1.5" }}>
              When Leila passes, you will need to go to{" "}
              <a href="#" style={{ color: "#4472c4", fontWeight: 700, textDecoration: "underline" }}>
                ovyu.com/activate-transfer
              </a>
              . There you will submit evidence of their passing and confirm the details for their Keeper. Once you do that, we take it from there.
            </p>
            <p style={{ fontFamily: sans, fontWeight: 400, fontSize: "18px", color: "#444", margin: 0, lineHeight: "1.5" }}>
              There is no deadline. Do this when you are ready and able.
            </p>
          </div>
        </div>
      </div>

      <p style={{
        position: "absolute", left: "68px", top: "917px",
        fontFamily: sans, fontStyle: "italic", fontWeight: 400,
        fontSize: "16px", color: "#888", whiteSpace: "nowrap", margin: 0,
      }}>
        You will always be the one to decide when you are ready to access this. Nothing happens without your confirmation.
      </p>

      <ProtoFooter />
      <ProtoNav />
    </div>
  );
}
