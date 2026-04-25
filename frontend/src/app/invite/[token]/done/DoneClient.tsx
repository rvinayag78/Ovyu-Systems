"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

function DoneInner() {
  const params = useSearchParams();
  const makerName = params.get("maker") ?? "the Maker";

  return (
    <div className="ovyu-page">
      <Header />
      <main className="ovyu-main" style={{ display: "flex", alignItems: "flex-start", justifyContent: "center" }}>
        <div className="ovyu-confirm">
          <div className="ovyu-confirm-circle">✓</div>
          <h1>You&apos;ve signed.</h1>
          <p>The contract between you and {makerName} is now in place.</p>
          <div className="ovyu-confirm__divider" />

          <div className="ovyu-callout ovyu-callout--hero" style={{ width: "100%", boxSizing: "border-box" }}>
            <p className="ovyu-callout__title">What happens when the time comes</p>
            <div className="ovyu-callout__body">
              <p>
                When {makerName} passes, you will need to go to <strong>ovyu.com/activate-transfer</strong>.
                There you will submit evidence of their passing and confirm the details for their Keeper.
                Once you do that, we take it from there.
              </p>
              <p>There is no deadline. Do this when you are ready and able.</p>
            </div>
          </div>

          <Link href="/" className="ovyu-btn ovyu-btn--primary">Done</Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export function DoneClient() {
  return (
    <Suspense fallback={<div style={{ minHeight: "100vh", background: "var(--ovyu-cream)" }} />}>
      <DoneInner />
    </Suspense>
  );
}
