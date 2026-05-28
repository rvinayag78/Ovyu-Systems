"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/Header";
import { api } from "@/lib/api";

const serif = "Georgia, serif";
const sans = "Helvetica Neue, Helvetica, Arial, sans-serif";

const DIMENSIONS = [
  "history", "relationships", "how-you-think", "how-you-talk", "how-you-live", "beliefs", "heart",
];

const CONFIG: Record<string, {
  label: string;
  sub: string;
  fields: Array<{ key: string; label: string; placeholder?: string }>;
}> = {
  people: {
    label: "People",
    sub: "Everyone who's part of your story.",
    fields: [
      { key: "name", label: "Name", placeholder: "Full name" },
      { key: "role", label: "Role / relationship", placeholder: "e.g. mother, best friend, mentor" },
      { key: "notes", label: "Notes", placeholder: "A line or two about them" },
    ],
  },
  years: {
    label: "Years",
    sub: "Birthdays, milestones, the years that mattered.",
    fields: [
      { key: "year", label: "Year", placeholder: "e.g. 1987" },
      { key: "title", label: "What happened", placeholder: "A short title" },
      { key: "body", label: "Details", placeholder: "Optional — more about this year" },
    ],
  },
  places: {
    label: "Places",
    sub: "The places in your story and your family's story.",
    fields: [
      { key: "name", label: "Place name", placeholder: "e.g. County Cork, Ireland" },
      { key: "why", label: "Why it matters", placeholder: "Optional" },
    ],
  },
};

type PersonItem = { id: string; name: string; role?: string; notes?: string };
type YearItem = { id: string; year?: number; title: string; body?: string };
type PlaceItem = { id: string; name: string; why?: string };
type AnyItem = PersonItem | YearItem | PlaceItem;

function BottomNav({ contractId }: { contractId: string }) {
  return (
    <div style={{
      position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 50,
      background: "white", borderTop: "3px solid #bababa",
    }}>
      <div style={{ height: "56px", display: "flex", alignItems: "center", padding: "0 50px", gap: "24px" }}>
        <span style={{ fontFamily: sans, fontWeight: 700, fontSize: "16px", color: "#1a1a1a", textTransform: "uppercase", marginRight: "8px" }}>You</span>
        <Link href={`/upload/${contractId}`} style={{ fontFamily: sans, fontSize: "16px", color: "#888", textDecoration: "none" }}>Voice</Link>
        {DIMENSIONS.map((slug, i, arr) => (
          <span key={slug} style={{ display: "flex", alignItems: "center", gap: "24px" }}>
            <Link href={`/upload/${contractId}/${slug}`} style={{ fontFamily: sans, fontSize: "16px", color: "#888", textDecoration: "none", textTransform: "capitalize" }}>
              {slug.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase())}
            </Link>
            {i < arr.length - 1 && <span style={{ width: "4px", height: "4px", borderRadius: "50%", background: "#bababa", display: "inline-block" }} />}
          </span>
        ))}
      </div>
      <div style={{ height: "44px", display: "flex", alignItems: "center", padding: "0 50px", gap: "24px", borderTop: "1px solid #e0ddd9" }}>
        <span style={{ fontFamily: sans, fontWeight: 700, fontSize: "14px", color: "#1a1a1a", textTransform: "uppercase", marginRight: "8px" }}>Your life</span>
        {["people", "years", "places"].map((key, i, arr) => (
          <span key={key} style={{ display: "flex", alignItems: "center", gap: "24px" }}>
            <Link href={`/upload/${contractId}/life/${key}`} style={{
              fontFamily: sans, fontWeight: 700, fontSize: "14px", color: "#6a4d7d", textDecoration: "none", textTransform: "capitalize",
            }}>{key}</Link>
            {i < arr.length - 1 && <span style={{ width: "4px", height: "4px", borderRadius: "50%", background: "#bababa", display: "inline-block" }} />}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function LifeTypePage() {
  const { contractId, type } = useParams<{ contractId: string; type: string }>();
  const router = useRouter();
  const config = CONFIG[type];

  const [items, setItems] = useState<AnyItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const initial = typeof window !== "undefined"
    ? (sessionStorage.getItem("ovyu_maker_name") ?? "")[0]?.toUpperCase() ?? "?"
    : "?";

  useEffect(() => {
    if (!config) { router.replace(`/upload/${contractId}`); return; }
    const loader = type === "people"
      ? api.listPeople(contractId)
      : type === "years"
      ? api.listYears(contractId)
      : api.listPlaces(contractId);
    loader
      .then(r => setItems(r as AnyItem[]))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [contractId, type, config, router]);

  if (!config) return null;

  function setField(key: string, val: string) { setForm(prev => ({ ...prev, [key]: val })); }

  async function handleAdd() {
    const firstField = config.fields[0];
    if (!form[firstField.key]?.trim()) return;
    setSaving(true);
    try {
      let added: AnyItem;
      if (type === "people") {
        added = await api.addPerson(contractId, { name: form.name, role: form.role || undefined, notes: form.notes || undefined }) as AnyItem;
      } else if (type === "years") {
        added = await api.addYear(contractId, {
          year: form.year ? parseInt(form.year) : undefined,
          title: form.title,
          body: form.body || undefined,
        }) as AnyItem;
      } else {
        added = await api.addPlace(contractId, { name: form.name, why: form.why || undefined }) as AnyItem;
      }
      setItems(prev => [...prev, added]);
      setForm({});
    } finally { setSaving(false); }
  }

  async function handleDelete(id: string) {
    setDeletingId(id);
    try {
      if (type === "people") await api.deletePerson(contractId, id);
      else if (type === "years") await api.deleteYear(contractId, id);
      else await api.deletePlace(contractId, id);
      setItems(prev => prev.filter(i => i.id !== id));
    } finally { setDeletingId(null); }
  }

  function itemLabel(item: AnyItem): string {
    if (type === "people") return (item as PersonItem).name;
    if (type === "years") return `${(item as YearItem).year ? (item as YearItem).year + " — " : ""}${(item as YearItem).title}`;
    return (item as PlaceItem).name;
  }

  function itemSub(item: AnyItem): string | undefined {
    if (type === "people") return (item as PersonItem).role;
    if (type === "years") return (item as YearItem).body;
    return (item as PlaceItem).why;
  }

  return (
    <div style={{ minWidth: "1920px", background: "#f8f7f5", display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Header variant="loggedIn" initial={initial} />

      <div style={{ flex: 1, paddingTop: "78px", paddingBottom: "140px" }}>
        {/* Banner */}
        <div style={{ background: "#efeaf2", padding: "40px 110px 32px" }}>
          <Link href={`/upload/${contractId}`} style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none", marginBottom: "24px" }}>
            <span style={{ fontFamily: sans, fontSize: "16px", color: "#6a4d7d", display: "inline-block", transform: "scaleX(-1)" }}>›</span>
            <span style={{ fontFamily: sans, fontSize: "16px", color: "#6a4d7d" }}>Upload hub</span>
          </Link>
          <h1 style={{ fontFamily: serif, fontStyle: "italic", fontWeight: 400, fontSize: "64px", color: "#1a1a1a", margin: "0 0 8px" }}>{config.label}</h1>
          <p style={{ fontFamily: sans, fontStyle: "italic", fontSize: "20px", color: "#6a4d7d", margin: 0 }}>{config.sub}</p>
        </div>

        <div style={{ display: "flex", padding: "40px 110px", gap: "60px" }}>
          {/* Left: list */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "16px" }}>
            <p style={{ fontFamily: sans, fontWeight: 700, fontSize: "18px", color: "#6a4d7d", margin: 0 }}>
              {config.label.toUpperCase()}
            </p>
            {loading ? (
              <p style={{ fontFamily: sans, fontStyle: "italic", fontSize: "18px", color: "#888", margin: 0 }}>Loading…</p>
            ) : items.length === 0 ? (
              <p style={{ fontFamily: sans, fontStyle: "italic", fontSize: "18px", color: "#888", margin: 0 }}>
                None yet. Add the first one →
              </p>
            ) : (
              items.map(item => (
                <div key={item.id} style={{
                  background: "#f7f4ef", border: "1.5px solid #ddd6c6", borderRadius: "10px",
                  padding: "20px 24px", position: "relative",
                }}>
                  <p style={{ fontFamily: serif, fontWeight: 700, fontSize: "18px", color: "#1a1a1a", margin: 0 }}>{itemLabel(item)}</p>
                  {itemSub(item) && (
                    <p style={{ fontFamily: sans, fontStyle: "italic", fontSize: "15px", color: "#888", margin: "6px 0 0" }}>{itemSub(item)}</p>
                  )}
                  <button onClick={() => handleDelete(item.id)} disabled={deletingId === item.id} style={{
                    position: "absolute", top: "16px", right: "16px",
                    fontFamily: sans, fontSize: "13px", color: "#bababa",
                    background: "none", border: "none", cursor: "pointer", padding: 0,
                    opacity: deletingId === item.id ? 0.4 : 1,
                  }}>Remove</button>
                </div>
              ))
            )}
          </div>

          {/* Right: add form */}
          <div style={{ width: "500px", flexShrink: 0, display: "flex", flexDirection: "column", gap: "20px" }}>
            <p style={{ fontFamily: sans, fontWeight: 700, fontSize: "18px", color: "#6a4d7d", margin: 0 }}>
              ADD {config.label.slice(0, -1).toUpperCase()}
            </p>
            {config.fields.map(field => (
              <div key={field.key} style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <label style={{ fontFamily: sans, fontWeight: 700, fontSize: "15px", color: "#1a1a1a" }}>{field.label}</label>
                <input
                  value={form[field.key] ?? ""}
                  onChange={e => setField(field.key, e.target.value)}
                  placeholder={field.placeholder ?? field.label}
                  style={{ padding: "12px 16px", borderRadius: "8px", border: "1.5px solid #ddd6c6", fontFamily: sans, fontSize: "16px", background: "white" }}
                />
              </div>
            ))}
            <button onClick={handleAdd} disabled={saving || !form[config.fields[0].key]?.trim()} style={{
              fontFamily: sans, fontWeight: 700, fontSize: "18px", color: "#f5f0e8",
              background: "#6a4d7d", border: "none", borderRadius: "10px",
              padding: "16px 40px", cursor: "pointer", alignSelf: "flex-start",
              opacity: saving || !form[config.fields[0].key]?.trim() ? 0.5 : 1,
            }}>
              {saving ? "Adding…" : `Add ${config.label.slice(0, -1).toLowerCase()}`}
            </button>
          </div>
        </div>
      </div>

      <BottomNav contractId={contractId} />
    </div>
  );
}
