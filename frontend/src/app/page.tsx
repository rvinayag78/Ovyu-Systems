import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function LandingPage() {
  return (
    <div className="ovyu-page ovyu-page--viewport">
      <Header />
      <main className="ovyu-main ovyu-main--home">
        <section className="ovyu-hero">

          {/* Column 1 — hero copy */}
          <div className="ovyu-hero__copy">
            <h1>A bit <em>of you.</em></h1>
            <span className="ovyu-sub">Keep yourself for the one person who needs you most.</span>
            <p>
              Ovyu lets you upload your voice, stories, and personality for one named person to
              access when you&apos;re gone. Private. Consensual. Yours.
            </p>
            <Link href="/signup" className="ovyu-btn ovyu-btn--begin">Begin &nbsp;→</Link>
          </div>

          {/* Column 2 — spacer (implicit in 3-col grid) */}

          {/* Column 3 — 01/02/03 sidebar */}
          <aside className="ovyu-hero__sidebar" aria-label="How it works">
            <SidebarStep
              src="/ovyu-01-contract.svg"
              naturalW={302} naturalH={45.5}
              caption="You and your Keeper agree on the terms before anything begins."
            />
            <hr className="ovyu-hero__divider" />
            <SidebarStep
              src="/ovyu-02-upload.svg"
              naturalW={280.5} naturalH={45.5}
              caption="You share your voice, memories, and stories at your own pace."
            />
            <hr className="ovyu-hero__divider" />
            <SidebarStep
              src="/ovyu-03-transfer.svg"
              naturalW={301} naturalH={58.9}
              caption="When the time comes, your Keeper receives what you left for them."
            />
          </aside>

        </section>
      </main>
      <Footer />
    </div>
  );
}

function SidebarStep({ src, naturalW, naturalH, caption }: {
  src: string; naturalW: number; naturalH: number; caption: string;
}) {
  return (
    <div className="ovyu-hero__step">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt="" width={naturalW} height={naturalH} style={{ display: "block", marginBottom: 12, maxWidth: "100%" }} />
      <p style={{ fontStyle: "italic", fontWeight: 400, fontSize: 16, color: "var(--ovyu-muted)", margin: 0, lineHeight: "normal" }}>
        {caption}
      </p>
    </div>
  );
}
