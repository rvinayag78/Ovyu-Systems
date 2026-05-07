"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const serif = "Georgia, serif";
const sans = "Helvetica Neue, Helvetica, Arial, sans-serif";

export default function KeeperRegisterPage() {
  const router = useRouter();
  const [initial, setInitial] = useState("?");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const keeperName = sessionStorage.getItem("ovyu_keeper_name");
    const contractId = sessionStorage.getItem("ovyu_contract_id");
    if (!keeperName || !contractId) {
      router.replace("/");
      return;
    }
    setInitial(keeperName[0]?.toUpperCase() ?? "?");
    setReady(true);
  }, [router]);

  if (!ready) return null;

  return (
    <div style={{ minWidth: "1920px", background: "#f8f7f5", display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Header variant="loggedIn" initial={initial} />

      <div style={{ flex: 1 }}>
        <div style={{
          margin: "135px auto 60px",
          width: "770px",
          display: "flex",
          flexDirection: "column",
          gap: "47px",
          alignItems: "center",
        }}>
          {/* Purple checkmark circle */}
          <div style={{
            width: "123px", height: "123px",
            background: "#4b3c5e", borderRadius: "50%",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <span style={{ fontFamily: serif, fontStyle: "italic", fontWeight: 400, fontSize: "64px", color: "#fff" }}>✓</span>
          </div>

          {/* Text block */}
          <div style={{ display: "flex", flexDirection: "column", gap: "42px", alignItems: "center", width: "100%" }}>
            <div style={{ textAlign: "center" }}>
              <p style={{ fontFamily: serif, fontWeight: 400, fontSize: "64px", color: "#1a1a1a", margin: 0, lineHeight: "normal" }}>
                Your email is verified.
              </p>
              <p style={{ fontFamily: serif, fontStyle: "italic", fontWeight: 400, fontSize: "64px", color: "#1a1a1a", margin: 0, lineHeight: "normal" }}>
                Let&apos;s review your contract.
              </p>
            </div>

            <p style={{ fontFamily: sans, fontWeight: 400, fontSize: "22px", color: "#444", textAlign: "center", margin: 0 }}>
              You&apos;ll read through the agreement, sign as the Keeper, and your Maker will be notified. The Contract is locked once both of you have signed.
            </p>

            <button
              onClick={() => router.push("/keeper/contract")}
              style={{
                width: "304px", height: "48px",
                background: "#000",
                borderRadius: "8px", border: "none",
                fontFamily: sans, fontWeight: 700, fontSize: "16px",
                color: "#f5f0e8", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}
            >
              Review my contract →
            </button>

            <p style={{ fontFamily: sans, fontStyle: "italic", fontWeight: 400, fontSize: "16px", color: "#444", textAlign: "center", margin: 0 }}>
              You can log in any time at ovyu.com with a link sent to your email.
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
