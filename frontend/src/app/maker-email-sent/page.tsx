"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const serif = "Georgia, serif";
const sans = "Helvetica Neue, Helvetica, Arial, sans-serif";

export default function MakerEmailSentPage() {
  const [email, setEmail] = useState("");

  useEffect(() => {
    const stored = sessionStorage.getItem("ovyu_pending_email");
    if (stored) setEmail(stored);
  }, []);

  return (
    <div style={{ minWidth: "1920px", background: "#f8f7f5", display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Header variant="loggedOut" />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "16px" }}>
        <h1 style={{ fontFamily: serif, fontStyle: "italic", fontWeight: 400, fontSize: "64px", color: "#1a1a1a", margin: 0 }}>
          Check your email.
        </h1>
        <p style={{ fontFamily: sans, fontWeight: 400, fontSize: "22px", color: "#888", margin: 0 }}>
          We sent it to {email ? <strong style={{ color: "#1a1a1a" }}>{email}</strong> : "your inbox"}.
        </p>
      </div>
      <Footer />
    </div>
  );
}
