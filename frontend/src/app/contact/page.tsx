"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const serif = "Georgia, serif";
const sans = "Helvetica Neue, Helvetica, Arial, sans-serif";

export default function ContactPage() {
  const [initial, setInitial] = useState<string | undefined>(undefined);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const session = sessionStorage.getItem("ovyu_session");
    const name =
      sessionStorage.getItem("ovyu_maker_name") ??
      sessionStorage.getItem("ovyu_keeper_name") ?? "";
    if (session) {
      setLoggedIn(true);
      setInitial(name[0]?.toUpperCase() ?? "?");
    }
  }, []);

  return (
    <div style={{ minWidth: "1920px", background: "#f8f7f5", display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Header variant={loggedIn ? "loggedIn" : "loggedOut"} initial={initial} />

      <div style={{ flex: 1, paddingLeft: "110px", paddingTop: "78px", paddingBottom: "80px" }}>
        <div style={{ width: "700px", display: "flex", flexDirection: "column", gap: "50px" }}>
          <h1 style={{
            fontFamily: serif, fontStyle: "italic", fontWeight: 400,
            fontSize: "64px", color: "#1a1a1a", margin: 0, lineHeight: "normal",
          }}>
            Contact.
          </h1>

          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            <p style={{
              fontFamily: sans, fontWeight: 400, fontSize: "22px",
              color: "#444", margin: 0, lineHeight: "1.5",
            }}>
              For questions about your account, contract, or anything else — reach us at:
            </p>

            <a
              href="mailto:contactovyu@gmail.com"
              style={{
                fontFamily: sans, fontWeight: 700, fontSize: "22px",
                color: "#1a1a1a", textDecoration: "underline",
              }}
            >
              contactovyu@gmail.com
            </a>

            <p style={{
              fontFamily: sans, fontStyle: "italic", fontWeight: 400,
              fontSize: "16px", color: "#888", margin: 0, lineHeight: "1.5",
            }}>
              We respond within 1–2 business days.
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
