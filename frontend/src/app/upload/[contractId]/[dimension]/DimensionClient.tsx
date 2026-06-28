"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import type { CSSProperties } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { YouBar } from "@/components/YouBar";
import { Typeahead } from "@/components/Typeahead";
import type { EntryTags } from "@/components/EntryEditor";
import { LANGUAGES, PLACES, isValidMMDDYYYY, maskMMDDYYYY } from "@/lib/refdata";
import { api } from "@/lib/api";

const serif = "Georgia, serif";
const sans = "Helvetica Neue, Helvetica, Arial, sans-serif";

const DIMENSIONS = [
  { slug: "history",       label: "History",       sub: "Childhood, schools, milestones, the turning points." },
  { slug: "relationships", label: "Relationships",  sub: "The people who shaped you, how you love, how you fight." },
  { slug: "how-you-think", label: "How you think",  sub: "How you decide, process, land on answers." },
  { slug: "how-you-talk",  label: "How you talk",   sub: "Catchphrases, inside jokes, the way you say things." },
  { slug: "how-you-live",  label: "How you live",   sub: "Habits, rituals, the texture of your daily life." },
  { slug: "beliefs",       label: "Beliefs",        sub: "What you believe, what you'd stand up for. Your worldview and ideologies." },
  { slug: "heart",         label: "Heart",          sub: "What moves you. What you love, what you can't stand, what lights you up." },
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

type FieldKind = "text" | "date" | "place" | "language";

type FormFieldDef = {
  key: string;
  label: string;
  placeholder: string;
  hint?: string;
  kind: FieldKind;
  multi: boolean;
};

type DimFormDef = {
  subtitle: string;
  col1: FormFieldDef[];
  col2: FormFieldDef[];
  col3: FormFieldDef[];
};

const DIMENSION_FORMS: Record<string, DimFormDef> = {
  history: {
    subtitle: "Where you come from. Who you come from.",
    col1: [
      { key: "full_name",      label: "Full name",        placeholder: "Your full name, exactly as you write it", kind: "text",     multi: false },
      { key: "goes_by",        label: "Goes by",          placeholder: "What people actually call you",           kind: "text",     multi: false },
      { key: "dob",            label: "Date of birth",    placeholder: "MM/DD/YYYY",                              kind: "date",     multi: false },
      { key: "place_of_birth", label: "Place of birth",   placeholder: "City, Country",                          kind: "place",    multi: false },
      { key: "where_from",     label: "Where you're from", placeholder: "Culture, ethnicity, the place that shaped you", kind: "text", multi: true },
      { key: "homes",          label: "Homes",            placeholder: "Where?",                                  kind: "place",    multi: true },
    ],
    col2: [
      { key: "parents",  label: "Parents",  placeholder: "Full name",  kind: "text", multi: true },
      { key: "siblings", label: "Siblings", placeholder: "Full name",  kind: "text", multi: true },
      { key: "partners", label: "Partners", placeholder: "Full name",  kind: "text", multi: true },
      { key: "children", label: "Children", placeholder: "Full name",  kind: "text", multi: true },
    ],
    col3: [
      { key: "languages", label: "Languages", placeholder: "Add a language", kind: "language", multi: true },
    ],
  },
  relationships: {
    subtitle: "How you are with the people in your life.",
    col1: [
      { key: "relationship_status",  label: "Relationship status",    placeholder: "Your answer", hint: "e.g., single, married, partnered, it's complicated",                kind: "text", multi: false },
      { key: "how_show_love",        label: "How you show love",      placeholder: "Your answer", hint: "e.g., words, time, gifts, touch, showing up",                       kind: "text", multi: false },
      { key: "how_handle_conflict",  label: "How you handle conflict", placeholder: "Your answer", hint: "e.g., talk it out, walk away, sit with it, push through",         kind: "text", multi: false },
    ],
    col2: [
      { key: "stand_on_family",      label: "Where you stand on family",      placeholder: "Your answer", hint: "e.g., close, distant, complicated, chosen",                          kind: "text", multi: false },
      { key: "stand_on_friendship",  label: "Where you stand on friendship",  placeholder: "Your answer", hint: "e.g., close, distant, complicated, chosen",                          kind: "text", multi: false },
      { key: "how_in_groups",        label: "How you are in groups",          placeholder: "Your answer", hint: "e.g., quiet observer, the one telling the story, fade in and out",   kind: "text", multi: false },
    ],
    col3: [
      { key: "where_refuel", label: "Where you refuel", placeholder: "Your answer", hint: "e.g., alone, with one person, in a crowd, on a walk", kind: "text", multi: false },
    ],
  },
  "how-you-think": {
    subtitle: "How you decide, process, land on answers.",
    col1: [
      { key: "how_decide",       label: "How you make decisions",         placeholder: "Your answer", hint: "e.g., gut first, research first, ask someone I trust",               kind: "text", multi: false },
      { key: "when_stuck",       label: "What you do when you're stuck",  placeholder: "Your answer", hint: "e.g., walk, sleep on it, talk it through, push harder",             kind: "text", multi: false },
      { key: "how_right",        label: "How you know when you're right", placeholder: "Your answer", hint: "e.g., it feels settled, people agree, the evidence stacks up",      kind: "text", multi: false },
    ],
    col2: [
      { key: "uncommon_belief",  label: "What you believe that most don't", placeholder: "Your answer", hint: "e.g., something you'd argue for but rarely say out loud",           kind: "text", multi: false },
      { key: "how_process",      label: "How you process information",      placeholder: "Your answer", hint: "e.g., instinct first, analysis first, a mix",                       kind: "text", multi: false },
    ],
    col3: [],
  },
  "how-you-talk": {
    subtitle: "What people hear when you speak.",
    col1: [
      { key: "accent",  label: "Your accent", placeholder: "Your answer", hint: "e.g., New York at home, neutral at work",                        kind: "text", multi: false },
      { key: "pace",    label: "Your pace",   placeholder: "Your answer", hint: "e.g., usually fast, slower when I'm being careful",              kind: "text", multi: false },
      { key: "volume",  label: "Your volume", placeholder: "Your answer", hint: "e.g., loud by default, quiet in rooms I don't know",             kind: "text", multi: false },
    ],
    col2: [
      { key: "humor",    label: "Your kind of humor", placeholder: "Your answer", hint: "e.g., dry, dark, depends on the room",                                                kind: "text", multi: false },
      { key: "swearing", label: "How you swear",      placeholder: "Your answer", hint: "e.g., constantly, only when driving, in another language, never",                     kind: "text", multi: false },
    ],
    col3: [
      { key: "words_say_a_lot",  label: "Words you say a lot",   placeholder: "Your answer", hint: 'e.g., honestly, mashallah, oof',                kind: "text", multi: false },
      { key: "words_never_say",  label: "Words you never say",   placeholder: "Your answer", hint: 'e.g., "literally", clichés, anything corny',    kind: "text", multi: false },
    ],
  },
  "how-you-live": {
    subtitle: "What your days are made of.",
    col1: [
      { key: "mornings", label: "Your mornings",  placeholder: "Your answer", hint: "e.g., up at five, slow with coffee, hit snooze three times",                      kind: "text", multi: true },
      { key: "evenings", label: "Your evenings",  placeholder: "Your answer", hint: "e.g., long dinners, in bed by nine, restless until midnight",                     kind: "text", multi: true },
      { key: "sleep",    label: "How you sleep",  placeholder: "Your answer", hint: "e.g., light sleeper, deep, never enough, weird dreams",                          kind: "text", multi: false },
      { key: "eat",      label: "What you eat",   placeholder: "Your answer", hint: "e.g., the same things on repeat, big home cooked meals, takeout, picky",         kind: "text", multi: true },
    ],
    col2: [
      { key: "free_time", label: "How you spend free time",     placeholder: "Your answer", hint: "e.g., outside, with people, alone with a book, in the kitchen",                          kind: "text", multi: true },
      { key: "work",      label: "What you've done for work",   placeholder: "Your answer", hint: "e.g., teacher for thirty years, ran a small business, raising kids, retired",             kind: "text", multi: true },
      { key: "rituals",   label: "Your rituals over the years", placeholder: "Your answer", hint: "e.g., Sunday calls with mom, Friday prayers, morning coffee alone",                       kind: "text", multi: true },
    ],
    col3: [
      { key: "home_feels",   label: "What your home feels like",  placeholder: "Your answer", hint: "e.g., quiet, full of books, always something cooking", kind: "text", multi: false },
      { key: "spend_money",  label: "What you spend money on",    placeholder: "Your answer", hint: "e.g., travel, books, the people I love",               kind: "text", multi: true },
    ],
  },
  beliefs: {
    subtitle: "What you hold without apology.",
    col1: [
      { key: "faith",           label: "Your faith",                    placeholder: "Your answer", hint: "e.g., Muslim, Catholic, spiritual but not religious, none",                             kind: "text", multi: false },
      { key: "how_practice",    label: "How you practice it",           placeholder: "Your answer", hint: "e.g., prayer, fasting, service, meditation, holidays only, not at all",                 kind: "text", multi: false },
      { key: "politics",        label: "Your politics",                 placeholder: "Your answer", hint: "e.g., left, right, complicated, I don't talk about it",                                 kind: "text", multi: false },
      { key: "believe_people",  label: "What you believe about people", placeholder: "Your answer", hint: "e.g., mostly good, capable of anything, you have to earn my trust",                     kind: "text", multi: true },
      { key: "believe_life",    label: "What you believe about life",   placeholder: "Your answer", hint: "e.g., we make our own meaning, everything happens for a reason",                        kind: "text", multi: true },
    ],
    col2: [
      { key: "stand_for",       label: "What you stand for",                  placeholder: "Your answer", hint: "e.g., honesty, loyalty, hard work, family first",                                kind: "text", multi: true },
      { key: "wont_compromise", label: "What you won't compromise on",        placeholder: "Your answer", hint: "e.g., my kids, my faith, telling the truth, my time",                            kind: "text", multi: true },
      { key: "believe_death",   label: "What you believe happens when we die", placeholder: "Your answer", hint: "e.g., heaven, nothing, something we can't know, we live on in others",         kind: "text", multi: false },
    ],
    col3: [
      { key: "believe_right",  label: "What you believe is right", placeholder: "Your answer", hint: "e.g., treating people well, telling the truth, doing the work",  kind: "text", multi: true },
      { key: "believe_wrong",  label: "What you believe is wrong", placeholder: "Your answer", hint: "e.g., cruelty, dishonesty, taking what isn't yours",              kind: "text", multi: true },
    ],
  },
  heart: {
    subtitle: "What you love, and how.",
    col1: [
      { key: "how_love",        label: "How you love",               placeholder: "Your answer", hint: "e.g., hard and fast, slow to start, forever once I do, all in",       kind: "text", multi: false },
      { key: "how_forgive",     label: "How you forgive",            placeholder: "Your answer", hint: "e.g., easily, never, after time, only when it's earned",               kind: "text", multi: false },
      { key: "how_deeply_feel", label: "How deeply you feel",        placeholder: "Your answer", hint: "e.g., loud and visible, deep but quiet, intensely, hard to access",    kind: "text", multi: false },
      { key: "how_express",     label: "How you express what's inside", placeholder: "Your answer", hint: "e.g., words, music, painting, cooking, building, in silence",      kind: "text", multi: true },
      { key: "things_love",     label: "Things you love",            placeholder: "Your answer", hint: "e.g., the ocean, jazz, the smell of rain, a long drive",               kind: "text", multi: true },
    ],
    col2: [
      { key: "who_love",       label: "Who you love",           placeholder: "Your answer", hint: "e.g., your kids, your dog, your oldest friend",                                               kind: "text", multi: true },
      { key: "find_beautiful", label: "What you find beautiful", placeholder: "Your answer", hint: "e.g., old buildings, your grandmother's handwriting, the desert, hands",                     kind: "text", multi: true },
      { key: "makes_laugh",    label: "What makes you laugh",   placeholder: "Your answer", hint: "e.g., your kids, slapstick, the way your partner tells stories",                              kind: "text", multi: true },
    ],
    col3: [
      { key: "cant_stand", label: "What you can't stand", placeholder: "Your answer", hint: "e.g., cruelty, small talk, slow walkers, dishonesty", kind: "text", multi: true },
    ],
  },
};

type Entry = { id: string; title?: string; body: string; entry_type: string; tags?: EntryTags; created_at: string };
type DimData = { id: string; slug: string; structured: Record<string, unknown> | null; entries: Entry[] };

const FOOTER_H = 103;
const BAR_H = 70;

function FieldInput({
  field,
  value,
  onChange,
}: {
  field: FormFieldDef;
  value: string;
  onChange: (v: string) => void;
}) {
  if (field.kind === "place") {
    return <Typeahead value={value} onChange={onChange} options={PLACES} placeholder={field.placeholder} />;
  }
  if (field.kind === "language") {
    return <Typeahead value={value} onChange={onChange} options={LANGUAGES} placeholder={field.placeholder} />;
  }
  if (field.kind === "date") {
    const invalid = value.length > 0 && !isValidMMDDYYYY(value);
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
        <input
          value={value}
          inputMode="numeric"
          onChange={e => onChange(maskMMDDYYYY(e.target.value))}
          placeholder={field.placeholder}
          style={{
            width: "100%", height: "57px", padding: "0 10px",
            borderRadius: "10px", border: `1px solid ${invalid ? "#c0392b" : "#888"}`,
            fontFamily: sans, fontSize: "14px", boxSizing: "border-box",
            background: "white", color: "#1a1a1a",
          }}
        />
        {invalid && <span style={{ fontFamily: sans, fontSize: "12px", color: "#c0392b", fontStyle: "oblique" }}>Use MM/DD/YYYY (e.g. 04/14/1990).</span>}
      </div>
    );
  }
  return (
    <input
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={field.placeholder}
      style={{
        width: "100%", height: "57px", padding: "0 10px",
        borderRadius: "10px", border: "1px solid #888",
        fontFamily: sans, fontSize: "14px", boxSizing: "border-box",
        background: "white", color: "#1a1a1a",
      }}
    />
  );
}

function FormColumn({
  fields,
  form,
  setField,
  isSaveCol,
  onSave,
  saving,
}: {
  fields: FormFieldDef[];
  form: Record<string, string | string[]>;
  setField: (key: string, val: string | string[]) => void;
  isSaveCol?: boolean;
  onSave?: () => void;
  saving?: boolean;
}) {
  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      justifyContent: isSaveCol ? "space-between" : "flex-start",
      gap: "20px",
      width: "400px",
      flexShrink: 0,
    }}>
      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        {fields.map(field => {
          const raw = form[field.key];
          if (field.multi) {
            const arr = (raw as string[] | undefined) ?? [];
            const displayArr = arr.length > 0 ? arr : [""];
            return (
              <div key={field.key} style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <span style={{ fontFamily: sans, fontWeight: 700, fontSize: "16px", color: "#444" }}>{field.label}</span>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {displayArr.map((item, idx) => (
                    <FieldInput
                      key={idx}
                      field={field}
                      value={item}
                      onChange={v => {
                        const next = [...displayArr];
                        next[idx] = v;
                        setField(field.key, next);
                      }}
                    />
                  ))}
                </div>
                {field.hint && (
                  <span style={{ fontFamily: sans, fontStyle: "oblique", fontSize: "12px", color: "#444" }}>{field.hint}</span>
                )}
                <button
                  onClick={() => {
                    const next = [...displayArr, ""];
                    setField(field.key, next);
                  }}
                  style={{
                    display: "flex", alignItems: "center", gap: "8px",
                    background: "none", border: "none", cursor: "pointer",
                    padding: "0 10px",
                  }}
                >
                  <span style={{ fontFamily: sans, fontSize: "22px", color: "#1a1a1a", lineHeight: 1 }}>+</span>
                  <span style={{ fontFamily: sans, fontSize: "16px", color: "#888" }}>Add more</span>
                </button>
              </div>
            );
          }
          return (
            <div key={field.key} style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <span style={{ fontFamily: sans, fontWeight: 700, fontSize: "16px", color: "#444" }}>{field.label}</span>
              <FieldInput
                field={field}
                value={(raw as string) ?? ""}
                onChange={v => setField(field.key, v)}
              />
              {field.hint && (
                <span style={{ fontFamily: sans, fontStyle: "oblique", fontSize: "12px", color: "#444" }}>{field.hint}</span>
              )}
            </div>
          );
        })}
      </div>

      {isSaveCol && onSave && (
        <button
          onClick={onSave}
          disabled={saving}
          style={{
            width: "304px", height: "48px",
            background: "#1a1a1a",
            borderRadius: "8px", border: "none",
            fontFamily: sans, fontWeight: 700, fontSize: "16px",
            color: "#f5f0e8",
            cursor: saving ? "not-allowed" : "pointer",
            opacity: saving ? 0.6 : 1,
            alignSelf: "flex-end",
          }}
        >
          {saving ? "Saving…" : "Save and continue →"}
        </button>
      )}
    </div>
  );
}

function DimensionForm({
  contractId,
  dimension,
  dim,
  formDef,
  initialStructured,
  onSaved,
}: {
  contractId: string;
  dimension: string;
  dim: typeof DIMENSIONS[number];
  formDef: DimFormDef;
  initialStructured: Record<string, unknown> | null;
  onSaved: (structured: Record<string, unknown>) => void;
}) {
  const [form, setForm] = useState<Record<string, string | string[]>>(() => {
    if (!initialStructured) return {};
    const out: Record<string, string | string[]> = {};
    for (const [k, v] of Object.entries(initialStructured)) {
      out[k] = Array.isArray(v) ? (v as string[]) : String(v);
    }
    return out;
  });
  const [saving, setSaving] = useState(false);

  function setField(key: string, value: string | string[]) {
    setForm(prev => ({ ...prev, [key]: value }));
  }

  async function handleSave() {
    setSaving(true);
    try {
      const cleaned: Record<string, unknown> = {};
      for (const [k, v] of Object.entries(form)) {
        if (Array.isArray(v)) {
          const filtered = v.filter(s => s.trim());
          if (filtered.length) cleaned[k] = filtered;
        } else if (typeof v === "string" && v.trim()) {
          cleaned[k] = v;
        }
      }
      await api.upsertDimension(contractId, dimension, cleaned);
      onSaved(cleaned);
    } finally {
      setSaving(false);
    }
  }

  // Save button always goes in the rightmost non-empty column
  const saveColIdx = formDef.col3.length > 0 ? 2 : formDef.col2.length > 0 ? 1 : 0;
  const allCols = [formDef.col1, formDef.col2, formDef.col3];

  return (
    <div style={{ paddingLeft: "108px", paddingTop: "31px", paddingBottom: "60px", width: "1700px" }}>
      {/* Back link */}
      <Link href="/contracts" style={{
        display: "flex", alignItems: "center", gap: "10px",
        fontFamily: sans, fontSize: "16px", color: "#888", textDecoration: "none",
        marginBottom: "30px",
      }}>
        <span style={{ display: "inline-block", transform: "scaleX(-1)" }}>›</span>
        Your contracts
      </Link>

      {/* Title + subtitle */}
      <div style={{ marginBottom: "50px" }}>
        <h1 style={{
          fontFamily: serif, fontStyle: "italic", fontWeight: 400,
          fontSize: "64px", color: "#1a1a1a", margin: "0 0 10px",
        }}>
          {dim.label}
        </h1>
        <p style={{
          fontFamily: sans, fontStyle: "oblique", fontSize: "22px",
          color: "#888", margin: 0,
        }}>
          {formDef.subtitle}
        </p>
      </div>

      {/* Form card */}
      <div style={{
        background: "white",
        border: "1px solid #ddd6c6",
        borderRadius: "20px",
        padding: "40px 60px",
        display: "flex",
        justifyContent: "space-between",
        gap: "40px",
      }}>
        {allCols.map((fields, colIdx) => (
          fields.length > 0 || colIdx === saveColIdx ? (
            <FormColumn
              key={colIdx}
              fields={fields}
              form={form}
              setField={setField}
              isSaveCol={colIdx === saveColIdx}
              onSave={colIdx === saveColIdx ? handleSave : undefined}
              saving={saving}
            />
          ) : null
        ))}
      </div>
    </div>
  );
}

const WAVE_BARS = 24;

function TagChip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: "6px",
      background: "#efeaf2", color: "#6a4d7d",
      fontFamily: sans, fontSize: "14px", padding: "5px 14px", borderRadius: "999px",
    }}>
      {label}
      <button onClick={onRemove} style={{ background: "none", border: "none", color: "#6a4d7d", cursor: "pointer", fontSize: "15px", lineHeight: 1, padding: 0, display: "flex", alignItems: "center" }}>×</button>
    </span>
  );
}

function SField({ label, value, onChange, hint, id }: { label: string; value: string; onChange: (v: string) => void; hint: string; id?: string }) {
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "6px" }}>
      <label style={{ fontFamily: sans, fontWeight: 700, fontSize: "12px", color: "#888", textTransform: "uppercase", letterSpacing: "0.04em" }}>{label}</label>
      <input id={id} value={value} onChange={e => onChange(e.target.value)} style={{ height: "57px", padding: "0 12px", border: "1px solid #888", borderRadius: "10px", fontFamily: sans, fontSize: "15px", width: "100%", boxSizing: "border-box" as const }} />
      <span style={{ fontFamily: sans, fontStyle: "oblique", fontSize: "12px", color: "#888" }}>{hint}</span>
    </div>
  );
}

function addTagBtnStyle(): CSSProperties {
  return { fontFamily: sans, fontSize: "12px", color: "#bababa", background: "white", border: "0.5px solid #bababa", height: "30px", padding: "0 14px", cursor: "pointer" };
}

function EntryEditView({
  entry,
  onSave,
  onClose,
  saving,
}: {
  entry: Entry;
  onSave: (patch: { title: string; body: string; tags: EntryTags }) => void;
  onClose: () => void;
  saving: boolean;
}) {
  const [title, setTitle] = useState(entry.title ?? "");
  const [body, setBody] = useState(entry.body);
  const [people, setPeople] = useState<string[]>(entry.tags?.people ?? []);
  const [year, setYear] = useState(entry.tags?.year ?? "");
  const [place, setPlace] = useState(entry.tags?.place ?? "");
  const [callThem, setCallThem] = useState("");
  const [fullName, setFullName] = useState("");
  const [whatHappened, setWhatHappened] = useState("");
  const [when, setWhen] = useState("");
  const [editingBody, setEditingBody] = useState(false);

  const isVoice = entry.entry_type === "voice";
  const created = new Date(entry.created_at).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });

  function addPersonFromForm() {
    const name = (fullName || callThem).trim();
    if (name && !people.some(p => p.toLowerCase() === name.toLowerCase())) {
      setPeople(prev => [...prev, name]);
    }
    setCallThem(""); setFullName("");
  }

  function handleSave() {
    const y = /\b(\d{4})\b/.exec(when)?.[1] ?? year;
    onSave({
      title: (title.trim() || whatHappened.trim()),
      body,
      tags: { people, year: y || null, place: place.trim() || null },
    });
  }

  const allTags: Array<{ label: string; remove: () => void }> = [
    ...people.map((p, i) => ({ label: p, remove: () => setPeople(prev => prev.filter((_, j) => j !== i)) })),
    ...(year ? [{ label: year, remove: () => setYear("") }] : []),
    ...(place ? [{ label: place, remove: () => setPlace("") }] : []),
  ];

  return (
    <div style={{ padding: "0 110px 80px" }}>
      <p style={{ fontFamily: sans, fontWeight: 700, fontSize: "22px", color: "#6a4d7d", margin: "0 0 20px", letterSpacing: "0.03em" }}>ENTRY</p>

      {/* Entry card */}
      <div style={{ background: "white", border: "1px solid #ddd6c6", borderRadius: "15px", padding: "30px 50px 36px", marginBottom: "40px", position: "relative" }}>
        {/* Circle × close */}
        <button onClick={onClose} style={{
          position: "absolute", top: "20px", right: "20px",
          width: "42px", height: "42px", borderRadius: "50%",
          border: "1.5px solid #c9a8d0", background: "white",
          display: "flex", alignItems: "center", justifyContent: "center",
          cursor: "pointer", fontSize: "20px", color: "#6a4d7d", fontFamily: sans, lineHeight: 1,
        }}>×</button>

        {/* Title */}
        {isVoice ? (
          <p style={{ fontFamily: sans, fontWeight: 700, fontSize: "20px", color: "#1a1a1a", margin: "0 0 6px", paddingRight: "60px" }}>{title || "Untitled"}</p>
        ) : (
          <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Title" style={{
            fontFamily: sans, fontWeight: 700, fontSize: "20px", color: "#1a1a1a",
            border: "none", background: "transparent", outline: "none",
            width: "calc(100% - 60px)", padding: 0, marginBottom: "6px", display: "block",
          }} />
        )}

        {/* Meta */}
        <p style={{ fontFamily: sans, fontSize: "16px", color: "#888", margin: "0 0 14px" }}>
          {isVoice ? "Voice" : "Text"} · {created}
        </p>

        {/* Tags */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "12px" }}>
          {allTags.length > 0
            ? allTags.map((t, i) => <TagChip key={i} label={t.label} onRemove={t.remove} />)
            : <span style={{ fontFamily: sans, fontStyle: "oblique", fontSize: "14px", color: "#bababa" }}>No tags yet — add them below.</span>
          }
        </div>

        {/* Quick-add tag buttons */}
        <div style={{ display: "flex", gap: "0", marginBottom: "24px" }}>
          <button onClick={() => document.getElementById("edit-call-them")?.focus()} style={addTagBtnStyle()}>+ Add Person</button>
          <button onClick={() => { const y = prompt("Year (e.g. 2013):"); if (y) setYear(y.trim()); }} style={addTagBtnStyle()}>+ Add Year</button>
          <button onClick={() => { const p = prompt("Place (City, Country):"); if (p) setPlace(p.trim()); }} style={addTagBtnStyle()}>+ Add Place</button>
        </div>

        {/* Body / Waveform */}
        {isVoice ? (
          <div style={{ background: "rgba(247,244,239,0.5)", borderRadius: "12px", padding: "20px 30px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "3px", height: "60px", marginBottom: "12px" }}>
              {Array.from({ length: 70 }).map((_, i) => {
                const h = 8 + Math.abs(Math.sin(i * 0.5 + 1) * Math.cos(i * 0.3)) * 44;
                return <div key={i} style={{ width: "5px", height: `${h}px`, background: `rgba(106,77,125,${0.2 + Math.abs(Math.sin(i * 0.4)) * 0.5})`, borderRadius: "2px", flexShrink: 0 }} />;
              })}
            </div>
            <p style={{ fontFamily: sans, fontStyle: "oblique", fontSize: "14px", color: "#888", margin: 0 }}>
              Voice recording — to change this entry, delete it and re-record.
            </p>
          </div>
        ) : (
          <div style={{ position: "relative", background: "rgba(247,244,239,0.5)", borderRadius: "12px", padding: "20px 30px", minHeight: "140px" }}>
            <button onClick={() => setEditingBody(b => !b)} style={{
              position: "absolute", top: "14px", right: "14px", width: "32px", height: "32px", borderRadius: "50%",
              border: "1.5px solid #c9a8d0", background: "white",
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer", color: "#6a4d7d", fontSize: "15px",
            }}>✎</button>
            {editingBody ? (
              <textarea value={body} onChange={e => setBody(e.target.value)} autoFocus style={{
                width: "100%", minHeight: "120px", border: "none", background: "transparent",
                fontFamily: sans, fontSize: "14px", lineHeight: "1.7", resize: "vertical",
                outline: "none", boxSizing: "border-box", color: "#1a1a1a",
              }} />
            ) : (
              <p style={{ fontFamily: sans, fontSize: "14px", color: "#1a1a1a", lineHeight: "1.7", margin: 0, whiteSpace: "pre-wrap", paddingRight: "40px" }}>
                {body || <span style={{ color: "#bababa", fontStyle: "oblique" }}>Click ✎ to edit</span>}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Structured forms */}
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        <p style={{ fontFamily: serif, fontStyle: "italic", fontSize: "18px", color: "#1a1a1a", margin: "0 0 12px" }}>Someone worth naming?</p>
        <div style={{ display: "flex", gap: "20px", alignItems: "flex-end", marginBottom: "20px" }}>
          <SField id="edit-call-them" label="WHAT YOU CALL THEM" value={callThem} onChange={setCallThem} hint="Mum • Auntie N • Whatever you actually say" />
          <SField label="FULL NAME" value={fullName} onChange={setFullName} hint="First and last, if you know it." />
          <button onClick={addPersonFromForm} style={{
            width: "204px", height: "57px", flexShrink: 0,
            background: "#6a4d7d", border: "none", borderRadius: "8px",
            fontFamily: sans, fontWeight: 700, fontSize: "16px", color: "white", cursor: "pointer",
          }}>+ Add person</button>
        </div>

        <p style={{ fontFamily: serif, fontStyle: "italic", fontSize: "18px", color: "#1a1a1a", margin: "0 0 12px" }}>A time that mattered?</p>
        <div style={{ display: "flex", gap: "20px", alignItems: "flex-end" }}>
          <SField label="WHAT HAPPENED" value={whatHappened} onChange={setWhatHappened} hint="Born · Moved · Married · A child arrived · Someone left" />
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "6px" }}>
            <label style={{ fontFamily: sans, fontWeight: 700, fontSize: "12px", color: "#888", textTransform: "uppercase", letterSpacing: "0.04em" }}>WHEN</label>
            <input value={when} onChange={e => { setWhen(e.target.value); const y = /\b(\d{4})\b/.exec(e.target.value)?.[1]; if (y) setYear(y); }} style={{ height: "57px", padding: "0 12px", border: "1px solid #888", borderRadius: "10px", fontFamily: sans, fontSize: "15px", width: "100%", boxSizing: "border-box" as const }} />
            <span style={{ fontFamily: sans, fontStyle: "oblique", fontSize: "12px", color: "#888" }}>A day, a month, a year, or a span. e.g. 2003 · 2015 to 2019</span>
          </div>
          <button onClick={handleSave} disabled={saving} style={{
            width: "204px", height: "57px", flexShrink: 0,
            background: saving ? "#b0a0c0" : "#6a4d7d", border: "none", borderRadius: "8px",
            fontFamily: sans, fontWeight: 700, fontSize: "17px", color: "white",
            cursor: saving ? "not-allowed" : "pointer",
          }}>
            {saving ? "Saving…" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}

function buildProse(slug: string, structured: Record<string, string | string[]>): string {
  if (Object.keys(structured).length === 0) return "";
  if (slug === "history") {
    const parts: string[] = [];
    if (structured.full_name) parts.push(String(structured.full_name));
    const dob = structured.dob ? `Born ${structured.dob}` : "";
    const pob = structured.place_of_birth ? `in ${String(structured.place_of_birth)}` : "";
    if (dob || pob) parts.push([dob, pob].filter(Boolean).join(" "));
    if (structured.where_from) {
      const wf = Array.isArray(structured.where_from) ? structured.where_from.filter(Boolean).join(", ") : String(structured.where_from);
      if (wf) parts.push(`From ${wf}`);
    }
    for (const g of [{ key: "parents", label: "Parents" }, { key: "siblings", label: "Siblings" }, { key: "partners", label: "Partners" }, { key: "children", label: "Children" }]) {
      const v = structured[g.key];
      if (v) {
        const names = Array.isArray(v) ? v.filter(Boolean).join(", ") : String(v);
        if (names) parts.push(`${g.label}: ${names}`);
      }
    }
    if (structured.languages) {
      const l = Array.isArray(structured.languages) ? structured.languages.filter(Boolean).join(", ") : String(structured.languages);
      if (l) parts.push(`Languages: ${l}`);
    }
    const prose = parts.join(" · ");
    const homes = structured.homes;
    const homeLine = homes ? (Array.isArray(homes) ? homes.filter(Boolean) : [String(homes)]).join(" → ") : "";
    return prose + (homeLine ? `\n${homeLine}` : "");
  }
  const formDef = DIMENSION_FORMS[slug];
  if (!formDef) return "";
  const allFields = [...formDef.col1, ...formDef.col2, ...formDef.col3];
  return allFields
    .filter(f => structured[f.key])
    .slice(0, 6)
    .map(f => {
      const v = structured[f.key];
      const str = Array.isArray(v) ? v.filter(Boolean).join(", ") : String(v);
      return str ? `${f.label}: ${str}` : "";
    })
    .filter(Boolean)
    .join(" · ");
}

function EntriesView({
  contractId,
  dim,
  data,
  initial,
  onEntryAdded,
  onEntryDeleted,
  onEntryUpdated,
  onEditStructured,
}: {
  contractId: string;
  dim: typeof DIMENSIONS[number];
  data: DimData;
  initial: string;
  onEntryAdded: (e: Entry) => void;
  onEntryDeleted: (id: string) => void;
  onEntryUpdated: (e: Entry) => void;
  onEditStructured: () => void;
}) {
  const prompts = PROMPTS[dim.slug] ?? [];
  const [promptIdx, setPromptIdx] = useState(0);
  const [mode, setMode] = useState<"voice" | "text">("text");
  const [body, setBody] = useState("");
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);
  const [editing, setEditing] = useState<Entry | null>(null);
  const [savingEdit, setSavingEdit] = useState(false);
  const [recording, setRecording] = useState(false);
  const [recordSeconds, setRecordSeconds] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  async function startRecording() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mr = new MediaRecorder(stream);
      mediaRecorderRef.current = mr;
      chunksRef.current = [];
      mr.ondataavailable = e => { if (e.data.size > 0) chunksRef.current.push(e.data); };
      mr.start();
      setRecording(true);
      setRecordSeconds(0);
      timerRef.current = setInterval(() => setRecordSeconds(s => s + 1), 1000);
    } catch (err) {
      console.error("Mic error:", err);
    }
  }

  function stopRecordingAsync(): Promise<Blob> {
    return new Promise(resolve => {
      const mr = mediaRecorderRef.current;
      if (!mr) { resolve(new Blob()); return; }
      mr.onstop = () => resolve(new Blob(chunksRef.current, { type: "audio/webm" }));
      mr.stop();
      mr.stream?.getTracks().forEach(t => t.stop());
      if (timerRef.current) clearInterval(timerRef.current);
      setRecording(false);
    });
  }

  async function handleSave() {
    if (mode === "text") {
      if (!body.trim()) return;
      setSaving(true);
      try {
        const e = await api.addDimensionEntry(contractId, dim.slug, { body: body.trim(), entry_type: "text" });
        onEntryAdded(e as Entry);
        setBody("");
      } finally { setSaving(false); }
    } else {
      if (!recording) return;
      setSaving(true);
      const secs = recordSeconds;
      try {
        const blob = await stopRecordingAsync();
        const { presigned_url, s3_key } = await api.getEntryMediaPresigned(contractId, dim.slug);
        await fetch(presigned_url, { method: "PUT", body: blob, headers: { "Content-Type": "audio/webm" } });
        const mins = Math.floor(secs / 60);
        const s = String(secs % 60).padStart(2, "0");
        const e = await api.addDimensionEntry(contractId, dim.slug, {
          body: "",
          entry_type: "voice",
          title: `Voice note (${mins}:${s})`,
          media_s3_key: s3_key,
        });
        onEntryAdded(e as Entry);
        setRecordSeconds(0);
      } finally { setSaving(false); }
    }
  }

  async function saveEdit(patch: { title: string; body: string; tags: EntryTags }) {
    if (!editing) return;
    setSavingEdit(true);
    try {
      const e = await api.updateDimensionEntry(contractId, dim.slug, editing.id, patch);
      onEntryUpdated(e as Entry);
      setEditing(null);
    } finally { setSavingEdit(false); }
  }

  async function deleteEntry(id: string) {
    setDeletingId(id);
    setMenuOpenId(null);
    try {
      await api.deleteDimensionEntry(contractId, dim.slug, id);
      onEntryDeleted(id);
    } finally { setDeletingId(null); }
  }

  const structured = data.structured as Record<string, string | string[]> | null;
  const formDef = DIMENSION_FORMS[dim.slug];
  const prose = structured ? buildProse(dim.slug, structured) : "";
  const canSave = mode === "text" ? body.trim().length > 0 : recording;

  return (
    <>
      <style>{`
        @keyframes barPulse {
          0%, 100% { transform: scaleY(0.12); }
          50% { transform: scaleY(1); }
        }
      `}</style>

      <div style={{ padding: "40px 110px 0" }}>
        <Link href={`/upload/${contractId}`} style={{
          display: "flex", alignItems: "center", gap: "10px",
          fontFamily: sans, fontSize: "16px", color: "#6a4d7d", textDecoration: "none",
          marginBottom: "28px",
        }}>
          <span style={{ display: "inline-block", transform: "scaleX(-1)" }}>›</span>
          Upload hub
        </Link>

        {/* Banner card */}
        <div style={{
          background: "#efeaf2", borderRadius: "20px",
          padding: "40px 50px",
          display: "flex", justifyContent: "space-between", alignItems: "flex-start",
          marginBottom: "50px",
        }}>
          <div style={{ display: "flex", gap: "30px", alignItems: "flex-start" }}>
            <div style={{
              width: "64px", height: "64px", borderRadius: "50%", background: "#6a4d7d",
              flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center",
              marginTop: "10px",
            }}>
              <span style={{ fontFamily: sans, fontWeight: 700, fontSize: "24px", color: "white" }}>{initial}</span>
            </div>
            <div>
              <h1 style={{
                fontFamily: serif, fontStyle: "italic", fontWeight: 400,
                fontSize: "64px", color: "#1a1a1a", margin: "0 0 16px", lineHeight: 1.1,
              }}>
                {dim.label}
              </h1>
              {prose && (
                <p style={{
                  fontFamily: sans, fontStyle: "oblique", fontSize: "22px",
                  color: "#888", margin: 0, lineHeight: "1.6",
                  whiteSpace: "pre-line", maxWidth: "1200px",
                }}>
                  {prose}
                </p>
              )}
            </div>
          </div>
          {formDef && structured && Object.keys(structured).length > 0 && (
            <button onClick={onEditStructured} style={{
              fontFamily: sans, fontStyle: "oblique", fontSize: "22px", color: "#6a4d7d",
              background: "none", border: "none", cursor: "pointer", padding: 0, flexShrink: 0,
              marginTop: "10px",
            }}>
              edit
            </button>
          )}
        </div>
      </div>

      {editing ? (
        <EntryEditView
          entry={editing}
          onSave={saveEdit}
          onClose={() => setEditing(null)}
          saving={savingEdit}
        />
      ) : (
      <div style={{ display: "flex", padding: "0 110px 80px", gap: "60px", alignItems: "flex-start" }}>

        {/* Left: ENTRIES (800px) */}
        <div style={{ width: "800px", flexShrink: 0, display: "flex", flexDirection: "column", gap: "20px" }}>
          <p style={{
            fontFamily: sans, fontWeight: 700, fontSize: "22px",
            color: "#6a4d7d", margin: 0, letterSpacing: "0.03em",
          }}>ENTRIES</p>

          {data.entries.length === 0 ? (
            <p style={{ fontFamily: sans, fontStyle: "oblique", fontSize: "22px", color: "#888", margin: 0, lineHeight: "1.5" }}>
              Your stories live here. Add your first entry.
            </p>
          ) : (
            data.entries.map(entry => {
              const tags = entry.tags ?? {};
              const peopleTags: string[] = tags.people?.length ? tags.people : [];
              const yearTag = tags.year ?? null;
              const placeTag = tags.place ?? null;
              const allTags = [...peopleTags, ...(yearTag ? [yearTag] : []), ...(placeTag ? [placeTag] : [])];
              const meta = `${entry.entry_type === "voice" ? "Voice" : "Text"} · ${new Date(entry.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`;
              return (
                <div key={entry.id} style={{
                  background: "#f7f4ef", border: "1.5px solid #ddd6c6", borderRadius: "12px",
                  padding: "24px 28px", position: "relative",
                }}>
                  <p style={{ fontFamily: serif, fontWeight: 700, fontSize: "18px", color: "#1a1a1a", margin: "0 0 6px", paddingRight: "40px" }}>
                    {entry.title || (entry.body ? `${entry.body.slice(0, 80)}${entry.body.length > 80 ? "…" : ""}` : "Untitled entry")}
                  </p>
                  <p style={{ fontFamily: sans, fontSize: "13px", color: "#bababa", margin: "0 0 12px" }}>{meta}</p>
                  {entry.entry_type !== "voice" && entry.body && (
                    <p style={{ fontFamily: sans, fontSize: "16px", color: "#1a1a1a", margin: "0 0 12px", lineHeight: "1.6", whiteSpace: "pre-wrap" }}>
                      {entry.body.length > 240 ? entry.body.slice(0, 240) + "…" : entry.body}
                    </p>
                  )}
                  {entry.entry_type === "voice" && !entry.body ? (
                    <span style={{
                      fontFamily: sans, fontSize: "13px", padding: "5px 12px", borderRadius: "999px",
                      background: "#f0f0f0", color: "#bababa", fontStyle: "italic",
                    }}>transcribing…</span>
                  ) : allTags.length > 0 ? (
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                      {allTags.map((c, i) => (
                        <span key={i} style={{
                          fontFamily: sans, fontSize: "13px", padding: "5px 12px", borderRadius: "999px",
                          background: "#efeaf2", color: "#6a4d7d",
                        }}>{c}</span>
                      ))}
                    </div>
                  ) : null}
                  <div style={{ position: "absolute", top: "18px", right: "18px" }}>
                    <button onClick={() => setMenuOpenId(menuOpenId === entry.id ? null : entry.id)} style={{
                      fontFamily: sans, fontSize: "20px", color: "#888", letterSpacing: "1px",
                      background: "none", border: "none", cursor: "pointer", padding: "0 6px", lineHeight: 1,
                    }}>⋯</button>
                    {menuOpenId === entry.id && (
                      <div style={{
                        position: "absolute", top: "26px", right: 0, zIndex: 30, background: "white",
                        border: "1px solid #e6e0d6", borderRadius: "10px",
                        boxShadow: "0 8px 24px rgba(0,0,0,0.12)", padding: "6px", minWidth: "130px",
                      }}>
                        <button onClick={() => { setEditing(entry); setMenuOpenId(null); }} style={menuItem()}>✎ edit</button>
                        <button onClick={() => deleteEntry(entry.id)} disabled={deletingId === entry.id} style={{ ...menuItem(), color: "#c0392b", opacity: deletingId === entry.id ? 0.5 : 1 }}>× delete</button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right: ADD entry (800px) */}
        <div style={{ width: "800px", flexShrink: 0, display: "flex", flexDirection: "column", gap: "24px" }}>
          <p style={{ fontFamily: sans, fontWeight: 700, fontSize: "22px", color: "#6a4d7d", margin: 0, letterSpacing: "0.03em" }}>
            {mode === "voice" ? "ADD VOICE ENTRY" : "ADD TEXT ENTRY"}
          </p>

          {/* Rotating questions — click to highlight */}
          {prompts.length > 0 && (
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {prompts.map((p, i) => (
                <button key={i} onClick={() => setPromptIdx(i)} style={{
                  fontFamily: sans, fontStyle: "oblique",
                  fontSize: i === promptIdx ? "18px" : "16px",
                  color: i === promptIdx ? "#6a4d7d" : "#888",
                  background: i === promptIdx ? "#efeaf2" : "transparent",
                  border: `1.5px solid ${i === promptIdx ? "#6a4d7d" : "transparent"}`,
                  borderRadius: "10px", padding: "12px 16px",
                  cursor: "pointer", textAlign: "left", width: "100%",
                  transition: "all 0.15s",
                }}>
                  {p}
                </button>
              ))}
            </div>
          )}

          {/* Entry input card (433px tall) */}
          <div style={{
            background: "white", border: "1px solid #ddd6c6",
            borderRadius: "15px", height: "433px",
            display: "flex", flexDirection: "column", overflow: "hidden",
          }}>
            {mode === "text" ? (
              <textarea
                value={body}
                onChange={e => setBody(e.target.value)}
                placeholder="Start typing here…"
                style={{
                  flex: 1, padding: "24px", border: "none",
                  fontFamily: sans, fontSize: "18px", resize: "none",
                  background: "transparent", lineHeight: "1.6",
                  outline: "none", color: "#1a1a1a",
                }}
              />
            ) : (
              <div style={{
                flex: 1, display: "flex", flexDirection: "column",
                alignItems: "center", justifyContent: "center", gap: "32px",
              }}>
                {/* Animated waveform */}
                <div style={{ display: "flex", alignItems: "center", gap: "5px", height: "80px" }}>
                  {Array.from({ length: WAVE_BARS }).map((_, i) => (
                    <div key={i} style={{
                      width: "7px",
                      height: "64px",
                      background: "#6a4d7d",
                      borderRadius: "4px",
                      transformOrigin: "center",
                      transform: recording ? undefined : "scaleY(0.12)",
                      animation: recording ? `barPulse ${0.4 + (i % 5) * 0.08}s ease-in-out ${(i * 0.04).toFixed(2)}s infinite` : "none",
                      opacity: recording ? 1 : 0.25,
                      transition: "opacity 0.3s",
                    }} />
                  ))}
                </div>
                {recording ? (
                  <p style={{ fontFamily: sans, fontSize: "18px", color: "#6a4d7d", margin: 0, fontWeight: 700 }}>
                    {Math.floor(recordSeconds / 60)}:{String(recordSeconds % 60).padStart(2, "0")}
                  </p>
                ) : (
                  <button onClick={startRecording} style={{
                    fontFamily: sans, fontWeight: 700, fontSize: "18px", color: "white",
                    background: "#6a4d7d", border: "none", borderRadius: "10px",
                    padding: "16px 48px", cursor: "pointer",
                  }}>
                    ● Record
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Mode buttons */}
          <div style={{ display: "flex", gap: "16px" }}>
            {(["voice", "text"] as const).map(m => (
              <button key={m} onClick={() => setMode(m)} style={{
                width: "253px", height: "70px",
                background: mode === m ? "#6a4d7d" : "white",
                border: `1.5px solid ${mode === m ? "#6a4d7d" : "#ddd6c6"}`,
                borderRadius: "12px", cursor: "pointer",
                fontFamily: sans, fontWeight: 700, fontSize: "18px",
                color: mode === m ? "white" : "#6a4d7d",
              }}>
                {m === "voice" ? "♪ Voice" : "✎ Text"}
              </button>
            ))}
            <button disabled style={{
              width: "253px", height: "70px",
              background: "#f7f4ef", border: "1.5px solid #ddd6c6",
              borderRadius: "12px", cursor: "not-allowed",
              fontFamily: sans, fontWeight: 700, fontSize: "18px", color: "#bababa",
            }}>
              ● Video (soon)
            </button>
          </div>

          {/* Save button */}
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button
              onClick={handleSave}
              disabled={saving || !canSave}
              style={{
                width: "255px", height: "71px",
                background: saving || !canSave ? "#b0a0c0" : "#6a4d7d",
                border: "none", borderRadius: "8px",
                fontFamily: sans, fontWeight: 700, fontSize: "18px", color: "white",
                cursor: saving || !canSave ? "not-allowed" : "pointer",
              }}
            >
              {saving ? "Saving…" : "Save"}
            </button>
          </div>
        </div>
      </div>
      )}
    </>
  );
}

function menuItem(): CSSProperties {
  return {
    display: "block", width: "100%", textAlign: "left",
    fontFamily: sans, fontSize: "15px", color: "#1a1a1a",
    background: "none", border: "none", cursor: "pointer",
    padding: "8px 12px", borderRadius: "6px",
  };
}

export function DimensionClient() {
  const { contractId, dimension } = useParams<{ contractId: string; dimension: string }>();
  const dim = DIMENSIONS.find(d => d.slug === dimension);
  const router = useRouter();

  const [data, setData] = useState<DimData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [dimensionCounts, setDimensionCounts] = useState<Record<string, number>>({});

  const initial = typeof window !== "undefined"
    ? (sessionStorage.getItem("ovyu_full_name") ?? "")[0]?.toUpperCase() ?? "?"
    : "?";

  useEffect(() => {
    if (!dim) { router.replace(`/upload/${contractId}`); return; }
    api.getDimension(contractId, dimension)
      .then(d => {
        setData(d as DimData);
        if (DIMENSION_FORMS[dimension] && !d.structured) setShowForm(true);
        setDimensionCounts(prev => ({ ...prev, [dimension]: (d as DimData).entries.length }));
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [contractId, dimension, dim, router]);

  const handleSaved = useCallback((structured: Record<string, unknown>) => {
    setData(prev => prev ? { ...prev, structured } : null);
    setShowForm(false);
  }, []);

  const handleEntryAdded = useCallback((e: Entry) => {
    setData(prev => {
      if (!prev) return null;
      const entries = [e, ...prev.entries];
      setDimensionCounts(c => ({ ...c, [dimension]: entries.length }));
      return { ...prev, entries };
    });
  }, [dimension]);
  const handleEntryDeleted = useCallback((id: string) => {
    setData(prev => {
      if (!prev) return null;
      const entries = prev.entries.filter(e => e.id !== id);
      setDimensionCounts(c => ({ ...c, [dimension]: entries.length }));
      return { ...prev, entries };
    });
  }, [dimension]);
  const handleEntryUpdated = useCallback((updated: Entry) => {
    setData(prev => prev ? { ...prev, entries: prev.entries.map(e => e.id === updated.id ? updated : e) } : null);
  }, []);

  if (!dim) return null;

  const formDef = DIMENSION_FORMS[dimension];

  return (
    <div style={{ minWidth: "1920px", background: "#f8f7f5", display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Header variant="loggedIn" initial={initial} />

      <div style={{ flex: 1, paddingBottom: `${FOOTER_H + BAR_H}px` }}>
        {loading ? (
          <div style={{ paddingLeft: "108px", paddingTop: "60px" }}>
            <p style={{ fontFamily: sans, fontSize: "18px", color: "#888" }}>Loading…</p>
          </div>
        ) : showForm && formDef ? (
          <DimensionForm
            contractId={contractId}
            dimension={dimension}
            dim={dim}
            formDef={formDef}
            initialStructured={data?.structured ?? null}
            onSaved={handleSaved}
          />
        ) : data ? (
          <EntriesView
            contractId={contractId}
            dim={dim}
            data={data}
            initial={initial}
            onEntryAdded={handleEntryAdded}
            onEntryDeleted={handleEntryDeleted}
            onEntryUpdated={handleEntryUpdated}
            onEditStructured={() => setShowForm(true)}
          />
        ) : (
          <div style={{ paddingLeft: "108px", paddingTop: "60px" }}>
            <p style={{ fontFamily: sans, fontSize: "18px", color: "#888" }}>Could not load dimension.</p>
          </div>
        )}
      </div>

      <YouBar voiceComplete contractId={contractId} dimensionCounts={dimensionCounts} />
      <Footer />
    </div>
  );
}
