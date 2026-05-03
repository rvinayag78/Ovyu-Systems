# Maker contracts page (Keeper and Transfer Contact not signed)

**Figma node:** 189:2582  
**Frame:** 1920×1080px  
**Background:** `#f8f7f5`

---

## State Description

The Maker has signed but the Keeper (or Transfer Contact) has not yet signed. The row shows "Contract sent [date]" and "Pending" status — no actions available.

---

## Reusable Components

| Component | Used here |
|---|---|
| Header (account open) | Logged-in, avatar variant |
| Footer | Black footer |
| Maker row | Maker signed, pending other party |

---

## Layout Hierarchy

```
Frame 1920×1080
├── Header — top: 0, 1924×103px
├── Content — absolute, left: 110px, top: 193px, w: 1700px, flex col, gap: 50px
│   ├── Title "Your contracts" — Georgia Italic 64px #1a1a1a
│   └── MAKING section — flex col, gap: 20px
│       ├── "MAKING" eyebrow
│       └── Maker row (pending) — 1700×100px, bg #efeaf2
└── Footer — top: 977px
```

---

## Maker row (Maker signed, pending other party) — 1700×100px

- **Background:** `#efeaf2`
- **Padding:** px: 55px, py: 18px
- **Inner:** w: 1600px, flex row, justify-between, align-items: center

### Left group (w: 782.333px, flex row, gap: 40px)

#### Avatar placeholder — 50×50px circle

#### Meta (w: 440px, flex col, gap: 9px)
- "Maker" — Helvetica Bold 16px `#6a4d7d` uppercase
- "For Ilias" — Georgia Bold 30px `#1a1a1a`

### Status columns
- "Contract sent January 23, 2026" — Helvetica Oblique 18px `#888`, white-space: nowrap
- "Pending" — Helvetica Oblique 18px `#888` (`--dark-grey`), white-space: nowrap

> **No action link** — both columns are status-only (italic, muted)

---

## Difference from Other Maker States

| State | Status col 1 | Status col 2 | Action |
|---|---|---|---|
| Maker not signed | "Pending Status" | — | "Sign Contract" |
| Maker signed, other pending (this frame) | "Contract sent [date]" | "Pending" | — |
| Both signed (LOCKED) | "Signed on [date]" | "View Contract" | "UPLOAD →" |

---

## Typography Scale

| Element | Font | Size | Weight | Color |
|---|---|---|---|---|
| Title | Georgia | 64px | Italic | `#1a1a1a` |
| Section eyebrow | Helvetica | 18px | Bold | `#c9a84c` |
| Role label | Helvetica | 16px | Bold | `#6a4d7d` |
| Name | Georgia | 30px | Bold | `#1a1a1a` |
| Sent date | Helvetica | 18px | Oblique | `#888` |
| "Pending" | Helvetica | 18px | Oblique | `#888` |
