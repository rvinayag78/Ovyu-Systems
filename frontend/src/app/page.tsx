import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

// Figma asset URLs — exported from Assets frame (node 185:1226).
// These expire ~7 days after extraction. Replace with /public SVGs for production.
const IMG_CONTRACT  = "https://www.figma.com/api/mcp/asset/614c926d-2812-44d2-a299-3b31c5200d87";
const IMG_UPLOAD    = "https://www.figma.com/api/mcp/asset/2996c380-66b2-47b7-acc3-cbef1b10a41e";
const IMG_TRANSFER  = "https://www.figma.com/api/mcp/asset/61207fed-539c-4d3b-a4e4-ff18f3f81b3b";

export default function LandingPage() {
  return (
    <div className="ovyu-page ovyu-page--viewport">
      <Header />
      <main className="ovyu-main ovyu-main--center">
        <section className="ovyu-hero">
          {/* Left — hero copy */}
          <div className="ovyu-hero__copy">
            <h1>
              A bit <em>of you.</em>
            </h1>
            <span className="ovyu-sub" style={{ fontSize: 22, fontWeight: 400, color: "var(--ovyu-ink-soft)" }}>Keep yourself for the one person who needs you most.</span>
            <p style={{ fontSize: 18, fontWeight: 300, color: "var(--ovyu-muted)" }}>
              Ovyu lets you upload your voice, stories, and personality for one named person to
              access when you&apos;re gone.{" "}
              Private. Consensual. Yours.
            </p>
            <Link href="/signup" className="ovyu-btn ovyu-btn--begin">Begin &nbsp;→</Link>
          </div>

          {/* Right — white card sidebar */}
          <aside className="ovyu-hero__sidebar" aria-label="How it works">
            <SidebarStep
              src={IMG_CONTRACT}
              width={302} height={45.5}
              caption="You and your Keeper agree on the terms before anything begins."
            />
            <hr className="ovyu-hero__divider" />
            <SidebarStep
              src={IMG_UPLOAD}
              width={280.5} height={45.5}
              caption="You share your voice, memories, and stories at your own pace."
            />
            <hr className="ovyu-hero__divider" />
            <SidebarStep
              src={IMG_TRANSFER}
              width={301} height={58.9}
              caption="When the time comes, your Keeper receives what you left for them."
            />
          </aside>
        </section>
      </main>
      <Footer />
    </div>
  );
}

function SidebarStep({ src, width, height, caption }: {
  src: string; width: number; height: number; caption: string;
}) {
  return (
    <div className="ovyu-hero__step" style={{ position: "relative", minHeight: 154 }}>
      <img
        src={src} alt=""
        style={{ width, height, display: "block", marginBottom: 12 }}
      />
      <p style={{ fontStyle: "italic", fontWeight: 300, fontSize: 16, color: "var(--ovyu-muted)", margin: 0 }}>
        {caption}
      </p>
    </div>
  );
}
