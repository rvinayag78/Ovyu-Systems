"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const serif = "Georgia, serif";
const sans = "Helvetica Neue, Helvetica, Arial, sans-serif";

const CIRCLE_FULL = "#5b4b7a";
const CIRCLE_EMPTY = "#b9a4cf";

function YouCircle({ count, threshold = 3, voiceRecorded = false }: { count: number; threshold?: number; voiceRecorded?: boolean }) {
  const isFull = voiceRecorded || count >= threshold;
  const isEmpty = !voiceRecorded && count <= 0;
  const pct = isEmpty ? 0 : Math.min(100, Math.round((count / threshold) * 100));

  let circleStyle: React.CSSProperties;
  if (isFull) {
    circleStyle = { background: CIRCLE_FULL, borderRadius: "50%", width: "100%", height: "100%" };
  } else if (isEmpty) {
    circleStyle = { border: `2px solid ${CIRCLE_EMPTY}`, borderRadius: "50%", width: "100%", height: "100%", boxSizing: "border-box" };
  } else {
    circleStyle = {
      borderRadius: "50%", width: "100%", height: "100%",
      background: `conic-gradient(${CIRCLE_FULL} ${pct}%, ${CIRCLE_EMPTY} ${pct}% 100%)`,
      WebkitMask: "radial-gradient(circle 16px at center, transparent 98%, #000 100%)",
      mask: "radial-gradient(circle 16px at center, transparent 98%, #000 100%)",
      boxShadow: `inset 0 0 0 1px ${CIRCLE_EMPTY}`,
    };
  }

  return (
    <div style={{ position: "relative", width: "40px", height: "40px", flexShrink: 0 }}>
      <div style={{ position: "absolute", inset: "-27%", borderRadius: "50%", ...circleStyle }} />
    </div>
  );
}

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

function DimArrow() {
  return (
    <svg width="9" height="16" viewBox="0 0 9 16" fill="none" style={{ flexShrink: 0 }}>
      <path d="M1 1L8 8L1 15" stroke="#888" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function BarArrow({ expanded }: { expanded: boolean }) {
  return (
    <div style={{
      width: expanded ? "26px" : "15px",
      height: expanded ? "15px" : "26px",
      display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
    }}>
      <div style={{ transform: expanded ? "rotate(90deg)" : "none", transition: "transform 0.15s" }}>
        <svg width="15" height="26" viewBox="0 0 15 26" fill="none">
          <path d="M1 1L14 13L1 25" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </div>
  );
}

function ExpandedRows({ contractId, dimensionCounts }: { contractId?: string; dimensionCounts: Record<string, number> }) {
  const router = useRouter();

  const rowBase: React.CSSProperties = {
    background: "#f7f4ef", border: "1.5px solid #ddd6c6", borderRadius: "8px",
    height: "73px", display: "flex", alignItems: "center",
    padding: "15px 40px", boxSizing: "border-box",
  };

  return (
    <>
      {/* Voice row — no link, 16px T/B per Figma (dimension rows use 15px) */}
      <div style={{ ...rowBase, padding: "16px 40px", gap: "30px" }}>
        <YouCircle count={1} threshold={1} voiceRecorded />
        <span style={{ fontFamily: serif, fontWeight: 700, fontSize: "18px", color: "#1a1a1a" }}>Voice</span>
        <span style={{ fontFamily: sans, fontStyle: "italic", fontSize: "18px", color: "#888" }}>
          Facial expressions and video coming soon.
        </span>
      </div>

      {DIMENSIONS.map(d => {
        const inner = (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "30px" }}>
              <YouCircle count={dimensionCounts[d.slug] ?? 0} threshold={3} />
              <span style={{ fontFamily: serif, fontWeight: 700, fontSize: "18px", color: "#1a1a1a" }}>{d.label}</span>
              <span style={{ fontFamily: sans, fontStyle: "italic", fontSize: "18px", color: "#888" }}>{d.sub}</span>
            </div>
            <DimArrow />
          </div>
        );

        if (contractId) {
          return (
            <div
              key={d.slug}
              role="button"
              tabIndex={0}
              onClick={() => router.push(`/upload/${contractId}/${d.slug}`)}
              onKeyDown={e => e.key === "Enter" && router.push(`/upload/${contractId}/${d.slug}`)}
              style={{ ...rowBase, cursor: "pointer" }}
            >
              {inner}
            </div>
          );
        }
        return <div key={d.slug} style={{ ...rowBase, cursor: "default" }}>{inner}</div>;
      })}
    </>
  );
}

type YouBarProps = {
  voiceComplete?: boolean;
  contractId?: string;
  dimensionCounts?: Record<string, number>;
  onExpandedChange?: (expanded: boolean) => void;
  overlayTop?: number;
};

export function YouBar({ voiceComplete = false, contractId, dimensionCounts = {}, onExpandedChange, overlayTop = 226 }: YouBarProps) {
  const [expanded, setExpanded] = useState(false);

  function toggle() {
    if (!voiceComplete) return;
    const next = !expanded;
    setExpanded(next);
    onExpandedChange?.(next);
  }

  // Lock body scroll while expanded
  useEffect(() => {
    if (expanded) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [expanded]);

  const dimColor = voiceComplete ? "#888" : "#bababa";
  const youColor = voiceComplete ? "#1a1a1a" : "#bababa";

  const barLabel = (
    <div style={{ display: "flex", alignItems: "center" }}>
      <span style={{ fontFamily: sans, fontWeight: 700, fontSize: "18px", color: youColor, minWidth: "138px", flexShrink: 0 }}>YOU</span>
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        {ALL_LABELS.map((label, i) => (
          <span key={label} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <span style={{ fontFamily: sans, fontWeight: 400, fontSize: "18px", color: dimColor }}>{label}</span>
            {i < ALL_LABELS.length - 1 && (
              <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: dimColor, display: "inline-block", flexShrink: 0 }} />
            )}
          </span>
        ))}
      </div>
    </div>
  );

  return (
    <div style={{ width: "100%" }}>
      {/* In-flow bar — holds layout space; hidden (not removed) when expanded so page height stays stable */}
      <div
        onClick={toggle}
        style={{
          width: "100%", height: "70px",
          background: voiceComplete ? "#fff" : "#f0f0f0",
          borderTop: "3px solid #bababa",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "0 50px", boxSizing: "border-box",
          cursor: voiceComplete ? "pointer" : "default",
          visibility: expanded ? "hidden" : "visible",
        }}>
        {barLabel}
        {voiceComplete ? <BarArrow expanded={false} /> : <span style={{ fontSize: "22px" }}>🔒</span>}
      </div>

      {/* Fixed overlay — covers all page content between header and footer, consistent across every page */}
      {expanded && (
        <div style={{
          position: "fixed", top: `${overlayTop}px`, left: 0, right: 0, bottom: "103px",
          zIndex: 50,
          display: "flex", flexDirection: "column",
        }}>
          {/* Bar strip (click to collapse) */}
          <div
            onClick={toggle}
            style={{
              height: "70px", flexShrink: 0,
              background: "#efeaf2",
              borderTop: "3px solid #bababa",
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "0 50px", boxSizing: "border-box",
              cursor: "pointer",
            }}>
            {barLabel}
            <BarArrow expanded={true} />
          </div>

          {/* Dimension rows — scrollable if they exceed available height */}
          <div style={{
            flex: 1, overflowY: "auto",
            background: "#fff",
            borderBottom: "0.5px solid #888",
            display: "flex", flexDirection: "column",
            gap: "10px", padding: "13px 88px",
            boxSizing: "border-box",
          }}>
            <ExpandedRows contractId={contractId} dimensionCounts={dimensionCounts} />
          </div>
        </div>
      )}
    </div>
  );
}
