import Link from "next/link";
import ProtoHeader from "../../_components/ProtoHeader";
import ProtoFooter from "../../_components/ProtoFooter";
import ProtoNav from "../../_components/ProtoNav";

const serif = "Georgia, serif";
const sans = "Helvetica Neue, Helvetica, Arial, sans-serif";

export default function PrototypeContractsKeeperNotSigned() {
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
          fontFamily: serif, fontStyle: "italic", fontWeight: 400,
          fontSize: "64px", color: "#1a1a1a", margin: 0, lineHeight: "normal",
        }}>Your contracts</h1>

        {/* MAKING section */}
        <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
          <p style={{ fontFamily: sans, fontWeight: 700, fontSize: "18px", color: "#c9a84c", margin: 0 }}>MAKING</p>
          <div style={{
            width: "1700px", height: "100px",
            border: "1px solid #888", borderRadius: "10px",
            paddingLeft: "55px",
            display: "flex", flexDirection: "row", gap: "30px", alignItems: "center",
            boxSizing: "border-box",
          }}>
            <span style={{ fontSize: "25px", color: "#000" }}>+</span>
            <span style={{ fontFamily: sans, fontWeight: 700, fontSize: "16px", color: "#000" }}>START A NEW CONTRACT</span>
          </div>
        </div>

        {/* RECEIVING section */}
        <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
          <p style={{ fontFamily: sans, fontWeight: 700, fontSize: "18px", color: "#c9a84c", margin: 0 }}>RECEIVING</p>

          {/* Keeper row — not signed */}
          <div style={{
            width: "1700px", height: "100px",
            background: "#fff",
            display: "flex", alignItems: "center", justifyContent: "space-between",
            paddingLeft: "55px", paddingRight: "55px",
            boxSizing: "border-box",
            border: "1px solid #e1e1e1",
          }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "9px", width: "440px" }}>
              <p style={{ fontFamily: sans, fontWeight: 700, fontSize: "16px", color: "#5c6b4a", margin: 0 }}>KEEPER</p>
              <p style={{ fontFamily: serif, fontWeight: 700, fontSize: "30px", color: "#1a1a1a", margin: 0 }}>From Leila</p>
            </div>

            <div style={{ display: "flex", flexDirection: "row", gap: "40px", alignItems: "center" }}>
              <span style={{ fontFamily: sans, fontStyle: "italic", fontWeight: 400, fontSize: "18px", color: "#888" }}>
                Waiting for your signature
              </span>
              <Link href="/prototype/contract/keeper" style={{
                fontFamily: sans, fontWeight: 700, fontSize: "18px", color: "#c9a84c", textDecoration: "none",
              }}>
                Sign your contract →
              </Link>
            </div>

            <div />
          </div>
        </div>
      </div>

      <ProtoFooter />
      <ProtoNav />
    </div>
  );
}
