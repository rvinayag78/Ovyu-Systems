"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  DimensionEngine,
  type DimFormDef,
  type SectionSpec,
} from "../../[dimension]/DimensionClient";

// FOR KEEPER — the five sections on the Upload Hub, each an instance of the
// same dimension entry engine as the YOU dimensions (Figma frames
// 2337:6142 / 2337:7589 / 2337:8583 / 2337:9542 / 2337:10499).
// Only "Who they are" has a structured form (2337:6097).

// Who they are (form) — Figma 2337:6097. Same field component as History's
// form: 400px columns, 57px inputs, hints below; col3 fixed at 667px so the
// save button pins to the bottom. Banner facts line per 2337:6142:
// "Calls them: … · To you: … · Full name: … · Pronouns: … · Born: … ·
//  Birthplace: … · Lives: … · Speaks: … · Does: …".
const WHO_THEY_ARE_FORM: DimFormDef = {
  subtitle: "The things worth getting exactly right.",
  col3Height: 667,
  prose: [
    { key: "call_them",    label: "Calls them:" },
    { key: "to_you",       label: "To you:" },
    { key: "full_name",    label: "Full name:" },
    { key: "pronouns",     label: "Pronouns:" },
    { key: "birthday",     label: "Born:" },
    { key: "birthplace",   label: "Birthplace:" },
    { key: "lives_now",    label: "Lives:" },
    { key: "languages",    label: "Speaks:" },
    { key: "what_they_do", label: "Does:" },
  ],
  col1: [
    { key: "call_them",  label: "What you call them",   placeholder: "Your answer", hint: "e.g., their name, a nickname, what you actually call them", kind: "text",  multi: true },
    { key: "to_you",     label: "What they are to you", placeholder: "Your answer", hint: "e.g., son, daughter, friend, the person you raised",         kind: "text",  multi: true },
    { key: "birthday",   label: "Birthday",             placeholder: "Your answer", hint: "e.g., April 14, 1998",                                       kind: "text",  multi: false },
    { key: "birthplace", label: "Birthplace",           placeholder: "Your answer", hint: "e.g., the city and country they were born in",               kind: "place", multi: false },
    { key: "lives_now",  label: "Where they live now",  placeholder: "Your answer", hint: "e.g., the city and country, if you know it",                 kind: "place", multi: false },
  ],
  col2: [
    { key: "full_name",    label: "Full name",      placeholder: "Your answer", hint: "e.g., first and last",                                          kind: "text", multi: false },
    { key: "pronouns",     label: "Their pronouns", placeholder: "Your answer", hint: "e.g., he/him, she/her, they/them",                              kind: "text", multi: false },
    { key: "what_they_do", label: "What they do",   placeholder: "Your answer", hint: "e.g., teacher, still figuring it out, raising kids, studying", kind: "text", multi: true },
  ],
  col3: [
    { key: "languages", label: "Languages", placeholder: "Your answer", hint: "e.g., the ones they speak", kind: "language", multi: true },
  ],
};

// TBD — user will supply real decks. Placeholder carousel questions,
// 5 per section, on-theme.
const KEEPER_PROMPTS: Record<string, string[]> = {
  "who-they-are": [
    "What's the first thing people notice about them?",
    "What do they care about more than anything?",
    "How would a stranger describe them after five minutes?",
    "What are they known for in the family?",
    "What's a detail about them only you would think to mention?",
  ],
  "who-theyre-becoming": [
    "What are they working toward right now?",
    "How have they changed in the last few years?",
    "What do they hope for that they rarely say out loud?",
    "What's a strength you've watched grow in them?",
    "Who do you see them turning into?",
  ],
  "what-you-want": [
    "What kind of life do you hope they build?",
    "What do you hope they never give up on?",
    "What do you want them to be free of?",
    "What would make you proudest to watch them do?",
    "What do you hope love looks like for them?",
  ],
  "what-you-want-known": [
    "What do you want them to know about how you feel about them?",
    "What have you never said to them plainly?",
    "What are you proudest of them for?",
    "What moment with them do you carry with you?",
    "What do you want them to hear in your voice, always?",
  ],
  advice: [
    "What advice would you give them for the hard days?",
    "What do you know now that you wish someone had told you?",
    "What should they do when they can't decide?",
    "What's worth spending money on, and what never is?",
    "What would you tell them on the morning of their biggest day?",
  ],
};

// Titles per the Figma frame banners (2337:6154 / 7600 / 8594 / 9553 / 10510).
const KEEPER_SECTIONS: Record<string, { label: string; formDef?: DimFormDef }> = {
  "who-they-are":        { label: "Who they are", formDef: WHO_THEY_ARE_FORM },
  "who-theyre-becoming": { label: "Who they are becoming" },
  "what-you-want":       { label: "What you want for them" },
  "what-you-want-known": { label: "What you want them to know" },
  advice:                { label: "Advice" },
};

export function KeeperSectionClient() {
  const { contractId: rawId, section: rawSection } = useParams<{ contractId: string; section: string }>();
  // Next.js static export may resolve the params to the SSG placeholder "_".
  // Recover the real values from the actual URL path (/upload/{id}/keeper/{section}).
  const contractId = (() => {
    if (rawId !== "_") return rawId;
    if (typeof window === "undefined") return rawId;
    const seg = window.location.pathname.split("/").filter(Boolean)[1];
    if (seg && seg !== "_") return seg;
    return sessionStorage.getItem("ovyu_contract_id") ?? rawId;
  })();
  const section = rawSection === "_" && typeof window !== "undefined"
    ? (window.location.pathname.split("/").filter(Boolean)[3] ?? rawSection)
    : rawSection;
  const cfg = KEEPER_SECTIONS[section];
  const router = useRouter();

  useEffect(() => {
    if (!cfg) router.replace(`/upload/${contractId}`);
  }, [cfg, contractId, router]);

  if (!cfg) return null;

  const spec: SectionSpec = {
    slug: section,
    label: cfg.label,
    formDef: cfg.formDef,
    prompts: KEEPER_PROMPTS[section] ?? [],
    backHref: `/upload/${contractId}`,
    // backLabel omitted — the engine labels it "For {keeper_name}" from the hub.
    proseWidth: 1064,   // banner prose width per 2337:6155
    keeperBanner: true, // centered banner + 10px title→prose gap per 2337:6151
  };

  return <DimensionEngine contractId={contractId} spec={spec} />;
}
