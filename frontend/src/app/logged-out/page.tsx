import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const serif = "Georgia, serif";
const sans = "Helvetica Neue, Helvetica, Arial, sans-serif";

export default function LoggedOutPage() {
  return (
    <div style={{ minWidth: "1920px", background: "#f8f7f5", display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Header variant="loggedOut" />

      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", paddingTop: "194px", paddingBottom: "60px" }}>
        <div style={{ width: "632px", display: "flex", flexDirection: "column", alignItems: "center", gap: "47px" }}>
          {/* Purple circle */}
          <div style={{
            width: "123px", height: "123px",
            background: "#4b3c5e", borderRadius: "50%",
            display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0,
          }}>
            <span style={{ fontFamily: serif, fontStyle: "italic", fontWeight: 400, fontSize: "64px", color: "#fff" }}>✓</span>
          </div>

          {/* Headline */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "24px" }}>
            <h1 style={{
              fontFamily: serif, fontWeight: 400, fontSize: "64px", color: "#1a1a1a",
              textAlign: "center", margin: 0, lineHeight: "normal",
            }}>
              You&apos;re logged out.
            </h1>
            <p style={{
              fontFamily: sans, fontWeight: 400, fontSize: "22px", color: "#444",
              textAlign: "center", margin: 0,
            }}>
              Your account is closed on this device.
            </p>
          </div>

          {/* CTA */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px" }}>
            <Link href="/login" style={{
              width: "304px", height: "48px",
              background: "#000", borderRadius: "8px",
              textDecoration: "none",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontFamily: sans, fontWeight: 700, fontSize: "16px", color: "#f5f0e8",
            }}>
              Log back in →
            </Link>
            <p style={{
              width: "632px",
              fontFamily: sans, fontStyle: "italic", fontWeight: 400, fontSize: "16px",
              color: "#444", textAlign: "center", margin: 0, lineHeight: "1.35",
            }}>
              ovyu.com sends a sign-in link to your email each time. There&apos;s no password to remember, and no one can access your account without that link.
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
