import Link from "next/link";
import ProtoHeader from "../_components/ProtoHeader";
import ProtoFooter from "../_components/ProtoFooter";
import ProtoNav from "../_components/ProtoNav";

const serif = "Georgia, serif";
const sans = "Helvetica Neue, Helvetica, Arial, sans-serif";

export default function PrototypeAccount() {
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
        }}>Account.</h1>

        {/* EMAIL section */}
        <div style={{ width: "591px", display: "flex", flexDirection: "column", gap: "15px" }}>
          <div style={{ width: "247px", display: "flex", flexDirection: "column", gap: "12px" }}>
            <p style={{ fontFamily: sans, fontWeight: 700, fontSize: "18px", color: "#c9a84c", margin: 0 }}>EMAIL</p>
            <p style={{ fontFamily: sans, fontWeight: 400, fontSize: "18px", color: "#888", margin: 0 }}>
              The email tied to your account.
            </p>
          </div>
          <div style={{ display: "flex", flexDirection: "row", gap: "41px", alignItems: "center" }}>
            <input
              readOnly
              placeholder="leila@example.com"
              style={{
                width: "400px", height: "57px",
                background: "#fff", border: "1px solid #888", borderRadius: "10px",
                padding: "10px", fontFamily: sans, fontWeight: 400, fontSize: "14px", color: "#888",
                boxSizing: "border-box",
              }}
            />
            <div style={{ display: "flex", flexDirection: "column", gap: "4px", width: "150px" }}>
              <span style={{ fontFamily: sans, fontStyle: "italic", fontWeight: 400, fontSize: "18px", color: "#000" }}>
                Change email
              </span>
              <div style={{ height: "1px", background: "#000", width: "100%" }} />
            </div>
          </div>
        </div>

        {/* PLAN section */}
        <div style={{ width: "293px", display: "flex", flexDirection: "column", gap: "12px" }}>
          <p style={{ fontFamily: sans, fontWeight: 700, fontSize: "18px", color: "#c9a84c", margin: 0 }}>PLAN</p>
          <div style={{ display: "flex", flexDirection: "row", gap: "19px", whiteSpace: "nowrap" }}>
            <span style={{ fontFamily: sans, fontWeight: 400, fontSize: "18px", color: "#000" }}>Free plan.</span>
            <span style={{ fontFamily: sans, fontStyle: "italic", fontWeight: 400, fontSize: "18px", color: "#888" }}>
              Paid plans coming later.
            </span>
          </div>
        </div>

        {/* Logout */}
        <Link href="/prototype/logged-out" style={{
          fontFamily: sans, fontStyle: "italic", fontWeight: 400, fontSize: "18px",
          color: "#000", textDecoration: "underline", display: "inline-block",
        }}>
          Log out
        </Link>
      </div>

      <ProtoFooter />
      <ProtoNav />
    </div>
  );
}
