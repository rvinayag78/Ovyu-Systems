# Contract (Transfer Contact)

**Figma node:** 141:577  
**Frame:** 1920×1080px  
**Background:** `#f8f7f5`

---

## Description

The Transfer Contact's signing screen. Shows the Transfer Contact Agreement explaining their role, and a signing panel to accept.

---

## Reusable Components

| Component | Used here |
|---|---|
| Header (log in) | Logged-out header (TC has no account) |
| Footer | Black footer |
| Input Label | "Full legal name" + "Date" |

---

## Layout Hierarchy

```
Frame 1920×1080
├── Header (log in) — top: 0, 1924×103px
├── Contract Content — centered (50%/50% translate), flex wrap, gap: 42px 49px, w: 1792px
│   ├── Header text — w: 1177px, flex col, gap: 12px
│   ├── Contract card — 1130×580px
│   ├── Signing panel — 613×580px
│   └── Legal note
└── Footer — top: 977px
```

---

## Header text (w: 1177px, flex col, gap: 12px)

- **Heading:** Georgia Italic 50px `#1a1a1a`
  - "[Name] has named you as their Transfer Contact."
- **Subtitle:** Helvetica Regular 22px `#888`
  - "Read through the contract below. By signing, you accept the responsibility of initiating the Transfer when the time comes."

> **Note:** H1 is 50px (not 64px) — smaller than the Maker/Keeper contract headings.

---

## Contract card (1130×580px)

- **Background:** `#fff`, **Border:** 2px solid `#e1e1e1`, **Border-radius:** 15px
- **Padding:** 60px all sides
- **Layout:** flex col, gap: 42px

### Party heading (Helvetica Bold 22px, flex col, gap: 8px, white-space: nowrap)
- "Ovyu Transfer Contact Agreement" — `#000`
- "Party A (Maker)" — `#8a6e30`
- "Party B (Keeper) Transfer Contact" — `#8a6e30`

### Contract body (Helvetica Regular 18px `#444`, w: 1011px)

Content includes:
- Maker/Keeper/TC names with `[placeholder]` format
- "By signing this agreement, you confirm that you:"
- Bullet list (4 items, list-style: disc, margin-start: 27px, gap between items: 10px):
  1. Understand that the Maker has created a private upload...
  2. Accept the responsibility of notifying Ovyu when the Maker passes...
  3. Will confirm the Keeper's name and email at the time of notification...
  4. All information you provide is handled with strict confidentiality...
- Bold-italic closing note: "If you decline, the Maker will be notified. You can always accept later if the Maker re-sends the invitation." — Helvetica Bold Oblique 18px

---

## Signing panel (613×580px)

- **Background:** `#fff`, **Border:** 2px solid `#e1e1e1`, **Border-radius:** 15px
- **Padding:** top: 50px, bottom: 31px, left: 52px, right: 44px
- **Layout:** flex col, gap: 20px

### "Accept and sign"
- **Font:** Georgia Bold 28px `#000`, white-space: nowrap

### Description
- **Font:** Helvetica Regular 20px `#888`
- "By signing, you confirm you have read and accept this responsibility."

### Input fields (scaled Input Label component)
- Label: Helvetica Bold 20.65px `#444`
- Input: h: 73.548px, border: 1.29px solid `#888`, border-radius: 10px, padding: 12.903px
  - Placeholder: Helvetica Regular 23.23px `#888`

| Field | Placeholder |
|---|---|
| Full legal name | "Type your full name" |
| Date | "Today" |

### "I accept and sign →" button
- **Size:** full width × 62px
- **Background:** `#000`, border-radius: 8px
- **Label:** "I accept and sign →" — Helvetica Bold 20.65px `#f5f0e8`

### Maker notification callout
- **Height:** 43px, w: full
- **Background:** `#f5edd6`, **Border:** 2px solid `#c9a84c`, border-radius: 8px
- **Text:** "The Maker will be notified when you accept and sign." — Helvetica Regular 16px `#000`, text-center

---

## Legal note

- **Font:** Helvetica Oblique 16px `#888`, white-space: nowrap
- "Your digital signature carries the same intent as a handwritten signature within the Ovyu platform."

---

## Typography Scale

| Element | Font | Size | Weight | Color |
|---|---|---|---|---|
| Page heading | Georgia | 50px | Italic | `#1a1a1a` |
| Page subtitle | Helvetica | 22px | Regular | `#888` |
| Party labels | Helvetica | 22px | Bold | `#000`/`#8a6e30` |
| Contract body | Helvetica | 18px | Regular | `#444` |
| Bullet items | Helvetica | 18px | Regular | `#444` |
| Bold-italic note | Helvetica | 18px | Bold Oblique | `#444` |
| Sign heading | Georgia | 28px | Bold | `#000` |
| Sign description | Helvetica | 20px | Regular | `#888` |
| Input label | Helvetica | 20.65px | Bold | `#444` |
| Input placeholder | Helvetica | 23.23px | Regular | `#888` |
| Button | Helvetica | 20.65px | Bold | `#f5f0e8` |
| Callout text | Helvetica | 16px | Regular | `#000` |
| Legal note | Helvetica | 16px | Oblique | `#888` |
