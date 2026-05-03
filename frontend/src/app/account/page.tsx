"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const serif = "Georgia, serif";
const sans = "Helvetica Neue, Helvetica, Arial, sans-serif";

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
    <div style={{ minWidth: "1920px", background: "#f8f7f5", display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Header variant="loggedIn" initial={initial} />

      <div style={{ position: "relative", flex: 1, minHeight: "874px" }}>
        {/* Content at left:110px, top:78px (181-103) */}
        <div style={{
          position: "absolute",
          left: "110px",
          top: "78px",
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
                value={email}
                placeholder="you@example.com"
                style={{
                  width: "400px", height: "57px",
                  background: "#fff", border: "1px solid #888", borderRadius: "10px",
                  padding: "0 10px", fontFamily: sans, fontWeight: 400, fontSize: "14px", color: "#888",
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
          <button
            onClick={handleLogout}
            style={{
              background: "none", border: "none", padding: 0, cursor: "pointer",
              fontFamily: sans, fontStyle: "italic", fontWeight: 400, fontSize: "18px",
              color: "#000", textDecoration: "underline", textAlign: "left",
            }}
          >
            Log out
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
}
