# Maker contracts page (Maker not signed)

**Figma node:** 189:2214  
**Frame:** 1920×1080px  
**Background:** `#f8f7f5`

---

## State Description

The Maker has not yet signed their own contract. The row shows "Pending Status" and a "Sign Contract" action.

---

## Reusable Components

| Component | Used here |
|---|---|
| Header (account open) | Logged-in, avatar variant |
| Footer | Black footer |
| Maker row | Unsigned/pending state |

---

## Layout Hierarchy

```
Frame 1920×1080
├── Header — top: 0, 1924×103px
├── Content — absolute, left: 110px, top: 193px, w: 1700px, flex col, gap: 50px
│   ├── Title "Your contracts" — Georgia Italic 64px #1a1a1a
│   └── MAKING section — flex col, gap: 20px
│       ├── "MAKING" eyebrow — Helvetica Bold 18px #c9a84c
│       └── Maker row (Maker not signed) — 1700×100px, bg #efeaf2
└── Footer — top: 977px, h: 103px
```

---

## Maker row (Maker not signed) — 1700×100px

- **Background:** `#efeaf2` (lavender tint)
- **Padding:** px: 55px, py: 18px
- **Inner:** w: 1600px, flex row, justify-between, align-items: center

### Left group (w: 782.333px, flex row, gap: 40px, align-items: center)

#### Avatar placeholder
- **Size:** 50×50px (circle, placeholder — no image)

#### Meta (w: 440px, flex col, gap: 9px)
- "Maker" — Helvetica Bold 16px `#6a4d7d` uppercase
- "For Ilias" — Georgia Bold 30px `#1a1a1a`

### Status
- "Pending Status" — Helvetica Oblique 18px `#888`, white-space: nowrap

### Action
- "Sign Contract" — Helvetica Oblique 18px `#1a1a1a`, white-space: nowrap

---

## Typography Scale

| Element | Font | Size | Weight | Color |
|---|---|---|---|---|
| Title | Georgia | 64px | Italic | `#1a1a1a` |
| Section eyebrow | Helvetica | 18px | Bold | `#c9a84c` |
| Role label | Helvetica | 16px | Bold | `#6a4d7d` |
| Keeper name | Georgia | 30px | Bold | `#1a1a1a` |
| Status text | Helvetica | 18px | Oblique | `#888` |
| Sign Contract | Helvetica | 18px | Oblique | `#1a1a1a` |
