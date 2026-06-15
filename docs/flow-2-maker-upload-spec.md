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
