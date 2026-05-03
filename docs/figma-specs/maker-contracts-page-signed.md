# Maker contracts page (signed)

**Figma node:** 189:2194  
**Frame:** 1920×1080px  
**Background:** `#f8f7f5`

---

## Reusable Components

| Component | Used here |
|---|---|
| Header (account open) | Logged-in header with avatar |
| Footer | Black footer |
| Maker row | Lavender-tint row, LOCKED state |

---

## Layout Hierarchy

```
Frame 1920×1080
├── Header (account open) — top: 0, w: 1924px, h: 103px
├── Content — absolute, left: 110px, top: 181px, w: 1700px, flex col, gap: 50px
│   ├── Title "Your contracts" — 64px Georgia Italic
│   └── MAKING section
│       ├── "MAKING" eyebrow
│       └── Maker row (LOCKED) — h: 100px, bg #efeaf2
└── Footer — top: 977px, h: 103px
```

---

## Header (account open)

- **Size:** 1924×103px, bg `#fff`, border-bottom: 3px solid `#e1e1e1`
- **Inner:** 1800px centered, flex row, justify-between
  - Wordmark: Georgia Bold/Bold Italic 40px `#000`, 113×50px
  - Right: gap 117px — "Activate Transfer" Helvetica Neue Regular 16px `#000`, Avatar 51×51px `#4b3c5e` circle

---

## Title

- **Font:** Georgia Italic 64px `#1a1a1a`
- **Text:** "Your contracts"

---

## MAKING eyebrow

- **Font:** Helvetica Bold 18px `#c9a84c`, uppercase
- **Text:** "MAKING"

---

## Maker row (LOCKED state) — h: 100px

- **Size:** 1700×100px
- **Background:** `#efeaf2` (lavender tint)
- **Padding:** px: 55px, py: 18px
- **Inner:** w: 1600px, flex row, justify-between, align-items: center

### Left group (w: 452px, flex row, gap: 40px, align-items: center)

#### Avatar placeholder
- **Size:** 50×50px circle (filled circle, no image shown — placeholder state)

#### Meta (w: 213px, flex col, gap: 9px)
- "Maker" — Helvetica Bold 16px `#6a4d7d` uppercase (deep lavender)
- "For Ilias" — Georgia Bold 30px `#1a1a1a`

### Middle group (flex row, gap: 40px)
- "Signed on Jan 23, 2026" — Helvetica Oblique 18px `#888`
- "View Contract" — Helvetica Oblique 18px `#1a1a1a` (underlined, soft link)

### Right group
- "UPLOAD" — Helvetica Bold 18px `#1a1a1a` uppercase
- Arrow: 15×26px (→ icon)
- flex row, align-items: center

---

## Typography Scale

| Element | Font | Size | Weight | Color |
|---|---|---|---|---|
| Page title | Georgia | 64px | Italic | `#1a1a1a` |
| Section eyebrow | Helvetica | 18px | Bold | `#c9a84c` |
| Role label | Helvetica | 16px | Bold | `#6a4d7d` |
| Keeper name | Georgia | 30px | Bold | `#1a1a1a` |
| Signed date | Helvetica | 18px | Oblique | `#888` |
| View Contract | Helvetica | 18px | Oblique | `#1a1a1a` |
| UPLOAD | Helvetica | 18px | Bold | `#1a1a1a` |

---

## Color Tokens

| Token | Value | Usage |
|---|---|---|
| lavender-tint | `#efeaf2` | Maker row bg |
| deep-lavender | `#6a4d7d` | Maker role label |
| gold | `#c9a84c` | Section eyebrow |
| ink | `#1a1a1a` | Names, actions |
| muted | `#888` | Status dates |
