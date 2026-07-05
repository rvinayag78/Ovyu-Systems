"use client";

import type { CSSProperties } from "react";
import { useState } from "react";
import { tokens } from "@/styles/tokens";

const serif = tokens.font.serif;
const sans = tokens.font.sans;
const PURPLE = tokens.color.lavender;
const LILAC = tokens.color.lavenderFill;

export type EntryTags = { people?: string[]; year?: string | null; place?: string | null; what_happened?: string | null; when?: string | null; call_them?: string | null; full_name?: string | null };
export type EditableEntry = {
  id: string;
  title?: string;
  body: string;
  entry_type: string;
  tags?: EntryTags;
  created_at: string;
};

/**
 * Entry editor modal (Flow 2 spec §D). Shared by text and voice entries.
 * Lets the Maker correct the title, body (text), the three tags
 * (People / Year / Place), and the structured prompts that feed triangulation.
 */
export function EntryEditor({
  entry,
  onSave,
  onClose,
  saving,
}: {
  entry: EditableEntry;
  onSave: (patch: { title: string; body: string; tags: EntryTags }) => void;
  onClose: () => void;
  saving: boolean;
}) {
  const [title, setTitle] = useState(entry.title ?? "");
  const [body, setBody] = useState(entry.body);
  const [people, setPeople] = useState<string[]>(entry.tags?.people ?? []);
  const [year, setYear] = useState<string>(entry.tags?.year ?? "");
  const [place, setPlace] = useState<string>(entry.tags?.place ?? "");

  // structured prompt inputs
  const [callThem, setCallThem] = useState("");
  const [fullName, setFullName] = useState("");
  const [whatHappened, setWhatHappened] = useState("");
  const [when, setWhen] = useState("");

  const isVoice = entry.entry_type === "voice";
  const created = new Date(entry.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  function addPerson() {
    const name = (fullName || callThem).trim();
    if (name && !people.some(p => p.toLowerCase() === name.toLowerCase())) {
      setPeople([...people, name]);
    }
    setCallThem(""); setFullName("");
  }
  function applyTime() {
    const y = /\b(\d{4})\b/.exec(when)?.[1];
    if (y) setYear(y);
    if (whatHappened.trim() && !title.trim()) setTitle(whatHappened.trim());
  }

  function save() {
    applyTime();
    const y = /\b(\d{4})\b/.exec(when)?.[1] ?? year;
    onSave({
      title: title.trim(),
      body: body,
      tags: { people, year: y || null, place: place.trim() || null },
    });
  }

  return (
    <div onClick={onClose} style={{
      position: "fixed", inset: 0, zIndex: 200, background: "rgba(26,26,26,0.45)",
      display: "flex", alignItems: "flex-start", justifyContent: "center", overflowY: "auto", padding: "60px 20px",
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        width: "820px", maxWidth: "100%", background: "#f8f7f5", borderRadius: "14px",
        padding: "36px 40px 40px", boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "6px" }}>
          <p style={{ fontFamily: sans, fontWeight: 700, fontSize: "16px", color: PURPLE, margin: 0, letterSpacing: "0.04em" }}>ENTRY</p>
          <button onClick={onClose} style={{ background: "none", border: "none", fontSize: "24px", color: "#888", cursor: "pointer", lineHeight: 1 }}>×</button>
        </div>

        <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Title"
          style={{ width: "100%", fontFamily: serif, fontWeight: 700, fontSize: "24px", color: "#1a1a1a", border: "none", background: "transparent", outline: "none", padding: 0, marginBottom: "4px", boxSizing: "border-box" }} />
        <p style={{ fontFamily: sans, fontSize: "14px", color: "#bababa", margin: "0 0 16px" }}>
          {isVoice ? "Voice" : "Text"} · {created}
        </p>

        {/* Tag chips */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "20px" }}>
          {people.map((p, i) => (
            <Chip key={`p${i}`} label={p} onRemove={() => setPeople(people.filter((_, j) => j !== i))} />
          ))}
          {year && <Chip label={year} onRemove={() => setYear("")} />}
          {place && <Chip label={place} onRemove={() => setPlace("")} />}
          {people.length === 0 && !year && !place && (
            <span style={{ fontFamily: sans, fontStyle: "italic", fontSize: "14px", color: "#bababa" }}>No tags yet — add them below.</span>
          )}
        </div>

        {/* Body */}
        {isVoice ? (
          <div style={{ background: "white", border: "1.5px solid #ddd6c6", borderRadius: "10px", padding: "16px", marginBottom: "24px" }}>
            <p style={{ fontFamily: sans, fontSize: "13px", color: "#888", margin: "0 0 8px", textTransform: "uppercase", letterSpacing: "0.05em" }}>Transcript</p>
            <textarea value={body} onChange={e => setBody(e.target.value)} placeholder="Transcript will appear here once processed."
              style={{ width: "100%", minHeight: "120px", border: "none", outline: "none", resize: "vertical", fontFamily: sans, fontSize: "16px", lineHeight: 1.6, background: "transparent", boxSizing: "border-box" }} />
          </div>
        ) : (
          <textarea value={body} onChange={e => setBody(e.target.value)}
            style={{ width: "100%", minHeight: "160px", padding: "16px", borderRadius: "10px", border: "1.5px solid #ddd6c6", fontFamily: sans, fontSize: "16px", lineHeight: 1.6, resize: "vertical", background: "white", boxSizing: "border-box", marginBottom: "24px" }} />
        )}

        {/* Structured prompts */}
        <p style={{ fontFamily: serif, fontStyle: "italic", fontSize: "18px", color: "#1a1a1a", margin: "0 0 10px" }}>Someone worth naming?</p>
        <div style={{ display: "flex", gap: "16px", marginBottom: "8px" }}>
          <Field label="WHAT YOU CALL THEM" value={callThem} onChange={setCallThem} hint="Mum • Auntie N • Whatever you actually say" />
          <Field label="FULL NAME" value={fullName} onChange={setFullName} hint="First and last, if you know it." />
        </div>
        <button onClick={addPerson} style={addBtn()}>+ Add person</button>

        <p style={{ fontFamily: serif, fontStyle: "italic", fontSize: "18px", color: "#1a1a1a", margin: "24px 0 10px" }}>A time that mattered?</p>
        <div style={{ display: "flex", gap: "16px", marginBottom: "8px" }}>
          <Field label="WHAT HAPPENED" value={whatHappened} onChange={setWhatHappened} hint="Born · Moved · Married · A child arrived · Someone left" />
          <Field label="WHEN" value={when} onChange={setWhen} hint="A day, a month, a year, or a span. e.g. 2003 · 2015 to 2019" />
        </div>

        {/* Add place inline */}
        <p style={{ fontFamily: serif, fontStyle: "italic", fontSize: "18px", color: "#1a1a1a", margin: "24px 0 10px" }}>Where did it happen?</p>
        <Field label="PLACE" value={place} onChange={setPlace} hint="City, Country" />

        <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "28px" }}>
          <button onClick={onClose} disabled={saving} style={{ fontFamily: sans, fontSize: "16px", color: "#888", background: "none", border: "none", cursor: "pointer" }}>Cancel</button>
          <button onClick={save} disabled={saving} style={{
            fontFamily: sans, fontWeight: 700, fontSize: "18px", color: "#f5f0e8", background: PURPLE,
            border: "none", borderRadius: "10px", padding: "14px 36px", cursor: "pointer", opacity: saving ? 0.5 : 1,
          }}>{saving ? "Saving…" : "Save"}</button>
        </div>
      </div>
    </div>
  );
}

function Chip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: LILAC, color: PURPLE, fontFamily: sans, fontSize: "14px", padding: "6px 12px", borderRadius: "999px" }}>
      {label}
      <button onClick={onRemove} style={{ background: "none", border: "none", color: PURPLE, cursor: "pointer", fontSize: "16px", lineHeight: 1, padding: 0 }}>×</button>
    </span>
  );
}

function Field({ label, value, onChange, hint }: { label: string; value: string; onChange: (v: string) => void; hint: string }) {
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "6px" }}>
      <label style={{ fontFamily: sans, fontWeight: 700, fontSize: "12px", color: "#888", letterSpacing: "0.05em" }}>{label}</label>
      <input value={value} onChange={e => onChange(e.target.value)}
        style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", border: "1px solid #ccc", fontFamily: sans, fontSize: "15px", boxSizing: "border-box" }} />
      <span style={{ fontFamily: sans, fontStyle: "italic", fontSize: "12px", color: "#bababa" }}>{hint}</span>
    </div>
  );
}

function addBtn(): CSSProperties {
  return { alignSelf: "flex-start", fontFamily: sans, fontSize: "15px", color: PURPLE, background: "none", border: "none", cursor: "pointer", padding: 0 };
}
