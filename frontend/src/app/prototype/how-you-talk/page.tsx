"use client";

/**
 * PROTOTYPE — How you talk (form)
 * Figma 2062:2386 — Frame 1920×1080px
 * 3-column form: 3 fields | 2 fields | 2 fields + Save button
 */

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { YouBar } from "@/components/YouBar";

const serif = "Georgia, serif";
const sans = "Helvetica Neue, Helvetica, Arial, sans-serif";

interface FieldDef {
  label: string;
  hint: string;
}

const COL1: FieldDef[] = [
  {
    label: "Your accent",
    hint: "e.g., New York at home, neutral at work",
  },
  {
    label: "Your pace",
    hint: "e.g., usually fast, slower when I'm being careful",
  },
  {
    label: "Your volume",
    hint: "e.g., loud by default, quiet in rooms I don't know",
  },
];

const COL2: FieldDef[] = [
  {
    label: "Your kind of humor",
    hint: "e.g., dry, dark, depends on the room",
  },
  {
    label: "How you swear",
    hint: "e.g., constantly, only when driving, in another language, never",
  },
];

const COL3: FieldDef[] = [
  {
    label: "Words you say a lot",
    hint: "e.g., honestly, mashallah, oof",
  },
  {
    label: "Words you never say",
    hint: `e.g., "literally", clichés, anything corny`,
  },
];

function FormField({ label, hint }: FieldDef) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px", width: "400px" }}>
      <div style={{
        fontFamily: sans, fontWeight: 700, fontSize: "16px",
        color: "#444", lineHeight: "normal",
      }}>
        {label}
      </div>
      <div style={{
        width: "400px", height: "57px",
        border: "1px solid #888", borderRadius: "10px",
        padding: "10px", boxSizing: "border-box",
        background: "white", display: "flex", alignItems: "center",
      }}>
        <span style={{
          fontFamily: sans, fontWeight: 400, fontSize: "14px",
          color: "#888", lineHeight: "normal",
        }}>
          Your answer
        </span>
      </div>
      <div style={{
        fontFamily: sans, fontStyle: "oblique", fontWeight: 400,
        fontSize: "12px", color: "#444", lineHeight: "normal",
      }}>
        {hint}
      </div>
    </div>
  );
}

export default function HowYouTalkPrototype() {
  return (
    <div style={{ width: "1920px", minHeight: "1080px", background: "#f8f7f5", display: "flex", flexDirection: "column" }}>
      <Header variant="loggedIn" initial="L" />

      {/* Main content */}
      <div style={{ flex: 1, paddingTop: "31px" }}>
        <div style={{
          marginLeft: "108px",
          width: "1700px",
          display: "flex",
          flexDirection: "column",
          gap: "50px",
        }}>

          {/* Back link */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontFamily: sans, fontSize: "16px", color: "#888" }}>‹</span>
            <span style={{ fontFamily: sans, fontSize: "16px", color: "#888" }}>Your contracts</span>
          </div>

          {/* Title + subtitle */}
          <div style={{ display: "flex", flexDirection: "column", gap: "10px", width: "1700px" }}>
            <h1 style={{
              fontFamily: serif, fontStyle: "italic", fontWeight: 400,
              fontSize: "64px", color: "#1a1a1a", margin: 0, lineHeight: "normal",
            }}>
              How you talk
            </h1>
            <p style={{
              fontFamily: sans, fontStyle: "oblique", fontWeight: 400,
              fontSize: "22px", color: "#1a1a1a", margin: 0, lineHeight: "normal",
            }}>
              What people hear when you speak.
            </p>
          </div>

          {/* Form card */}
          <div style={{
            background: "white",
            border: "1px solid #ddd6c6",
            borderRadius: "20px",
            padding: "40px 60px",
            display: "flex",
            justifyContent: "space-between",
            width: "1700px",
            boxSizing: "border-box",
          }}>

            {/* Column 1 — 3 fields */}
            <div style={{ width: "400px", display: "flex", flexDirection: "column", gap: "20px" }}>
              {COL1.map(f => <FormField key={f.label} {...f} />)}
            </div>

            {/* Column 2 — 2 fields */}
            <div style={{ width: "400px", display: "flex", flexDirection: "column", gap: "20px" }}>
              {COL2.map(f => <FormField key={f.label} {...f} />)}
            </div>

            {/* Column 3 — 2 fields + button pinned to bottom-right */}
            <div style={{
              width: "400px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              alignItems: "flex-end",
            }}>
              {/* Fields at top */}
              <div style={{ display: "flex", flexDirection: "column", gap: "20px", width: "400px" }}>
                {COL3.map(f => <FormField key={f.label} {...f} />)}
              </div>

              {/* Save button at bottom-right */}
              <button style={{
                width: "304px", height: "48px",
                background: "black", color: "#f5f0e8",
                fontFamily: sans, fontWeight: 700, fontSize: "16px",
                borderRadius: "8px", border: "none", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                Save and continue →
              </button>
            </div>

          </div>

        </div>
      </div>

      {/* YOU bar — lavender bg, How you talk highlighted */}
      <YouBar voiceComplete={true} dimensionCounts={{}} activeDimension="how-you-talk" />

      <Footer />
    </div>
  );
}
