# Contract (Keeper Not Signed)

**Figma node:** 141:649  
**Frame:** 1920×1080px  
**Background:** `#f8f7f5`

---

## Description

The Keeper's contract invitation screen. Shows a personal heading "[Name] has created something for you", the Ovyu Agreement from the Keeper's perspective, and a signing panel.

---

## Reusable Components

| Component | Used here |
|---|---|
| Header (account open) | Logged-in, avatar variant |
| Footer | Black footer |
| Input Label | "Full legal name" + "Date" |

---

## Layout Hierarchy

```
Frame 1920×1080
├── Header — top: 0, 1924×103px
├── Contract Content — centered, flex col, gap: 43px, w: 1792px
│   ├── Top row (content-end, flex wrap, gap: 41px 49px)
│   │   ├── Header text — w: 1124px, flex col, gap: 16px
│   │   ├── Contract card — 1130×580px
│   │   └── Signing panel — 613×580px
│   └── Legal note — w: full
└── Footer — top: 977px
```

---

## Header text (w: 1124px, flex col, gap: 16px)

- **Heading:** Georgia Italic 64px `#1a1a1a`
  - "[Name] has created something for you."
- **Subtitle:** Helvetica Regular 22px `#888`
  - "Review the agreement below. Take your time. Sign only if you're ready to accept."

---

## Contract card (1130×580px)

- **Background:** `#fff`, **Border:** 2px solid `#e1e1e1`, **Border-radius:** 15px
- **Padding:** 60px, **Layout:** flex col, justify-between

### Party heading (Helvetica Bold 22px, w: 354px)
- "Ovyu Agreement" — `#000`
- "Party A (Maker)" — `#8a6e30`
- "Party B (Keeper)" — `#8a6e30`

### Contract body (Helvetica Regular 18px `#444`, min-width: full, white-space: pre-wrap)
- Maker + Keeper + Relationship `[placeholder]` lines
- "By accepting, you agree to receive the Maker's upload upon the Transfer..."
- Access duration, transferable terms
- Withdrawal rights
- Data privacy statement

---

## Signing panel (613×580px)

- **Background:** `#fff`, **Border:** 2px solid `#e1e1e1`, **Border-radius:** 15px
- **Padding:** top: 50px, bottom: 31px, left: 52px, right: 44px
- **Layout:** flex col, gap: 20px

### "Sign as Keeper"
- **Font:** Georgia Bold 28px `#000`, white-space: nowrap

### Description
- Helvetica Regular 20px `#888` — "By signing, you confirm you have read and agree to the terms on this page."

### Input fields
- "Full legal name": Helvetica Bold 20.65px `#444` label, h: 73.548px input, border: 1.29px `#888`, border-radius: 10px
  - Placeholder: Helvetica Regular 23.23px `#888` — "Type your full name"
- "Date": same — placeholder "Today"

### "Sign and continue →" button
- **Size:** full width × 62px
- **Background:** `#000`, border-radius: 8px
- **Label:** "Sign and continue →" — Helvetica Bold 20.65px `#f5f0e8`

> **No TC callout** — Keeper signing does not involve a Transfer Contact notification.

---

## Legal note

- **Font:** Helvetica Oblique 16px `#888`, w: full
- "Your digital signature carries the same intent as a handwritten signature within the Ovyu platform."

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
| Button | Helvetica | 20.65px | Bold | `#f5f0e8` |
| Legal note | Helvetica | 16px | Oblique | `#888` |
