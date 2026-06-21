"use client";

import type { CSSProperties } from "react";
import { useEffect, useRef, useState } from "react";

const sans = "Helvetica Neue, Helvetica, Arial, sans-serif";
const PURPLE = "#6a4d7d";

type Phase = "idle" | "recording" | "recorded";

/**
 * Voice entry recorder (Flow 2 spec §C-voice).
 * The "Voice" affordance becomes a RECORD button; record → stop → playback,
 * then the parent persists via onSave(blob, durationSeconds).
 */
export function VoiceRecorder({
  onSave,
  saving,
}: {
  onSave: (blob: Blob, durationS: number) => void;
  saving: boolean;
}) {
  const [phase, setPhase] = useState<Phase>("idle");
  const [elapsed, setElapsed] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const blobRef = useRef<Blob | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startedAtRef = useRef<number>(0);

  useEffect(() => () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    recorderRef.current?.stream.getTracks().forEach(t => t.stop());
  }, [audioUrl]);

  async function startRecording() {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const rec = new MediaRecorder(stream);
      chunksRef.current = [];
      rec.ondataavailable = e => { if (e.data.size > 0) chunksRef.current.push(e.data); };
      rec.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: rec.mimeType || "audio/webm" });
        blobRef.current = blob;
        setAudioUrl(URL.createObjectURL(blob));
        stream.getTracks().forEach(t => t.stop());
        setPhase("recorded");
      };
      rec.start();
      recorderRef.current = rec;
      startedAtRef.current = Date.now();
      setElapsed(0);
      setPhase("recording");
      timerRef.current = setInterval(() => setElapsed(Math.floor((Date.now() - startedAtRef.current) / 1000)), 250);
    } catch {
      setError("Microphone access is needed to record. Check your browser permissions.");
    }
  }

  function stopRecording() {
    if (timerRef.current) clearInterval(timerRef.current);
    recorderRef.current?.stop();
  }

  function reset() {
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    setAudioUrl(null);
    blobRef.current = null;
    setElapsed(0);
    setPhase("idle");
  }

  const mins = String(Math.floor(elapsed / 60)).padStart(1, "0");
  const secs = String(elapsed % 60).padStart(2, "0");

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      {/* Waveform / status panel */}
      <div style={{
        width: "100%", minHeight: "200px", borderRadius: "10px", border: "1.5px solid #ddd6c6",
        background: "white", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "14px",
      }}>
        <Bars active={phase === "recording"} />
        <span style={{ fontFamily: sans, fontSize: "18px", color: phase === "recording" ? PURPLE : "#888", fontVariantNumeric: "tabular-nums" }}>
          {phase === "idle" ? "Tap record to begin" : `${mins}:${secs}`}
        </span>
        {phase === "recorded" && audioUrl && (
          <audio controls src={audioUrl} style={{ width: "80%" }} />
        )}
      </div>

      {error && <p style={{ fontFamily: sans, fontSize: "14px", color: "#b00", margin: 0 }}>{error}</p>}

      <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
        {phase === "idle" && (
          <button onClick={startRecording} style={btn(PURPLE)}>● Record</button>
        )}
        {phase === "recording" && (
          <button onClick={stopRecording} style={btn("#1a1a1a")}>■ Stop</button>
        )}
        {phase === "recorded" && (
          <>
            <button
              onClick={() => blobRef.current && onSave(blobRef.current, elapsed)}
              disabled={saving}
              style={{ ...btn(PURPLE), opacity: saving ? 0.5 : 1 }}
            >
              {saving ? "Saving…" : "Save entry"}
            </button>
            <button onClick={reset} disabled={saving} style={btnGhost()}>Re-record</button>
          </>
        )}
      </div>
    </div>
  );
}

function btn(bg: string): CSSProperties {
  return { fontFamily: sans, fontWeight: 700, fontSize: "18px", color: "#f5f0e8", background: bg, border: "none", borderRadius: "10px", padding: "14px 32px", cursor: "pointer" };
}
function btnGhost(): CSSProperties {
  return { fontFamily: sans, fontWeight: 400, fontSize: "16px", color: PURPLE, background: "none", border: "none", cursor: "pointer", padding: "14px 8px" };
}

function Bars({ active }: { active: boolean }) {
  const heights = [12, 26, 18, 34, 22, 40, 16, 30, 20, 36, 14, 28];
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "4px", height: "44px" }}>
      {heights.map((h, i) => (
        <span key={i} style={{
          width: "4px", borderRadius: "2px", background: active ? PURPLE : "#d9cfe6",
          height: `${h}px`,
          animation: active ? `ovyuPulse 900ms ease-in-out ${i * 60}ms infinite alternate` : "none",
        }} />
      ))}
      <style>{`@keyframes ovyuPulse { from { transform: scaleY(0.5); } to { transform: scaleY(1.25); } }`}</style>
    </div>
  );
}
