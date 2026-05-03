import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const serif = "Georgia, serif";
const sans = "Helvetica Neue, Helvetica, Arial, sans-serif";

export default function LoggedOutPage() {
  return (
    <div style={{ minWidth: "1920px", background: "#f8f7f5", display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Header variant="loggedOut" />

      <div style={{ position: "relative", flex: 1, minHeight: "874px" }}>
        {/* Content block at left:644px, top:194px (297-103) */}
        <div style={{
          position: "absolute",
          left: "644px",
          top: "194px",
          width: "632px",
          height: "456px",
        }}>
          {/* Purple circle */}
          <div style={{
            position: "absolute",
            left: "254.5px",
            top: "0px",
            width: "123px",
            height: "123px",
            background: "#4b3c5e",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}>
            <span style={{ fontFamily: serif, fontStyle: "italic", fontWeight: 400, fontSize: "64px", color: "#fff" }}>✓</span>
          </div>

          {/* Text + actions */}
          <div style={{ position: "absolute", left: "0px", right: "0px", top: "170px", height: "286px" }}>
            {/* Headline block */}
            <div style={{ position: "absolute", top: "0px", width: "511px", left: "60.5px" }}>
              <h1 style={{
                fontFamily: serif, fontWeight: 400, fontSize: "64px", color: "#1a1a1a",
                textAlign: "center", margin: "0 0 24px 0", lineHeight: "normal",
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

            {/* CTA block */}
            <div style={{ position: "absolute", top: "164px", width: "632px" }}>
              <Link href="/login" style={{
                position: "absolute",
                left: "164px",
                width: "304px",
                height: "48px",
                background: "#000",
                borderRadius: "8px",
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: sans,
                fontWeight: 700,
                fontSize: "16px",
                color: "#f5f0e8",
              }}>
                Log back in →
              </Link>
              <p style={{
                position: "absolute",
                top: "60px",
                width: "632px",
                fontFamily: sans,
                fontStyle: "italic",
                fontWeight: 400,
                fontSize: "16px",
                color: "#444",
                textAlign: "center",
                margin: 0,
                lineHeight: "1.35",
              }}>
                ovyu.com sends a sign-in link to your email each time. There&apos;s no password to remember, and no one can access your account without that link.
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
