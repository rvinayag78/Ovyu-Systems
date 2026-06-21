"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const serif = "Georgia, serif";
const sans = "Helvetica Neue, Helvetica, Arial, sans-serif";

const YOU_DIMS = ["Voice", "History", "Relationships", "How you think", "How you talk", "How you live", "Beliefs", "Heart"];

const BASE = process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:8000";

export function VoiceProfileClient() {
  const { contractId } = useParams<{ contractId: string }>();
  const router = useRouter();
  const [initial, setInitial] = useState("?");

  const [isRecording, setIsRecording] = useState(false);
  const [recorded, setRecorded] = useState(false);
  const [recordingMs, setRecordingMs] = useState(0);
  const [confirmed, setConfirmed] = useState(false);
  const [saving, setSaving] = useState(false);
  const [blobRef, setBlobRef] = useState<Blob | null>(null);
  const [durationS, setDurationS] = useState(0);

  const mediaRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const name = sessionStorage.getItem("ovyu_full_name") ?? "";
    setInitial(name[0]?.toUpperCase() ?? "?");
  }, []);

  function fmtTime(ms: number) {
    const s = Math.floor(ms / 1000);
    return `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
  }

  async function startRecording() {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mr = new MediaRecorder(stream);
    chunksRef.current = [];
    mr.ondataavailable = (e) => { if (e.data.size > 0) chunksRef.current.push(e.data); };
    mr.start(100);
    mediaRef.current = mr;
    setIsRecording(true);
    setRecorded(false);
    setConfirmed(false);
    setRecordingMs(0);
    timerRef.current = setInterval(() => setRecordingMs(ms => ms + 100), 100);
  }

  async function stopRecording() {
    if (!mediaRef.current) return;
    if (timerRef.current) clearInterval(timerRef.current);
    const dur = recordingMs / 1000;
    setDurationS(dur);
    await new Promise<void>((resolve) => {
      mediaRef.current!.onstop = () => resolve();
      mediaRef.current!.stop();
      mediaRef.current!.stream.getTracks().forEach(t => t.stop());
    });
    const blob = new Blob(chunksRef.current, { type: "audio/webm" });
    setBlobRef(blob);
    setIsRecording(false);
    setRecorded(true);
  }

  async function handleSave() {
    if (!confirmed || !blobRef) return;
    setSaving(true);
    try {
      const session = sessionStorage.getItem("ovyu_session");
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (session) headers["Authorization"] = `Bearer ${session}`;

      const { presigned_url, s3_key, upload_id } = await fetch(
        `${BASE}/api/v1/contracts/${contractId}/upload/voice/presigned?voice_type=profile`,
        { method: "POST", headers }
      ).then(r => r.json());

      await fetch(presigned_url, { method: "PUT", body: blobRef, headers: { "Content-Type": "audio/webm" } });

      await fetch(`${BASE}/api/v1/contracts/${contractId}/upload/voice/complete`, {
        method: "POST",
        headers,
        body: JSON.stringify({ upload_id, type: "profile", s3_key, duration_s: durationS }),
      });

      router.push(`/upload/${contractId}`);
    } catch {
      alert("Upload failed. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  const meetsMinDuration = durationS >= 10;
  const canSave = confirmed && recorded && meetsMinDuration && !saving;

  return (
    <div style={{ minWidth: "1920px", minHeight: "100vh", background: "#f8f7f5", display: "flex", flexDirection: "column" }}>
      <Header variant="loggedIn" initial={initial} />

      <div style={{ flex: 1, paddingTop: "31px", paddingBottom: "173px" }}>
        {/* Back link */}
        <div style={{ paddingLeft: "110px", marginBottom: "60px" }}>
          <Link href="/contracts" style={{
            display: "flex", alignItems: "center", gap: "10px",
            fontFamily: sans, fontSize: "16px", color: "#888", textDecoration: "none",
          }}>
            <span style={{ display: "inline-block", transform: "scaleX(-1)" }}>›</span>
            Your contracts
          </Link>
        </div>

        {/* Title + subtitle */}
        <div style={{ paddingLeft: "110px", marginBottom: "60px" }}>
          <h1 style={{
            fontFamily: serif, fontStyle: "italic", fontWeight: 400,
            fontSize: "64px", color: "#1a1a1a", margin: "0 0 8px", lineHeight: "normal",
          }}>
            The sound of you.
          </h1>
          <p style={{
            fontFamily: sans, fontStyle: "oblique", fontWeight: 400,
            fontSize: "22px", color: "#888", margin: 0, lineHeight: "normal",
            width: "1256px",
          }}>
            This is the longest recording. Speak freely — the rhythm of your voice, the way you pause, the way you laugh. All of it matters.
          </p>
        </div>

        {/* Two-column script */}
        <div style={{ paddingLeft: "110px", display: "flex", gap: "113px", marginBottom: "48px" }}>
          {/* Left script */}
          <div style={{ width: "760px" }}>
            <p style={{ fontFamily: sans, fontWeight: 700, fontSize: "22px", color: "#6a4d7d", margin: "0 0 20px", letterSpacing: "0.02em" }}>
              READ THIS ALOUD
            </p>
            {[
              "Talk about yourself — who you are, where you grew up, your family. Speak as if you're telling a new friend your story.",
              "Tell us something that made you laugh this week. Or something that's been on your mind.",
              "Describe someone you love. How do they make you feel? What do you love most about them?",
            ].map((line, i) => (
              <p key={i} style={{
                fontFamily: sans, fontStyle: "oblique", fontSize: "16px",
                color: "#1a1a1a", margin: "0 0 16px", lineHeight: 1.3,
              }}>
                {line}
              </p>
            ))}
          </div>

          {/* Right script */}
          <div style={{ width: "800px" }}>
            <p style={{ fontFamily: sans, fontWeight: 700, fontSize: "22px", color: "#6a4d7d", margin: "0 0 20px", letterSpacing: "0.02em" }}>
              CONTINUE WITH
            </p>
            {[
              "What does a perfect day look like for you? Walk us through it from morning to night.",
              "What&apos;s something you believe that most people around you don&apos;t?",
              "If you could say one thing to the people who love you — the most important thing — what would it be?",
            ].map((line, i) => (
              <p key={i} style={{
                fontFamily: sans, fontStyle: "oblique", fontSize: "16px",
                color: "#1a1a1a", margin: "0 0 16px", lineHeight: 1.3,
              }}>
                {line}
              </p>
            ))}
          </div>
        </div>

        {/* Recording controls */}
        <div style={{ paddingLeft: "110px", display: "flex", flexDirection: "column", gap: "24px", maxWidth: "554px" }}>
          {/* Start recording — shown when not actively recording */}
          {!isRecording && (
            <button
              onClick={startRecording}
              style={{
                width: "214px", height: "49px",
                background: "#efeaf2",
                border: "1px solid #6a4d7d",
                borderRadius: "15px",
                display: "flex", alignItems: "center", gap: "10px",
                justifyContent: "center",
                cursor: "pointer",
              }}
            >
              <span style={{ width: "13px", height: "13px", borderRadius: "50%", background: "#6a4d7d", display: "inline-block", flexShrink: 0 }} />
              <span style={{ fontFamily: sans, fontSize: "18px", color: "#6a4d7d" }}>Start recording</span>
            </button>
          )}

          {/* Pause recording — shown while actively recording */}
          {isRecording && (
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <button
                onClick={stopRecording}
                style={{
                  width: "214px", height: "49px",
                  background: "#4b3c5e", border: "none",
                  borderRadius: "15px", cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                }}
              >
                <span style={{ fontFamily: sans, fontSize: "18px", color: "#fff" }}>⏸ Pause recording</span>
              </button>
              <span style={{ fontFamily: sans, fontSize: "13px", color: "#888", textAlign: "center", fontVariantNumeric: "tabular-nums" }}>
                {fmtTime(recordingMs)}
              </span>
            </div>
          )}


          {/* Confirm checkbox */}
          <label style={{ display: "flex", alignItems: "center", gap: "12px", cursor: meetsMinDuration ? "pointer" : "default" }}>
            <input
              type="checkbox"
              checked={confirmed}
              onChange={e => setConfirmed(e.target.checked)}
              disabled={!recorded || !meetsMinDuration}
              style={{ width: "24px", height: "24px", cursor: meetsMinDuration ? "pointer" : "not-allowed", flexShrink: 0 }}
            />
            <span style={{
              fontFamily: sans, fontStyle: "oblique", fontSize: "16px",
              color: meetsMinDuration ? "#888" : "#bababa",
            }}>
              I confirm this is my voice
            </span>
          </label>

          {/* Save button */}
          <button
            onClick={handleSave}
            disabled={!canSave}
            style={{
              width: "304px", height: "48px",
              background: canSave ? "#1a1a1a" : "#efeaf2",
              borderRadius: "8px",
              border: "none",
              cursor: canSave ? "pointer" : "not-allowed",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >
            <span style={{
              fontFamily: sans, fontSize: "16px", fontWeight: 700,
              color: canSave ? "#f5f0e8" : "#bababa",
            }}>
              {saving ? "Saving…" : "Save and continue →"}
            </span>
          </button>
        </div>
      </div>

      {/* Locked YOU bar */}
      <div style={{
        width: "100%",
        height: "70px",
        background: "#f0f0f0",
        borderTop: "3px solid #bababa",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 50px",
        boxSizing: "border-box",
        flexShrink: 0,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <span style={{ fontFamily: sans, fontWeight: 700, fontSize: "18px", color: "#bababa" }}>YOU</span>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            {YOU_DIMS.map((label, i, arr) => (
              <span key={label} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span style={{ fontFamily: sans, fontSize: "18px", color: "#bababa" }}>{label}</span>
                {i < arr.length - 1 && (
                  <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: "#bababa", display: "inline-block" }} />
                )}
              </span>
            ))}
          </div>
        </div>
        <span style={{ fontSize: "20px", color: "#bababa" }}>🔒</span>
      </div>

      <Footer />
    </div>
  );
}
