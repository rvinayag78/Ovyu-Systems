"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { api } from "@/lib/api";

const serif = "Georgia, serif";
const sans = "Helvetica Neue, Helvetica, Arial, sans-serif";

const YOU_DIMENSIONS = [
  { slug: "faith",       label: "Faith",       hint: "Your beliefs, spirituality, what grounds you." },
  { slug: "family",      label: "Family",      hint: "Where you come from. The ones who shaped you." },
  { slug: "work",        label: "Work",        hint: "What you built, what you gave, what it meant." },
  { slug: "health",      label: "Health",      hint: "Your relationship with your body through the years." },
  { slug: "values",      label: "Values",      hint: "What you stood for. What you would never compromise." },
  { slug: "personality", label: "Personality", hint: "How people experienced you. The energy you brought." },
  { slug: "legacy",      label: "Legacy",      hint: "What you want to leave behind." },
  { slug: "lessons",     label: "Lessons",     hint: "What life taught you. What you wish you had known sooner." },
];

type Progress = { voice_done: boolean; you_pct: number; your_life_pct: number; for_keeper_pct: number };
type Person = { id: string; name: string; role?: string; notes?: string };
type YearEntry = { id: string; year?: number; title: string; body?: string };
type Place = { id: string; name: string; why?: string };
type KeeperMessage = { id: string; type: string; trigger?: string; body: string };
type KeeperProfile = { who_they_are?: string; who_theyre_becoming?: string; what_you_want?: string; what_you_want_known?: string; advice?: string };
type DimEntry = { id: string; body: string };

export function UploadDashboard() {
  const params = useSearchParams();
  const contractId = params.get("id") ?? "";
  const [session] = useState(() => typeof window !== "undefined" ? sessionStorage.getItem("ovyu_session") : null);
  const [makerInitial, setMakerInitial] = useState("");

  const [progress, setProgress] = useState<Progress>({ voice_done: false, you_pct: 0, your_life_pct: 0, for_keeper_pct: 0 });
  const [uploadId, setUploadId] = useState<string>("");

  // section open state
  const [openSection, setOpenSection] = useState<"voice" | "you" | "life" | "keeper" | null>("voice");
  const [openDim, setOpenDim] = useState<string | null>(null);
  const [openLifeTab, setOpenLifeTab] = useState<"people" | "years" | "places">("people");

  // voice recording state
  const [voiceStatus, setVoiceStatus] = useState<{ name: string; profile: string }>({ name: "pending", profile: "pending" });
  const [recordingType, setRecordingType] = useState<"name" | "profile" | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingMs, setRecordingMs] = useState(0);
  const mediaRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // dimension state
  const [dimEntries, setDimEntries] = useState<Record<string, DimEntry[]>>({});
  const [dimText, setDimText] = useState("");
  const [dimSaving, setDimSaving] = useState(false);

  // your life state
  const [people, setPeople] = useState<Person[]>([]);
  const [years, setYears] = useState<YearEntry[]>([]);
  const [places, setPlaces] = useState<Place[]>([]);
  const [personForm, setPersonForm] = useState({ name: "", role: "", notes: "" });
  const [yearForm, setYearForm] = useState({ year: "", title: "", body: "" });
  const [placeForm, setPlaceForm] = useState({ name: "", why: "" });

  // for keeper state
  const [messages, setMessages] = useState<KeeperMessage[]>([]);
  const [keeperProfile, setKeeperProfile] = useState<KeeperProfile>({});
  const [welcomeBody, setWelcomeBody] = useState("");
  const [forWhenTrigger, setForWhenTrigger] = useState("");
  const [forWhenBody, setForWhenBody] = useState("");

  const authHeaders = useCallback(() => ({
    "Content-Type": "application/json",
    ...(session ? { Authorization: `Bearer ${session}` } : {}),
  }), [session]);

  const BASE = process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:8000";

  async function apiFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
    const res = await fetch(`${BASE}/api/v1${path}`, {
      headers: authHeaders(),
      ...init,
    });
    if (!res.ok) {
      const b = await res.json().catch(() => ({}));
      throw new Error(b.detail ?? `Error ${res.status}`);
    }
    if (res.status === 204) return undefined as T;
    return res.json();
  }

  useEffect(() => {
    const name = typeof window !== "undefined" ? sessionStorage.getItem("ovyu_full_name") : "";
    setMakerInitial((name ?? "M").charAt(0).toUpperCase());
  }, []);

  useEffect(() => {
    if (!contractId) return;
    (async () => {
      try {
        const [up, prog, vs] = await Promise.all([
          apiFetch<{ id: string; voice_status: string }>(`/contracts/${contractId}/upload`),
          apiFetch<Progress>(`/contracts/${contractId}/upload/progress`),
          apiFetch<{ name: string; profile: string }>(`/contracts/${contractId}/upload/voice/status`),
        ]);
        setUploadId(up.id);
        setProgress(prog);
        setVoiceStatus(vs);
      } catch (e) {
        console.error(e);
      }
    })();
  }, [contractId]);

  async function refreshProgress() {
    if (!contractId) return;
    const prog = await apiFetch<Progress>(`/contracts/${contractId}/upload/progress`);
    setProgress(prog);
  }

  // ── Voice recording ─────────────────────────────────────────────────────────

  async function startRecording(type: "name" | "profile") {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mr = new MediaRecorder(stream);
    chunksRef.current = [];
    mr.ondataavailable = (e) => { if (e.data.size > 0) chunksRef.current.push(e.data); };
    mr.start(100);
    mediaRef.current = mr;
    setRecordingType(type);
    setIsRecording(true);
    setRecordingMs(0);
    timerRef.current = setInterval(() => setRecordingMs(ms => ms + 100), 100);
  }

  async function stopRecording() {
    if (!mediaRef.current || !recordingType) return;
    const durationS = recordingMs / 1000;
    setIsRecording(false);
    if (timerRef.current) clearInterval(timerRef.current);

    await new Promise<void>((resolve) => {
      mediaRef.current!.onstop = () => resolve();
      mediaRef.current!.stop();
      mediaRef.current!.stream.getTracks().forEach(t => t.stop());
    });

    const blob = new Blob(chunksRef.current, { type: "audio/webm" });

    try {
      const { presigned_url, s3_key, upload_id } = await apiFetch<{
        presigned_url: string; s3_key: string; upload_id: string;
      }>(`/contracts/${contractId}/upload/voice/presigned?voice_type=${recordingType}`, { method: "POST" });

      await fetch(presigned_url, { method: "PUT", body: blob, headers: { "Content-Type": "audio/webm" } });

      await apiFetch(`/contracts/${contractId}/upload/voice/complete`, {
        method: "POST",
        body: JSON.stringify({ upload_id, type: recordingType, s3_key, duration_s: durationS }),
      });

      const vs = await apiFetch<{ name: string; profile: string }>(`/contracts/${contractId}/upload/voice/status`);
      setVoiceStatus(vs);
      if (vs.name === "complete" && vs.profile === "complete") {
        setProgress(p => ({ ...p, voice_done: true }));
      }
    } catch (e) {
      console.error("Upload failed:", e);
      alert("Recording upload failed. Please try again.");
    }
    setRecordingType(null);
  }

  function fmtTime(ms: number) {
    const s = Math.floor(ms / 1000);
    return `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
  }

  // ── Dimension entries ───────────────────────────────────────────────────────

  async function loadDimEntries(slug: string) {
    if (dimEntries[slug]) return;
    try {
      const dim = await apiFetch<{ entries: DimEntry[] }>(`/contracts/${contractId}/upload/dimensions/${slug}`);
      setDimEntries(prev => ({ ...prev, [slug]: dim.entries }));
    } catch { setDimEntries(prev => ({ ...prev, [slug]: [] })); }
  }

  async function addDimEntry(slug: string) {
    if (!dimText.trim()) return;
    setDimSaving(true);
    try {
      const entry = await apiFetch<DimEntry>(
        `/contracts/${contractId}/upload/dimensions/${slug}/entries`,
        { method: "POST", body: JSON.stringify({ body: dimText.trim() }) }
      );
      setDimEntries(prev => ({ ...prev, [slug]: [...(prev[slug] ?? []), entry] }));
      setDimText("");
      await refreshProgress();
    } finally { setDimSaving(false); }
  }

  async function deleteDimEntry(slug: string, entryId: string) {
    await apiFetch(`/contracts/${contractId}/upload/dimensions/${slug}/entries/${entryId}`, { method: "DELETE" });
    setDimEntries(prev => ({ ...prev, [slug]: (prev[slug] ?? []).filter(e => e.id !== entryId) }));
  }

  // ── YOUR LIFE loaders ───────────────────────────────────────────────────────

  async function loadLife() {
    if (!contractId) return;
    const [p, y, pl] = await Promise.all([
      apiFetch<Person[]>(`/contracts/${contractId}/upload/people`),
      apiFetch<YearEntry[]>(`/contracts/${contractId}/upload/years`),
      apiFetch<Place[]>(`/contracts/${contractId}/upload/places`),
    ]);
    setPeople(p); setYears(y); setPlaces(pl);
  }

  async function addPerson() {
    if (!personForm.name.trim()) return;
    const p = await apiFetch<Person>(`/contracts/${contractId}/upload/people`, {
      method: "POST", body: JSON.stringify({ name: personForm.name, role: personForm.role || null, notes: personForm.notes || null }),
    });
    setPeople(prev => [...prev, p]);
    setPersonForm({ name: "", role: "", notes: "" });
    await refreshProgress();
  }

  async function deletePerson(id: string) {
    await apiFetch(`/contracts/${contractId}/upload/people/${id}`, { method: "DELETE" });
    setPeople(prev => prev.filter(p => p.id !== id));
  }

  async function addYear() {
    if (!yearForm.title.trim()) return;
    const y = await apiFetch<YearEntry>(`/contracts/${contractId}/upload/years`, {
      method: "POST", body: JSON.stringify({ year: yearForm.year ? Number(yearForm.year) : null, title: yearForm.title, body: yearForm.body || null }),
    });
    setYears(prev => [...prev, y]);
    setYearForm({ year: "", title: "", body: "" });
    await refreshProgress();
  }

  async function deleteYear(id: string) {
    await apiFetch(`/contracts/${contractId}/upload/years/${id}`, { method: "DELETE" });
    setYears(prev => prev.filter(y => y.id !== id));
  }

  async function addPlace() {
    if (!placeForm.name.trim()) return;
    const pl = await apiFetch<Place>(`/contracts/${contractId}/upload/places`, {
      method: "POST", body: JSON.stringify({ name: placeForm.name, why: placeForm.why || null }),
    });
    setPlaces(prev => [...prev, pl]);
    setPlaceForm({ name: "", why: "" });
    await refreshProgress();
  }

  async function deletePlace(id: string) {
    await apiFetch(`/contracts/${contractId}/upload/places/${id}`, { method: "DELETE" });
    setPlaces(prev => prev.filter(p => p.id !== id));
  }

  // ── FOR KEEPER loaders ──────────────────────────────────────────────────────

  async function loadKeeper() {
    if (!contractId) return;
    const [msgs, profile] = await Promise.all([
      apiFetch<KeeperMessage[]>(`/contracts/${contractId}/upload/messages`),
      apiFetch<KeeperProfile>(`/contracts/${contractId}/upload/keeper-profile`),
    ]);
    setMessages(msgs);
    setKeeperProfile(profile);
    const welcome = msgs.find(m => m.type === "welcome");
    if (welcome) setWelcomeBody(welcome.body);
  }

  async function saveWelcome() {
    await apiFetch(`/contracts/${contractId}/upload/messages`, {
      method: "POST", body: JSON.stringify({ type: "welcome", body: welcomeBody }),
    });
    await loadKeeper();
    await refreshProgress();
  }

  async function addForWhen() {
    if (!forWhenBody.trim()) return;
    await apiFetch(`/contracts/${contractId}/upload/messages`, {
      method: "POST", body: JSON.stringify({ type: "for_when", trigger: forWhenTrigger || null, body: forWhenBody }),
    });
    setForWhenTrigger(""); setForWhenBody("");
    await loadKeeper();
    await refreshProgress();
  }

  async function deleteMessage(id: string) {
    await apiFetch(`/contracts/${contractId}/upload/messages/${id}`, { method: "DELETE" });
    await loadKeeper();
  }

  async function saveKeeperProfile() {
    await apiFetch(`/contracts/${contractId}/upload/keeper-profile`, {
      method: "PUT", body: JSON.stringify(keeperProfile),
    });
    await refreshProgress();
  }

  // ── UI helpers ──────────────────────────────────────────────────────────────

  function PctBar({ pct }: { pct: number }) {
    return (
      <div style={{ height: "4px", background: "#e5e5e5", borderRadius: "2px", flex: 1 }}>
        <div style={{ height: "100%", width: `${pct}%`, background: "#6a4d7d", borderRadius: "2px", transition: "width 0.3s" }} />
      </div>
    );
  }

  function LockBadge() {
    return (
      <span style={{ fontFamily: sans, fontSize: "12px", color: "#9c9c9c", display: "flex", alignItems: "center", gap: "4px" }}>
        🔒 Complete voice recording first
      </span>
    );
  }

  function SectionHeader({
    id, title, pct, locked, badge,
  }: { id: typeof openSection; title: string; pct?: number; locked?: boolean; badge?: React.ReactNode }) {
    return (
      <div
        onClick={() => {
          if (locked) return;
          if (id === "life" && openSection !== "life") loadLife();
          if (id === "keeper" && openSection !== "keeper") loadKeeper();
          setOpenSection(open => open === id ? null : id);
        }}
        style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "20px 28px", cursor: locked ? "not-allowed" : "pointer",
          background: openSection === id ? "#f7f4ef" : "#fff",
          borderBottom: "1px solid #e5e5e5",
          opacity: locked ? 0.6 : 1,
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "6px", flex: 1 }}>
          <span style={{ fontFamily: sans, fontWeight: 700, fontSize: "13px", letterSpacing: "0.08em", color: "#6a4d7d" }}>
            {title}
          </span>
          {pct !== undefined && (
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <PctBar pct={pct} />
              <span style={{ fontFamily: sans, fontSize: "12px", color: "#9c9c9c", whiteSpace: "nowrap" }}>{pct}%</span>
            </div>
          )}
          {badge}
        </div>
        <span style={{ fontFamily: sans, fontSize: "18px", color: "#6a4d7d", marginLeft: "16px" }}>
          {openSection === id ? "−" : "+"}
        </span>
      </div>
    );
  }

  const voiceDone = progress.voice_done;

  return (
    <div style={{ minHeight: "100vh", background: "#f7f4ef", display: "flex", flexDirection: "column" }}>
      <Header variant="loggedIn" initial={makerInitial} />

      <main style={{ flex: 1, maxWidth: "860px", margin: "0 auto", width: "100%", padding: "48px 24px 80px" }}>
        {/* Page title */}
        <div style={{ marginBottom: "40px" }}>
          <h1 style={{ fontFamily: serif, fontSize: "40px", fontWeight: 400, color: "#1a1a1a", margin: "0 0 8px" }}>
            Your upload.
          </h1>
          <p style={{ fontFamily: sans, fontSize: "16px", color: "#9c9c9c", margin: 0 }}>
            Build what you want to leave behind — one piece at a time.
          </p>
        </div>

        {/* Progress bar row */}
        <div style={{
          display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px",
          marginBottom: "40px", background: "#fff", borderRadius: "8px",
          padding: "20px 24px", border: "1px solid #e5e5e5",
        }}>
          {[
            { label: "YOU", pct: progress.you_pct },
            { label: "YOUR LIFE", pct: progress.your_life_pct },
            { label: "FOR YOUR KEEPER", pct: progress.for_keeper_pct },
          ].map(({ label, pct }) => (
            <div key={label} style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <span style={{ fontFamily: sans, fontWeight: 700, fontSize: "11px", letterSpacing: "0.08em", color: "#6a4d7d" }}>{label}</span>
              <PctBar pct={pct} />
              <span style={{ fontFamily: sans, fontSize: "12px", color: "#9c9c9c" }}>{pct}%</span>
            </div>
          ))}
        </div>

        {/* Sections */}
        <div style={{ borderRadius: "8px", border: "1px solid #e5e5e5", overflow: "hidden", background: "#fff" }}>

          {/* ── VOICE ────────────────────────────────────────────────────────── */}
          <SectionHeader
            id="voice"
            title="VOICE RECORDING"
            badge={
              voiceDone
                ? <span style={{ fontFamily: sans, fontSize: "12px", color: "#4fb07d" }}>✓ Complete</span>
                : <span style={{ fontFamily: sans, fontSize: "12px", color: "#ec9b42" }}>Required to unlock sections below</span>
            }
          />
          {openSection === "voice" && (
            <div style={{ padding: "28px", borderBottom: "1px solid #e5e5e5" }}>
              <p style={{ fontFamily: sans, fontSize: "14px", color: "#555", margin: "0 0 24px", lineHeight: 1.6 }}>
                These two recordings are the foundation of everything. They capture the sound of you.
              </p>

              {(["name", "profile"] as const).map(type => {
                const done = voiceStatus[type] === "complete";
                const active = recordingType === type && isRecording;
                return (
                  <div key={type} style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "16px 20px", background: done ? "#f0faf4" : "#fafafa",
                    border: `1px solid ${done ? "#4fb07d" : "#e5e5e5"}`,
                    borderRadius: "6px", marginBottom: "12px",
                  }}>
                    <div>
                      <p style={{ fontFamily: sans, fontWeight: 700, fontSize: "14px", color: "#1a1a1a", margin: "0 0 4px" }}>
                        {type === "name" ? "Your name." : "The sound of you."}
                      </p>
                      <p style={{ fontFamily: sans, fontSize: "12px", color: "#9c9c9c", margin: 0 }}>
                        {type === "name"
                          ? "Say your full name, naturally, as if greeting someone you love."
                          : "Speak freely for 2–5 minutes. Tell us who you are in your own words."}
                      </p>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px", flexShrink: 0, marginLeft: "16px" }}>
                      {done && <span style={{ fontFamily: sans, fontSize: "13px", color: "#4fb07d" }}>✓ Saved</span>}
                      {active && (
                        <span style={{ fontFamily: sans, fontSize: "13px", color: "#ec9b42", fontVariantNumeric: "tabular-nums" }}>
                          ● {fmtTime(recordingMs)}
                        </span>
                      )}
                      {!active && !isRecording && (
                        <button
                          onClick={() => startRecording(type)}
                          style={{
                            fontFamily: sans, fontSize: "13px", fontWeight: 700,
                            padding: "8px 18px", borderRadius: "9999px",
                            background: done ? "#fff" : "#6a4d7d", color: done ? "#6a4d7d" : "#fff",
                            border: `1px solid #6a4d7d`, cursor: "pointer",
                          }}
                        >
                          {done ? "Re-record" : "Record"}
                        </button>
                      )}
                      {active && (
                        <button
                          onClick={stopRecording}
                          style={{
                            fontFamily: sans, fontSize: "13px", fontWeight: 700,
                            padding: "8px 18px", borderRadius: "9999px",
                            background: "#1a1a1a", color: "#fff",
                            border: "none", cursor: "pointer",
                          }}
                        >
                          Stop
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* ── YOU ──────────────────────────────────────────────────────────── */}
          <SectionHeader id="you" title="YOU" pct={progress.you_pct} locked={!voiceDone}
            badge={!voiceDone ? <LockBadge /> : undefined}
          />
          {openSection === "you" && voiceDone && (
            <div style={{ padding: "20px 28px", borderBottom: "1px solid #e5e5e5" }}>
              <p style={{ fontFamily: sans, fontSize: "14px", color: "#555", margin: "0 0 20px", lineHeight: 1.6 }}>
                Eight dimensions of who you are. Open each one to add memories, thoughts, and entries.
              </p>
              {YOU_DIMENSIONS.map(dim => (
                <div key={dim.slug} style={{ marginBottom: "8px", border: "1px solid #e5e5e5", borderRadius: "6px", overflow: "hidden" }}>
                  <div
                    onClick={() => {
                      if (openDim !== dim.slug) loadDimEntries(dim.slug);
                      setOpenDim(d => d === dim.slug ? null : dim.slug);
                      setDimText("");
                    }}
                    style={{
                      padding: "14px 18px", cursor: "pointer", display: "flex",
                      justifyContent: "space-between", alignItems: "center",
                      background: openDim === dim.slug ? "#f7f4ef" : "#fff",
                    }}
                  >
                    <div>
                      <span style={{ fontFamily: sans, fontWeight: 700, fontSize: "13px", color: "#6a4d7d" }}>{dim.label.toUpperCase()}</span>
                      {openDim !== dim.slug && (
                        <p style={{ fontFamily: sans, fontSize: "12px", color: "#9c9c9c", margin: "3px 0 0" }}>{dim.hint}</p>
                      )}
                    </div>
                    <span style={{ color: "#6a4d7d" }}>{openDim === dim.slug ? "−" : "+"}</span>
                  </div>
                  {openDim === dim.slug && (
                    <div style={{ padding: "16px 18px", borderTop: "1px solid #e5e5e5", background: "#fff" }}>
                      <p style={{ fontFamily: sans, fontSize: "13px", color: "#555", margin: "0 0 16px" }}>{dim.hint}</p>

                      {(dimEntries[dim.slug] ?? []).map(entry => (
                        <div key={entry.id} style={{
                          display: "flex", justifyContent: "space-between", alignItems: "flex-start",
                          padding: "10px 12px", background: "#f7f4ef", borderRadius: "4px", marginBottom: "8px",
                        }}>
                          <p style={{ fontFamily: sans, fontSize: "14px", color: "#1a1a1a", margin: 0, flex: 1, lineHeight: 1.5 }}>{entry.body}</p>
                          <button onClick={() => deleteDimEntry(dim.slug, entry.id)}
                            style={{ background: "none", border: "none", color: "#9c9c9c", cursor: "pointer", fontSize: "16px", marginLeft: "12px", flexShrink: 0 }}>
                            ×
                          </button>
                        </div>
                      ))}

                      <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
                        <textarea
                          value={dimText}
                          onChange={e => setDimText(e.target.value)}
                          placeholder="Add a memory, thought, or reflection…"
                          rows={3}
                          style={{
                            flex: 1, fontFamily: sans, fontSize: "14px", padding: "10px 12px",
                            border: "1px solid #e5e5e5", borderRadius: "6px", resize: "vertical",
                            outline: "none",
                          }}
                        />
                        <button
                          onClick={() => addDimEntry(dim.slug)}
                          disabled={dimSaving || !dimText.trim()}
                          style={{
                            fontFamily: sans, fontSize: "13px", fontWeight: 700,
                            padding: "0 18px", borderRadius: "6px",
                            background: "#6a4d7d", color: "#fff", border: "none",
                            cursor: dimSaving || !dimText.trim() ? "not-allowed" : "pointer",
                            opacity: dimSaving || !dimText.trim() ? 0.5 : 1,
                            alignSelf: "flex-start", height: "40px", marginTop: "2px",
                          }}
                        >
                          Add
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* ── YOUR LIFE ─────────────────────────────────────────────────────── */}
          <SectionHeader id="life" title="YOUR LIFE" pct={progress.your_life_pct} locked={!voiceDone}
            badge={!voiceDone ? <LockBadge /> : undefined}
          />
          {openSection === "life" && voiceDone && (
            <div style={{ borderBottom: "1px solid #e5e5e5" }}>
              {/* Tabs */}
              <div style={{ display: "flex", borderBottom: "1px solid #e5e5e5" }}>
                {(["people", "years", "places"] as const).map(tab => (
                  <button key={tab} onClick={() => setOpenLifeTab(tab)} style={{
                    fontFamily: sans, fontWeight: 700, fontSize: "12px", letterSpacing: "0.06em",
                    padding: "12px 20px", border: "none", background: "none", cursor: "pointer",
                    color: openLifeTab === tab ? "#6a4d7d" : "#9c9c9c",
                    borderBottom: openLifeTab === tab ? "2px solid #6a4d7d" : "2px solid transparent",
                  }}>
                    {tab.toUpperCase()}
                  </button>
                ))}
              </div>

              <div style={{ padding: "20px 28px" }}>
                {/* People */}
                {openLifeTab === "people" && (
                  <div>
                    {people.map(p => (
                      <div key={p.id} style={{
                        display: "flex", justifyContent: "space-between", alignItems: "center",
                        padding: "10px 12px", background: "#f7f4ef", borderRadius: "4px", marginBottom: "8px",
                      }}>
                        <div>
                          <span style={{ fontFamily: sans, fontWeight: 700, fontSize: "14px", color: "#1a1a1a" }}>{p.name}</span>
                          {p.role && <span style={{ fontFamily: sans, fontSize: "13px", color: "#9c9c9c", marginLeft: "8px" }}>{p.role}</span>}
                        </div>
                        <button onClick={() => deletePerson(p.id)} style={{ background: "none", border: "none", color: "#9c9c9c", cursor: "pointer", fontSize: "16px" }}>×</button>
                      </div>
                    ))}
                    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginTop: "12px" }}>
                      <input placeholder="Name" value={personForm.name} onChange={e => setPersonForm(f => ({ ...f, name: e.target.value }))}
                        style={{ fontFamily: sans, fontSize: "14px", padding: "8px 12px", border: "1px solid #e5e5e5", borderRadius: "6px", flex: "1 1 140px" }} />
                      <input placeholder="Role (e.g. mother)" value={personForm.role} onChange={e => setPersonForm(f => ({ ...f, role: e.target.value }))}
                        style={{ fontFamily: sans, fontSize: "14px", padding: "8px 12px", border: "1px solid #e5e5e5", borderRadius: "6px", flex: "1 1 140px" }} />
                      <button onClick={addPerson} style={{ fontFamily: sans, fontSize: "13px", fontWeight: 700, padding: "8px 18px", borderRadius: "6px", background: "#6a4d7d", color: "#fff", border: "none", cursor: "pointer" }}>Add</button>
                    </div>
                  </div>
                )}

                {/* Years */}
                {openLifeTab === "years" && (
                  <div>
                    {years.map(y => (
                      <div key={y.id} style={{
                        display: "flex", justifyContent: "space-between", alignItems: "flex-start",
                        padding: "10px 12px", background: "#f7f4ef", borderRadius: "4px", marginBottom: "8px",
                      }}>
                        <div>
                          {y.year && <span style={{ fontFamily: sans, fontWeight: 700, fontSize: "13px", color: "#6a4d7d", marginRight: "8px" }}>{y.year}</span>}
                          <span style={{ fontFamily: sans, fontSize: "14px", color: "#1a1a1a" }}>{y.title}</span>
                          {y.body && <p style={{ fontFamily: sans, fontSize: "13px", color: "#555", margin: "4px 0 0" }}>{y.body}</p>}
                        </div>
                        <button onClick={() => deleteYear(y.id)} style={{ background: "none", border: "none", color: "#9c9c9c", cursor: "pointer", fontSize: "16px", flexShrink: 0 }}>×</button>
                      </div>
                    ))}
                    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginTop: "12px" }}>
                      <input placeholder="Year (optional)" type="number" value={yearForm.year} onChange={e => setYearForm(f => ({ ...f, year: e.target.value }))}
                        style={{ fontFamily: sans, fontSize: "14px", padding: "8px 12px", border: "1px solid #e5e5e5", borderRadius: "6px", width: "100px" }} />
                      <input placeholder="Title or event" value={yearForm.title} onChange={e => setYearForm(f => ({ ...f, title: e.target.value }))}
                        style={{ fontFamily: sans, fontSize: "14px", padding: "8px 12px", border: "1px solid #e5e5e5", borderRadius: "6px", flex: "1 1 200px" }} />
                      <input placeholder="Details (optional)" value={yearForm.body} onChange={e => setYearForm(f => ({ ...f, body: e.target.value }))}
                        style={{ fontFamily: sans, fontSize: "14px", padding: "8px 12px", border: "1px solid #e5e5e5", borderRadius: "6px", flex: "1 1 200px" }} />
                      <button onClick={addYear} style={{ fontFamily: sans, fontSize: "13px", fontWeight: 700, padding: "8px 18px", borderRadius: "6px", background: "#6a4d7d", color: "#fff", border: "none", cursor: "pointer" }}>Add</button>
                    </div>
                  </div>
                )}

                {/* Places */}
                {openLifeTab === "places" && (
                  <div>
                    {places.map(p => (
                      <div key={p.id} style={{
                        display: "flex", justifyContent: "space-between", alignItems: "flex-start",
                        padding: "10px 12px", background: "#f7f4ef", borderRadius: "4px", marginBottom: "8px",
                      }}>
                        <div>
                          <span style={{ fontFamily: sans, fontWeight: 700, fontSize: "14px", color: "#1a1a1a" }}>{p.name}</span>
                          {p.why && <p style={{ fontFamily: sans, fontSize: "13px", color: "#555", margin: "4px 0 0" }}>{p.why}</p>}
                        </div>
                        <button onClick={() => deletePlace(p.id)} style={{ background: "none", border: "none", color: "#9c9c9c", cursor: "pointer", fontSize: "16px", flexShrink: 0 }}>×</button>
                      </div>
                    ))}
                    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginTop: "12px" }}>
                      <input placeholder="Place name" value={placeForm.name} onChange={e => setPlaceForm(f => ({ ...f, name: e.target.value }))}
                        style={{ fontFamily: sans, fontSize: "14px", padding: "8px 12px", border: "1px solid #e5e5e5", borderRadius: "6px", flex: "1 1 200px" }} />
                      <input placeholder="Why it matters (optional)" value={placeForm.why} onChange={e => setPlaceForm(f => ({ ...f, why: e.target.value }))}
                        style={{ fontFamily: sans, fontSize: "14px", padding: "8px 12px", border: "1px solid #e5e5e5", borderRadius: "6px", flex: "1 1 200px" }} />
                      <button onClick={addPlace} style={{ fontFamily: sans, fontSize: "13px", fontWeight: 700, padding: "8px 18px", borderRadius: "6px", background: "#6a4d7d", color: "#fff", border: "none", cursor: "pointer" }}>Add</button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── FOR KEEPER ────────────────────────────────────────────────────── */}
          <SectionHeader id="keeper" title="FOR YOUR KEEPER" pct={progress.for_keeper_pct} />
          {openSection === "keeper" && (
            <div style={{ padding: "20px 28px" }}>
              <p style={{ fontFamily: sans, fontSize: "14px", color: "#555", margin: "0 0 24px", lineHeight: 1.6 }}>
                Words written directly for the person who will receive your legacy.
              </p>

              {/* Welcome message */}
              <div style={{ marginBottom: "28px" }}>
                <p style={{ fontFamily: sans, fontWeight: 700, fontSize: "13px", color: "#6a4d7d", margin: "0 0 8px", letterSpacing: "0.06em" }}>WELCOME MESSAGE</p>
                <textarea
                  value={welcomeBody}
                  onChange={e => setWelcomeBody(e.target.value)}
                  placeholder="Write the first thing they'll read when they gain access…"
                  rows={5}
                  style={{ width: "100%", fontFamily: sans, fontSize: "14px", padding: "12px", border: "1px solid #e5e5e5", borderRadius: "6px", resize: "vertical", boxSizing: "border-box" }}
                />
                <button onClick={saveWelcome} style={{ fontFamily: sans, fontSize: "13px", fontWeight: 700, marginTop: "8px", padding: "8px 18px", borderRadius: "9999px", background: "#6a4d7d", color: "#fff", border: "none", cursor: "pointer" }}>Save</button>
              </div>

              {/* For-when messages */}
              <div style={{ marginBottom: "28px" }}>
                <p style={{ fontFamily: sans, fontWeight: 700, fontSize: "13px", color: "#6a4d7d", margin: "0 0 8px", letterSpacing: "0.06em" }}>FOR WHEN…</p>
                {messages.filter(m => m.type === "for_when").map(m => (
                  <div key={m.id} style={{ padding: "12px", background: "#f7f4ef", borderRadius: "6px", marginBottom: "8px", display: "flex", justifyContent: "space-between" }}>
                    <div>
                      {m.trigger && <p style={{ fontFamily: sans, fontSize: "12px", color: "#6a4d7d", fontWeight: 700, margin: "0 0 4px" }}>For when {m.trigger}</p>}
                      <p style={{ fontFamily: sans, fontSize: "14px", color: "#1a1a1a", margin: 0 }}>{m.body}</p>
                    </div>
                    <button onClick={() => deleteMessage(m.id)} style={{ background: "none", border: "none", color: "#9c9c9c", cursor: "pointer", fontSize: "16px", marginLeft: "12px", flexShrink: 0 }}>×</button>
                  </div>
                ))}
                <input placeholder="Trigger (e.g. you feel lost)" value={forWhenTrigger} onChange={e => setForWhenTrigger(e.target.value)}
                  style={{ fontFamily: sans, fontSize: "14px", padding: "8px 12px", border: "1px solid #e5e5e5", borderRadius: "6px", width: "100%", boxSizing: "border-box", marginBottom: "8px" }} />
                <textarea placeholder="What you want them to know in that moment…" value={forWhenBody} onChange={e => setForWhenBody(e.target.value)} rows={3}
                  style={{ fontFamily: sans, fontSize: "14px", padding: "10px 12px", border: "1px solid #e5e5e5", borderRadius: "6px", width: "100%", boxSizing: "border-box", resize: "vertical" }} />
                <button onClick={addForWhen} style={{ fontFamily: sans, fontSize: "13px", fontWeight: 700, marginTop: "8px", padding: "8px 18px", borderRadius: "9999px", background: "#6a4d7d", color: "#fff", border: "none", cursor: "pointer" }}>Add message</button>
              </div>

              {/* Keeper profile */}
              <div>
                <p style={{ fontFamily: sans, fontWeight: 700, fontSize: "13px", color: "#6a4d7d", margin: "0 0 16px", letterSpacing: "0.06em" }}>ABOUT YOUR KEEPER</p>
                {([
                  { key: "who_they_are", label: "Who they are" },
                  { key: "who_theyre_becoming", label: "Who they're becoming" },
                  { key: "what_you_want", label: "What you want for them" },
                  { key: "what_you_want_known", label: "What you want them to know" },
                  { key: "advice", label: "Advice" },
                ] as const).map(({ key, label }) => (
                  <div key={key} style={{ marginBottom: "16px" }}>
                    <label style={{ fontFamily: sans, fontSize: "12px", color: "#9c9c9c", display: "block", marginBottom: "4px" }}>{label}</label>
                    <textarea
                      value={keeperProfile[key] ?? ""}
                      onChange={e => setKeeperProfile(p => ({ ...p, [key]: e.target.value }))}
                      rows={3}
                      style={{ width: "100%", fontFamily: sans, fontSize: "14px", padding: "10px 12px", border: "1px solid #e5e5e5", borderRadius: "6px", resize: "vertical", boxSizing: "border-box" }}
                    />
                  </div>
                ))}
                <button onClick={saveKeeperProfile} style={{ fontFamily: sans, fontSize: "13px", fontWeight: 700, padding: "8px 18px", borderRadius: "9999px", background: "#6a4d7d", color: "#fff", border: "none", cursor: "pointer" }}>Save all</button>
              </div>
            </div>
          )}

        </div>
      </main>

      <Footer />
    </div>
  );
}
