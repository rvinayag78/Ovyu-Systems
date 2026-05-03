import Link from "next/link";

const sans = "Helvetica Neue, Helvetica, Arial, sans-serif";

export function Footer() {
  return (
    <footer style={{
      width: "100%",
      height: "103px",
      background: "#000",
      position: "relative",
      flexShrink: 0,
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
          <Link href="/contact" style={{ fontFamily: sans, fontWeight: 400, fontSize: "13px", color: "#f5f0e8", textDecoration: "none" }}>CONTACT</Link>
          <Link href="/about" style={{ fontFamily: sans, fontWeight: 400, fontSize: "13px", color: "#f5f0e8", textDecoration: "none" }}>ABOUT</Link>
        </div>
        <p style={{ fontFamily: sans, fontWeight: 300, fontStyle: "italic", fontSize: "11px", color: "#f5f0e8", width: "918px", margin: 0 }}>
          ovyu stores your information securely and will never sell or share your personal data with third parties.
        </p>
        <div style={{ display: "flex", gap: "27px", alignItems: "center" }}>
          {["© 2026 OVYU", "MANAGE COOKIES", "LEGAL", "PRIVACY"].map((item) => (
            <span key={item} style={{ fontFamily: sans, fontWeight: 400, fontSize: "11px", color: "#f5f0e8" }}>{item}</span>
          ))}
        </div>
      </div>
    </footer>
  );
}
