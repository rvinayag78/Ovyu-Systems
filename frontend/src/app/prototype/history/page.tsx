"use client";

/**
 * PROTOTYPE — History (form)
 * Figma 2044:694 "History (form)"
 *
 * 3-column form for the History dimension.
 * No hint text — just label + input.
 * Repeatable fields show "+ Add more" after the last instance.
 * Frame: 1920 × 1453px; YOU bar at 1280px from top.
 */

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { YouBar } from "@/components/YouBar";

const serif = "Georgia, serif";
const sans = "Helvetica Neue, Helvetica, Arial, sans-serif";

// ── Shared sub-components ─────────────────────────────────────────────────────

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      fontFamily: sans,
      fontWeight: 700,
      fontSize: "16px",
      color: "#444",
      lineHeight: "normal",
    }}>
      {children}
    </div>
  );
}

function FieldInput({ placeholder }: { placeholder: string }) {
  return (
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
  );
}

function Field({ label, placeholder }: { label: string; placeholder: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px", width: "400px" }}>
      <FieldLabel>{label}</FieldLabel>
      <FieldInput placeholder={placeholder} />
    </div>
  );
}

function AddMore() {
  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      gap: "8px",
      paddingLeft: "10px",
      cursor: "pointer",
    }}>
      <span style={{ fontFamily: sans, fontSize: "22px", color: "#1a1a1a", lineHeight: 1 }}>+</span>
      <span style={{ fontFamily: sans, fontSize: "16px", color: "#888", lineHeight: "normal" }}>Add more</span>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function HistoryPrototype() {
  return (
    <div style={{ width: "1920px", background: "#f8f7f5", display: "flex", flexDirection: "column", minHeight: "1453px" }}>
      <Header variant="loggedIn" initial="L" />

      {/* Main content — paddingTop 31px so content top = 103 + 31 = 134px; flex:1 pushes YOU bar to bottom */}
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

          {/* Title + subtitle + form — gap 50px between heading block and form */}
          <div style={{ display: "flex", flexDirection: "column", gap: "50px" }}>

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
                History
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
                Where you come from. Who you come from.
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

              {/* Column 1: identity + places */}
              <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                <Field label="Full name" placeholder="Your full name, exactly as you write it" />
                <Field label="Goes by" placeholder="What people actually call you" />
                <Field label="Date of birth" placeholder="MM/DD/YYYY" />
                <Field label="Place of birth" placeholder="City, Country" />
                <Field label="Where you're from" placeholder="Culture, ethnicity, the place that shaped you" />
                <AddMore />
                <Field label="Homes" placeholder="Where?" />
                <AddMore />
              </div>

              {/* Column 2: family */}
              <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                <Field label="Parents" placeholder="Full name" />
                <AddMore />
                <Field label="Siblings" placeholder="Full name" />
                <AddMore />
                <Field label="Partners" placeholder="Full name" />
                <AddMore />
                <Field label="Children" placeholder="Full name" />
                <AddMore />
              </div>

              {/* Column 3: languages + save button */}
              <div style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                alignItems: "flex-end",
                height: "667px",
              }}>
                {/* Top: Languages field + Add more */}
                <div style={{ display: "flex", flexDirection: "column", gap: "8px", width: "400px", alignSelf: "flex-start" }}>
                  <Field label="Languages" placeholder="Add a language" />
                  <div style={{ paddingTop: "3px" }}>
                    <AddMore />
                  </div>
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

      {/* YOU bar — lavender bg, History highlighted; immediately above Footer (no gap) */}
      <YouBar voiceComplete={true} dimensionCounts={{}} activeDimension="history" />

      <Footer />
    </div>
  );
}
