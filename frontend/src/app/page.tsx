import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function LandingPage() {
  return (
    <div className="ovyu-page">
      <Header />
      <main className="ovyu-main">
        <section className="ovyu-hero">
          <div className="ovyu-hero__copy">
            <h1>A bit of you.</h1>
            <span className="ovyu-sub">Keep yourself for the one person who needs you most.</span>
            <p>
              Ovyu lets you upload your voice, stories, and personality for one named person to
              access when you&apos;re gone. Private. Consensual. Yours.
            </p>
            <Link href="/contract/new" className="ovyu-btn ovyu-btn--begin">Begin →</Link>
          </div>

          <aside className="ovyu-hero__sidebar" aria-label="How it works">
            <div className="ovyu-hero__step">
              <span className="num">Step one</span>
              <h3>Sign the contract.</h3>
              <p>You and one trusted person agree on what Ovyu is for, and what it isn&apos;t. Ten minutes.</p>
            </div>
            <hr className="ovyu-hero__divider" />
            <div className="ovyu-hero__step">
              <span className="num">Step two</span>
              <h3>Upload yourself.</h3>
              <p>Voice, photos, stories, opinions. The shape of you, in your own words.</p>
            </div>
            <hr className="ovyu-hero__divider" />
            <div className="ovyu-hero__step">
              <span className="num">Step three</span>
              <h3>The Transfer.</h3>
              <p>When the time comes, your Keeper gains access. Until then, no one — not even us — sees what you&apos;ve made.</p>
            </div>
          </aside>
        </section>
      </main>
      <Footer />
    </div>
  );
}
