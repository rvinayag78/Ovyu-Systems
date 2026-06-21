# Flow 2 — The Upload · Overview

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

## Pending Issues

### 1. Voice entries not uploaded to S3
The voice recorder captures audio in the browser but does not yet upload it. Voice entries save with an empty body. The full pipeline needs a presigned PUT endpoint + an upload step after recording.

**Fix:** Wire `VoiceRecorder` → presigned S3 PUT → save S3 key to `dimension_entries`.

### 2. No Amazon Transcribe worker
Voice entries have no transcript, so auto-tagging does not work for voice (only text). Transcription is needed to extract People/Year/Place and generate the entry title automatically.

**Fix (POST-MVP):** Lambda worker triggered after S3 upload → Transcribe → extract tags via Haiku → update entry.

### 3. Auto-tagging is synchronous
Tagging currently blocks the POST entry response (~1 second). For a better experience it should run in the background and update the card asynchronously.

**Fix (POST-MVP):** Move to SQS + Lambda worker; show "tagging…" chip state until complete.

### 4. Prompt decks not yet authored per dimension
The "ADD AN ENTRY" panel cycles through rotating prompt questions to inspire the Maker. Currently all 7 dimensions show the same placeholder deck. Each dimension needs its own unique questions written.

**Fix:** Author 5+ unique prompts per dimension with product owner; store as config so they can be updated without code changes.

### 5. Status circle threshold not confirmed
The status circle fills from empty → partial → full based on entry count. The proposed threshold is 3 entries = full. This is a placeholder — confirm per-dimension targets with product.

### 6. Dashboard Figma alignment (reverted)
The Contract Dashboard, YOU bar, and dimension pages were built and then reverted due to Figma misalignment. These need to be rebuilt correctly from scratch using the Figma workflow (`docs/figma-workflow.md`) — frame by frame, one component at a time.
