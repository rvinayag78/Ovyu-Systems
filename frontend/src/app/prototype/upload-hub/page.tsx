"use client";

/**
 * PROTOTYPE — Contract Dashboard (Upload Hub)
 * Figma 2004:1726 "Contract Dashboard" — YOU closed state
 * Figma 2005:1923 "Contract Dashboard (You Expanded)" — YOU open state (click YOU bar)
 *
 * Content container: left 108px, width 1702px, gap 48px
 * paddingTop 31px (content top = 103 + 31 = 134px)
 */

// no state needed — YouBar manages its own expanded state internally
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { YouBar } from "@/components/YouBar";

const serif = "Georgia, serif";
const sans = "Helvetica Neue, Helvetica, Arial, sans-serif";

const KEEPER_CARDS = [
  { key: "who_they_are",      label: "Who they are",           sub: "Their story, history, birth dates, context. Your relationship to them.", width: 555, textWidth: 465, filled: false },
  { key: "who_theyre_becoming", label: "Who they're becoming", sub: "Who they are now, their hopes, the person they're turning into.",        width: 550, textWidth: 443, filled: false },
  { key: "what_you_want",     label: "What you want for them", sub: "Your hopes for their life. The shape you hope it takes.",                width: 550, textWidth: 380, filled: false },
  { key: "what_you_want_known", label: "What you want them to know", sub: "How you feel about them. Praise, acknowledgment, things worth naming.", width: 550, textWidth: 380, filled: false },
  { key: "advice",            label: "Advice",                  sub: "Counsel for happy times and hard times. What you imagine them needing.", width: 550, textWidth: 380, filled: false },
];

function Dot({ filled }: { filled: boolean }) {
  return (
    <div style={{ position: "relative", width: "25.92px", height: "25.92px", flexShrink: 0 }}>
      <div style={{
        position: "absolute",
        top: "-21.6%", left: "-21.6%", right: "-21.6%", bottom: "-21.6%",
        borderRadius: "50%",
        border: `1.5px solid ${filled ? "#6a4d7d" : "#bababa"}`,
        background: filled ? "#6a4d7d" : "transparent",
      }} />
    </div>
  );
}

export default function UploadHubPrototype() {
  return (
    <div style={{ width: "1920px", height: "1340px", background: "#f8f7f5", display: "flex", flexDirection: "column" }}>
      <Header variant="loggedIn" initial="L" />

      {/* flex: 1 pushes YouBar + Footer to bottom of 1340px viewport so overlay bottom: 103px aligns with footer */}
      <div style={{ flex: 1, paddingTop: "31px" }}>
        <div style={{
          marginLeft: "108px",
          width: "1702px",
          display: "flex",
          flexDirection: "column",
          gap: "48px",
          paddingBottom: "40px",
        }}>

          {/* Back link */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontFamily: sans, fontSize: "16px", color: "#888" }}>‹</span>
            <span style={{ fontFamily: sans, fontSize: "16px", color: "#888" }}>Your contracts</span>
          </div>

          {/* Heading — gap 10px between title and subtitle */}
          <div style={{ display: "flex", flexDirection: "column", gap: "10px", width: "1700px" }}>
            <h1 style={{
              fontFamily: serif, fontStyle: "italic", fontWeight: 400,
              fontSize: "64px", color: "#1a1a1a", margin: 0, lineHeight: "normal",
            }}>
              For Ilias
            </h1>
            {/* Subtitle: #1a1a1a (NOT grey) per Figma 2004:1726 */}
            <p style={{
              fontFamily: sans, fontStyle: "oblique", fontWeight: 400,
              fontSize: "22px", color: "#1a1a1a", margin: 0, lineHeight: "normal",
            }}>
              A bit of you. Started today.
            </p>
          </div>

          {/* MESSAGES section */}
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {/* Label: #8e5e6e (pink/mauve), Bold 18px */}
            <p style={{ fontFamily: sans, fontWeight: 700, fontSize: "18px", color: "#8e5e6e", margin: 0 }}>MESSAGES</p>

            {/* Cards row: 2 cards, W 840px each, H 130px, justify-between */}
            <div style={{ display: "flex", justifyContent: "space-between", width: "1700px" }}>

              {/* Welcome card — full opacity */}
              <div style={{
                background: "#f4e8ec", borderRadius: "10px",
                height: "130px", width: "840px",
                padding: "20px 30px",
                boxSizing: "border-box",
                display: "flex", alignItems: "flex-start",
                cursor: "pointer",
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", width: "100%", alignItems: "flex-start" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "9px" }}>
                    <p style={{ fontFamily: serif, fontWeight: 700, fontSize: "30px", color: "#1a1a1a", margin: 0 }}>Welcome</p>
                    <p style={{ fontFamily: sans, fontStyle: "oblique", fontSize: "16px", color: "#888", margin: 0 }}>
                      The first thing received upon transfer.
                    </p>
                  </div>
                  <Dot filled={false} />
                </div>
              </div>

              {/* For when card — opacity 0.4 (disabled/coming soon) per Figma 2004:1726 */}
              <div style={{
                background: "#f4e8ec", borderRadius: "10px",
                height: "130px", width: "840px",
                padding: "20px 30px",
                boxSizing: "border-box",
                display: "flex", alignItems: "flex-start",
                opacity: 0.4,
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", width: "100%", alignItems: "flex-start" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "9px" }}>
                    <p style={{ fontFamily: serif, fontWeight: 700, fontSize: "30px", color: "#1a1a1a", margin: 0 }}>For when</p>
                    <p style={{ fontFamily: sans, fontStyle: "oblique", fontSize: "16px", color: "#888", margin: 0, whiteSpace: "pre-line" }}>
                      {"Messages for specific moments.\nScheduled delivery coming soon."}
                    </p>
                  </div>
                  <Dot filled={false} />
                </div>
              </div>

            </div>
          </div>

          {/* ILIAS / KEEPER section */}
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {/* Label: #6a4d7d (lavender), Bold 18px */}
            <p style={{ fontFamily: sans, fontWeight: 700, fontSize: "18px", color: "#6a4d7d", margin: 0 }}>ILIAS</p>

            {/* Keeper cards grid: flex-wrap, gap-x 22px, h 286px, align-content space-between */}
            <div style={{
              display: "flex",
              flexWrap: "wrap",
              columnGap: "22px",
              alignContent: "space-between",
              alignItems: "center",
              height: "286px",
              width: "1700px",
            }}>
              {KEEPER_CARDS.map(card => (
                <div
                  key={card.key}
                  style={{
                    background: "#efeaf2", borderRadius: "10px",
                    height: "130px", width: `${card.width}px`,
                    padding: "20px 30px",
                    boxSizing: "border-box",
                    display: "flex", alignItems: "flex-start",
                    cursor: "pointer",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", width: "100%", alignItems: "flex-start" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: "9px", width: `${card.textWidth}px`, flexShrink: 0 }}>
                      <p style={{ fontFamily: serif, fontWeight: 700, fontSize: "30px", color: "#1a1a1a", margin: 0 }}>{card.label}</p>
                      <p style={{ fontFamily: sans, fontStyle: "oblique", fontSize: "16px", color: "#888", margin: 0 }}>{card.sub}</p>
                    </div>
                    <Dot filled={card.filled} />
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* YOU bar — voiceComplete=true → closed state (white bg, → arrow), clicking expands */}
      <YouBar
        voiceComplete={true}
        contractId="demo"
        dimensionCounts={{}}
      />

      {/* Footer fixed at viewport bottom so overlay bottom:103px connects flush with it */}
      <div style={{ position: "fixed", bottom: 0, left: 0, width: "1920px", zIndex: 30 }}>
        <Footer />
      </div>
      {/* Spacer so in-flow content isn't hidden under fixed footer */}
      <div style={{ height: "103px", flexShrink: 0 }} />
    </div>
  );
}
