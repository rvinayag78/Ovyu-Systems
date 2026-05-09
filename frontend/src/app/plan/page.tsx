"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const serif = "Georgia, serif";
const sans = "Helvetica Neue, Helvetica, Arial, sans-serif";

const PLANS = [
  {
    name: "Free", price: "$0", priceNote: "Forever free", active: true,
    features: ["1 Keeper", "Voice upload", "Messages", "Story prompts", "Basic contract"],
  },
  {
    name: "Standard", price: null, priceNote: "Coming soon", active: false,
    features: ["Everything in Free", "3 Keepers", "Voice & video upload", "Extended contract options"],
  },
  {
    name: "Legacy", price: null, priceNote: "Coming soon", active: false,
    features: ["Everything in Standard", "5 Keepers", "Lifetime storage", "Priority support"],
  },
];

export default function PaywallPage() {
  const router = useRouter();
  const [initial, setInitial] = useState("?");

  useEffect(() => {
    const name = sessionStorage.getItem("ovyu_maker_name");
    if (name) setInitial(name[0]);
  }, []);

  function handleStartFree() {
    const contractId = sessionStorage.getItem("ovyu_contract_id");
    router.push(contractId ? `/contract/sign?id=${contractId}` : "/signup");
  }

  return (
    <div style={{ minWidth: "1920px", background: "#f8f7f5", display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Header variant="loggedIn" initial={initial} />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", paddingTop: "62px", paddingBottom: "60px", gap: "100px" }}>

        {/* Title block */}
        <div style={{
          width: "491px",
          display: "flex", flexDirection: "column", gap: "7px", alignItems: "center",
        }}>
          <h1 style={{ fontFamily: serif, fontWeight: 400, fontSize: "64px", color: "#1a1a1a", margin: 0, textAlign: "center", lineHeight: "normal" }}>
            Choose your plan
          </h1>
          <p style={{ fontFamily: sans, fontWeight: 400, fontSize: "22px", color: "#444", margin: 0, textAlign: "center" }}>
            Start free. Everything you build here is yours.
          </p>
        </div>

        {/* Plan cards */}
        <div style={{ display: "flex", flexDirection: "row", gap: "45px" }}>
          {PLANS.map(plan => (
            <div key={plan.name} style={{
              width: "500px", height: "600px",
              background: plan.active ? "#fff" : "#e7e7e7",
              border: plan.active ? "3px solid #000" : "3px solid rgba(136,136,136,0.4)",
              borderRadius: "16px",
              padding: plan.active ? "15px 37px" : "30px 37px",
              display: "flex", flexDirection: "column",
              gap: plan.active ? "64px" : "89px",
              alignItems: "center", justifyContent: "center",
              boxSizing: "border-box",
              opacity: plan.active ? 1 : 0.5,
            }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "7px", alignItems: "center", whiteSpace: "nowrap" }}>
                <p style={{ fontFamily: serif, fontWeight: 700, fontSize: "36px", color: "#000", margin: 0, textAlign: "center" }}>{plan.name}</p>
                {plan.active ? (
                  <>
                    <p style={{ fontFamily: serif, fontWeight: 700, fontSize: "48px", color: "#000", margin: 0, textAlign: "center" }}>{plan.price}</p>
                    <p style={{ fontFamily: sans, fontWeight: 400, fontSize: "18px", color: "#888", margin: 0 }}>{plan.priceNote}</p>
                  </>
                ) : (
                  <p style={{ fontFamily: sans, fontWeight: 400, fontSize: "18px", color: "#888", margin: 0 }}>Coming soon</p>
                )}
              </div>

              <ul style={{ display: "flex", flexDirection: "column", gap: "8px", fontFamily: sans, fontWeight: 400, fontSize: "24px", color: "#444", margin: 0, paddingLeft: "36px" }}>
                {plan.features.map(f => <li key={f}>{f}</li>)}
              </ul>

              {plan.active ? (
                <button
                  onClick={handleStartFree}
                  style={{
                    width: "456px", height: "72px", background: "#000", borderRadius: "8px", border: "none",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontFamily: sans, fontWeight: 700, fontSize: "24px", color: "#f5f0e8", cursor: "pointer",
                  }}
                >Start free</button>
              ) : (
                <div style={{
                  width: "456px", height: "72px", background: "#e7e7e7", border: "3px solid #888",
                  borderRadius: "12px", opacity: 0.5,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontFamily: sans, fontWeight: 700, fontSize: "24px", color: "#888",
                }}>Notify me</div>
              )}
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}
