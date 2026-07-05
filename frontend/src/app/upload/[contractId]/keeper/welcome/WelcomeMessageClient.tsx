"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { BackLink } from "@/components/ui/BackLink";
import { PageShell } from "@/components/ui/PageShell";
import { tokens } from "@/styles/tokens";
import { api } from "@/lib/api";

const serif = "Georgia, serif";
const sans = "Helvetica Neue, Helvetica, Arial, sans-serif";

// Figma 2337:11573 — the suggested Welcome script, verbatim
const SCRIPT_PARAGRAPHS = [
  "Hi. It's me. And welcome, in a strange and roundabout way, to something I made for you.",
  "If you're hearing this, then I'm gone, and everything I set up has done what it was meant to do. I always knew this moment would come, and I wanted to be ready for it. So I made this, so that some part of me would still be here for you.",
  "It's called Ovyu. While I was alive, I used it to record myself over time. My voice, my memories, the way I think and talk and see the world. Ovyu took everything I gave it and built it into something you can talk to, in my voice, the way you'd talk to me.",
  "It sounds like me because it came from me. Every word of it is mine, recorded by me, for you. It won't get everything right, and it isn't quite the same as having me here. But it's real, and it's yours now.",
  "So whenever you're ready, come talk to me. Ask me anything. Tell me what's going on with you. There's no rush, and there's no wrong way to do this. I'm right here.",
];

export function WelcomeMessageClient() {
  const params = useParams<{ contractId: string }>();
  // Next.js static export may resolve the param to the SSG placeholder "_".
  // Recover the real ID from the actual URL path or sessionStorage fallback.
  const contractId = (() => {
    const raw = params.contractId;
    if (raw !== "_") return raw;
    if (typeof window === "undefined") return raw;
    const seg = window.location.pathname.split("/").filter(Boolean)[1];
    if (seg && seg !== "_") return seg;
    return sessionStorage.getItem("ovyu_contract_id") ?? raw;
  })();
  const router = useRouter();
  const [initial, setInitial] = useState("?");
  const [keeperName, setKeeperName] = useState("…");
  const [dimensionCounts, setDimensionCounts] = useState<Record<string, number>>({});

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
    const name = sessionStorage.getItem("ovyu_maker_name") ?? sessionStorage.getItem("ovyu_full_name") ?? "";
    setInitial(name[0]?.toUpperCase() ?? "?");

    if (contractId) {
      api.getVoiceStatus(contractId).then(status => {
        if (status.name !== "complete") router.replace(`/upload/${contractId}/voice/name`);
        else if (status.profile !== "complete") router.replace(`/upload/${contractId}/voice/profile`);
      }).catch(() => {});
      api.getHub(contractId).then(h => {
        setKeeperName(h.keeper_name);
        setDimensionCounts(h.dimension_counts);
      }).catch(() => {});
    }
  }, [contractId]);

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
      const { presigned_url, s3_key } = await api.getMessagePresigned(contractId, "welcome");

      await fetch(presigned_url, { method: "PUT", body: blobRef, headers: { "Content-Type": "audio/webm" } });

      await api.addMessage(contractId, { type: "welcome", body: "", s3_key, duration_s: durationS });

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
    <PageShell
      headerInitial={initial}
      contentStyle={{ paddingTop: "31px", paddingBottom: "30px" }}
      youBar={{ voiceComplete: true, contractId, dimensionCounts }}
    >
      <div>
        {/* Back link — left 110, top 134 per Figma 2337:11564 */}
        <div style={{ marginLeft: "110px", display: "flex", flexDirection: "column" }}>
          <BackLink href={`/upload/${contractId}`} label={`For ${keeperName}`} marginBottom="34px" />

          {/* Pink banner — 1700w, fill pinkFill, radius 20, padding 60, gap 13 per Figma 2337:11640 */}
          <div style={{
            width: "1700px", boxSizing: "border-box",
            background: tokens.color.pinkFill, borderRadius: "20px",
            padding: "60px", display: "flex", flexDirection: "column", gap: "13px",
            marginBottom: "62px",
          }}>
            <h1 style={{
              fontFamily: serif, fontStyle: "italic", fontWeight: 400,
              fontSize: "64px", color: tokens.color.black, margin: 0, lineHeight: "normal",
            }}>
              Welcome Message
            </h1>
            <p style={{
              fontFamily: sans, fontStyle: "oblique", fontWeight: 400,
              fontSize: "22px", color: tokens.color.darkGrey, margin: 0, lineHeight: "normal",
              width: "1256px",
            }}>
              This is the first thing they&apos;ll hear from you, after you&apos;re gone. Most people say hello,
              and tell them what this is. Below is one way to begin. Use it, change it, or set it aside and
              say it your own way.
            </p>
          </div>

          {/* Content column — x 124 (14px in from the 110 banner edge), 1673w × 669h, gap 44 per Figma 2337:11569 */}
          <div style={{
            marginLeft: "14px", width: "1673px", height: "669px",
            display: "flex", flexDirection: "column", gap: "44px", alignItems: "flex-start",
          }}>

            {/* Label + script — gap 35 per Figma 2337:11570 */}
            <div style={{ display: "flex", flexDirection: "column", gap: "35px", alignItems: "flex-start", width: "100%" }}>
              <p style={{ fontFamily: sans, fontWeight: 700, fontSize: "22px", color: tokens.color.lavender, margin: 0, whiteSpace: "nowrap" }}>
                A PLACE TO START
              </p>
              <div style={{ width: "760px", fontFamily: sans, fontStyle: "oblique", fontSize: "16px", color: "#000", lineHeight: 1.3 }}>
                {SCRIPT_PARAGRAPHS.map((para, i) => (
                  <p key={i} style={{ margin: 0, lineHeight: 1.3 }}>{para}</p>
                ))}
              </div>
            </div>

            {/* Start / Pause recording — 214×49 per Figma 2026:781 instance */}
            <div style={{ display: "flex", flexDirection: "column", gap: "6px", alignItems: "flex-start" }}>
              {!isRecording ? (
                <button
                  onClick={startRecording}
                  style={{
                    width: "214px", height: "49px",
                    background: tokens.color.lavenderFill,
                    border: `1px solid ${tokens.color.lavender}`,
                    borderRadius: "15px",
                    boxSizing: "border-box",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: "10px",
                    cursor: "pointer",
                  }}
                >
                  <span style={{ width: "13px", height: "13px", borderRadius: "50%", background: tokens.color.lavender, display: "inline-block", flexShrink: 0 }} />
                  <span style={{ fontFamily: sans, fontSize: "22px", color: tokens.color.lavender }}>Start recording</span>
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
                <span style={{ fontFamily: sans, fontSize: "13px", color: tokens.color.darkGrey, fontVariantNumeric: "tabular-nums", paddingLeft: "4px" }}>
                  {fmtTime(recordingMs)}
                </span>
              )}
            </div>

            {/* Checkbox + Save — gap 19, items-center per Figma 2337:11576 */}
            <div style={{ display: "flex", flexDirection: "column", gap: "19px", alignItems: "center" }}>
              <label style={{ display: "flex", alignItems: "center", gap: "10px", cursor: meetsMinDuration ? "pointer" : "default", width: "209px", height: "24px" }}>
                <input
                  type="checkbox"
                  checked={confirmed}
                  onChange={e => setConfirmed(e.target.checked)}
                  disabled={!recorded || !meetsMinDuration}
                  style={{ width: "24px", height: "24px", cursor: meetsMinDuration ? "pointer" : "not-allowed", flexShrink: 0 }}
                />
                <span style={{
                  fontFamily: sans, fontStyle: "oblique", fontSize: "16px",
                  color: meetsMinDuration ? tokens.color.darkGrey : tokens.color.lightGrey,
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
                  background: canSave ? tokens.color.black : tokens.color.lavenderFill,
                  borderRadius: "8px",
                  border: "none",
                  cursor: canSave ? "pointer" : "not-allowed",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}
              >
                <span style={{
                  fontFamily: sans, fontSize: "16px", fontWeight: 700,
                  color: canSave ? tokens.color.footerText : tokens.color.lightGrey,
                }}>
                  {saving ? "Saving…" : "Save and continue →"}
                </span>
              </button>
            </div>

          </div>{/* end content column */}
        </div>
      </div>
    </PageShell>
  );
}
