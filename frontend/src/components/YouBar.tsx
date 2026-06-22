"use client";

import { useState } from "react";
import { StatusCircle } from "./StatusCircle";

const serif = "Georgia, serif";
const sans = "Helvetica Neue, Helvetica, Arial, sans-serif";

const dimensionsWithDesc = [
  { label: "Voice", sub: "Facial expressions and video coming soon." },
  { label: "History", sub: "Childhood, schools, milestones, the turning points." },
  { label: "Relationships", sub: "The people who shaped you, how you love, how you fight." },
  { label: "How you think", sub: "How you decide, process, land on answers." },
  { label: "How you talk", sub: "Catchphrases, inside jokes, the way you say things." },
  { label: "How you live", sub: "Habits, rituals, the texture of your daily life." },
  { label: "Beliefs", sub: "What you believe, what you'd stand up for. Your worldview and ideologies." },
  { label: "Heart", sub: "What moves you. What you love, what you can't stand, what lights you up." },
];

const dimensions = dimensionsWithDesc.map(d => d.label);

type YouBarProps = {
  voiceComplete?: boolean;
  onDimensionClick?: (dimension: string) => void;
  expandedContent?: React.ReactNode;
};

export function YouBar({ voiceComplete = false, onDimensionClick, expandedContent }: YouBarProps) {
  const [expanded, setExpanded] = useState(false);

  const isClickable = voiceComplete;

  return (
    <div style={{ width: "100%" }}>
      {/* YOU bar — locked or unlocked state */}
      <div
        onClick={() => isClickable && setExpanded(!expanded)}
        style={{
          width: "100%",
          height: "70px",
          background: expanded ? "#efeaf2" : (voiceComplete ? "#fff" : "#f0f0f0"),
          borderTop: `3px solid ${expanded ? "#6a4d7d" : (voiceComplete ? "#1a1a1a" : "#bababa")}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 50px",
          boxSizing: "border-box",
          cursor: isClickable ? "pointer" : "default",
        }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <span style={{ fontFamily: sans, fontWeight: 700, fontSize: "18px", color: expanded ? "#1a1a1a" : (voiceComplete ? "#1a1a1a" : "#bababa") }}>YOU</span>
          {!expanded && (
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              {dimensions.map((label, i, arr) => (
                <span key={label} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ fontFamily: sans, fontSize: "18px", color: voiceComplete ? "#888" : "#bababa" }}>{label}</span>
                  {i < arr.length - 1 && (
                    <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: voiceComplete ? "#888" : "#bababa", display: "inline-block" }} />
                  )}
                </span>
              ))}
            </div>
          )}
        </div>
        <span style={{ fontSize: "24px", color: expanded ? "#1a1a1a" : (voiceComplete ? "#1a1a1a" : "#bababa") }}>
          {expanded ? "∨" : (voiceComplete ? "›" : "🔒")}
        </span>
      </div>

      {/* Expanded YOU panel — static layout below bar */}
      {expanded && (
        <div
          style={{
            width: "100%",
            background: "#fff",
            borderBottom: "0.5px solid #888",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            padding: "13px 88px",
            boxSizing: "border-box",
          }}>
          {expandedContent ? (
            expandedContent
          ) : (
            dimensionsWithDesc.map((dim) => (
              <div
                key={dim.label}
                onClick={() => {
                  if (dim.label !== "Voice" && onDimensionClick) {
                    onDimensionClick(dim.label);
                    setExpanded(false);
                  }
                }}
                style={{
                  background: "#f7f4ef",
                  border: "1.5px solid #ddd6c6",
                  borderRadius: "8px",
                  padding: "15px 40px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: dim.label === "Voice" ? "flex-start" : "space-between",
                  gap: "30px",
                  cursor: dim.label === "Voice" ? "default" : "pointer",
                  height: "73px",
                }}>
                <div style={{ display: "flex", alignItems: "center", gap: "30px" }}>
                  <StatusCircle count={dim.label === "Voice" ? 1 : 0} threshold={1} voiceRecorded={dim.label === "Voice"} size={40} />
                  <div style={{ display: "flex", flexDirection: "column", gap: "0px" }}>
                    <span style={{ fontFamily: serif, fontWeight: 700, fontSize: "18px", color: "#1a1a1a", lineHeight: "1.2" }}>{dim.label}</span>
                    <span style={{ fontFamily: sans, fontStyle: "italic", fontSize: "18px", color: "#888", lineHeight: "1.2", whiteSpace: "nowrap" }}>{dim.sub}</span>
                  </div>
                </div>
                {dim.label !== "Voice" && <span style={{ fontSize: "20px", color: "#888", flexShrink: 0 }}>›</span>}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
