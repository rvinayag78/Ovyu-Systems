"use client";

/**
 * PROTOTYPE — How you think (form)
 * Figma 2062:1893 — Frame 1920×1240px
 * 3-column form: 4 fields | 3 fields | 2 fields + Save button
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
    label: "What your mind is sharp at",
    hint: "e.g., numbers, names, faces, directions, languages, patterns, big picture",
  },
  {
    label: "What your mind struggles with",
    hint: "e.g., remembering names, sitting still, abstract ideas, small talk",
  },
  {
    label: "How you make decisions",
    hint: "e.g., gut, pros and cons, ask people, sleep on it, decide fast",
  },
  {
    label: "How your memory works",
    hint: "e.g., conversations word for word, feelings over facts, faces not names",
  },
];

const COL2: FieldDef[] = [
  {
    label: "How you focus",
    hint: "e.g., one thing at a time, easily distracted, deep dives",
  },
  {
    label: "How you picture things in your head",
    hint: "e.g., in words, in images, other, not at all",
  },
  {
    label: "How you keep your mind sharp",
    hint: "e.g., crosswords, mahjong, reading, learning a language, debate",
  },
];

const COL3: FieldDef[] = [
  {
    label: "What you read or watch",
    hint: "e.g., literary fiction, sci-fi, history, biographies, documentaries, the news",
  },
  {
    label: "Your sense of time",
    hint: "e.g., always early, always late, lose track of it",
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

export default function HowYouThinkPrototype() {
  return (
    <div style={{ width: "1920px", minHeight: "1240px", background: "#f8f7f5", display: "flex", flexDirection: "column" }}>
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
              How you think
            </h1>
            <p style={{
              fontFamily: sans, fontStyle: "oblique", fontWeight: 400,
              fontSize: "22px", color: "#1a1a1a", margin: 0, lineHeight: "normal",
            }}>
              The way your mind works.
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

            {/* Column 1 — 4 fields */}
            <div style={{ width: "400px", display: "flex", flexDirection: "column", gap: "20px" }}>
              {COL1.map(f => <FormField key={f.label} {...f} />)}
            </div>

            {/* Column 2 — 3 fields */}
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

      {/* YOU bar — lavender bg, How you think highlighted */}
      <YouBar voiceComplete={true} dimensionCounts={{}} activeDimension="how-you-think" />

      <Footer />
    </div>
  );
}
