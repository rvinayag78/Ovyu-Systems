import ProtoHeader from "../../_components/ProtoHeader";
import ProtoFooter from "../../_components/ProtoFooter";
import ProtoNav from "../../_components/ProtoNav";

const serif = "Georgia, serif";
const sans = "Helvetica Neue, Helvetica, Arial, sans-serif";

export default function PrototypeContractsPendingKeeper() {
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
        left: "110px",
        top: "181px",
        width: "1700px",
        display: "flex",
        flexDirection: "column",
        gap: "50px",
      }}>
        <h1 style={{
          fontFamily: serif,
          fontStyle: "italic",
          fontWeight: 400,
          fontSize: "64px",
          color: "#1a1a1a",
          margin: 0,
          lineHeight: "normal",
        }}>Your contracts</h1>

        <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
          <p style={{ fontFamily: sans, fontWeight: 700, fontSize: "18px", color: "#c9a84c", margin: 0 }}>MAKING</p>

          {/* Maker row — pending Keeper signature */}
          <div style={{
            width: "1700px",
            height: "100px",
            background: "#efeaf2",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            paddingLeft: "55px",
            paddingRight: "55px",
            boxSizing: "border-box",
          }}>
            {/* Left */}
            <div style={{ width: "452px", display: "flex", flexDirection: "row", gap: "40px", alignItems: "center" }}>
              <div style={{
                width: "50px", height: "50px",
                background: "#4b3c5e", borderRadius: "50%",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <span style={{ fontFamily: serif, fontWeight: 400, fontSize: "28px", color: "#fff" }}>L</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "9px" }}>
                <p style={{ fontFamily: sans, fontWeight: 700, fontSize: "16px", color: "#6a4d7d", margin: 0 }}>MAKER</p>
                <p style={{ fontFamily: serif, fontWeight: 700, fontSize: "30px", color: "#1a1a1a", margin: 0 }}>For James</p>
              </div>
            </div>

            {/* Middle */}
            <div style={{ display: "flex", flexDirection: "row", gap: "40px", alignItems: "center" }}>
              <span style={{ fontFamily: sans, fontStyle: "italic", fontWeight: 400, fontSize: "18px", color: "#888" }}>
                Contract sent Jan 23, 2026
              </span>
              <span style={{ fontFamily: sans, fontStyle: "italic", fontWeight: 400, fontSize: "18px", color: "#888" }}>
                Pending Keeper signature
              </span>
            </div>

            {/* Right — greyed UPLOAD */}
            <div style={{ display: "flex", flexDirection: "row", gap: "12px", alignItems: "center" }}>
              <span style={{ fontFamily: sans, fontWeight: 700, fontSize: "18px", color: "#888" }}>UPLOAD</span>
              <span style={{ fontSize: "18px", color: "#888" }}>→</span>
            </div>
          </div>
        </div>
      </div>

      <ProtoFooter />
      <ProtoNav />
    </div>
  );
}
