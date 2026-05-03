import Link from "next/link";

const sans = "Helvetica Neue, Helvetica, Arial, sans-serif";

export default function ProtoFooter() {
  return (
    <div style={{
      position: "absolute",
      top: "977px",
      left: 0,
      width: "1920px",
      height: "103px",
      background: "#000",
    }}>
      <div style={{
        position: "absolute",
        left: "68px",
        top: "44px",
        display: "flex",
        flexDirection: "row",
        gap: "199px",
        alignItems: "center",
      }}>
        <div style={{ display: "flex", gap: "27px", alignItems: "center" }}>
          <Link href="/prototype/contact" style={{
            fontFamily: sans,
            fontWeight: 400,
            fontSize: "13px",
            color: "#f5f0e8",
            textDecoration: "none",
          }}>CONTACT</Link>
          <Link href="/prototype" style={{
            fontFamily: sans,
            fontWeight: 400,
            fontSize: "13px",
            color: "#f5f0e8",
            textDecoration: "none",
          }}>ABOUT</Link>
        </div>
        <p style={{
          fontFamily: sans,
          fontWeight: 300,
          fontStyle: "italic",
          fontSize: "11px",
          color: "#f5f0e8",
          width: "918px",
          margin: 0,
        }}>
          ovyu stores your information securely and will never sell or share your personal data with third parties.
        </p>
        <div style={{ display: "flex", gap: "27px", alignItems: "center" }}>
          {["© 2026 OVYU", "MANAGE COOKIES", "LEGAL", "PRIVACY"].map((item) => (
            <span key={item} style={{
              fontFamily: sans,
              fontWeight: 400,
              fontSize: "11px",
              color: "#f5f0e8",
            }}>{item}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
