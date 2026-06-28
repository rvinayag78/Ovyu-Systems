"use client";

/**
 * PROTOTYPE — How you live (form)
 * Figma node 2062:2879 — dimension form for "How you live"
 * Frame: 1920×1337px
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

export default function HowYouLivePrototype() {
  return (
    <div
      style={{
        width: "1920px",
        minHeight: "1337px",
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
              How you live
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
              What your days are made of.
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
            {/* Column 1 */}
            <div
              style={{
                width: 400,
                display: "flex",
                flexDirection: "column",
                gap: 20,
              }}
            >
              <Field
                label="Your mornings"
                hint="e.g., up at five, slow with coffee, hit snooze three times"
                addMore
              />
              <Field
                label="Your evenings"
                hint="e.g., long dinners, in bed by nine, restless until midnight"
                addMore
              />
              <Field
                label="How you sleep"
                hint="e.g., light sleeper, deep, never enough, weird dreams"
                addMore={false}
              />
              <Field
                label="What you eat"
                hint="e.g., the same things on repeat, big home cooked meals, takeout, picky"
                addMore
              />
            </div>

            {/* Column 2 */}
            <div
              style={{
                width: 400,
                display: "flex",
                flexDirection: "column",
                gap: 20,
              }}
            >
              <Field
                label="How you spend free time"
                hint="e.g., outside, with people, alone with a book, in the kitchen"
                addMore
              />
              <Field
                label="What you've done for work"
                hint="e.g., teacher for thirty years, ran a small business, raising kids, retired"
                addMore
              />
              <Field
                label="Your rituals over the years"
                hint="e.g., Sunday calls with mom, Friday prayers, morning coffee alone"
                addMore
              />
            </div>

            {/* Column 3 — space-between, items aligned right, button at bottom */}
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
                  label="What your home feels like"
                  hint="e.g., quiet, full of books, always something cooking"
                  addMore={false}
                />
                <Field
                  label="What you spend money on"
                  hint="e.g., travel, books, the people I love"
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

      {/* YOU bar — lavender bg, How you live highlighted */}
      <YouBar voiceComplete={true} dimensionCounts={{}} activeDimension="how-you-live" />

      <Footer />
    </div>
  );
}
