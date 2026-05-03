"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const PLANS = [
  {
    name: "Free", price: "$0", tagline: "Forever free",
    features: [
      "1 Keeper", "Voice upload", "Messages",
      "Story prompts", "Data collection (up to X amount)", "Basic contract",
    ],
    cta: "Start free", active: true,
  },
  {
    name: "Standard", price: null, tagline: "Coming soon",
    features: [
      "Everything in Free", "3 Keepers", "Voice & video upload",
      "Messages and scheduled deliveries", "Data collection (up to X amount)",
      "Extended contract options",
    ],
    cta: "Notify me", active: false,
  },
  {
    name: "Legacy", price: null, tagline: "Coming soon",
    features: [
      "Everything in Standard", "5 Keepers", "Priority Upload & Transfer support",
      "Dedicated Transfer Contact assist", "Data collection (up to XX amount)",
      "Lifetime storage",
    ],
    cta: "Notify me", active: false,
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
    if (contractId) {
      router.push(`/contract/sign?id=${contractId}`);
    } else {
      router.push("/signup");
    }
  }

  return (
    <div className="ovyu-page">
      <Header variant="loggedIn" initial={initial} />
      <main className="ovyu-main">
        <div className="ovyu-page-header" style={{ textAlign: "center" }}>
          <h1>Choose your plan</h1>
          <span className="ovyu-sub">Start free. Everything you build here is yours</span>
        </div>

        <div className="ovyu-pricing">
          {PLANS.map(plan => (
            <div key={plan.name} className={`ovyu-pricing__card${plan.active ? "" : " is-disabled"}`}>
              <div>
                <p className="ovyu-pricing__title">{plan.name}</p>
                {plan.price && <p className="ovyu-pricing__price">{plan.price}</p>}
                <p className="ovyu-pricing__tag">{plan.tagline}</p>
              </div>
              <ul className="ovyu-pricing__list">
                {plan.features.map(f => <li key={f}>{f}</li>)}
              </ul>
              {plan.active ? (
                <button
                  className="ovyu-btn ovyu-btn--primary ovyu-btn--wide"
                  onClick={handleStartFree}
                >
                  {plan.cta}
                </button>
              ) : (
                <button className="ovyu-btn ovyu-btn--primary ovyu-btn--wide" disabled>
                  {plan.cta}
                </button>
              )}
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
