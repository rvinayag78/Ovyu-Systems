"use client";

/**
 * Graduated status indicator for a dimension (Flow 2 spec §3).
 *   - empty   (0 entries)            → light lilac outline
 *   - started (1..threshold-1)       → proportional ring fill
 *   - full    (>= threshold)         → solid dark purple
 * `voiceRecorded` forces the solid dark state (Voice is binary: recorded = done).
 */
const EMPTY = "#b9a4cf";
const RING = "#b9a4cf";
const FULL = "#5b4b7a";

export function StatusCircle({
  count,
  threshold = 3,
  voiceRecorded = false,
  size = 22,
}: {
  count: number;
  threshold?: number;
  voiceRecorded?: boolean;
  size?: number;
}) {
  const isFull = voiceRecorded || count >= threshold;
  const isEmpty = !voiceRecorded && count <= 0;

  if (isFull) {
    return <span style={{ width: size, height: size, borderRadius: "50%", background: FULL, display: "inline-block", flexShrink: 0 }} />;
  }
  if (isEmpty) {
    return <span style={{ width: size, height: size, borderRadius: "50%", border: `2px solid ${EMPTY}`, boxSizing: "border-box", display: "inline-block", flexShrink: 0 }} />;
  }
  // started — ring filled proportionally with a conic gradient
  const pct = Math.min(100, Math.round((count / threshold) * 100));
  return (
    <span style={{
      width: size, height: size, borderRadius: "50%", display: "inline-block", flexShrink: 0,
      background: `conic-gradient(${FULL} ${pct}%, ${EMPTY} ${pct}% 100%)`,
      WebkitMask: `radial-gradient(circle ${size / 2 - 4}px at center, transparent 98%, #000 100%)`,
      mask: `radial-gradient(circle ${size / 2 - 4}px at center, transparent 98%, #000 100%)`,
      border: `0`,
      boxShadow: `inset 0 0 0 1px ${RING}`,
    }} />
  );
}
