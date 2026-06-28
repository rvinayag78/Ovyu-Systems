"use client";

/**
 * PROTOTYPE — Relationships (form)
 * Figma 2062:1400 "Relationships (form)"
 *
 * 3-column form for the Relationships dimension.
 * Every field has: label → input → hint text (italic 12px #444).
 * No repeatable "+ Add more" links (all fields are single-entry).
 * Frame: 1920 × 1069px; YOU bar at 896px from top.
 */

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { YouBar } from "@/components/YouBar";

const serif = "Georgia, serif";
const sans = "Helvetica Neue, Helvetica, Arial, sans-serif";

// ── Shared sub-components ─────────────────────────────────────────────────────

function Field({ label, placeholder, hint }: { label: string; placeholder: string; hint: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px", width: "400px" }}>
      {/* Label */}
      <div style={{
        fontFamily: sans,
        fontWeight: 700,
        fontSize: "16px",
        color: "#444",
        lineHeight: "normal",
      }}>
        {label}
      </div>

      {/* Input */}
      <input
        type="text"
        placeholder={placeholder}
        style={{
          width: "400px",
          height: "57px",
          border: "1px solid #888",
          borderRadius: "10px",
          padding: "10px",
          boxSizing: "border-box",
          fontFamily: sans,
          fontSize: "14px",
          color: "#888",
          background: "white",
          outline: "none",
        }}
      />

      {/* Hint text */}
      <div style={{
        fontFamily: sans,
        fontStyle: "oblique",
        fontWeight: 400,
        fontSize: "12px",
        color: "#444",
        lineHeight: "normal",
      }}>
        {hint}
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function RelationshipsPrototype() {
  return (
    <div style={{ width: "1920px", minHeight: "1340px", background: "#f8f7f5", display: "flex", flexDirection: "column" }}>
      <Header variant="loggedIn" initial="L" />

      {/* Main content — paddingTop 31px so content top = 103 + 31 = 134px */}
      <div style={{ paddingTop: "31px", flex: 1 }}>
        <div style={{
          marginLeft: "108px",
          width: "1700px",
          display: "flex",
          flexDirection: "column",
          gap: "30px",
        }}>

          {/* Back link */}
          <a style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            cursor: "pointer",
            textDecoration: "none",
          }}>
            <span style={{ fontFamily: sans, fontSize: "16px", color: "#888" }}>‹</span>
            <span style={{ fontFamily: sans, fontSize: "16px", color: "#888" }}>Your contracts</span>
          </a>

          {/* Title + subtitle + form — gap 30px between heading and form (Figma: gap-[30px]) */}
          <div style={{ display: "flex", flexDirection: "column", gap: "30px" }}>

            {/* Heading block */}
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <h1 style={{
                fontFamily: serif,
                fontStyle: "italic",
                fontWeight: 400,
                fontSize: "64px",
                color: "#1a1a1a",
                margin: 0,
                lineHeight: "normal",
              }}>
                Relationships
              </h1>
              <p style={{
                fontFamily: sans,
                fontStyle: "oblique",
                fontWeight: 400,
                fontSize: "22px",
                color: "#1a1a1a",
                margin: 0,
                lineHeight: "normal",
              }}>
                How you are with the people in your life.
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
              alignItems: "flex-start",
            }}>

              {/* Column 1: intimacy + conflict */}
              <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                <Field
                  label="Relationship status"
                  placeholder="Your answer"
                  hint="e.g., single, married, partnered, it's complicated"
                />
                <Field
                  label="How you show love"
                  placeholder="Your answer"
                  hint="e.g., words, time, gifts, touch, showing up"
                />
                <Field
                  label="How you handle conflict"
                  placeholder="Your answer"
                  hint="e.g., talk it out, walk away, sit with it, push through"
                />
              </div>

              {/* Column 2: social world */}
              <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                <Field
                  label="Where you stand on family"
                  placeholder="Your answer"
                  hint="e.g., close, distant, complicated, chosen"
                />
                <Field
                  label="Where you stand on friendship"
                  placeholder="Your answer"
                  hint="e.g., close, distant, complicated, chosen"
                />
                <Field
                  label="How you are in groups"
                  placeholder="Your answer"
                  hint="e.g., quiet observer, the one telling the story, fade in and out"
                />
              </div>

              {/* Column 3: energy + save button */}
              <div style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                alignItems: "flex-end",
                height: "365px",
              }}>
                {/* Top: Where you refuel */}
                <div style={{ alignSelf: "flex-start" }}>
                  <Field
                    label="Where you refuel"
                    placeholder="Your answer"
                    hint="e.g., alone, with one person, in a crowd, on a walk"
                  />
                </div>

                {/* Bottom: Save button */}
                <button style={{
                  width: "304px",
                  height: "48px",
                  background: "#1a1a1a",
                  color: "#f5f0e8",
                  fontFamily: sans,
                  fontWeight: 700,
                  fontSize: "16px",
                  borderRadius: "8px",
                  border: "none",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}>
                  Save and continue →
                </button>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* YOU bar — lavender bg, Relationships highlighted */}
      <YouBar voiceComplete={true} dimensionCounts={{}} activeDimension="relationships" />

      <Footer />
    </div>
  );
}
