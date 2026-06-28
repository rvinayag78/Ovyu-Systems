"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { YouBar } from "@/components/YouBar";
import { api } from "@/lib/api";

const serif = "Georgia, serif";
const sans = "Helvetica Neue, Helvetica, Arial, sans-serif";

const BASE = process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:8000";

export function VoiceProfileClient() {
  const params = useParams<{ contractId: string }>();
  let contractId = params.contractId;
  if (contractId === "_") {
    contractId = typeof window !== "undefined" ? sessionStorage.getItem("ovyu_contract_id") ?? "" : "";
  }
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
    const name = sessionStorage.getItem("ovyu_full_name") ?? sessionStorage.getItem("ovyu_maker_name") ?? "";
    setInitial(name[0]?.toUpperCase() ?? "?");

    if (contractId) {
      api.getVoiceStatus(contractId).then(status => {
        if (status.profile === "complete") router.replace(`/upload/${contractId}`);
        else if (status.name !== "complete") router.replace(`/upload/${contractId}/voice/name`);
      }).catch(() => {});
    }
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

      router.push(`/contracts`);
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

      <div style={{ flex: 1, paddingTop: "31px", paddingBottom: "30px" }}>
        <div style={{ marginLeft: "110px", width: "1673px", display: "flex", flexDirection: "column", gap: "34px" }}>

          {/* Back link */}
          <Link href="/contracts" style={{
            display: "flex", alignItems: "center", gap: "10px",
            fontFamily: sans, fontSize: "16px", color: "#888", textDecoration: "none",
          }}>
            <span style={{ display: "inline-block", transform: "scaleX(-1)" }}>›</span>
            Your contracts
          </Link>

          {/* Title */}
          <h1 style={{
            fontFamily: serif, fontStyle: "italic", fontWeight: 400,
            fontSize: "64px", color: "#1a1a1a", margin: 0, lineHeight: "normal",
          }}>
            The sound of you
          </h1>

          {/* Subtitle */}
          <p style={{
            fontFamily: sans, fontStyle: "oblique", fontWeight: 400,
            fontSize: "22px", color: "#888", margin: 0, lineHeight: "normal",
            width: "1256px",
          }}>
            Read this aloud. Your voice, saying these words, is what we keep. And as you read, you&apos;ll learn exactly what you&apos;re building here.
            {" "}Speak at the pace you&apos;d use to tell a story to someone you trust. If you slow down, that&apos;s right. If you pause, that&apos;s right too.
          </p>

          {/* Main content area — 697px height, justify-between: script row / start recording / checkbox+save */}
          <div style={{ height: "697px", display: "flex", flexDirection: "column", alignItems: "flex-start", justifyContent: "space-between" }}>

            {/* Script two-column row */}
            <div style={{ display: "flex", justifyContent: "space-between", width: "100%", alignItems: "center" }}>
              {/* Left — label + script text */}
              <div style={{ width: "760px", display: "flex", flexDirection: "column", gap: "10px" }}>
                <p style={{ fontFamily: sans, fontWeight: 700, fontSize: "22px", color: "#6a4d7d", margin: 0, whiteSpace: "nowrap" }}>
                  READ THIS ALOUD
                </p>
                <div style={{ fontFamily: sans, fontStyle: "oblique", fontSize: "16px", color: "#1a1a1a", lineHeight: 1.3 }}>
                  {[
                    "My name is [name]. I am recording this because I have chosen to leave a piece of myself behind for someone I love. When I pass, that person will be able to come here and have a conversation with what I have left: my voice, my stories, my memories, the way I think and talk and see the world. Ovyu holds all of it securely and delivers it to them when the time comes. Only they will ever have access to it.",
                    "Once this recording is done, my full profile unlocks. And before I go further: I am just going to talk the way I normally talk. The more like myself I sound now, the more like myself I will sound to them later. So this is me, ordinary voice, no performance.",
                    "My profile is built across eight dimensions, and together they add up to me. Voice is the one I am doing right now, the sound of how I actually talk. History is where I come from and the moments that changed things. Relationships is the people who shaped me, and how I am with them. How I think is the way I work things out. How I talk is my phrases, my humor, the words that are mine. How I live is what an ordinary day actually looks like. Beliefs is what I hold onto and will not apologize for. And Heart is what moves me, what I love, what I cannot stand. I can move through them in any order I like.",
                    "Each one starts with a few quick questions, the things Ovyu wants to get right. I can edit any of those answers anytime. After that, I add as much as I want, recorded or written, whenever something comes to me. If I hit a wall and do not know what to add for an entry, I can refer to a rotating list of questions designed to open something up and get me thinking and talking within that dimension. They are specific to wherever I am in the upload.",
                  ].map((para, i) => (
                    <p key={i} style={{ margin: "0 0 0 0", lineHeight: 1.3 }}>{para}</p>
                  ))}
                </div>
              </div>

              {/* Right — continuation */}
              <div style={{ width: "800px", fontFamily: sans, fontStyle: "oblique", fontSize: "16px", color: "#1a1a1a", lineHeight: 1.3 }}>
                {[
                  "As I go, Ovyu will ask me small things: who was in this story, where it happened, when it was. All of it is optional, but the more I share, the fuller the picture becomes, and the more of me there is to find later. All of that is me, the eight dimensions, and that is what every person I leave something for will meet.",
                  "Then there is the part I build for one person in particular. This works the same way, my own questions to answer, my own entries to add, the same small tags for the people and places and times that come up, but all of it is turned toward them. Everything I know and notice about who they are, and who they are becoming. A welcome, for the moment they arrive. Messages for the moments still ahead of them, the ones I will not be there for. What I want for them. What I want them to know. And my advice, for the times they will need it. This part is as deep as everything else, and it is built for them alone.",
                  "And if there is more than one person I want to leave something for, I do not start over. The eight dimensions are already me, they carry across to everyone. For each new person, I just build their part, their questions, their entries, everything turned toward them. So the me stays the same. What I gather and say for each of them is theirs alone.",
                  "One thing about these early recordings: while I am getting started, what I record also helps Ovyu learn the sound of my voice. So for now, it really does need to be me. No getting my brother to do it in a funny accent.",
                  "Well. That was a lot to take in, and also a lot to say out loud. But I think I have a sense of what I am building here and why it matters. Time to begin.",
                ].map((para, i) => (
                  <p key={i} style={{ margin: "0 0 0 0", lineHeight: 1.3 }}>{para}</p>
                ))}
              </div>
            </div>

            {/* Start / Pause recording — standalone 2nd child */}
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

            {/* Checkbox + Save — 3rd child, centered */}
            <div style={{ display: "flex", flexDirection: "column", gap: "19px", alignItems: "center" }}>
              <label style={{ display: "flex", alignItems: "center", gap: "12px", cursor: meetsMinDuration ? "pointer" : "default", width: "209px", height: "24px" }}>
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
                  whiteSpace: "nowrap",
                }}>
                  I confirm this is my voice
                </span>
              </label>

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

          </div>{/* end 697px content area */}
        </div>{/* end 1673px container */}
      </div>

      <YouBar voiceComplete={false} />

      <Footer />
    </div>
  );
}
