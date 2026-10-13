import Link from "next/link";

const sans = "Helvetica Neue, Helvetica, Arial, sans-serif";

export function Footer() {
  return (
    <footer style={{
      width: "1920px",
      height: "103px",
      background: "#1a1a1a",
      flexShrink: 0,
      position: "relative",
    }}>
      {/* Inner container: left 68px, vertically centred — matches Figma absolute left-[68px] top-[44px] */}
      <div style={{
        position: "absolute",
        left: "68px",
        top: "50%",
        transform: "translateY(-50%)",
        display: "flex",
        gap: "199px",
        alignItems: "center",
      }}>
        {/* Section 1 — CONTACT + ABOUT */}
        <div style={{ display: "flex", gap: "27px", alignItems: "center", flexShrink: 0 }}>
          <Link href="/contact" style={{ fontFamily: sans, fontWeight: 400, fontSize: "13px", color: "#f5f0e8", textDecoration: "none" }}>CONTACT</Link>
          <Link href="/about" style={{ fontFamily: sans, fontWeight: 400, fontSize: "13px", color: "#f5f0e8", textDecoration: "none" }}>ABOUT</Link>
        </div>

        {/* Section 2 — disclaimer text, w 918px */}
        <p style={{
          fontFamily: sans, fontWeight: 300, fontStyle: "oblique",
          fontSize: "11px", color: "#f5f0e8",
          margin: 0, width: "918px", flexShrink: 0,
        }}>
          OVYU DOES NOT SHARE, SELL, OR RETAIN PERSONAL DATA, INCLUDING UPLOAD, CONTRACT, AND CONVERSATIONS, BEYOND WHAT IS REQUIRED TO OPERATE THIS SERVICE.
        </p>

        {/* Section 3 — © OVYU | MANAGE COOKIES | LEGAL | PRIVACY, w 350px, pixel-exact from Figma */}
        <div style={{ position: "relative", width: "350px", height: "13px", flexShrink: 0 }}>
          <span style={{ position: "absolute", left: 0, top: "50%", transform: "translateY(-50%)", fontFamily: sans, fontWeight: 400, fontSize: "11px", color: "#f5f0e8", whiteSpace: "nowrap" }}>© 2026 OVYU</span>
          <span style={{ position: "absolute", left: "91px", top: "50%", transform: "translateY(-50%)", fontFamily: sans, fontWeight: 400, fontSize: "11px", color: "#f5f0e8", whiteSpace: "nowrap" }}>MANAGE COOKIES</span>
          <div style={{ position: "absolute", left: "210px", top: "1.5px", width: "1px", height: "10px", background: "#d9d9d9" }} />
          <span style={{ position: "absolute", left: "229px", top: "50%", transform: "translateY(-50%)", fontFamily: sans, fontWeight: 400, fontSize: "11px", color: "#f5f0e8", whiteSpace: "nowrap" }}>LEGAL</span>
          <div style={{ position: "absolute", left: "283px", top: "1.5px", width: "1px", height: "10px", background: "#d9d9d9" }} />
          <span style={{ position: "absolute", left: "302px", top: "50%", transform: "translateY(-50%)", fontFamily: sans, fontWeight: 400, fontSize: "11px", color: "#f5f0e8", whiteSpace: "nowrap" }}>PRIVACY</span>
        </div>
      </div>
    </footer>
  );
}
