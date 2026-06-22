"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { YouBar } from "@/components/YouBar";

const serif = "Georgia, serif";
const sans = "Helvetica Neue, Helvetica, Arial, sans-serif";

const BASE = process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:8000";

export function VoiceNameClient() {
  const params = useParams<{ contractId: string }>();
  let contractId = params.contractId;
  if (contractId === "_") {
    contractId = typeof window !== "undefined" ? sessionStorage.getItem("ovyu_contract_id") ?? "" : "";
  }
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
    const name = sessionStorage.getItem("ovyu_full_name") ?? sessionStorage.getItem("ovyu_maker_name") ?? "";
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

  const meetsMinDuration = durationS >= 10;
  const canSave = confirmed && recorded && meetsMinDuration && !saving;

  return (
    <div style={{ minWidth: "1920px", minHeight: "100vh", background: "#f8f7f5", display: "flex", flexDirection: "column" }}>
      <Header variant="loggedIn" initial={initial} />

      <div style={{ flex: 1, paddingTop: "31px", paddingBottom: "173px" }}>
        {/* 1500px container at left 209px */}
        <div style={{ marginLeft: "209px", width: "1500px", display: "flex", flexDirection: "column", gap: "34px" }}>

        {/* Back link */}
          <Link href="/contracts" style={{
            display: "flex", alignItems: "center", gap: "10px",
            fontFamily: sans, fontSize: "16px", color: "#888", textDecoration: "none",
          }}>
            <span style={{ display: "inline-block", transform: "scaleX(-1)" }}>›</span>
            Your contracts
          </Link>

          {/* Title + subtitle */}
          <div style={{ display: "flex", flexDirection: "column", gap: "13px" }}>
            <h1 style={{
              fontFamily: serif, fontStyle: "italic", fontWeight: 400,
              fontSize: "64px", color: "#1a1a1a", margin: 0, lineHeight: "normal",
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
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", width: "100%" }}>
          {/* Left — before you begin */}
          <div style={{ width: "432px", flexShrink: 0 }}>
            <p style={{
              fontFamily: serif, fontStyle: "italic", fontWeight: 400,
              fontSize: "22px", color: "#1a1a1a", lineHeight: "44px", margin: 0,
            }}>
              Before you begin, we need to hear your name. Not performed. Not spelled out. Just said, the way you actually say it. Read each line aloud, naturally, at your own pace.
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
              marginBottom: "20px",
              display: "flex",
              flexDirection: "column",
              gap: "19px",
            }}>
              <p style={{ fontFamily: sans, fontWeight: 700, fontSize: "22px", color: "#6a4d7d", margin: 0 }}>
                READ THIS ALOUD
              </p>
              <div>
                {[
                  `My name is ${makerFullName}.`,
                  `Most people call me ${makerPreferred}.`,
                  `Some people also call me [alternative nickname, if any].`,
                  `When I introduce myself, I usually say: hi, I'm ${makerPreferred}.`,
                ].map((line, i) => (
                  <p key={i} style={{
                    fontFamily: sans, fontStyle: "oblique", fontWeight: 400,
                    fontSize: "16px", color: "#1a1a1a", margin: 0, lineHeight: 2,
                  }}>
                    {line}
                  </p>
                ))}
              </div>

              {/* Start / Pause recording — same fixed size in both states */}
              <div style={{ display: "flex", flexDirection: "column", gap: "6px", alignItems: "flex-start" }}>
                {!isRecording ? (
                  <button
                    onClick={startRecording}
                    style={{
                      width: "214px", height: "49px",
                      background: "#efeaf2",
                      border: "1px solid #6a4d7d",
                      borderRadius: "15px",
                      boxSizing: "border-box",
                      display: "flex", alignItems: "center", justifyContent: "center", gap: "10px",
                      cursor: "pointer",
                    }}
                  >
                    <span style={{ width: "13px", height: "13px", borderRadius: "50%", background: "#6a4d7d", display: "inline-block", flexShrink: 0 }} />
                    <span style={{ fontFamily: sans, fontSize: "22px", color: "#6a4d7d" }}>Start recording</span>
                  </button>
                ) : (
                  <button
                    onClick={stopRecording}
                    style={{
                      width: "214px", height: "49px",
                      background: "#4b3c5e",
                      border: "1px solid #4b3c5e",
                      borderRadius: "15px",
                      boxSizing: "border-box",
                      display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                      cursor: "pointer",
                    }}
                  >
                    <span style={{ fontFamily: sans, fontSize: "22px", color: "#fff" }}>⏸ Pause recording</span>
                  </button>
                )}
                {isRecording && (
                  <span style={{ fontFamily: sans, fontSize: "13px", color: "#888", fontVariantNumeric: "tabular-nums", paddingLeft: "4px" }}>
                    {fmtTime(recordingMs)}
                  </span>
                )}
              </div>
            </div>


            {/* Confirm checkbox */}
            <label style={{
              display: "flex", alignItems: "center", gap: "12px",
              cursor: meetsMinDuration ? "pointer" : "default", marginBottom: "24px",
            }}>
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
        </div>{/* end two-column */}
        </div>{/* end 1500px container */}
      </div>

      <YouBar voiceComplete={false} />

      <Footer />
    </div>
  );
}
