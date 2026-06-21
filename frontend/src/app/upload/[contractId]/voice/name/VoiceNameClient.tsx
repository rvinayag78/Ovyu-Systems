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

export function VoiceNameClient() {
  const { contractId } = useParams<{ contractId: string }>();
  const router = useRouter();
  const [initial, setInitial] = useState("?");
  const [makerFullName, setMakerFullName] = useState("[full name]");
  const [makerPreferred, setMakerPreferred] = useState("[preferred name]");

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
    const preferred = sessionStorage.getItem("ovyu_preferred_name") ?? name.split(" ")[0] ?? "";
    setInitial(name[0]?.toUpperCase() ?? "?");
    if (name) setMakerFullName(name);
    if (preferred) setMakerPreferred(preferred);
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
        `${BASE}/api/v1/contracts/${contractId}/upload/voice/presigned?voice_type=name`,
        { method: "POST", headers }
      ).then(r => r.json());

      await fetch(presigned_url, { method: "PUT", body: blobRef, headers: { "Content-Type": "audio/webm" } });

      await fetch(`${BASE}/api/v1/contracts/${contractId}/upload/voice/complete`, {
        method: "POST",
        headers,
        body: JSON.stringify({ upload_id, type: "name", s3_key, duration_s: durationS }),
      });

      router.push(`/upload/${contractId}/voice/profile`);
    } catch {
      alert("Upload failed. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  const canSave = confirmed && recorded && !saving;

  return (
    <div style={{ minWidth: "1920px", minHeight: "100vh", background: "#f8f7f5", display: "flex", flexDirection: "column" }}>
      <Header variant="loggedIn" initial={initial} />

      <div style={{ flex: 1, paddingTop: "31px", paddingBottom: "173px" }}>
        {/* Back link */}
        <div style={{ paddingLeft: "209px", marginBottom: "60px" }}>
          <Link href="/contracts" style={{
            display: "flex", alignItems: "center", gap: "10px",
            fontFamily: sans, fontSize: "16px", color: "#888", textDecoration: "none",
          }}>
            <span style={{ display: "inline-block", transform: "scaleX(-1)" }}>›</span>
            Your contracts
          </Link>
        </div>

        {/* Title + subtitle */}
        <div style={{ paddingLeft: "209px", marginBottom: "60px" }}>
          <h1 style={{
            fontFamily: serif, fontStyle: "italic", fontWeight: 400,
            fontSize: "64px", color: "#1a1a1a", margin: "0 0 8px", lineHeight: "normal",
          }}>
            Your name
          </h1>
          <p style={{
            fontFamily: sans, fontStyle: "oblique", fontWeight: 400,
            fontSize: "22px", color: "#888", margin: 0, lineHeight: "normal",
          }}>
            Say it the way the people who love you say it.
          </p>
        </div>

        {/* Two-column content */}
        <div style={{ paddingLeft: "209px", display: "flex", gap: "186px", alignItems: "flex-start" }}>
          {/* Left — before you begin */}
          <div style={{ width: "432px", flexShrink: 0 }}>
            <p style={{
              fontFamily: serif, fontStyle: "italic", fontWeight: 400,
              fontSize: "22px", color: "#1a1a1a", lineHeight: "44px", margin: 0,
            }}>
              Before you begin, find a quiet space. Speak naturally — exactly as you would introducing yourself to someone you already trust.
            </p>
          </div>

          {/* Right — script card + controls */}
          <div style={{ width: "554px", flexShrink: 0 }}>
            {/* Script card */}
            <div style={{
              background: "#fff",
              border: "1px solid #bababa",
              borderRadius: "15px",
              padding: "50px",
              marginBottom: "24px",
              display: "flex",
              flexDirection: "column",
              gap: "28px",
            }}>
              <p style={{ fontFamily: sans, fontWeight: 700, fontSize: "22px", color: "#6a4d7d", margin: 0, letterSpacing: "0.02em" }}>
                READ THIS ALOUD
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {[
                  `My name is ${makerFullName}.`,
                  `Most people call me ${makerPreferred}.`,
                  `Some people also call me — [any nicknames you go by].`,
                  `When I introduce myself, I usually say — [how you normally say it].`,
                ].map((line, i) => (
                  <p key={i} style={{
                    fontFamily: sans, fontStyle: "oblique", fontWeight: 400,
                    fontSize: "16px", color: "#1a1a1a", margin: 0, lineHeight: 1.5,
                  }}>
                    {line}
                  </p>
                ))}
              </div>

              {/* Recording button */}
              {!isRecording && !recorded && (
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
                  <span style={{ width: "13px", height: "13px", borderRadius: "50%", background: "#6a4d7d", display: "inline-block" }} />
                  <span style={{ fontFamily: sans, fontSize: "22px", color: "#6a4d7d" }}>Start recording</span>
                </button>
              )}

              {isRecording && (
                <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                  <span style={{ fontFamily: sans, fontSize: "18px", color: "#ec9b42", fontVariantNumeric: "tabular-nums" }}>
                    ● {fmtTime(recordingMs)}
                  </span>
                  <button
                    onClick={stopRecording}
                    style={{
                      width: "120px", height: "49px",
                      background: "#1a1a1a", border: "none",
                      borderRadius: "15px", cursor: "pointer",
                      fontFamily: sans, fontSize: "16px", color: "#fff",
                    }}
                  >
                    Stop
                  </button>
                </div>
              )}

              {recorded && !isRecording && (
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
                  <span style={{ fontFamily: sans, fontSize: "16px", color: "#6a4d7d" }}>↺ Re-record</span>
                </button>
              )}
            </div>

            {/* Confirm checkbox */}
            <label style={{
              display: "flex", alignItems: "center", gap: "12px",
              cursor: "pointer", marginBottom: "24px",
            }}>
              <input
                type="checkbox"
                checked={confirmed}
                onChange={e => setConfirmed(e.target.checked)}
                disabled={!recorded}
                style={{ width: "24px", height: "24px", cursor: recorded ? "pointer" : "not-allowed", flexShrink: 0 }}
              />
              <span style={{
                fontFamily: sans, fontStyle: "oblique", fontSize: "16px",
                color: recorded ? "#888" : "#bababa",
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
                background: "#efeaf2",
                borderRadius: "8px",
                border: "none",
                cursor: canSave ? "pointer" : "not-allowed",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}
            >
              <span style={{
                fontFamily: sans, fontSize: "18px", fontWeight: 400,
                color: canSave ? "#1a1a1a" : "#bababa",
              }}>
                {saving ? "Saving…" : "Save and continue →"}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Locked YOU bar */}
      <div style={{
        width: "1920px",
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
