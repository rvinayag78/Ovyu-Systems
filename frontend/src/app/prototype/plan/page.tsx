import Link from "next/link";
import ProtoHeader from "../_components/ProtoHeader";
import ProtoFooter from "../_components/ProtoFooter";
import ProtoNav from "../_components/ProtoNav";

const serif = "Georgia, serif";
const sans = "Helvetica Neue, Helvetica, Arial, sans-serif";

function PlanCard({
  name, price, priceNote, features, ctaLabel, ctaLink, active,
}: {
  name: string; price: string; priceNote: string;
  features: string[]; ctaLabel: string; ctaLink?: string; active?: boolean;
}) {
  return (
    <div style={{
      width: "500px", height: "600px",
      background: active ? "#fff" : "#e7e7e7",
      border: active ? "3px solid #000" : "3px solid rgba(136,136,136,0.4)",
      borderRadius: "16px",
      padding: active ? "15px 37px" : "30px 37px",
      display: "flex", flexDirection: "column",
      gap: active ? "64px" : "89px",
      alignItems: "center", justifyContent: "center",
      boxSizing: "border-box",
      opacity: active ? 1 : 0.5,
    }}>
      <div style={{ display: "flex", flexDirection: "column", gap: "7px", alignItems: "center", whiteSpace: "nowrap" }}>
        <p style={{ fontFamily: serif, fontWeight: 700, fontSize: "36px", color: "#000", margin: 0, textAlign: "center" }}>{name}</p>
        {active ? (
          <>
            <p style={{ fontFamily: serif, fontWeight: 700, fontSize: "48px", color: "#000", margin: 0, textAlign: "center" }}>{price}</p>
            <p style={{ fontFamily: sans, fontWeight: 400, fontSize: "18px", color: "#888", margin: 0 }}>{priceNote}</p>
          </>
        ) : (
          <p style={{ fontFamily: sans, fontWeight: 400, fontSize: "18px", color: "#888", margin: 0 }}>Coming soon</p>
        )}
      </div>

      <ul style={{
        display: "flex", flexDirection: "column", gap: "8px",
        fontFamily: sans, fontWeight: 400, fontSize: "24px", color: "#444",
        margin: 0, paddingLeft: "36px",
      }}>
        {features.map((f) => <li key={f}>{f}</li>)}
      </ul>

      {active && ctaLink ? (
        <Link href={ctaLink} style={{
          width: "456px", height: "72px",
          background: "#000", borderRadius: "8px",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontFamily: sans, fontWeight: 700, fontSize: "24px", color: "#f5f0e8",
          textDecoration: "none",
        }}>{ctaLabel}</Link>
      ) : (
        <div style={{
          width: "456px", height: "72px",
          background: "#e7e7e7", border: "3px solid #888", borderRadius: "12px", opacity: 0.5,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontFamily: sans, fontWeight: 700, fontSize: "24px", color: "#888",
        }}>{ctaLabel}</div>
      )}
    </div>
  );
}

export default function PrototypePlan() {
  return (
    <div style={{
      width: "1920px",
      height: "1080px",
      background: "#f8f7f5",
      position: "relative",
      overflow: "hidden",
    }}>
      <ProtoHeader variant="loggedin" />

      {/* Title block */}
      <div style={{
        position: "absolute",
        left: "50%",
        top: "165px",
        transform: "translateX(-50%)",
        width: "491px",
        display: "flex",
        flexDirection: "column",
        gap: "7px",
        alignItems: "center",
      }}>
        <h1 style={{
          fontFamily: serif, fontWeight: 400, fontSize: "64px", color: "#1a1a1a",
          margin: 0, textAlign: "center", lineHeight: "normal",
        }}>Choose your plan</h1>
        <p style={{ fontFamily: sans, fontWeight: 400, fontSize: "22px", color: "#444", margin: 0, textAlign: "center" }}>
          Start free. Everything you build here is yours.
        </p>
      </div>

      {/* Plan cards */}
      <div style={{
        position: "absolute",
        left: "165px",
        top: "325px",
        display: "flex",
        flexDirection: "row",
        gap: "45px",
      }}>
        <PlanCard
          name="Free" price="$0" priceNote="Forever free"
          features={["1 Keeper", "Voice upload", "Messages", "Story prompts", "Basic contract"]}
          ctaLabel="Start free"
          ctaLink="/prototype/begin"
          active
        />
        <PlanCard
          name="Standard" price="" priceNote=""
          features={["Everything in Free", "3 Keepers", "Voice & video upload", "Extended contract options"]}
          ctaLabel="Notify me"
        />
        <PlanCard
          name="Legacy" price="" priceNote=""
          features={["Everything in Standard", "5 Keepers", "Lifetime storage", "Priority support"]}
          ctaLabel="Notify me"
        />
      </div>

      <ProtoFooter />
      <ProtoNav />
    </div>
  );
}
