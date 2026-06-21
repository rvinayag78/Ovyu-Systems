# Flow 2 — Maker Upload · UX Spec

> **Source of truth** for Flow 2 ("FLOW TWO // MAKER UPLOAD"). Every string inside `"` is verbatim from the frames and must not be rewritten.
>
> Source: Figma file `ovyu • frames • flow-two`, file key `7eUxhN3sNdvXaPcwUhIlfh`.
>
> Status: **work in progress** — being assembled frame by frame with the product owner. Frames marked _coded_ already exist in the app and are the baseline; new work begins after them.

---

## 0. Baseline — already coded (do not rebuild)

These frames exist and are the entry point for Flow 2. They are listed only to anchor the navigation graph.

| Step | Screen | Frame node | Status |
|------|--------|-----------|--------|
| 1 | Home Page → log in | `3:2` | coded |
| 2 | Log In — enter email | `2003:1302` | coded |
| 3 | Magic-link email received → click → lands on Profile Dashboard | (email) | coded |
| 4 | Profile Dashboard — first visit; "Your contract" card shows a **"View contract"** button (first time only) | `2024:738` | coded |
| 4a | Click **"View contract"** → Signed Contract (Maker & Keeper) | `2022:574` | coded |
| 4b | On contract: **"Ready to begin, start with your voice"** → Profile Dashboard | `2026:583` | coded |

**Also already coded / complete:**
- All **Entry / Auth** screens: Home Page, Logged Out, Log In, Email Auth, Account, Contact, Contact (message received).
- **Profile Dashboard** sections: **"Your contract / Ready to upload"**, **"Your Name"**, and **"The sound of you"** are all complete. The Profile Dashboard **upload** is also complete.

> New design/build work begins at the frame **after `2026:583`**. The sections below will document those frames as they are walked through.

---

## 1. Navigation graph (live — updates as we go)

```
Home Page (3:2)
  └─ log in ─▶ Log In (2003:1302)
       └─ enter email ─▶ magic-link email
            └─ click link ─▶ Profile Dashboard — first visit (2024:738)
                 └─ "View contract" ─▶ Signed Contract (Maker & Keeper) (2022:574)
                      └─ "Ready to begin, start with your voice" ─▶ Profile Dashboard (2026:583)
                           └─ ... (first-time onboarding: Your Name + Sound of you 2026:696)

Returning Maker (name + Sound of you already done)
  └─ log in ─▶ Contract Dashboard (2004:1726)  [YOU accordion unlocked]
       ├─ tap "YOU" bar ─▶ accordion expands over page (2005:1923)
       │    └─ tap a layer (History / Relationships / How you think /
       │        How you talk / How you live / Beliefs / Heart) ─▶ that dimension form
       └─ tap a MESSAGES / ILIAS card ─▶ (to be documented)
```

---

## 2. First-time vs returning Maker

The first-time upload onboarding (Profile Dashboard → "Your Name" → "The sound of you") runs **only once**. The frames `2024:738` and `2026:583`/`2026:696` (Sound of you) do **not reappear** once completed.

| Situation | Lands on | Frame |
|-----------|----------|-------|
| **First time** starting upload | Profile Dashboard onboarding (name + Sound of you) | `2024:738` → `2026:583` → `2026:696` (all coded) |
| **Returning** Maker logs in (name + Sound of you already done) | Dashboard with the **YOU accordion unlocked** | `2004:1726` (Contract Dashboard) |

- `2026:696` ("Sound of you") is **coded**.
- The **YOU accordion is locked** before the first upload, and **unlocks** once the Maker finishes **"Your Name"** and **"The sound of you."** After that it is **always unlocked**.

---

## 3. The "YOU" accordion (global component)

> Appears on **every page after login**. It is the Maker's own self-portrait (their voice + 7 dimensions). Distinct from the per-Keeper contract content ("For Ilias").

### Global rules
- **Header and footer are identical on every page** — never remove them. The accordion sits **between** them.
- The accordion **expands and collapses as an overlay** — it animates **up over the page content**, it does **not** push the page content down.
- **Collapsed:** a single bar reading **`YOU`** followed by the 8 layer names inline, with a chevron (`>` collapsed / `v` expanded) at the far right.
- **Locked** until first upload complete (name + Sound of you); **unlocked** permanently thereafter.
- Each unlocked layer row is clickable (chevron `>`) and opens that dimension's form (Section 5). **Voice** has no chevron — instead it reads "Facial expressions and video coming soon."

### The 8 layers (canonical order + verbatim subtitles)

| # | Layer | Subtitle (verbatim) | Opens |
|---|-------|---------------------|-------|
| 1 | **Voice** | "Facial expressions and video coming soon." | (no form — set during Sound of you) |
| 2 | **History** | "Childhood, schools, milestones, the turning points." | History (form) |
| 3 | **Relationships** | "The people who shaped you, how you love, how you fight." | Relationships (form) |
| 4 | **How you think** | "How you decide, process, land on answers." | How you think (form) |
| 5 | **How you talk** | "Catchphrases, inside jokes, the way you say things." | How you talk (form) |
| 6 | **How you live** | "Habits, rituals, the texture of your daily life." | How you live (form) |
| 7 | **Beliefs** | "What you believe, what you'd stand up for. Your worldview and ideologies." | Beliefs (form) |
| 8 | **Heart** | "What moves you. What you love, what you can't stand, what lights you up." | Heart (form) |

### Status circle (per layer) — fill logic (PROPOSED)

Each layer has a circular status indicator on its left.
- **Voice** is **dark purple** from the start because the recording is binary — once the Sound of you is recorded, it is done.
- All other layers start **light lilac (empty)** and should deepen toward **dark purple** as the Maker adds content.

Open question from product owner: *when does a circle become dark purple?* Proposed model — a **3-state fill** driven by entries per dimension:

| State | Trigger | Visual |
|-------|---------|--------|
| **Empty** | 0 entries | Light lilac outline circle (`#E9E2F2`-ish), no fill |
| **Started** | 1 entry up to threshold − 1 | Medium purple, or a ring filled proportionally (entries ÷ threshold) |
| **Full (dark)** | entries ≥ threshold (suggested **3**), or Maker marks the dimension "done" | Solid dark purple (`#5B4B7A`-ish, matching the Voice circle) |

Rationale: a binary empty/dark would feel punishing on a 7-part task; a graduated ring rewards incremental progress and gives the dashboard a visible sense of the portrait "filling in." Threshold of 3 is a placeholder — confirm per-dimension targets with product. (Voice stays a special case: dark on record.)

---

## 4. Contract Dashboard — `2004:1726`

The dashboard a returning Maker lands on (accordion unlocked, collapsed at the bottom).

- **Header (global):** `ovyu` wordmark (left); `Activate Transfer` link + circular avatar (initial "L") (right).
- **Breadcrumb:** `< Your contracts`
- **Title (serif H1):** "For Ilias"  ·  subtitle (italic): "A bit of you. Started today."
- **Section `MESSAGES`** (two cards, pink fill, each with a circular status indicator top-right):
  - **"Welcome"** — "The first thing received upon transfer."
  - **"For when"** — "Messages for specific moments. Scheduled delivery coming soon."
- **Section `ILIAS`** (cards, lilac fill, circular status indicator each):
  - **"Who they are"** — "Their story, history, birth dates, context. Your relationship to them."
  - **"Who they're becoming"** — "Who they are now, their hopes, the person they're turning into."
  - **"What you want for them"** — "Your hopes for their life. The shape you hope it takes."
  - **"What you want them to know"** — "How you feel about them. Praise, acknowledgment, things worth naming."
  - **"Advice"** — "Counsel for happy times and hard times. What you imagine them needing."
- **YOU accordion** (collapsed bar, Section 3) pinned above the footer.
- **Footer (global):** `CONTACT  ABOUT` (left) · fine print "OVYU DOES NOT SHARE, SELL, OR RETAIN PERSONAL DATA, INCLUDING UPLOAD, CONTRACT, AND CONVERSATIONS, BEYOND WHAT IS REQUIRED TO OPERATE THIS SERVICE." (center) · "@ 2026 OVYU  MANAGE COOKIES | LEGAL | PRIVACY" (right).
- **Expanded state:** `2005:1923` — accordion drops over the page; rows as listed in Section 3.

---

## 5. Dimension sub-flow (applies to ALL 7 dimensions)

The seven dimensions to build are **History, Relationships, How you think, How you talk, How you live, Beliefs, Heart**. They are **identical in structure** — same screens, same components, same transitions. Only the copy differs (title, subtitle, form fields, prompt questions, summary template). **Build one parameterised dimension component and feed it per-dimension content.**

`Heart` is documented below as the canonical example. Node IDs for all seven are in Section 6.

### Sub-flow sequence

```
YOU accordion ─ tap a layer ─▶  (A) Dimension form  [first time only / via "edit"]
                                     │ Save and continue →
                                     ▼
                                (B) Dimension dashboard  ("add entry")
                                     │   choose Voice or Text   (Video = "soon", disabled)
                        ┌────────────┴────────────┐
                        ▼                          ▼
              (C-text) ADD TEXT ENTRY     (C-voice) ADD VOICE ENTRY
              textarea, Save              waveform + record, Save
                        └────────────┬────────────┘
                                     ▼
                                (D) Entry editor  ("save … entry")
                                enrich: people / year / place + structured prompts
                                     │ Save
                                     ▼
                                (E) Dashboard with new entry card in ENTRIES list
                                     (loop back to add another)
```

### (A) Dimension form — `Heart (form)` `2062:2981`
The common "fill-in" page reached when a dimension is first opened (and via **edit** later).
- Header (global) + breadcrumb `< Your contracts`.
- Serif H1 **"Heart"**, italic subtitle **"What you love, and how."**
- One large card holding labelled short-answer fields in three columns. Each field = bold label + `Your answer` input + italic `e.g., …` helper. Repeatable fields have a **`+ Add more`** affordance.

| Field label | Helper (verbatim) | Add more? |
|---|---|---|
| How you love | "e.g., hard and fast, slow to start, forever once I do, all in" | – |
| How you forgive | "e.g., easily, never, after time, only when it's earned" | – |
| How deeply you feel | "e.g., loud and visible, deep but quiet, intensely, hard to access" | – |
| How you express what's inside | "e.g., words, music, painting, cooking, building, in silence" | ✓ |
| Things you love | "e.g., the ocean, jazz, the smell of rain, a long drive" | ✓ |
| Who you love | "e.g., your kids, your dog, your oldest friend" | ✓ |
| What you find beautiful | "e.g., old buildings, your grandmother's handwriting, the desert, hands" | ✓ |
| What makes you laugh | "e.g., your kids, slapstick, the way your partner tells stories" | ✓ |
| What you can't stand | "e.g., cruelty, small talk, slow walkers, dishonesty" | ✓ |

- Primary CTA (black): **"Save and continue →"** → goes to (B).

### (B) Dimension dashboard — `Heart (add entry)` `2062:3155`
The critical per-dimension hub.
- **Summary title bar** (lilac), populated from the (A) answers, with a status circle on the left and an **edit** link (→ back to form A):
  - "Heart" + "Loves: [how] · Forgives: [how] · Feels: [how deeply] · Expresses through [answer] · Loves [things] · Loves [people] · Finds beautiful: [answer] · Laughs at: [answer] · Can't stand: [answer]"
- **Left column `ENTRIES`** — empty state: "Your stories live here. Add your first entry." Once entries exist they render as cards (see Entry card below).
- **Right column `ADD AN ENTRY`** — a card cycling reflective **prompt questions** (faded above/below, one in focus), e.g.:
  - "When was the first time you felt like an adult?"
  - "What did home smell like when you were young?"
  - **"What's a choice you made young that still holds?"** (focused)
  - "When did you first feel really proud of yourself?"
  - "What's a sound from your past you can still hear?"
- **Mode buttons:** **`♪ Voice`** (purple, default selected) · **`✎ Text`** (white) · **`● Video (soon)`** (greyed, disabled).
- **`Save`** button — disabled (light) until there is content.

### (C-text) Add text entry — `Heart (add entry // text)` `2062:3497`
- Right panel header changes to **`ADD TEXT ENTRY`**.
- The prompt card becomes a large **textarea**, placeholder **"Start typing here…"**.
- Mode buttons remain; **Save** becomes active (purple). Save → (D).

### (C-voice) Add voice entry — `Heart (add entry // voice)` `2083:4778`
- Right panel header changes to **`ADD VOICE ENTRY`**.
- The card becomes a **waveform** recorder area.
- Per product owner: the **`Voice`** button changes to a **`RECORD`** button; tapping it records; the waveform animates; **Save** completes & saves the recording. Save → (D).

### (D) Entry editor — `Heart (save text entry)` `2182:5392` · `Heart (save voice entry)` `2131:5014`
Shared editor for BOTH text and voice (only the body differs). Heading **`ENTRY`**, dismiss **✕** top-right.
- **Title** (e.g., "The day I met my best friend" / "This is the story of when I got lost in Tokyo…").
- **Meta line:** "Text · April 14, 2026"  /  "Voice · April 14, 2026 · 2:35".
- **Tag chips:** e.g. `Kalee` `2013` `Paris`  /  `Sofia` `2021` `Tokyo`.
- **Add-metadata buttons:** `+ Add Person`  `+ Add Year`  `+ Add Place`.
- **Body:**
  - *Text:* the written story in a panel with a ✎ edit icon.
  - *Voice:* audio **play / pause / stop** controls + waveform.
- **Structured prompts (both):**
  - *"Someone worth naming?"* → **WHAT YOU CALL THEM** (helper "Mum • Auntie N • Whatever you actually say") · **FULL NAME** (helper "First and last, if you know it.")
  - *"A time that mattered?"* → **WHAT HAPPENED** (helper "Born · Moved · Married · A child arrived · Someone left") · **WHEN** (helper "A day, a month, a year, or a span. April 14, 2003 · 2015 to 2019")
- **`Save`** (purple) → (E).

### (E) Dashboard with saved entry — `…(add entry // text/voice entry in)` `2062:3319` / `2088:5034`
- The new entry now appears as a **card** in the left `ENTRIES` list:
  - Title · meta ("Text · date" or "Voice · date · duration") · tag chips · `…` overflow menu.
- Right panel returns to `ADD AN ENTRY` (prompt rotator) ready for the next entry.

---

## 6. Per-dimension frame index

All seven dimensions repeat the (A)–(E) states above. Field copy / prompt copy for the other six still needs to be captured from their `(form)` and `(add entry)` frames — structure is identical to Heart.

| Dimension | form (A) | add entry (B) | text (C) | text entry in (E) | save text (D) | voice (C) | voice entry in (E) | save voice (D) |
|---|---|---|---|---|---|---|---|---|
| **History** | 2044:694 | 2045:1116 | 2062:1016 | 2062:1195 | 2182:7663 | 2095:6793 | 2095:6746 | 2182:7611 |
| **Relationships** | 2062:1400 | 2062:1451 | 2062:1533 | 2062:1487 | 2182:7273 | 2095:6401 | 2095:6354 | 2182:7221 |
| **How you think** | 2062:1893 | 2062:1944 | 2062:2026 | 2062:1980 | 2182:6883 | 2095:6013 | 2095:5966 | 2182:6831 |
| **How you talk** | 2062:2386 | 2062:2437 | 2062:2519 | 2062:2473 | 2182:6493 | 2093:5633 | 2093:5587 | 2182:6441 |
| **How you live** | 2062:2879 | 2062:3083 | 2062:3411 | 2062:3227 | 2182:6103 | 2091:5268 | 2091:5221 | 2182:6051 |
| **Beliefs** | 2062:2930 | 2062:3119 | 2062:3454 | 2062:3273 | 2182:5713 | 2083:4287 | 2083:3491 | 2182:5661 |
| **Heart** | 2062:2981 | 2062:3155 | 2062:3497 | 2062:3319 | 2182:5392 | 2083:4778 | 2088:5034 | 2131:5014 |

---

## 7. History — full detail

History is the first dimension being built out. Its (A)–(E) states follow Section 5; the History-specific copy and rules are below.

### (A) History form — `2044:694`
- Serif H1 **"History"**, subtitle **"Where you come from. Who you come from."**
- Three-column card of labelled fields. Verbatim labels + placeholders:

| Column | Label | Placeholder (verbatim) | Add more? | Notes |
|---|---|---|---|---|
| L | Full name | "Your full name, exactly as you write it" | – | |
| L | Goes by | "What people actually call you" | – | |
| L | Date of birth | "MM/DD/YYYY" | – | **Validate format MM/DD/YYYY** |
| L | Place of birth | "City, Country" | – | **City/Country typeahead** |
| L | Where you're from | "Culture, ethnicity, the place that shaped you" | ✓ | |
| L | Homes | "Where?" | ✓ | place typeahead; ordered list (see summary "Home 1 → Home 2 → …") |
| M | Parents | "Full name" | ✓ | |
| M | Siblings | "Full name" | ✓ | |
| M | Partners | "City, Country" | ✓ | ⚠ placeholder likely a copy/paste bug — should be "Full name". Confirm. |
| M | Children | "Culture, ethnicity, the place that shaped you" | ✓ | ⚠ placeholder likely a copy/paste bug — should be "Full name". Confirm. |
| R | Languages | "Add a language" | ✓ | **Language typeahead** |

> **Decision (locked):** Partners → placeholder **"Full name"**; Children → placeholder **"Full name"** (the Figma "City, Country" / "Culture, ethnicity…" placeholders are copy/paste bugs).

- CTA (black): **"Save and continue →"** → History dashboard (B).

### (B) History dashboard — `2045:1116`
- **Summary title bar** template (populated from A):
  - "[Full name] · Born [date] in [place of birth] · From [where you're from] · Parents: [parent names] · Siblings: [sibling names] · Partners: [partner names] · Children: [children names] · Languages: [languages]"
  - second line: "[Home 1] → [Home 2] → [Home 3] → …"
  - status circle (left) + **edit** link (→ form A).
- `ENTRIES` empty state: "Your stories live here. Add your first entry."
- `ADD AN ENTRY` rotating prompt deck (focused item centered, others faded). **This deck is the SAME set seen on Heart** → prompts appear to be a shared/generic deck, not dimension-specific:
  - "When was the first time you felt like an adult?"
  - "What did home smell like when you were young?"
  - **"What's a choice you made young that still holds?"** (focused)
  - "When did you first feel really proud of yourself?"
  - "What's a sound from your past you can still hear?"
- **♪ Voice** (default) · **✎ Text** · **● Video (soon)** (disabled) · **Save** (disabled until content).

### (C/D/E) Text & Voice — `2062:1016` (text) · `2095:6793` (voice) · editors `2182:7663` (text) / `2182:7611` (voice) · saved-list `2062:1195` (text) / `2095:6746` (voice)
Same as Heart's (C)–(E). For voice, the **Voice** button becomes a **RECORD** button; record → Save completes & saves; a card appears in `ENTRIES`.

### Entry card + overflow menu
Each saved card shows: **title**, meta ("Voice/Text · date [· duration]"), and **3 tag chips** (People · Year · Place). A **`…`** button opens a menu:
- **✎ edit** → opens the entry editor (D)
- **✕ delete** → removes the entry

---

## 8. Entry auto-tagging + fact triangulation (NEW — needs build decision)

> Product owner (Raji): *"These facts (names, births, homes, family) feed the backend triangulation too, same as entry tags. They should populate people/years/places automatically, not just sit as form fields. Watch for duplicates where a fact comes from both the form and an entry."*

### 8.1 What needs tagging
Every entry card carries **3 tags**: **People/Name**, **Year**, **Place**. These must be **auto-detected** from the entry's text (or the voice transcript). If a tag can't be found, store it as **`unknown`** (still shown as a chip so the Maker can fill it via `+ Add Person/Year/Place`).

### 8.2 Recommended approach (simple + cost-effective)
| Modality | Pipeline |
|---|---|
| **Text entry** | one structured **Claude Haiku** call → `{ people: [], year: "", place: "" }` |
| **Voice entry** | **Amazon Transcribe** → transcript → same Haiku extraction call. (Transcript also feeds the auto-generated card title, e.g. "This is the story of when I got lost in Tokyo…") |

**Decision (locked): Bedrock Claude Haiku** (`us.anthropic.claude-haiku-4-5`). Cost comparison on the AWS stack:
- Haiku per entry: ~300–700 in + ~50 out tokens ≈ **~$0.001/entry** (~$1 per 1,000 entries).
- Local spaCy in Lambda: ~**$0.00003/entry** raw compute — marginally cheaper but heavier deploy, cold starts, lower name recall, no auto-title.
- **Dominant cost is Amazon Transcribe** for voice (~$0.024/min ⇒ ~$0.06 per 2.5-min clip), required in both paths.

Net: at this scale Haiku tagging is rounding error next to Transcribe, gives better accuracy (matters for a legacy product) and a free auto-title, and reuses the model already designated in CLAUDE.md. Haiku wins on total cost of ownership.

- Run extraction **async** (SQS + Lambda worker per the stack) right after save; show a "tagging…" state on the card, then fill chips. Falls back to `unknown` on low confidence.

### 8.3 Triangulation store (form facts + entry tags → one graph)
The History **form facts** (full name, goes-by, DOB/year, place of birth, homes, parents, siblings, partners, children, languages) must also **populate the people/years/places store** — not just live as form fields.

- Maintain a per-contract canonical set of **People**, **Years**, **Places**. Both **form facts** and **entry tags** write into it.
- **Dedupe** on a normalized key:
  - People: lowercase + trim + nickname/alias linking ("Goes by" ↔ full name; "Mum" ↔ full name from the entry editor's "Someone worth naming?").
  - Years: normalize to a 4-digit year (or range).
  - Places: normalize "City, Country" (consider geocode/canonical id).
- **Watch the form↔entry duplicate case** Raji flagged: a parent named in the form and again mentioned in an entry should resolve to **one** person node, not two.

### 8.4 Form input helpers / validation (History form)
| Field | Helper / validation |
|---|---|
| Date of birth | Masked **MM/DD/YYYY** input; reject malformed dates; consider a date picker. Feeds Year into triangulation. |
| Place of birth / Homes / (Partners?) | **City, Country typeahead** — suggest as the user types so they can click a `City, Country` instead of typing it fully. Backing data: a static cities dataset (e.g. GeoNames) for client-side fuzzy search, or a Places autocomplete API. Country list is small/static. |
| Languages | **Language typeahead** from a static ISO 639 language list (free, bundled). |

> **Decision (locked): prompt decks are UNIQUE per dimension.** ⚠ Note: the current Figma frames show the *same* placeholder deck on History and Heart, so the real per-dimension questions are **not yet authored**. Each dimension needs its own ~5+ rotating prompts written before build (or a content task to author them). Track them in Section 9.

---

## 9. Per-dimension prompt decks (to author — unique per dimension)

The "ADD AN ENTRY" rotating deck must be unique per dimension. The Figma placeholder deck (shown on History & Heart) is:
1. "When was the first time you felt like an adult?"
2. "What did home smell like when you were young?"
3. "What's a choice you made young that still holds?"
4. "When did you first feel really proud of yourself?"
5. "What's a sound from your past you can still hear?"

| Dimension | Real prompts |
|---|---|
| History | _to author_ |
| Relationships | _to author_ |
| How you think | _to author_ |
| How you talk | _to author_ |
| How you live | _to author_ |
| Beliefs | _to author_ |
| Heart | _to author_ |

> Build note: store the deck per dimension as config/data so prompts can be edited without code changes.
>
> Implementation note: the frontend `PROMPTS` map in `frontend/src/app/upload/[contractId]/[dimension]/page.tsx` already holds a **unique deck per dimension** (working copy authored in code) — confirm/replace the wording with product. The Figma placeholder deck is unrelated.

---

## 10. Implementation status

*Last updated: 2026-06-21. All 7 dimensions + voice gate + hub are complete for MVP.*

### ✅ Complete — Backend

| Feature | Notes |
|---------|-------|
| Upload hub endpoint | `GET /contracts/{id}/upload/hub` — returns keeper name, voice status, dimension counts |
| Keeper profile CRUD | `GET/PUT /contracts/{id}/upload/keeper-profile` |
| Messages CRUD | `GET/POST/DELETE /contracts/{id}/upload/messages` |
| Dimension form upsert (all 7) | `PUT /upload/dimensions/{slug}` — stores structured form fields |
| History triangulation | Populates People/Places/Years store from form facts (parents, siblings, partners, children, DOB, homes); dedupes case-insensitively |
| Dimension entry CRUD (all 7) | `POST/PUT/DELETE /upload/dimensions/{slug}/entries` |
| Entry auto-tagging (text) | Bedrock Claude Haiku (`us.anthropic.claude-haiku-4-5`); synchronous on POST; returns `{people[], year, place}`; graceful fallback to empty |
| Voice presigned upload — name/profile | `POST /upload/voice/presigned?voice_type=name|profile` → presigned S3 PUT |
| Entry media presigned upload | `POST /upload/dimensions/{slug}/entries/media-presigned` → presigned S3 PUT for voice dimension entries |

### ✅ Complete — Frontend

| Screen | Route | Figma frames | Notes |
|--------|-------|-------------|-------|
| Voice Gate — Your Name | `/upload/[contractId]/voice/name` | `2026:583` | MediaRecorder + script card + confirm checkbox + presigned S3 PUT |
| Voice Gate — Sound of You | `/upload/[contractId]/voice/profile` | `2026:696` | MediaRecorder + two-panel script + presigned S3 PUT |
| Upload Hub (Dashboard) | `/upload/[contractId]` | `2004:1726` / `2005:1923` | For [Keeper], MESSAGES cards (pink), Keeper profile cards (lavender), YOU accordion |
| Dimension Form (A) — all 7 | `/upload/[contractId]/[dimension]` | per Section 6 | 3-column card; DOB mask + validation; City/Country typeahead; Language typeahead; `+ Add more` multi-fields |
| Entries View (B/C) — all 7 | same route | `2062:1016` / `2095:6793` | Lavender banner card (avatar + prose + edit link); 800px 2-col layout (ENTRIES + ADD AN ENTRY); rotating question carousel with click-to-highlight; 433px entry textarea / animated waveform; 3 mode buttons (253×70px); Save 255×71px |
| Voice recording — dimension entries | same route | `2095:6793` | MediaRecorder → animated 24-bar waveform → Save = stop + presigned S3 PUT → `addDimensionEntry` with `media_s3_key` |
| Entry edit view (D) — all 7 | same route (inline state swap) | `2182:7663` / `2182:7611` | Inline (not modal); banner card stays; title + tag chips with ×; `+ Add Person/Year/Place`; ✎ toggle body editing; voice = read-only waveform + re-record note; "Someone worth naming?" + "A time that mattered?" structured prompts; Save 204px lavender |
| Delete entry | same route | — | `…` menu → delete → `deleteDimensionEntry` |
| YOU bar | all dimension pages | — | 70px `#efeaf2`; current dim bold purple; others grey; all 7 links wired |
| AI auto-tags display | entry cards | — | `people / year / place` chips from API response; `unknown` excluded if empty; chips removable in edit view |
| Structured data prose in banner | all 7 dims | — | History: full prose format (name · born · parents · siblings · etc.); other dims: `Field: value · …` format |

### 🔴 MVP Blockers

| # | Issue | Impact |
|---|-------|--------|
| 1 | **Prompt decks need 10 unique questions per dimension** | Currently 5 working-copy prompts per dim in `DimensionClient.tsx` `PROMPTS` map. User to provide final 10 per dim — content swap pass needed |

### 🟡 Post-MVP / Quality

| # | Issue | Fix path |
|---|-------|----------|
| 3 | **Auto-tagging is synchronous** | Blocks POST entry response ~1s. Move to SQS + Lambda worker; show "tagging…" chip until complete |
| 4 | **StatusCircle threshold not confirmed** | 3 entries = full is a placeholder. Confirm per-dimension target with product |
| 5 | **Voice dimension entries have no playback UI** | Edit view shows decorative waveform; no play/pause. Needs audio playback wired to S3 presigned URL |
| 6 | **Video entry mode** | Button disabled ("Video soon"). Full video record + upload pipeline not planned for MVP |
| 7 | **VoiceName / VoiceProfile use manual `fetch()`** | Bypass centralized error handling in `api.ts`. Migrate to `api.getVoicePresigned` / `api.completeVoice` for consistency |
