"use client";

/**
 * PROTOTYPE — Heart (form)
 * Figma node 2062:2981 — dimension form for "Heart"
 * Frame: 1920×1453px
 */

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { YouBar } from "@/components/YouBar";

const serif = "Georgia, serif";
const sans = "Helvetica Neue, Helvetica, Arial, sans-serif";

function Field({
  label,
  hint,
  addMore = false,
}: {
  label: string;
  hint: string;
  addMore?: boolean;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <div
        style={{
          fontFamily: sans,
          fontWeight: 700,
          fontSize: 16,
          color: "#444",
        }}
      >
        {label}
      </div>
      <input
        type="text"
        placeholder="Your answer"
        style={{
          width: 400,
          height: 57,
          border: "1px solid #888",
          borderRadius: 10,
          padding: 10,
          boxSizing: "border-box",
          fontFamily: sans,
          fontSize: 14,
          color: "#888",
          background: "white",
          outline: "none",
        }}
      />
      <div
        style={{
          fontFamily: sans,
          fontStyle: "oblique",
          fontSize: 12,
          color: "#444",
        }}
      >
        {hint}
      </div>
      {addMore && (
        <div style={{ display: "flex", gap: 8, paddingLeft: 10 }}>
          <span style={{ fontSize: 22 }}>+</span>
          <span style={{ fontFamily: sans, fontSize: 16, color: "#888" }}>
            Add more
          </span>
        </div>
      )}
    </div>
  );
}

export default function HeartPrototype() {
  return (
    <div
      style={{
        width: "1920px",
        minHeight: "1453px",
        background: "#f8f7f5",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Header variant="loggedIn" initial="L" />

      <div style={{ flex: 1, paddingTop: "31px" }}>
        <div
          style={{
            marginLeft: "108px",
            width: "1700px",
            display: "flex",
            flexDirection: "column",
            gap: "50px",
          }}
        >
          {/* Back link */}
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span
              style={{
                fontFamily: sans,
                fontSize: 16,
                color: "#888",
                display: "inline-block",
                transform: "scaleX(-1)",
              }}
            >
              ›
            </span>
            <span style={{ fontFamily: sans, fontSize: 16, color: "#888" }}>
              Your contracts
            </span>
          </div>

          {/* Title + Subtitle */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <h1
              style={{
                fontFamily: serif,
                fontStyle: "italic",
                fontWeight: 400,
                fontSize: 64,
                color: "#1a1a1a",
                margin: 0,
                lineHeight: "normal",
              }}
            >
              Heart
            </h1>
            <p
              style={{
                fontFamily: sans,
                fontStyle: "oblique",
                fontWeight: 400,
                fontSize: 22,
                color: "#1a1a1a",
                margin: 0,
                lineHeight: "normal",
              }}
            >
              What you love, and how.
            </p>
          </div>

          {/* Form card — 3 columns */}
          <div
            style={{
              background: "white",
              border: "1px solid #ddd6c6",
              borderRadius: 20,
              padding: "40px 60px",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            {/* Column 1 — 5 fields */}
            <div
              style={{
                width: 400,
                display: "flex",
                flexDirection: "column",
                gap: 20,
              }}
            >
              <Field
                label="How you love"
                hint="e.g., hard and fast, slow to start, forever once I do, all in"
                addMore={false}
              />
              <Field
                label="How you forgive"
                hint="e.g., easily, never, after time, only when it's earned"
                addMore={false}
              />
              <Field
                label="How deeply you feel"
                hint="e.g., loud and visible, deep but quiet, intensely, hard to access"
                addMore={false}
              />
              <Field
                label="How you express what's inside"
                hint="e.g., words, music, painting, cooking, building, in silence"
                addMore
              />
              <Field
                label="Things you love"
                hint="e.g., the ocean, jazz, the smell of rain, a long drive"
                addMore
              />
            </div>

            {/* Column 2 — 3 fields */}
            <div
              style={{
                width: 400,
                display: "flex",
                flexDirection: "column",
                gap: 20,
              }}
            >
              <Field
                label="Who you love"
                hint="e.g., your kids, your dog, your oldest friend"
                addMore
              />
              <Field
                label="What you find beautiful"
                hint="e.g., old buildings, your grandmother's handwriting, the desert, hands"
                addMore
              />
              <Field
                label="What makes you laugh"
                hint="e.g., your kids, slapstick, the way your partner tells stories"
                addMore
              />
            </div>

            {/* Column 3 — 1 field + Add more + button at bottom-right */}
            <div
              style={{
                width: 400,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                alignItems: "flex-end",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 20,
                  alignItems: "flex-start",
                }}
              >
                <Field
                  label="What you can't stand"
                  hint="e.g., cruelty, small talk, slow walkers, dishonesty"
                  addMore
                />
              </div>
              <button
                style={{
                  width: 304,
                  height: 48,
                  background: "#000",
                  color: "#f5f0e8",
                  fontFamily: sans,
                  fontWeight: 700,
                  fontSize: 16,
                  borderRadius: 8,
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Save and continue →
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* YOU bar — lavender bg, Heart highlighted */}
      <YouBar voiceComplete={true} dimensionCounts={{}} activeDimension="heart" />

      <Footer />
    </div>
  );
}
