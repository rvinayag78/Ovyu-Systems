"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function AccountPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [initial, setInitial] = useState("?");

  useEffect(() => {
    const session = sessionStorage.getItem("ovyu_session");
    if (!session) { router.replace("/login"); return; }
    const name = sessionStorage.getItem("ovyu_maker_name") ?? "";
    const e = sessionStorage.getItem("ovyu_pending_email") ?? "";
    setInitial(name[0]?.toUpperCase() ?? "?");
    setEmail(e);
  }, [router]);

  function handleLogout() {
    sessionStorage.clear();
    router.push("/logged-out");
  }

  return (
    <div className="ovyu-page">
      <Header variant="loggedIn" initial={initial} />
      <main className="ovyu-main ovyu-main--contracts">
        <h1 style={{
          fontFamily: "var(--ovyu-font-serif)",
          fontStyle: "italic",
          fontWeight: 400,
          fontSize: 64,
          color: "var(--ovyu-ink)",
          margin: "0 0 50px",
        }}>
          Account.
        </h1>

        {/* EMAIL section */}
        <div style={{ display: "flex", flexDirection: "column", gap: 15, width: 591, marginBottom: 50 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 12, width: 247 }}>
            <p style={{ fontFamily: "var(--ovyu-font-sans)", fontWeight: 700, fontSize: 18, color: "var(--ovyu-gold)", margin: 0, textTransform: "uppercase" }}>
              Email
            </p>
            <p style={{ fontFamily: "var(--ovyu-font-sans)", fontWeight: 400, fontSize: 18, color: "var(--ovyu-muted)", margin: 0 }}>
              The email tied to your account.
            </p>
          </div>
          <div style={{ display: "flex", flexDirection: "row", gap: 41, alignItems: "center" }}>
            <input
              readOnly
              value={email}
              placeholder="you@example.com"
              style={{
                width: 400,
                height: 57,
                background: "#fff",
                border: "1px solid var(--ovyu-muted)",
                borderRadius: "var(--ovyu-radius-input)",
                padding: "0 10px",
                fontFamily: "var(--ovyu-font-sans)",
                fontSize: 14,
                color: "var(--ovyu-muted)",
                boxSizing: "border-box",
              }}
            />
            <div style={{ display: "flex", flexDirection: "column", gap: 4, width: 150 }}>
              <span style={{ fontFamily: "var(--ovyu-font-sans)", fontStyle: "italic", fontSize: 18, color: "var(--ovyu-ink)" }}>
                Change email
              </span>
              <div style={{ height: 1, background: "var(--ovyu-ink)", width: "100%" }} />
            </div>
          </div>
        </div>

        {/* PLAN section */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12, width: 293, marginBottom: 50 }}>
          <p style={{ fontFamily: "var(--ovyu-font-sans)", fontWeight: 700, fontSize: 18, color: "var(--ovyu-gold)", margin: 0, textTransform: "uppercase" }}>
            Plan
          </p>
          <div style={{ display: "flex", flexDirection: "row", gap: 19, whiteSpace: "nowrap" }}>
            <span style={{ fontFamily: "var(--ovyu-font-sans)", fontWeight: 400, fontSize: 18, color: "var(--ovyu-ink)" }}>Free plan.</span>
            <span style={{ fontFamily: "var(--ovyu-font-sans)", fontStyle: "italic", fontWeight: 400, fontSize: 18, color: "var(--ovyu-muted)" }}>Paid plans coming later.</span>
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          style={{
            background: "none",
            border: "none",
            padding: 0,
            cursor: "pointer",
            fontFamily: "var(--ovyu-font-sans)",
            fontStyle: "italic",
            fontSize: 18,
            color: "var(--ovyu-ink)",
            textDecoration: "underline",
          }}
        >
          Log out
        </button>
      </main>
      <Footer />
    </div>
  );
}
