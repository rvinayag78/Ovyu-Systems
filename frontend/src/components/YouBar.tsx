"use client";

import { useState } from "react";
import Link from "next/link";
import { StatusCircle } from "./StatusCircle";

const serif = "Georgia, serif";
const sans = "Helvetica Neue, Helvetica, Arial, sans-serif";

const DIMENSIONS = [
  { slug: "history",       label: "History",       sub: "Childhood, schools, milestones, the turning points." },
  { slug: "relationships", label: "Relationships", sub: "The people who shaped you, how you love, how you fight." },
  { slug: "how-you-think", label: "How you think", sub: "How you decide, process, land on answers." },
  { slug: "how-you-talk",  label: "How you talk",  sub: "Catchphrases, inside jokes, the way you say things." },
  { slug: "how-you-live",  label: "How you live",  sub: "Habits, rituals, the texture of your daily life." },
  { slug: "beliefs",       label: "Beliefs",       sub: "What you believe, what you'd stand up for. Your worldview and ideologies." },
  { slug: "heart",         label: "Heart",         sub: "What moves you. What you love, what you can't stand, what lights you up." },
];

const ALL_LABELS = ["Voice", ...DIMENSIONS.map(d => d.label)];

// Thin chevron for dimension rows — 9×15.765px per Figma
function DimArrow() {
  return (
    <svg width="9" height="16" viewBox="0 0 9 16" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
      <path d="M1 1L8 8L1 15" stroke="#888" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// Bar arrow — 15×26px inner, rotated for expanded state
function BarArrow({ expanded }: { expanded: boolean }) {
  return (
    <div style={{
      width: "26px", height: "15px",
      display: "flex", alignItems: "center", justifyContent: "center",
      flexShrink: 0,
    }}>
      <div style={{ transform: expanded ? "rotate(90deg)" : "none", transition: "transform 0.15s" }}>
        <svg width="15" height="26" viewBox="0 0 15 26" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M1 1L14 13L1 25" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </div>
  );
}

type YouBarProps = {
  voiceComplete?: boolean;
  contractId?: string;
  dimensionCounts?: Record<string, number>;
};

export function YouBar({ voiceComplete = false, contractId, dimensionCounts = {} }: YouBarProps) {
  const [expanded, setExpanded] = useState(false);

  const dimColor = voiceComplete ? "#888" : "#bababa";
  const youColor = voiceComplete ? "#1a1a1a" : "#bababa";

  return (
    <div style={{ width: "100%" }}>
      {/* YOU bar */}
      <div
        onClick={() => voiceComplete && setExpanded(!expanded)}
        style={{
          width: "100%",
          height: "70px",
          background: expanded ? "#efeaf2" : (voiceComplete ? "#fff" : "#f0f0f0"),
          borderTop: "3px solid #bababa",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 50px",
          boxSizing: "border-box",
          cursor: voiceComplete ? "pointer" : "default",
        }}>
        {/* Left: YOU + dimension names — visible in all states */}
        <div style={{ display: "flex", alignItems: "center" }}>
          <span style={{
            fontFamily: sans, fontWeight: 700, fontSize: "18px",
            color: youColor,
            minWidth: "138px", flexShrink: 0,
          }}>YOU</span>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            {ALL_LABELS.map((label, i) => (
              <span key={label} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <span style={{ fontFamily: sans, fontWeight: 400, fontSize: "18px", color: dimColor }}>
                  {label}
                </span>
                {i < ALL_LABELS.length - 1 && (
                  <span style={{
                    width: "5px", height: "5px", borderRadius: "50%",
                    background: dimColor, display: "inline-block", flexShrink: 0,
                  }} />
                )}
              </span>
            ))}
          </div>
        </div>

        {/* Right: chevron arrow or lock */}
        {voiceComplete ? (
          <BarArrow expanded={expanded} />
        ) : (
          <span style={{ fontSize: "22px" }}>🔒</span>
        )}
      </div>

      {/* Expanded panel */}
      {expanded && (
        <div style={{
          width: "100%",
          background: "#fff",
          borderBottom: "0.5px solid #888",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          padding: "13px 88px",
          boxSizing: "border-box",
        }}>
          {/* Voice row — no arrow, no link */}
          <div style={{
            background: "#f7f4ef", border: "1.5px solid #ddd6c6", borderRadius: "8px",
            display: "flex", alignItems: "center",
            padding: "16px 40px", gap: "30px",
          }}>
            <StatusCircle count={1} threshold={1} voiceRecorded size={62} />
            <span style={{ fontFamily: serif, fontWeight: 700, fontSize: "18px", color: "#1a1a1a" }}>Voice</span>
            <span style={{ fontFamily: sans, fontStyle: "italic", fontSize: "18px", color: "#888" }}>
              Facial expressions and video coming soon.
            </span>
          </div>

          {/* Dimension rows */}
          {DIMENSIONS.map(d => {
            const inner = (
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "30px" }}>
                  <StatusCircle count={dimensionCounts[d.slug] ?? 0} threshold={3} size={62} />
                  <span style={{ fontFamily: serif, fontWeight: 700, fontSize: "18px", color: "#1a1a1a" }}>{d.label}</span>
                  <span style={{ fontFamily: sans, fontStyle: "italic", fontSize: "18px", color: "#888" }}>{d.sub}</span>
                </div>
                <DimArrow />
              </div>
            );

            const rowStyle: React.CSSProperties = {
              background: "#f7f4ef", border: "1.5px solid #ddd6c6", borderRadius: "8px",
              height: "73px", display: "flex", alignItems: "center",
              padding: "15px 40px", boxSizing: "border-box",
              textDecoration: "none",
            };

            return contractId ? (
              <Link key={d.slug} href={`/upload/${contractId}/${d.slug}`} style={rowStyle}>
                {inner}
              </Link>
            ) : (
              <div key={d.slug} style={{ ...rowStyle, cursor: "default" }}>
                {inner}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
