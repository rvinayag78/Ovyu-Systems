"use client";

/**
 * PROTOTYPE — YOU Bar all 3 states
 * Figma 2003:922 "Profile Dashboard (You Expanded)"
 *
 * Shows all 3 states stacked vertically for side-by-side review:
 *   1. Locked   — bg #f0f0f0, text #bababa, 🔒
 *   2. Closed   — bg #ffffff, text #888, → arrow
 *   3. Open     — bg #efeaf2, ↓ arrow + expanded rows below
 */

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { YouBar } from "@/components/YouBar";

const sans = "Helvetica Neue, Helvetica, Arial, sans-serif";
const serif = "Georgia, serif";

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ paddingLeft: "50px", paddingBottom: "8px" }}>
      <p style={{ fontFamily: sans, fontWeight: 700, fontSize: "13px", color: "#888", margin: 0, textTransform: "uppercase", letterSpacing: "0.08em" }}>
        {children}
      </p>
    </div>
  );
}

export default function YouBarPrototype() {
  return (
    <div style={{ width: "1920px", background: "#f8f7f5", display: "flex", flexDirection: "column" }}>
      <Header variant="loggedIn" initial="L" />

      <div style={{ flex: 1, paddingTop: "60px", paddingBottom: "60px", display: "flex", flexDirection: "column", gap: "60px" }}>

        {/* State 1: Locked */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
          <SectionLabel>State 1 — YOU Locked (voice not complete)</SectionLabel>
          <YouBar voiceComplete={false} />
        </div>

        {/* State 2: Closed / unlocked */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
          <SectionLabel>State 2 — YOU Closed / unlocked (click to expand)</SectionLabel>
          <YouBar voiceComplete={true} contractId="demo" />
        </div>

        {/* Spacer so State 3 expanded rows have room */}
        <div style={{ paddingTop: "20px" }}>
          <SectionLabel>State 3 — YOU Open / expanded</SectionLabel>
          <YouBar
            voiceComplete={true}
            contractId="demo"
            dimensionCounts={{ history: 1, relationships: 3, "how-you-think": 0, "how-you-talk": 2, "how-you-live": 0, beliefs: 1, heart: 0 }}
          />
        </div>

      </div>

      <Footer />
    </div>
  );
}
