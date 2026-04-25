import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export function ComingSoon({ helper = "This part of Ovyu is being built. Check back soon." }: { helper?: string }) {
  return (
    <div className="ovyu-page">
      <Header />
      <main className="ovyu-main" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ maxWidth: 480, textAlign: "center" }}>
          <h1 style={{ fontFamily: "var(--ovyu-font-serif)", fontSize: "clamp(32px,4vw,52px)", lineHeight: 1.05, marginBottom: 16 }}>
            Coming soon.
          </h1>
          <p style={{ fontSize: 17, color: "var(--ovyu-ink-soft)", lineHeight: 1.55 }}>{helper}</p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
