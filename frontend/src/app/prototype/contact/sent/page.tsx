import ProtoHeader from "../../_components/ProtoHeader";
import ProtoFooter from "../../_components/ProtoFooter";
import ProtoNav from "../../_components/ProtoNav";

const serif = "Georgia, serif";
const sans = "Helvetica Neue, Helvetica, Arial, sans-serif";

export default function PrototypeContactSent() {
  return (
    <div style={{
      width: "1920px",
      height: "1080px",
      background: "#f8f7f5",
      position: "relative",
      overflow: "hidden",
    }}>
      <ProtoHeader variant="loggedin" />

      {/* Confirmation block */}
      <div style={{
        position: "absolute",
        left: "643px",
        top: "364px",
        width: "634px",
        padding: "23px 88px",
        display: "flex",
        flexDirection: "column",
        gap: "37px",
        alignItems: "center",
        boxSizing: "border-box",
      }}>
        {/* Purple checkmark circle */}
        <div style={{
          width: "123px", height: "123px",
          background: "#4b3c5e", borderRadius: "50%",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <span style={{ fontFamily: serif, fontStyle: "italic", fontWeight: 400, fontSize: "64px", color: "#fff" }}>✓</span>
        </div>

        {/* Text group */}
        <div style={{ display: "flex", flexDirection: "column", gap: "13px", alignItems: "center", textAlign: "center" }}>
          <h1 style={{
            fontFamily: serif, fontStyle: "italic", fontWeight: 400,
            fontSize: "64px", color: "#1a1a1a", margin: 0, lineHeight: "normal",
          }}>Got it.</h1>
          <p style={{ fontFamily: sans, fontWeight: 400, fontSize: "22px", color: "#444", margin: 0 }}>
            We&apos;ll get back to you within two business days.
          </p>
          <p style={{
            fontFamily: sans, fontStyle: "italic", fontWeight: 400,
            fontSize: "16px", color: "#444", margin: 0, lineHeight: "1.35",
          }}>
            A copy has been sent to your email.
          </p>
        </div>
      </div>

      <ProtoFooter />
      <ProtoNav />
    </div>
  );
}
