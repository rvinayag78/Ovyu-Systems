"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { YouBar } from "@/components/YouBar";
import { api } from "@/lib/api";

const serif = "Georgia, serif";
const sans = "Helvetica Neue, Helvetica, Arial, sans-serif";

const KEEPER_CARDS = [
  { key: "who_they_are", label: "Who they are", sub: "Their story, history, birth dates, context. Your relationship to them.", width: 555, textWidth: 465 },
  { key: "who_theyre_becoming", label: "Who they're becoming", sub: "Who they are now, their hopes, the person they're turning into.", width: 550, textWidth: 443 },
  { key: "what_you_want", label: "What you want for them", sub: "Your hopes for their life. The shape you hope it takes.", width: 550, textWidth: 380 },
  { key: "what_you_want_known", label: "What you want them to know", sub: "How you feel about them. Praise, acknowledgment, things worth naming.", width: 550, textWidth: 380 },
  { key: "advice", label: "Advice", sub: "Counsel for happy times and hard times. What you imagine them needing.", width: 550, textWidth: 380 },
];

type HubData = {
  contract_id: string; keeper_name: string; upload_id: string; voice_status: string;
  dimension_counts: Record<string, number>;
};
type KeeperProfile = { who_they_are?: string; who_theyre_becoming?: string; what_you_want?: string; what_you_want_known?: string; advice?: string };
type Msg = { id: string; type: string; body: string };

function Dot({ filled }: { filled: boolean }) {
  return (
    <div style={{ position: "relative", width: "26px", height: "26px", flexShrink: 0 }}>
      <div style={{
        position: "absolute", top: "-6px", left: "-6px",
        width: "37px", height: "37px", borderRadius: "50%",
        border: `1.5px solid ${filled ? "#6a4d7d" : "#bababa"}`,
        background: filled ? "#6a4d7d" : "transparent",
      }} />
    </div>
  );
}

export function UploadHubClient() {
  const { contractId } = useParams<{ contractId: string }>();
  const [hub, setHub] = useState<HubData | null>(null);
  const [profile, setProfile] = useState<KeeperProfile>({});
  const [messages, setMessages] = useState<Msg[]>([]);
  const [loading, setLoading] = useState(true);
  const [voiceComplete, setVoiceComplete] = useState(false);
  const [editKeeperKey, setEditKeeperKey] = useState<string | null>(null);
  const [editKeeperText, setEditKeeperText] = useState("");
  const [editMsgType, setEditMsgType] = useState<string | null>(null);
  const [editMsgText, setEditMsgText] = useState("");
  const [saving, setSaving] = useState(false);
  const [youExpanded, setYouExpanded] = useState(false);

  const initial = typeof window !== "undefined"
    ? (sessionStorage.getItem("ovyu_maker_name") ?? "")[0]?.toUpperCase() ?? "?"
    : "?";

  useEffect(() => {
    Promise.all([
      api.getHub(contractId),
      api.getKeeperProfile(contractId),
      api.listMessages(contractId),
      api.getVoiceStatus(contractId),
    ]).then(([h, p, m, vs]) => {
      setHub(h as HubData);
      setProfile(p);
      setMessages(m);
      const status = vs as { name: string; profile: string };
      setVoiceComplete(status.name === "complete" && status.profile === "complete");
    }).catch(console.error).finally(() => setLoading(false));
  }, [contractId]);

  async function saveKeeperCard() {
    if (!editKeeperKey) return;
    setSaving(true);
    try {
      const updated = { ...profile, [editKeeperKey]: editKeeperText };
      await api.saveKeeperProfile(contractId, updated);
      setProfile(updated);
      setEditKeeperKey(null);
    } finally { setSaving(false); }
  }

  async function saveMessage() {
    if (!editMsgType) return;
    setSaving(true);
    try {
      const existing = messages.find(m => m.type === editMsgType);
      if (existing) await api.deleteMessage(contractId, existing.id);
      if (editMsgText.trim()) {
        const msg = await api.addMessage(contractId, { type: editMsgType, body: editMsgText });
        setMessages(prev => [...prev.filter(m => m.type !== editMsgType), msg as Msg]);
      } else {
        setMessages(prev => prev.filter(m => m.type !== editMsgType));
      }
      setEditMsgType(null);
    } finally { setSaving(false); }
  }

  const keeperName = hub?.keeper_name ?? "…";

  return (
    <div style={{ width: "1920px", background: "#f8f7f5", display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Header variant="loggedIn" initial={initial} />

      {/* All content — flex:1 pushes YouBar to bottom; hidden when YOU expanded */}
      {!youExpanded ? (
        <div style={{ flex: 1, paddingTop: "31px" }}>
          <div style={{ marginLeft: "108px", width: "1702px", display: "flex", flexDirection: "column", gap: "48px", paddingBottom: "40px" }}>

            {/* Breadcrumb */}
            <Link href="/contracts" style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none" }}>
              <span style={{ fontFamily: sans, fontSize: "16px", color: "#888", display: "inline-block", transform: "scaleX(-1)" }}>›</span>
              <span style={{ fontFamily: sans, fontSize: "16px", color: "#888" }}>Your contracts</span>
            </Link>

            {/* Heading */}
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <h1 style={{ fontFamily: serif, fontStyle: "italic", fontWeight: 400, fontSize: "64px", color: "#1a1a1a", margin: 0, lineHeight: "normal" }}>
                For {keeperName}
              </h1>
              <p style={{ fontFamily: sans, fontStyle: "oblique", fontSize: "22px", color: "#1a1a1a", margin: 0 }}>
                A bit of you. Started today.
              </p>
            </div>

            {/* MESSAGES */}
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <p style={{ fontFamily: sans, fontWeight: 700, fontSize: "18px", color: "#8e5e6e", margin: 0 }}>MESSAGES</p>
              <div style={{ display: "flex", justifyContent: "space-between", width: "1700px" }}>
                {[
                  { type: "welcome", label: "Welcome", sub: "The first thing received upon transfer." },
                  { type: "for_when", label: "For when", sub: "Messages for specific moments.\nScheduled delivery coming soon.", disabled: true },
                ].map(card => {
                  const saved = messages.find(m => m.type === card.type);
                  const isDisabled = (card as { disabled?: boolean }).disabled;
                  return isDisabled ? (
                    <div key={card.type} style={{
                      background: "#f4e8ec", borderRadius: "10px",
                      height: "130px", width: "840px", padding: "20px 30px",
                      boxSizing: "border-box", display: "flex", alignItems: "flex-start",
                      opacity: 0.4,
                    }}>
                      <div style={{ display: "flex", justifyContent: "space-between", width: "100%", alignItems: "flex-start" }}>
                        <div style={{ display: "flex", flexDirection: "column", gap: "9px" }}>
                          <p style={{ fontFamily: serif, fontWeight: 700, fontSize: "30px", color: "#1a1a1a", margin: 0 }}>{card.label}</p>
                          <p style={{ fontFamily: sans, fontStyle: "italic", fontSize: "16px", color: "#888", margin: 0, whiteSpace: "pre-line" }}>{card.sub}</p>
                        </div>
                        <Dot filled={false} />
                      </div>
                    </div>
                  ) : (
                    <button key={card.type} onClick={() => { setEditMsgType(card.type); setEditMsgText(saved?.body ?? ""); }} style={{
                      background: "#f4e8ec", borderRadius: "10px", border: "none", cursor: "pointer",
                      height: "130px", width: "840px", padding: "20px 30px",
                      boxSizing: "border-box", textAlign: "left", display: "flex", alignItems: "flex-start",
                    }}>
                      <div style={{ display: "flex", justifyContent: "space-between", width: "100%", alignItems: "flex-start" }}>
                        <div style={{ display: "flex", flexDirection: "column", gap: "9px" }}>
                          <p style={{ fontFamily: serif, fontWeight: 700, fontSize: "30px", color: "#1a1a1a", margin: 0 }}>{card.label}</p>
                          <p style={{ fontFamily: sans, fontStyle: "italic", fontSize: "16px", color: "#888", margin: 0, whiteSpace: "pre-line" }}>
                            {saved ? saved.body.slice(0, 70) + (saved.body.length > 70 ? "…" : "") : card.sub}
                          </p>
                        </div>
                        <Dot filled={!!saved} />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* KEEPER section */}
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <p style={{ fontFamily: sans, fontWeight: 700, fontSize: "18px", color: "#6a4d7d", margin: 0 }}>
                {keeperName.toUpperCase()}
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", columnGap: "22px", alignContent: "space-between", alignItems: "center", height: "286px", width: "1700px" }}>
                {KEEPER_CARDS.map(card => {
                  const value = (profile as Record<string, string | undefined>)[card.key];
                  return (
                    <button key={card.key} onClick={() => { setEditKeeperKey(card.key); setEditKeeperText(value ?? ""); }} style={{
                      background: "#efeaf2", borderRadius: "10px", border: "none", cursor: "pointer",
                      height: "130px", width: `${card.width}px`, padding: "20px 30px",
                      boxSizing: "border-box", textAlign: "left", display: "flex", alignItems: "flex-start",
                    }}>
                      <div style={{ display: "flex", justifyContent: "space-between", width: "100%", alignItems: "flex-start" }}>
                        <div style={{ display: "flex", flexDirection: "column", gap: "9px", width: `${card.textWidth}px`, flexShrink: 0 }}>
                          <p style={{ fontFamily: serif, fontWeight: 700, fontSize: "30px", color: "#1a1a1a", margin: 0 }}>{card.label}</p>
                          <p style={{ fontFamily: sans, fontStyle: "italic", fontSize: "16px", color: "#888", margin: 0 }}>
                            {value ? value.slice(0, 70) + (value.length > 70 ? "…" : "") : card.sub}
                          </p>
                        </div>
                        <Dot filled={!!value} />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

          </div>
        </div>
      ) : (
        // Spacer keeps YouBar at bottom while overlay is open
        <div style={{ flex: 1 }} />
      )}

      {/* YOU bar — at bottom of page, above fixed footer */}
      <YouBar
        voiceComplete={voiceComplete}
        contractId={contractId}
        dimensionCounts={hub?.dimension_counts ?? {}}
        onExpandedChange={setYouExpanded}
      />

      {/* Fixed footer */}
      <div style={{ position: "fixed", bottom: 0, left: 0, width: "1920px", zIndex: 30 }}>
        <Footer />
      </div>
      {/* Spacer so in-flow content isn't hidden under fixed footer */}
      <div style={{ height: "103px", flexShrink: 0 }} />

      {/* Keeper card edit modal */}
      {editKeeperKey && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }}>
          <div style={{ background: "white", borderRadius: "20px", padding: "40px", width: "700px", display: "flex", flexDirection: "column", gap: "20px" }}>
            <h2 style={{ fontFamily: serif, fontStyle: "italic", fontWeight: 400, fontSize: "36px", color: "#1a1a1a", margin: 0 }}>
              {KEEPER_CARDS.find(c => c.key === editKeeperKey)?.label}
            </h2>
            <p style={{ fontFamily: sans, fontStyle: "italic", fontSize: "16px", color: "#888", margin: 0 }}>
              {KEEPER_CARDS.find(c => c.key === editKeeperKey)?.sub}
            </p>
            <textarea value={editKeeperText} onChange={e => setEditKeeperText(e.target.value)}
              style={{ width: "100%", minHeight: "180px", padding: "16px", borderRadius: "10px", border: "1px solid #888", fontFamily: sans, fontSize: "16px", resize: "vertical", boxSizing: "border-box" }}
              placeholder="Write here…" autoFocus />
            <div style={{ display: "flex", gap: "16px", justifyContent: "flex-end" }}>
              <button onClick={() => setEditKeeperKey(null)} style={{ fontFamily: sans, fontSize: "16px", color: "#888", background: "none", border: "none", cursor: "pointer" }}>Cancel</button>
              <button onClick={saveKeeperCard} disabled={saving} style={{ background: "#1a1a1a", color: "#f5f0e8", fontFamily: sans, fontWeight: 700, fontSize: "16px", padding: "12px 32px", borderRadius: "8px", border: "none", cursor: "pointer", opacity: saving ? 0.6 : 1 }}>Save</button>
            </div>
          </div>
        </div>
      )}

      {/* Message edit modal */}
      {editMsgType && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }}>
          <div style={{ background: "white", borderRadius: "20px", padding: "40px", width: "700px", display: "flex", flexDirection: "column", gap: "20px" }}>
            <h2 style={{ fontFamily: serif, fontStyle: "italic", fontWeight: 400, fontSize: "36px", color: "#1a1a1a", margin: 0 }}>
              {editMsgType === "welcome" ? "Welcome" : "For when"}
            </h2>
            <p style={{ fontFamily: sans, fontStyle: "italic", fontSize: "16px", color: "#888", margin: 0 }}>
              {editMsgType === "welcome" ? "The first thing your Keeper receives upon transfer." : "A message for a specific moment. Scheduled delivery coming soon."}
            </p>
            <textarea value={editMsgText} onChange={e => setEditMsgText(e.target.value)}
              style={{ width: "100%", minHeight: "180px", padding: "16px", borderRadius: "10px", border: "1px solid #888", fontFamily: sans, fontSize: "16px", resize: "vertical", boxSizing: "border-box" }}
              placeholder="Write here…" autoFocus />
            <div style={{ display: "flex", gap: "16px", justifyContent: "flex-end" }}>
              <button onClick={() => setEditMsgType(null)} style={{ fontFamily: sans, fontSize: "16px", color: "#888", background: "none", border: "none", cursor: "pointer" }}>Cancel</button>
              <button onClick={saveMessage} disabled={saving} style={{ background: "#1a1a1a", color: "#f5f0e8", fontFamily: sans, fontWeight: 700, fontSize: "16px", padding: "12px 32px", borderRadius: "8px", border: "none", cursor: "pointer", opacity: saving ? 0.6 : 1 }}>Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
