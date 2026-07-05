# Flow 2 — The Upload · Overview

---

## What changed as-built (2026-07-05)

- **Voice entries** use a deliberate 4-step flow: ♪ Voice → ● Record → ■ Stop → Save (10-second minimum; a short take lets you re-record). Saving any entry opens the editor first for review/tagging; the editor's Save returns to the list.
- **Tags** are three fixed columns — Person, Year, Place — and each can hold **multiple values** (extra rows). AI fills what it finds; the Maker adds/removes instantly with + buttons and ×. AI results arriving later (voice transcription) merge in without overwriting the Maker's tags. Transcription is invisible and gives up quietly after 10 minutes.
- **Titles** are AI-suggested from the content (or the first few words); the Maker's own title always wins.
- **"For [Keeper]" cards are now full pages**, not pop-ups: each of the five opens an entries page identical to a dimension (text + voice, tagging, everything). "Who they are" starts with a short facts form about the Keeper. **"Welcome" is a voice recording page** with a suggested script, like the Voice Gate pages.
- **Status Circle**: fills fully at 3 entries (confirmed default).
- See `flow-2-maker-upload-spec.md` §10 for the precise as-built rules.

---

## Plain English Glossary

| Term | What it means |
|------|---------------|
| **The Upload** | Everything the Maker records and writes about themselves — voice, stories, memories, personality. This is what the Keeper receives after the Transfer. |
| **Voice Gate** | Before anything else is unlocked, the Maker must record two things: their name and a voice profile. This ensures the Maker's real voice is always part of the upload. |
| **YOU** | The accordion bar at the bottom of every page. It holds 8 layers of the Maker's self-portrait — Voice + 7 dimensions. Locked until the Voice Gate is complete. |
| **Dimensions** | The 7 categories the Maker fills in to capture their personality and life: History, Relationships, How you think, How you talk, How you live, Beliefs, Heart. |
| **Entries** | Individual stories or recordings within a dimension. A Maker can add as many as they want — text or voice. Each entry gets tagged with a Person, Year, and Place automatically. |
| **The Dashboard** | The main hub the Maker sees after logging in. Shows Messages to the Keeper and the Keeper profile cards. |
| **Messages** | Two special uploads not tied to dimensions: "Welcome" (the first thing the Keeper receives) and "For when" (messages for specific future moments in the Keeper's life). |
| **For [Keeper]** | Five cards about the Keeper themselves — who they are, who they're becoming, what the Maker wants for them, what the Maker wants them to know, and advice. |
| **Status Circle** | A circle next to each dimension that fills up as the Maker adds entries — empty → partial → full (dark purple). Voice is a special case: it goes dark as soon as it's recorded. |
| **Auto-tagging** | After saving an entry, the system automatically extracts a Person, Year, and Place from the text using AI. The Maker can correct any tag. |

---

## How The Upload Works

```
              Contract is LOCKED
                     │
                     ▼
         ┌─────────────────────────┐
         │  VOICE GATE (one time)  │
         │                         │
         │  1. Record your name    │
         │  2. Record your voice   │
         │     profile             │
         └────────────┬────────────┘
                      │ Both recorded
                      ▼
         ┌─────────────────────────┐
         │  THE DASHBOARD          │
         │  (returning Maker hub)  │
         │                         │
         │  MESSAGES               │
         │  ┌──────┐  ┌─────────┐  │
         │  │Welcome│  │For when │  │
         │  └──────┘  └─────────┘  │
         │                         │
         │  FOR [KEEPER NAME]      │
         │  ┌────────┐ ┌────────┐  │
         │  │Who they│ │Who they│  │
         │  │are     │ │'re     │  │
         │  │        │ │becoming│  │
         │  └────────┘ └────────┘  │
         │  ┌────────┐ ┌────────┐  │
         │  │What you│ │What you│  │
         │  │want for│ │want    │  │
         │  │them    │ │them to │  │
         │  │        │ │know    │  │
         │  └────────┘ └────────┘  │
         │  ┌────────┐             │
         │  │Advice  │             │
         │  └────────┘             │
         │                         │
         │  YOU ▸  (accordion bar) │
         └─────────────────────────┘
                      │
                      ▼
         Maker taps YOU bar → expands
         showing 8 layers → taps a
         dimension → fills it in
```

---

## Full Flow Chart

```
FIRST TIME (Voice Gate)
────────────────────────
  /upload/[contractId]          → Dashboard loads, YOU bar shows locked
  /upload/[contractId]/voice/name   → Record name → confirm → save
  /upload/[contractId]/voice/profile → Record voice profile → save
                                   → YOU bar unlocks permanently


RETURNING MAKER (dashboard)
────────────────────────────
  /upload/[contractId]          → Dashboard (for [Keeper name])
  Tap MESSAGES card             → Message editor (Welcome / For when)
  Tap FOR [KEEPER] card         → Keeper profile editor (5 sections)
  Tap YOU bar                   → Accordion expands over page
  Tap a dimension               → Dimension sub-flow (below)


DIMENSION SUB-FLOW (same for all 7 dimensions)
────────────────────────────────────────────────
  (A) Dimension form            → Fill in structured facts about yourself
      "Save and continue →"
                │
                ▼
  (B) Dimension dashboard       → Shows summary bar + ENTRIES list + ADD AN ENTRY panel
      Choose Voice or Text      → (Video coming soon, disabled)
                │
      ┌─────────┴──────────┐
      ▼                    ▼
  (C-text)             (C-voice)
  Type your story      Record your story
      │                    │
      └─────────┬──────────┘
                ▼
  (D) Entry editor           → Add title, tags (Person/Year/Place), structured prompts
      "Save"
                │
                ▼
  (E) Dashboard with entry   → New card appears in ENTRIES list
                               Loop back to add another entry
```

---

## The 8 YOU Layers (canonical order)

| # | Layer | What it captures | Status circle |
|---|-------|-----------------|---------------|
| 1 | **Voice** | How the Maker sounds — name + voice profile recordings | Dark purple once recorded |
| 2 | **History** | Childhood, schools, milestones, the turning points | Fills as entries are added |
| 3 | **Relationships** | The people who shaped them, how they love, how they fight | Fills as entries are added |
| 4 | **How you think** | How they decide, process, land on answers | Fills as entries are added |
| 5 | **How you talk** | Catchphrases, inside jokes, the way they say things | Fills as entries are added |
| 6 | **How you live** | Habits, rituals, the texture of their daily life | Fills as entries are added |
| 7 | **Beliefs** | What they believe, what they'd stand up for | Fills as entries are added |
| 8 | **Heart** | What moves them, what they love, what lights them up | Fills as entries are added |

The YOU bar is **always visible** on every upload page, collapsed at the bottom. Tapping it expands the 8 layers as an overlay — it does not push page content down.

---

## UI Spec

### Design system (from Figma file `7eUxhN3sNdvXaPcwUhIlfh`)

| Element | Value |
|---------|-------|
| Page background | `#f8f7f5` (cream) |
| Primary text | `#1a1a1a` (black) |
| Secondary text | `#888888` (dark grey) |
| Lavender (YOU bar, dimension cards) | `#6a4d7d` |
| Lavender fill (YOU bar bg expanded) | `#efeaf2` |
| Pink (MESSAGES section label) | `#8e5e6e` |
| Pink fill (MESSAGES cards) | `#f4e8ec` |
| Gold (section labels) | `#c9a84c` |
| Status circle empty | `#e9e2f2` (light lilac outline) |
| Status circle full | `#5b4b7a` (dark purple) |
| YOU bar height | 70px |
| Header height | 103px |
| Footer height | 103px |
| Canvas width | 1920px |
| Heading font | Georgia, serif — italic, 64px |
| Body font | Helvetica Neue, Helvetica, Arial, sans-serif |
| Cards | White / lavender fill, `border-radius: 8px` |

### Key Figma frame nodes

| Screen | Node |
|--------|------|
| Dashboard (returning Maker) | `2004:1726` |
| YOU accordion expanded | `2005:1923` |
| History form (A) | `2044:694` |
| History dashboard (B) | `2045:1116` |
| Add text entry (C-text) | `2062:1016` |
| Add voice entry (C-voice) | `2095:6793` |
| Entry editor — text (D) | `2182:7663` |
| Entry editor — voice (D) | `2182:7611` |
| Heart form (A) | `2062:2981` |
| Heart dashboard (B) | `2062:3155` |

---

## Backend Table Flow

### Tables involved

| Table | Purpose |
|-------|---------|
| `uploads` | One row per contract — tracks overall upload progress |
| `voice_recordings` | Stores S3 keys for name + voice profile recordings |
| `dimensions` | One row per dimension per upload — stores structured form answers |
| `dimension_entries` | Individual stories/recordings within a dimension |
| `people` | Canonical list of people mentioned across all entries and forms |
| `years` | Canonical list of years/dates mentioned |
| `places` | Canonical list of places mentioned |
| `keeper_messages` | Welcome + For when messages |
| `keeper_profile` | The 5 Keeper profile cards (who they are, etc.) |

### What happens per event

| Event | Tables written |
|-------|---------------|
| Maker records name | `voice_recordings` (type=name), `uploads.voice_name_status` |
| Maker records voice profile | `voice_recordings` (type=profile), `uploads.voice_profile_status` → YOU bar unlocks |
| Maker saves dimension form (A) | `dimensions` row upserted — structured fields stored |
| History form saved | `people`, `years`, `places` populated from form facts (parents, siblings, DOB, homes) |
| Maker saves an entry (text) | `dimension_entries` row created → auto-tagging triggered (Haiku) |
| Maker saves an entry (voice) | `dimension_entries` row created, audio uploaded to S3 → transcription queued (POST-MVP) |
| Auto-tagging completes | `dimension_entries.tags` updated with `{people, year, place}` |
| Maker saves a message | `keeper_messages` row upserted |
| Maker saves keeper profile | `keeper_profile` row upserted |

### Auto-tagging
After every text entry is saved, the backend calls **AWS Bedrock Claude Haiku** to extract a Person, Year, and Place from the text. This runs synchronously on save (~1 second). If extraction fails, tags default to `unknown` — the Maker can correct them from the entry card.

---

## Implementation Status

*Last updated: 2026-06-21*

### ✅ COMPLETE — Frontend

| Screen | Route | Status | Notes |
|--------|-------|--------|-------|
| Voice Gate — Your Name | `/upload/[contractId]/voice/name` | ✅ Done | MediaRecorder + script card + confirm checkbox + presigned S3 upload |
| Voice Gate — Sound of You | `/upload/[contractId]/voice/profile` | ✅ Done | MediaRecorder + two-panel script + presigned S3 upload |
| Upload Hub (Dashboard) | `/upload/[contractId]` | ✅ Done | For [Keeper], MESSAGES cards, Keeper profile cards, YOU bar |
| Dimension Form (A) — all 7 | `/upload/[contractId]/[dimension]` | ✅ Done | 3-column card; DOB mask+validation; City/Country typeahead; Language typeahead; `+ Add more` multi-fields |
| Entries View (B/C) — all 7 | same route | ✅ Done | Lavender banner card; 800px 2-col layout; rotating questions (click-to-highlight); 433px entry card; animated waveform; 3 mode buttons (253×70px); Save 255×71px |
| Voice recording — dimension entries | same route | ✅ Done | MediaRecorder → animated bars → Record/Save → presigned S3 PUT → `addDimensionEntry` with `media_s3_key` |
| Entry edit view (D) | same route (inline state) | ✅ Done | Inline (not modal); banner stays; ENTRY label; circle × close; tag chips with ×; `+ Add Person/Year/Place`; ✎ edit body; voice read-only with waveform; "Someone worth naming?" + "A time that mattered?" forms; Save 204px lavender |
| Delete entry | same route | ✅ Done | `…` menu → delete → `deleteDimensionEntry` |
| YOU bar | all dimension pages | ✅ Done | 70px `#efeaf2`; current dim bold purple; others grey; all 7 links wired |
| AI auto-tags display | entry cards | ✅ Done | `people / year / place` chips from API response; no manual fallback chips (unknown excluded if empty) |
| Structured data prose in banner | history + all dims | ✅ Done | History: prose format per Figma; other dims: `Field: value · …` format |

### ✅ COMPLETE — Backend

| Feature | Status | Notes |
|---------|--------|-------|
| Upload hub endpoint | ✅ Done | `GET /contracts/{id}/upload/hub` |
| Keeper profile CRUD | ✅ Done | `GET/PUT /contracts/{id}/upload/keeper-profile` |
| Messages CRUD | ✅ Done | `GET/POST/DELETE /contracts/{id}/upload/messages` |
| Dimension form upsert | ✅ Done | `PUT /upload/dimensions/{slug}` with triangulation |
| Dimension entry CRUD | ✅ Done | `POST/PUT/DELETE /upload/dimensions/{slug}/entries` |
| Entry auto-tagging (text) | ✅ Done | Bedrock Claude Haiku; synchronous; returns `{people[], year, place}` |
| History triangulation | ✅ Done | Populates People/Places/Years store from form facts; dedupes |
| Voice presigned upload — name/profile | ✅ Done | `POST /upload/voice/presigned?voice_type=name|profile` |
| Entry media presigned upload — dimensions | ✅ Done | `POST /upload/dimensions/{slug}/entries/media-presigned` |
| Amazon Transcribe worker | ✅ Done | `ovyu-transcribe-worker-staging` Lambda; SQS-triggered from POST voice entry; polls Transcribe → reads transcript → Haiku tags → updates `dimension_entries.body/title/tags`; voice entry cards show "transcribing…" chip while pending |

---

## Pending Issues / TODO

### 🔴 MVP blocker

| # | Issue | Impact |
|---|-------|--------|
| 1 | **Prompt decks need 10 unique questions per dimension** | Currently 5 working-copy prompts per dim coded in `DimensionClient.tsx`. User will provide final 10 per dim — need a content swap pass once provided |

### 🟡 Post-MVP / Quality

| # | Issue | Fix path |
|---|-------|----------|
| 2 | **Auto-tagging is synchronous for text** | Blocks POST entry response ~1s. Move to SQS + Lambda worker; show "tagging…" chip until complete |
| 3 | **StatusCircle threshold not confirmed** | 3 entries = full is a placeholder. Confirm per-dimension target with product |
| 4 | **Voice dimension entries have no playback UI** | The edit view shows a static decorative waveform; no play/pause. Needs audio playback wired to S3 URL once signed |
| 5 | **Video entry mode** | Button is disabled ("Video soon"). Full video record + upload pipeline not planned for MVP |
| 6 | **VoiceName / VoiceProfile use manual `fetch()`** | Bypass centralized error handling in `api.ts`. Migrate to `api.getVoicePresigned` / `api.completeVoice` for consistency |
