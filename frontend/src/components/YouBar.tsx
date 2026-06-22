"use client";

import { useState } from "react";
import { StatusCircle } from "./StatusCircle";

const sans = "Helvetica Neue, Helvetica, Arial, sans-serif";
const dimensions = ["Voice", "History", "Relationships", "How you think", "How you talk", "How you live", "Beliefs", "Heart"];

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
            zIndex: 1000,
          }}
        />
      )}

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
        <div style={{
          width: "100%",
          background: "#efeaf2",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          padding: "20px 50px",
          boxSizing: "border-box",
          position: "relative",
          zIndex: 1001,
        }}>
          {expandedContent ? (
            expandedContent
          ) : (
            dimensions.map((label) => (
              <div
                key={label}
                onClick={() => {
                  if (label !== "Voice" && onDimensionClick) {
                    onDimensionClick(label);
                    setExpanded(false);
                  }
                }}
                style={{
                  background: "#fff",
                  border: "1px solid #ddd6c6",
                  borderRadius: "8px",
                  padding: "20px 40px",
                  display: "flex",
                  alignItems: "center",
                  gap: "16px",
                  cursor: label === "Voice" ? "default" : "pointer",
                  opacity: label === "Voice" ? 0.6 : 1,
                }}>
                <StatusCircle count={label === "Voice" ? 1 : 0} threshold={1} voiceRecorded={label === "Voice"} size={20} />
                <span style={{ fontFamily: sans, fontSize: "16px", color: "#1a1a1a", flex: 1 }}>{label}</span>
                {label !== "Voice" && <span style={{ fontSize: "16px", color: "#888" }}>›</span>}
              </div>
            ))
          )}
        </div>
      )}
    </>
  );
}
