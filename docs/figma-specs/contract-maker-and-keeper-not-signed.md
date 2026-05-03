# Contract (Maker & Keeper Not Signed)

**Figma node:** 78:1365  
**Frame:** 1920×1080px  
**Background:** `#f8f7f5`

---

## Description

The Maker's contract signing screen — aware path variant. Shows the Ovyu Agreement (Maker ↔ Keeper only, no TC). No TC callout.

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
├── Header — top: 0, 1924×103px (account open variant)
├── Contract Content — centered, inline-grid 2-col 3-row, gap: 42px 49px
│   ├── [col1 row1] Header text — w: 833px
│   ├── [col1 row2] Contract card — 1130×580px
│   ├── [col2 row2] Signing panel — 613×580px (no TC callout)
│   └── [col1 row3] Legal note
└── Footer — top: 977px
```

---

## Header text (col1 row1, w: 833px, flex col, gap: 12px)

- **"Your contract."** — Georgia Italic 64px `#1a1a1a`
- **Subtitle** — Helvetica Regular 22px `#888`
  - "Read through carefully. This is between you and your Keeper."

---

## Contract card (1130×580px)

- **Background:** `#fff`, **Border:** 2px solid `#e1e1e1`, **Border-radius:** 15px
- **Padding:** 60px, **Layout:** flex col, justify-between

### Party heading (Helvetica Bold 22px, w: 354px, flex col, gap: 8px)
- "Ovyu Agreement" — `#000`
- "Party A (Maker)" — `#8a6e30`
- "Party B (Keeper)" — `#8a6e30` (no Transfer Contact line)

### Contract body (Helvetica Regular 18px `#444`, w: 890px)
- Maker + Keeper + Relationship placeholders
- Access duration, transferable, interaction limit
- Maker ownership clause
- Data privacy clause
- Full text with `[placeholder]` tokens

---

## Signing panel (613×580px) — no TC callout

- **Background:** `#fff`, **Border:** 2px solid `#e1e1e1`, **Border-radius:** 15px
- **Padding:** top: 50px, bottom: 31px, left: 52px, right: 44px
- **Layout:** flex col, gap: 20px

### "Sign as Maker"
- **Font:** Georgia Bold 28px `#000`

### Description
- Helvetica Regular 20px `#888` — "By signing, you confirm you have read and agree to the terms on this page."

### Input fields (same scaled component as other contract screens)
- "Full legal name": Helvetica Bold 20.65px `#444` label, h: 73.548px input
- "Date": same

### "Sign and continue →" button
- **Size:** full width × 62px
- **Background:** `#000`, border-radius: 8px
- **Label:** "Sign and continue →" — Helvetica Bold 20.65px `#f5f0e8`

> **Note:** No TC callout below the button (this is the aware path — Keeper signs next, no TC).

---

## Legal note

- **Font:** Helvetica Oblique 16px `#888`, white-space: nowrap

---

## Difference from TC variant (78:1193)

| Feature | Aware path (this) | Private path (78:1193) |
|---|---|---|
| Heading size | Georgia Italic 64px | Georgia Italic 64px |
| Subtitle | "between you and your Keeper" | "between you, your Keeper, and your Transfer Contact" |
| Party C in contract | None | "Transfer Contact" line |
| TC callout below button | Absent | Present (gold border, `#f5edd6` bg) |
