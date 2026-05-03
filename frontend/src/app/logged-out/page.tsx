import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function LoggedOutPage() {
  return (
    <div className="ovyu-page ovyu-page--viewport">
      <Header variant="loggedOut" />
      <main className="ovyu-main" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 42, maxWidth: 632 }}>

          {/* Purple checkmark circle */}
          <div style={{
            width: 123,
            height: 123,
            background: "var(--ovyu-avatar-purple)",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}>
            <span style={{
              fontFamily: "var(--ovyu-font-serif)",
              fontStyle: "italic",
              fontSize: 64,
              color: "#fff",
              lineHeight: 1,
            }}>✓</span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
            <h1 style={{
              fontFamily: "var(--ovyu-font-serif)",
              fontWeight: 400,
              fontSize: 64,
              color: "var(--ovyu-ink)",
              textAlign: "center",
              margin: 0,
              lineHeight: "normal",
            }}>
              You&apos;re logged out.
            </h1>
            <p style={{
              fontFamily: "var(--ovyu-font-sans)",
              fontWeight: 400,
              fontSize: 22,
              color: "var(--ovyu-ink-soft)",
              textAlign: "center",
              margin: 0,
            }}>
              Your account is closed on this device.
            </p>
          </div>

          <Link href="/login" style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 304,
            height: 48,
            background: "var(--ovyu-ink)",
            borderRadius: "var(--ovyu-radius-sm)",
            fontFamily: "var(--ovyu-font-sans)",
            fontWeight: 700,
            fontSize: 16,
            color: "var(--ovyu-footer-text)",
            textDecoration: "none",
          }}>
            Log back in →
          </Link>

          <p style={{
            fontFamily: "var(--ovyu-font-sans)",
            fontStyle: "italic",
            fontWeight: 400,
            fontSize: 16,
            color: "var(--ovyu-ink-soft)",
            textAlign: "center",
            lineHeight: 1.35,
            margin: 0,
          }}>
            ovyu.com sends a sign-in link to your email each time. There&apos;s no password to
            remember, and no one can access your account without that link.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
