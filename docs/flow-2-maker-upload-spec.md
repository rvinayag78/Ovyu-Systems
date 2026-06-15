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

## 5. Dimension forms

_(Captured one at a time with the product owner. Each will get: purpose, verbatim copy, layout, interactive elements, and transitions.)_
