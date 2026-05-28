"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/Header";
import { api } from "@/lib/api";

const serif = "Georgia, serif";
const sans = "Helvetica Neue, Helvetica, Arial, sans-serif";

const DIMENSIONS = [
  { slug: "history", label: "History", sub: "Childhood, schools, milestones, the turning points." },
  { slug: "relationships", label: "Relationships", sub: "The people who shaped you, how you love, how you fight." },
  { slug: "how-you-think", label: "How you think", sub: "How you decide, process, land on answers." },
  { slug: "how-you-talk", label: "How you talk", sub: "Catchphrases, inside jokes, the way you say things." },
  { slug: "how-you-live", label: "How you live", sub: "Habits, rituals, the texture of your daily life." },
  { slug: "beliefs", label: "Beliefs", sub: "What you believe, what you'd stand up for. Your worldview and ideologies." },
  { slug: "heart", label: "Heart", sub: "What moves you. What you love, what you can't stand, what lights you up." },
];

const PROMPTS: Record<string, string[]> = {
  history: [
    "What's the earliest memory you can recall?",
    "What was school like for you?",
    "Describe the home you grew up in.",
    "What was the most important turning point in your life?",
    "Who was your biggest influence growing up?",
  ],
  relationships: [
    "Who knows you best, and why?",
    "How do you show love?",
    "What does loyalty mean to you?",
    "Describe a friendship that changed you.",
    "How do you handle conflict with people you care about?",
  ],
  "how-you-think": [
    "How do you make a hard decision?",
    "What do you do when you're stuck?",
    "How do you know when you're right about something?",
    "What's a belief you hold that most people don't?",
    "How do you process information — instinct or analysis?",
  ],
  "how-you-talk": [
    "What phrase do you say so often people tease you for it?",
    "What's an inside joke only your close people would get?",
    "How would someone describe the way you speak?",
    "What slang or words are uniquely yours?",
    "What's a saying you live by?",
  ],
  "how-you-live": [
    "What does a typical Tuesday look like for you?",
    "What ritual do you never skip?",
    "What do you do when you need to recharge?",
    "What's something small that makes your day better?",
    "What does your home say about you?",
  ],
  beliefs: [
    "What do you believe that you'd argue for?",
    "How has your faith or worldview changed over time?",
    "What's something you used to believe that you no longer do?",
    "What's sacred to you?",
    "If you could change one thing about the world, what would it be?",
  ],
  heart: [
    "What makes you cry — in a good way?",
    "What can you not stand?",
    "What lights you up from the inside?",
    "What beauty do you see that others miss?",
    "What would you do every day if you could?",
  ],
};

const HISTORY_FIELDS = [
  { key: "full_name", label: "Full name", multi: false },
  { key: "goes_by", label: "Goes by", multi: false },
  { key: "dob", label: "Date of birth", multi: false },
  { key: "place_of_birth", label: "Place of birth", multi: false },
  { key: "where_from", label: "Where you're from", multi: true },
  { key: "homes", label: "Homes", multi: true },
  { key: "parents", label: "Parents", multi: true },
  { key: "siblings", label: "Siblings", multi: true },
  { key: "partners", label: "Partners", multi: true },
  { key: "children", label: "Children", multi: true },
  { key: "languages", label: "Languages", multi: true },
];

type Entry = { id: string; title?: string; body: string; entry_type: string; tags?: Record<string, string[]>; created_at: string };
type DimData = { id: string; slug: string; structured: Record<string, unknown> | null; entries: Entry[] };

function BottomNav({ contractId, current }: { contractId: string; current: string }) {
  return (
    <div style={{
      position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 50,
      background: "white", borderTop: "3px solid #bababa",
    }}>
      {/* YOU bar */}
      <div style={{
        height: "56px", display: "flex", alignItems: "center",
        padding: "0 50px", gap: "24px",
      }}>
        <span style={{ fontFamily: sans, fontWeight: 700, fontSize: "16px", color: "#1a1a1a", textTransform: "uppercase", marginRight: "8px" }}>You</span>
        <Link href={`/upload/${contractId}`} style={{ fontFamily: sans, fontSize: "16px", color: "#888", textDecoration: "none" }}>Voice</Link>
        {DIMENSIONS.map((d, i, arr) => (
          <span key={d.slug} style={{ display: "flex", alignItems: "center", gap: "24px" }}>
            <Link href={`/upload/${contractId}/${d.slug}`} style={{
              fontFamily: sans, fontWeight: d.slug === current ? 700 : 400,
              fontSize: "16px",
              color: d.slug === current ? "#6a4d7d" : "#888",
              textDecoration: "none",
            }}>{d.label}</Link>
            {i < arr.length - 1 && <span style={{ width: "4px", height: "4px", borderRadius: "50%", background: "#bababa", display: "inline-block" }} />}
          </span>
        ))}
      </div>
      {/* YOUR LIFE bar */}
      <div style={{
        height: "44px", display: "flex", alignItems: "center",
        padding: "0 50px", gap: "24px",
        borderTop: "1px solid #e0ddd9",
      }}>
        <span style={{ fontFamily: sans, fontWeight: 700, fontSize: "14px", color: "#1a1a1a", textTransform: "uppercase", marginRight: "8px" }}>Your life</span>
        {["people", "years", "places"].map((key, i, arr) => (
          <span key={key} style={{ display: "flex", alignItems: "center", gap: "24px" }}>
            <Link href={`/upload/${contractId}/life/${key}`} style={{ fontFamily: sans, fontSize: "14px", color: "#888", textDecoration: "none", textTransform: "capitalize" }}>{key}</Link>
            {i < arr.length - 1 && <span style={{ width: "4px", height: "4px", borderRadius: "50%", background: "#bababa", display: "inline-block" }} />}
          </span>
        ))}
      </div>
    </div>
  );
}

function HistoryForm({ contractId, dimension, onSaved }: { contractId: string; dimension: string; onSaved: (structured: Record<string, unknown>) => void }) {
  const [form, setForm] = useState<Record<string, string | string[]>>({});
  const [saving, setSaving] = useState(false);

  function setField(key: string, value: string | string[]) {
    setForm(prev => ({ ...prev, [key]: value }));
  }

  function addMulti(key: string) {
    const arr = (form[key] as string[] | undefined) ?? [];
    setField(key, [...arr, ""]);
  }

  function setMultiItem(key: string, idx: number, val: string) {
    const arr = [...((form[key] as string[] | undefined) ?? [])];
    arr[idx] = val;
    setField(key, arr);
  }

  async function handleSave() {
    setSaving(true);
    try {
      const cleaned: Record<string, unknown> = {};
      for (const [k, v] of Object.entries(form)) {
        if (Array.isArray(v)) {
          const filtered = v.filter(s => s.trim());
          if (filtered.length) cleaned[k] = filtered;
        } else if (v.trim()) {
          cleaned[k] = v;
        }
      }
      await api.upsertDimension(contractId, dimension, cleaned);
      onSaved(cleaned);
    } finally { setSaving(false); }
  }

  return (
    <div style={{ width: "1702px", margin: "0 auto", paddingTop: "60px", paddingBottom: "160px" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "40px" }}>
        <Link href={`/upload/${contractId}`} style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none" }}>
          <span style={{ fontFamily: sans, fontSize: "16px", color: "#888", display: "inline-block", transform: "scaleX(-1)" }}>›</span>
          <span style={{ fontFamily: sans, fontSize: "16px", color: "#888" }}>Upload hub</span>
        </Link>
        <h1 style={{ fontFamily: serif, fontStyle: "italic", fontWeight: 400, fontSize: "64px", color: "#1a1a1a", margin: "20px 0 0" }}>History</h1>
        <p style={{ fontFamily: sans, fontStyle: "italic", fontSize: "22px", color: "#888", margin: 0 }}>
          Start with the facts. You can add stories after.
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "32px", maxWidth: "760px" }}>
        {HISTORY_FIELDS.map(field => {
          const val = form[field.key];
          const arr = (val as string[] | undefined) ?? [];
          return (
            <div key={field.key} style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <label style={{ fontFamily: sans, fontWeight: 700, fontSize: "16px", color: "#1a1a1a" }}>{field.label}</label>
              {field.multi ? (
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {arr.map((item, idx) => (
                    <input key={idx} value={item} onChange={e => setMultiItem(field.key, idx, e.target.value)}
                      style={{ width: "100%", padding: "12px 16px", borderRadius: "8px", border: "1px solid #ccc", fontFamily: sans, fontSize: "16px", boxSizing: "border-box" }}
                      placeholder={field.label} />
                  ))}
                  <button onClick={() => addMulti(field.key)} style={{
                    alignSelf: "flex-start", fontFamily: sans, fontSize: "15px", color: "#6a4d7d",
                    background: "none", border: "none", cursor: "pointer", padding: 0,
                  }}>+ Add more</button>
                </div>
              ) : (
                <input value={(val as string) ?? ""} onChange={e => setField(field.key, e.target.value)}
                  style={{ width: "100%", padding: "12px 16px", borderRadius: "8px", border: "1px solid #ccc", fontFamily: sans, fontSize: "16px", boxSizing: "border-box" }}
                  placeholder={field.label} />
              )}
            </div>
          );
        })}

        <button onClick={handleSave} disabled={saving} style={{
          alignSelf: "flex-start", marginTop: "10px",
          fontFamily: sans, fontWeight: 700, fontSize: "18px", color: "#f5f0e8",
          background: "#1a1a1a", border: "none", borderRadius: "10px",
          padding: "16px 40px", cursor: "pointer", opacity: saving ? 0.6 : 1,
        }}>
          Save and continue →
        </button>
      </div>
    </div>
  );
}

function EntriesView({
  contractId,
  dim,
  data,
  onEntryAdded,
  onEntryDeleted,
  onEditStructured,
}: {
  contractId: string;
  dim: typeof DIMENSIONS[number];
  data: DimData;
  onEntryAdded: (e: Entry) => void;
  onEntryDeleted: (id: string) => void;
  onEditStructured: () => void;
}) {
  const prompts = PROMPTS[dim.slug] ?? [];
  const [promptIdx, setPromptIdx] = useState(0);
  const [body, setBody] = useState("");
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  function nextPrompt() { setPromptIdx(i => (i + 1) % prompts.length); }
  function prevPrompt() { setPromptIdx(i => (i - 1 + prompts.length) % prompts.length); }

  async function addEntry() {
    if (!body.trim()) return;
    setSaving(true);
    try {
      const e = await api.addDimensionEntry(contractId, dim.slug, { body: body.trim(), entry_type: "text" });
      onEntryAdded(e as Entry);
      setBody("");
    } finally { setSaving(false); }
  }

  async function deleteEntry(id: string) {
    setDeletingId(id);
    try {
      await api.deleteDimensionEntry(contractId, dim.slug, id);
      onEntryDeleted(id);
    } finally { setDeletingId(null); }
  }

  const structured = data.structured as Record<string, unknown> | null;

  return (
    <div style={{ minWidth: "1920px", background: "#f8f7f5" }}>
      {/* Banner */}
      <div style={{ background: "#efeaf2", padding: "40px 110px 32px" }}>
        <Link href={`/upload/${contractId}`} style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none", marginBottom: "24px" }}>
          <span style={{ fontFamily: sans, fontSize: "16px", color: "#6a4d7d", display: "inline-block", transform: "scaleX(-1)" }}>›</span>
          <span style={{ fontFamily: sans, fontSize: "16px", color: "#6a4d7d" }}>Upload hub</span>
        </Link>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <div>
            <h1 style={{ fontFamily: serif, fontStyle: "italic", fontWeight: 400, fontSize: "64px", color: "#1a1a1a", margin: "0 0 8px" }}>{dim.label}</h1>
            <p style={{ fontFamily: sans, fontStyle: "italic", fontSize: "20px", color: "#6a4d7d", margin: 0 }}>{dim.sub}</p>
          </div>
          {dim.slug === "history" && structured && Object.keys(structured).length > 0 && (
            <button onClick={onEditStructured} style={{
              fontFamily: sans, fontStyle: "italic", fontSize: "16px", color: "#6a4d7d",
              background: "none", border: "none", cursor: "pointer", textDecoration: "underline", padding: 0,
            }}>
              Edit facts
            </button>
          )}
        </div>
      </div>

      {/* History structured summary strip */}
      {dim.slug === "history" && structured && Object.keys(structured).length > 0 && (
        <div style={{ background: "#f7f4ef", borderBottom: "1.5px solid #ddd6c6", padding: "20px 110px", display: "flex", gap: "40px", flexWrap: "wrap" }}>
          {HISTORY_FIELDS.filter(f => structured[f.key]).map(f => (
            <div key={f.key} style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              <span style={{ fontFamily: sans, fontWeight: 700, fontSize: "12px", color: "#888", textTransform: "uppercase", letterSpacing: "0.05em" }}>{f.label}</span>
              <span style={{ fontFamily: sans, fontSize: "15px", color: "#1a1a1a" }}>
                {Array.isArray(structured[f.key])
                  ? (structured[f.key] as string[]).join(", ")
                  : String(structured[f.key])}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Main content */}
      <div style={{ display: "flex", padding: "40px 110px 180px", gap: "60px" }}>
        {/* Left: Entries */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "16px" }}>
          <p style={{ fontFamily: sans, fontWeight: 700, fontSize: "18px", color: "#6a4d7d", margin: 0 }}>ENTRIES</p>
          {data.entries.length === 0 ? (
            <p style={{ fontFamily: sans, fontStyle: "italic", fontSize: "18px", color: "#888", margin: 0 }}>
              Nothing yet. Add your first entry →
            </p>
          ) : (
            data.entries.map(entry => (
              <div key={entry.id} style={{
                background: "#f7f4ef", border: "1.5px solid #ddd6c6", borderRadius: "10px",
                padding: "24px 28px", position: "relative",
              }}>
                {entry.title && (
                  <p style={{ fontFamily: serif, fontWeight: 700, fontSize: "18px", color: "#1a1a1a", margin: "0 0 8px" }}>{entry.title}</p>
                )}
                <p style={{ fontFamily: sans, fontSize: "16px", color: "#1a1a1a", margin: 0, lineHeight: "1.6", whiteSpace: "pre-wrap" }}>{entry.body}</p>
                <p style={{ fontFamily: sans, fontSize: "13px", color: "#bababa", margin: "12px 0 0" }}>
                  {new Date(entry.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                </p>
                <button onClick={() => deleteEntry(entry.id)} disabled={deletingId === entry.id} style={{
                  position: "absolute", top: "16px", right: "16px",
                  fontFamily: sans, fontSize: "13px", color: "#bababa",
                  background: "none", border: "none", cursor: "pointer", padding: 0,
                  opacity: deletingId === entry.id ? 0.4 : 1,
                }}>
                  Remove
                </button>
              </div>
            ))
          )}
        </div>

        {/* Right: Add entry */}
        <div style={{ width: "620px", flexShrink: 0, display: "flex", flexDirection: "column", gap: "20px" }}>
          <p style={{ fontFamily: sans, fontWeight: 700, fontSize: "18px", color: "#6a4d7d", margin: 0 }}>ADD AN ENTRY</p>

          {/* Prompt carousel */}
          {prompts.length > 0 && (
            <div style={{
              background: "#efeaf2", borderRadius: "10px", padding: "20px 24px",
              display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px",
            }}>
              <button onClick={prevPrompt} style={{ fontFamily: sans, fontSize: "20px", color: "#6a4d7d", background: "none", border: "none", cursor: "pointer", padding: "0 8px" }}>‹</button>
              <p style={{ fontFamily: sans, fontStyle: "italic", fontSize: "16px", color: "#1a1a1a", margin: 0, flex: 1, textAlign: "center" }}>
                {prompts[promptIdx]}
              </p>
              <button onClick={nextPrompt} style={{ fontFamily: sans, fontSize: "20px", color: "#6a4d7d", background: "none", border: "none", cursor: "pointer", padding: "0 8px" }}>›</button>
            </div>
          )}

          <textarea
            value={body}
            onChange={e => setBody(e.target.value)}
            placeholder="Write here…"
            style={{
              width: "100%", minHeight: "200px", padding: "16px", borderRadius: "10px",
              border: "1.5px solid #ddd6c6", fontFamily: sans, fontSize: "16px",
              resize: "vertical", boxSizing: "border-box", background: "white",
              lineHeight: "1.6",
            }}
          />

          <button onClick={addEntry} disabled={saving || !body.trim()} style={{
            fontFamily: sans, fontWeight: 700, fontSize: "18px", color: "#f5f0e8",
            background: "#6a4d7d", border: "none", borderRadius: "10px",
            padding: "16px 40px", cursor: "pointer", alignSelf: "flex-start",
            opacity: saving || !body.trim() ? 0.5 : 1,
          }}>
            {saving ? "Saving…" : "Save entry"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function DimensionPage() {
  const { contractId, dimension } = useParams<{ contractId: string; dimension: string }>();
  const dim = DIMENSIONS.find(d => d.slug === dimension);
  const router = useRouter();

  const [data, setData] = useState<DimData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const initial = typeof window !== "undefined"
    ? (sessionStorage.getItem("ovyu_maker_name") ?? "")[0]?.toUpperCase() ?? "?"
    : "?";

  useEffect(() => {
    if (!dim) { router.replace(`/upload/${contractId}`); return; }
    api.getDimension(contractId, dimension)
      .then(d => {
        setData(d as DimData);
        if (dimension === "history" && !d.structured) setShowForm(true);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [contractId, dimension, dim, router]);

  const handleSaved = useCallback((structured: Record<string, unknown>) => {
    setData(prev => prev ? { ...prev, structured } : null);
    setShowForm(false);
  }, []);

  const handleEntryAdded = useCallback((e: Entry) => {
    setData(prev => prev ? { ...prev, entries: [e, ...prev.entries] } : null);
  }, []);

  const handleEntryDeleted = useCallback((id: string) => {
    setData(prev => prev ? { ...prev, entries: prev.entries.filter(e => e.id !== id) } : null);
  }, []);

  if (!dim) return null;

  return (
    <div style={{ minWidth: "1920px", background: "#f8f7f5", display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Header variant="loggedIn" initial={initial} />

      <div style={{ flex: 1, paddingTop: "78px" }}>
        {loading ? (
          <div style={{ width: "1702px", margin: "0 auto", paddingTop: "60px" }}>
            <p style={{ fontFamily: sans, fontSize: "18px", color: "#888" }}>Loading…</p>
          </div>
        ) : showForm && dimension === "history" ? (
          <HistoryForm contractId={contractId} dimension={dimension} onSaved={handleSaved} />
        ) : data ? (
          <EntriesView
            contractId={contractId}
            dim={dim}
            data={data}
            onEntryAdded={handleEntryAdded}
            onEntryDeleted={handleEntryDeleted}
            onEditStructured={() => setShowForm(true)}
          />
        ) : (
          <div style={{ width: "1702px", margin: "0 auto", paddingTop: "60px" }}>
            <p style={{ fontFamily: sans, fontSize: "18px", color: "#888" }}>Could not load dimension.</p>
          </div>
        )}
      </div>

      <BottomNav contractId={contractId} current={dimension} />
    </div>
  );
}
