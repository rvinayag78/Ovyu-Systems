"use client";

/**
 * PROTOTYPE — Beliefs (form)
 * Figma node 2062:2930 — dimension form for "Beliefs"
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

export default function BeliefsPrototype() {
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
              Beliefs
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
              What you hold without apology.
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
                label="Your faith"
                hint="e.g., Muslim, Catholic, spiritual but not religious, none"
                addMore={false}
              />
              <Field
                label="How you practice it"
                hint="e.g., prayer, fasting, service, meditation, holidays only, not at all"
                addMore={false}
              />
              <Field
                label="Your politics"
                hint="e.g., left, right, complicated, I don't talk about it"
                addMore={false}
              />
              <Field
                label="What you believe about people"
                hint="e.g., mostly good, capable of anything, you have to earn my trust"
                addMore
              />
              <Field
                label="What you believe about life"
                hint="e.g., we make our own meaning, everything happens for a reason"
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
                label="What you stand for"
                hint="e.g., honesty, loyalty, hard work, family first"
                addMore
              />
              <Field
                label="What you won't compromise on"
                hint="e.g., my kids, my faith, telling the truth, my time"
                addMore
              />
              <Field
                label="What you believe happens when we die"
                hint="e.g., heaven, nothing, something we can't know, we live on in others"
                addMore={false}
              />
            </div>

            {/* Column 3 — 2 fields + button at bottom-right */}
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
                  label="What you believe is right"
                  hint="e.g., treating people well, telling the truth, doing the work"
                  addMore
                />
                <Field
                  label="What you believe is wrong"
                  hint="e.g., cruelty, dishonesty, taking what isn't yours"
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

      {/* YOU bar — lavender bg, Beliefs highlighted */}
      <YouBar voiceComplete={true} dimensionCounts={{}} activeDimension="beliefs" />

      <Footer />
    </div>
  );
}
