"use client";

/**
 * PROTOTYPE — Contracts page (Flow 2), both states
 * Figma 2024:738 "Profile Dashboard" — before voice complete
 * Figma 2003:922 "Profile Dashboard (You Expanded)" — after voice complete
 *
 * Content container: left-110px, width-1700px per Figma 2024:741
 * paddingTop: 78px → content top at 103+78=181px
 */

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { YouBar } from "@/components/YouBar";

const serif = "Georgia, serif";
const sans = "Helvetica Neue, Helvetica, Arial, sans-serif";

function Label({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ paddingLeft: "50px", paddingBottom: "10px", paddingTop: "10px" }}>
      <p style={{ fontFamily: sans, fontWeight: 700, fontSize: "13px", color: "#555", margin: 0, textTransform: "uppercase", letterSpacing: "0.08em" }}>
        {children}
      </p>
    </div>
  );
}

function ContractRow({ voiceComplete }: { voiceComplete: boolean }) {
  return (
    <div style={{
      width: "1700px", height: "100px",
      background: "#efeaf2",
      display: "flex", alignItems: "center",
      paddingLeft: "55px", paddingRight: "55px",
      boxSizing: "border-box",
    }}>
      {/* Inner: w-1600px per Figma */}
      <div style={{ width: "1600px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>

        {/* Left: avatar + MAKER + "For Ilias" — w-452px, gap-40px */}
        <div style={{ display: "flex", gap: "40px", alignItems: "center", width: "452px" }}>
          {/* 50px node, inset -21.6% → 71.6px display, bg #4b3c5e */}
          <div style={{ position: "relative", width: "50px", height: "50px", flexShrink: 0 }}>
            <div style={{
              position: "absolute",
              top: "-21.6%", left: "-21.6%", right: "-21.6%", bottom: "-21.6%",
              background: "#4b3c5e", borderRadius: "50%",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <span style={{ fontFamily: serif, fontWeight: 400, fontSize: "32px", color: "#fff" }}>M</span>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "9px", width: "213px" }}>
            <p style={{ fontFamily: sans, fontWeight: 700, fontSize: "16px", color: "#6a4d7d", margin: 0, textTransform: "uppercase" }}>Maker</p>
            <p style={{ fontFamily: serif, fontWeight: 700, fontSize: "30px", color: "#1a1a1a", margin: 0 }}>For Ilias</p>
          </div>
        </div>

        {/* Before voice complete: Signed on = center, View Contract = right (3 separate items)
            After voice complete:  Signed on + View Contract grouped center, Upload = right */}
        {voiceComplete ? (
          <>
            <div style={{ display: "flex", gap: "40px", alignItems: "center", fontFamily: sans, fontStyle: "oblique", fontSize: "18px", flexShrink: 0, whiteSpace: "nowrap" }}>
              <span style={{ color: "#888" }}>Signed on Jan 23, 2026</span>
              <span style={{ color: "#1a1a1a" }}>View Contract</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", flexShrink: 0 }}>
              <span style={{ fontFamily: sans, fontWeight: 700, fontSize: "18px", color: "#1a1a1a", textTransform: "uppercase" }}>Upload</span>
              <svg width="15" height="26" viewBox="0 0 15 26" fill="none">
                <path d="M1 1L14 13L1 25" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </>
        ) : (
          <>
            <span style={{ fontFamily: sans, fontStyle: "oblique", fontSize: "18px", color: "#888", flexShrink: 0, whiteSpace: "nowrap" }}>
              Signed on Jan 23, 2026
            </span>
            <span style={{ fontFamily: sans, fontStyle: "oblique", fontSize: "18px", color: "#1a1a1a", flexShrink: 0, whiteSpace: "nowrap" }}>
              View Contract
            </span>
          </>
        )}

      </div>
    </div>
  );
}

function StartNewContractRow() {
  return (
    <div style={{
      width: "1700px", height: "100px",
      border: "1px solid #888", borderRadius: "8px",
      display: "flex", alignItems: "center", gap: "57px",
      paddingLeft: "55px", paddingRight: "55px",
      boxSizing: "border-box",
    }}>
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none" style={{ flexShrink: 0 }}>
        <line x1="20" y1="0" x2="20" y2="40" stroke="#888" strokeWidth="2.5"/>
        <line x1="0" y1="20" x2="40" y2="20" stroke="#888" strokeWidth="2.5"/>
      </svg>
      <span style={{ fontFamily: sans, fontWeight: 700, fontSize: "22px", color: "#888", whiteSpace: "nowrap" }}>
        Start a new contract
      </span>
    </div>
  );
}

function ContractsPage({ voiceComplete }: { voiceComplete: boolean }) {
  return (
    <div style={{ width: "1920px", background: "#f8f7f5", display: "flex", flexDirection: "column" }}>
      <Header variant="loggedIn" initial="L" />

      <div style={{ flex: 1, paddingTop: "78px" }}>
        {/* left-110px, w-1700px per Figma 2024:741 */}
        <div style={{ marginLeft: "110px", width: "1700px", display: "flex", flexDirection: "column", gap: "50px", paddingBottom: "40px" }}>

          <h1 style={{ fontFamily: serif, fontStyle: "italic", fontWeight: 400, fontSize: "64px", color: "#1a1a1a", margin: 0, lineHeight: "normal" }}>
            Your contracts
          </h1>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <p style={{ fontFamily: sans, fontWeight: 700, fontSize: "18px", color: "#c9a84c", margin: 0 }}>MAKING</p>
            <ContractRow voiceComplete={voiceComplete} />
            <StartNewContractRow />
            {/* "Ready to begin?" — only before voice complete */}
            {!voiceComplete && (
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <div style={{
                  display: "flex", alignItems: "center", justifyContent: "center",
                  width: "345px", height: "48px",
                  background: "#1a1a1a", borderRadius: "8px", cursor: "pointer",
                }}>
                  <span style={{ fontFamily: sans, fontSize: "16px", color: "#f5f0e8" }}>
                    <em style={{ fontWeight: 300, fontStyle: "italic" }}>Ready to begin?</em>
                    {" "}Start with your voice →
                  </span>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>

      {!voiceComplete && (
        <div style={{ paddingLeft: "50px", paddingBottom: "12px" }}>
          <p style={{ fontFamily: sans, fontStyle: "oblique", fontSize: "16px", color: "#888", margin: 0 }}>
            Complete your voice recording to unlock your profile.
          </p>
        </div>
      )}

      <YouBar voiceComplete={voiceComplete} contractId={voiceComplete ? "demo" : undefined} />
      <Footer />
    </div>
  );
}

export default function ContractsPrototype() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "60px", background: "#d0d0d0", paddingBottom: "60px" }}>
      <div>
        <Label>State A — Before voice complete (Figma 2024:738) — YOU locked, Ready to begin CTA visible</Label>
        <ContractsPage voiceComplete={false} />
      </div>
      <div>
        <Label>State B — After voice complete (Figma 2003:922) — YOU closed, Upload visible</Label>
        <ContractsPage voiceComplete={true} />
      </div>
    </div>
  );
}
