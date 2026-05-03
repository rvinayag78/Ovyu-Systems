# Contract (Maker & Transfer Contact Not Signed)

**Figma node:** 78:1193  
**Frame:** 1920×1080px  
**Background:** `#f8f7f5`

---

## Description

The Maker's contract signing screen — private path variant. Shows the Ovyu Agreement with space for the Maker to sign. A gold callout notes that the Transfer Contact will also receive the contract.

---

## Reusable Components

| Component | Used here |
|---|---|
| Header (account open) | Logged-in, avatar variant |
| Footer | Black footer |
| Input Label | "Full legal name" + "Date" fields |

---

## Layout Hierarchy

```
Frame 1920×1080
├── Header — top: 0, 1924×103px
├── Contract Content — centered (50% 50% translate), inline-grid 2-col 3-row, gap: 42px 49px
│   ├── [col1 row1] Header text — w: 833px
│   │   ├── "Your contract." — Georgia Italic 64px
│   │   └── Subtitle — Helvetica Regular 22px #888
│   ├── [col1 row2] Contract card — 1130×580px, bg #fff, border 2px #e1e1e1, rounded-15px
│   ├── [col2 row2] Signing panel — 613×580px, bg #fff, border 2px #e1e1e1, rounded-15px
│   └── [col1 row3] Legal note — Helvetica Oblique 16px #888
└── Footer — top: 977px
```

---

## Header text block (col1 row1, w: 833px, flex col, gap: 12px)

- **"Your contract."** — Georgia Italic 64px `#1a1a1a`
- **Subtitle** — Helvetica Regular 22px `#888`
  - "Read through carefully. This is between you, your Keeper, and your Transfer Contact."

---

## Contract card (col1 row2, 1130×580px)

- **Background:** `#fff`
- **Border:** 2px solid `#e1e1e1`
- **Border-radius:** 15px
- **Padding:** 60px all sides
- **Layout:** flex col, gap: 63px

### Party heading (flex col, gap: 8px, Helvetica Bold 22px, w: 354px)
- "Ovyu Agreement" — color `#000`
- "Party A (Maker)" — color `#8a6e30`
- "Party B (Keeper) Transfer Contact" — color `#8a6e30`

### Contract body (Helvetica Regular 18px `#444`, w: 890px)
- Maker, Keeper, Transfer Contact fields with `[placeholder]` text
- Paragraph about private path — "Your Keeper is not aware of this upload..."
- Terms: Access begins, duration, transferable, interaction limit
- Final clause about Maker retaining ownership

---

## Signing panel (col2 row2, 613×580px)

- **Background:** `#fff`
- **Border:** 2px solid `#e1e1e1`
- **Border-radius:** 15px
- **Padding:** top: 50px, bottom: 31px, left: 52px, right: 44px
- **Layout:** flex col, gap: 20px

### "Sign as Maker" heading
- **Font:** Georgia Bold 28px `#000`, white-space: nowrap

### Description
- **Font:** Helvetica Regular 20px `#888`
- "By signing, you confirm you have read and agree to the terms on this page."

### Input fields (flex col, gap: 10.323px each, Input Label component)

Input Label component (scaled at 1.29× base):
- **Label:** Helvetica Bold 20.65px `#444`
- **Input:** h: 73.548px, bg `#fff`, border: 1.29px solid `#888`, border-radius: 10px, padding: 12.903px
  - Placeholder: Helvetica Regular 23.23px `#888`

| Field | Label | Placeholder |
|---|---|---|
| Full legal name | "Full legal name" | "Type your full name" |
| Date | "Date" | "Today" |

### "Sign and continue →" button
- **Size:** full width (517px approx) × 62px
- **Background:** `#000`, border-radius: 8px
- **Padding:** px: 65.806px, py: 19.355px
- **Label:** "Sign and continue →" — Helvetica Bold 20.65px `#f5f0e8`, text-center

### TC notification callout (below button)
- **Height:** 43px, w: full
- **Background:** `#f5edd6`
- **Border:** 2px solid `#c9a84c`, border-radius: 8px
- **Padding:** py: ~13px, px: 29px
- **Text:** "Your Transfer Contact will also receive this contract to sign."
  - Helvetica Regular 16px `#000`, text-center

---

## Legal note (col1 row3)

- **Font:** Helvetica Oblique 16px `#888`, white-space: nowrap
- **Text:** "Your digital signature carries the same intent as a handwritten signature within the Ovyu platform."

---

## Typography Scale

| Element | Font | Size | Weight | Color |
|---|---|---|---|---|
| Page heading | Georgia | 64px | Italic | `#1a1a1a` |
| Page subtitle | Helvetica | 22px | Regular | `#888` |
| Party labels | Helvetica | 22px | Bold | `#000`/`#8a6e30` |
| Contract body | Helvetica | 18px | Regular | `#444` |
| Sign heading | Georgia | 28px | Bold | `#000` |
| Sign description | Helvetica | 20px | Regular | `#888` |
| Input label | Helvetica | 20.65px | Bold | `#444` |
| Input placeholder | Helvetica | 23.23px | Regular | `#888` |
| Sign button | Helvetica | 20.65px | Bold | `#f5f0e8` |
| TC callout | Helvetica | 16px | Regular | `#000` |
| Legal note | Helvetica | 16px | Oblique | `#888` |
