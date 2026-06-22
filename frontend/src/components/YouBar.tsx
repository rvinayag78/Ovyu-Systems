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
  const showCollapsed = !expanded;

  return (
    <>
      {/* Backdrop for expanded YOU panel */}
      {expanded && (
        <div
          onClick={() => setExpanded(false)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0, 0, 0, 0.3)",
            zIndex: 108,
            cursor: "pointer",
          }}
        />
      )}

      {/* YOU bar — locked or unlocked state */}
      <div
        onClick={() => isClickable && setExpanded(!expanded)}
        style={{
          position: "fixed",
          bottom: "103px",
          left: 0,
          right: 0,
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
          zIndex: 110,
        }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <span style={{ fontFamily: sans, fontWeight: 700, fontSize: "18px", color: expanded ? "#1a1a1a" : (voiceComplete ? "#1a1a1a" : "#bababa") }}>YOU</span>
          {showCollapsed && (
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              {dimensions.map((label, i, arr) => (
                <span key={label} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ fontFamily: sans, fontSize: "14px", color: voiceComplete ? "#888" : "#bababa" }}>{label}</span>
                  {i < arr.length - 1 && (
                    <span style={{ width: "3px", height: "3px", borderRadius: "50%", background: voiceComplete ? "#888" : "#bababa", display: "inline-block" }} />
                  )}
                </span>
              ))}
            </div>
          )}
        </div>
        <span style={{ fontSize: "20px", color: expanded ? "#1a1a1a" : (voiceComplete ? "#1a1a1a" : "#bababa") }}>
          {expanded ? "∨" : (voiceComplete ? "›" : "🔒")}
        </span>
      </div>

      {/* Expanded YOU panel */}
      {expanded && (
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            position: "fixed",
            bottom: "173px",
            left: 0,
            right: 0,
            width: "100%",
            background: "#efeaf2",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            padding: "20px 50px",
            boxSizing: "border-box",
            zIndex: 1001,
            maxHeight: "60vh",
            overflowY: "auto",
            pointerEvents: "auto",
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
                  border: "1px solid #ddd6c6",
                  borderRadius: "8px",
                  padding: "20px 40px",
                  display: "flex",
                  alignItems: "center",
                  gap: "30px",
                  cursor: dim.label === "Voice" ? "default" : "pointer",
                  opacity: dim.label === "Voice" ? 0.6 : 1,
                  minHeight: "73px",
                }}>
                <StatusCircle count={dim.label === "Voice" ? 1 : 0} threshold={1} voiceRecorded={dim.label === "Voice"} size={40} />
                <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "4px" }}>
                  <span style={{ fontFamily: serif, fontWeight: 700, fontSize: "18px", color: "#1a1a1a" }}>{dim.label}</span>
                  <span style={{ fontFamily: sans, fontStyle: "italic", fontSize: "14px", color: "#888" }}>{dim.sub}</span>
                </div>
                {dim.label !== "Voice" && <span style={{ fontSize: "20px", color: "#888", flexShrink: 0 }}>›</span>}
              </div>
            ))
          )}
        </div>
      )}
    </>
  );
}
