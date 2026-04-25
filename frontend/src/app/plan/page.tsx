import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const PLANS = [
  {
    title: "Free", price: "$0", tag: "Forever free",
    features: ["1 Keeper", "Voice upload", "Story prompts", "Basic contract"],
    cta: "Start free →", href: "/contract/new", disabled: false,
  },
  {
    title: "Standard", price: "Coming soon", tag: null,
    features: ["Everything in Free", "Unlimited uploads", "Photo & video", "Extended contract options"],
    cta: "Notify me", href: null, disabled: true,
  },
  {
    title: "Legacy", price: "Coming soon", tag: null,
    features: ["Everything in Standard", "Priority Transfer support", "Dedicated Transfer Contact assist", "Lifetime storage"],
    cta: "Notify me", href: null, disabled: true,
  },
];

export default function PlanPage() {
  return (
    <div className="ovyu-page">
      <Header />
      <main className="ovyu-main">
        <div className="ovyu-page-header" style={{ textAlign: "center" }}>
          <h1>Choose your plan.</h1>
          <span className="ovyu-sub">Start free. Everything you build here is yours.</span>
        </div>

        <div className="ovyu-pricing">
          {PLANS.map(plan => (
            <div key={plan.title} className={`ovyu-pricing__card${plan.disabled ? " is-disabled" : ""}`}>
              <div>
                <p className="ovyu-pricing__title">{plan.title}</p>
                <p className="ovyu-pricing__price">{plan.price}</p>
                {plan.tag && <p className="ovyu-pricing__tag">{plan.tag}</p>}
              </div>
              <ul className="ovyu-pricing__list">
                {plan.features.map(f => <li key={f}>{f}</li>)}
              </ul>
              {plan.href ? (
                <a href={plan.href} className="ovyu-btn ovyu-btn--primary">{plan.cta}</a>
              ) : (
                <button className="ovyu-btn ovyu-btn--primary" disabled>{plan.cta}</button>
              )}
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
