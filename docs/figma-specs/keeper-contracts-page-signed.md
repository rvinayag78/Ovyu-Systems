# Keeper contracts page (signed)

**Figma node:** 189:1748  
**Frame:** 1920×1080px  
**Background:** `#f8f7f5`

---

## Reusable Components

| Component | Used here |
|---|---|
| Header (account open) | Logged-in header with avatar |
| Footer | Black footer |
| Keeper row | Sage-green row, signed state |

---

## Layout Hierarchy

```
Frame 1920×1080
├── Header (account open) — top: 0, w: 1924px, h: 103px
├── Content — absolute, left: 110px, top: ~181px, w: 1700px, flex col, gap: 50px
│   ├── Title "Your contracts" — 64px Georgia Italic
│   ├── MAKING section
│   │   ├── "MAKING" eyebrow label
│   │   └── Empty Making row — 1700×100px (dashed border, "+ Start a new contract")
│   └── RECEIVING section
│       ├── "RECEIVING" eyebrow label
│       └── Keeper row (signed) — 1700×100px, bg #eceee5
└── Footer — top: 977px, h: 103px
```

---

## Header (account open)

- **Size:** 1924×103px, bg `#fff`, border-bottom: 3px solid `#e1e1e1`, overflow: hidden
- **Inner:** 1800px centered, flex row, justify-between, align-items: center
  - Wordmark: Georgia Bold/Bold Italic 40px `#000`, 113×50px
  - Right group: gap: 117px
    - "Activate Transfer": Helvetica Neue Regular 16px `#000`, 150×24px
    - Avatar: 51×51px circle, bg `#4b3c5e`, border-radius: 25.5px
      - Initial: Georgia Regular 32.66px `#fff`, centered

---

## Title

- **Position:** left: 110px, y-center: 217.5px, w: 1700px
- **Font:** Georgia Italic 64px `#1a1a1a`
- **Text:** "Your contracts"

---

## MAKING section

### Eyebrow label
- **Position:** left: 110px, y-center: 314.5px, w: 247px
- **Font:** Helvetica Bold 18px `#c9a84c`
- **Text:** "MAKING" (uppercase)

### Empty Making row
- **Position:** left: 110px, top: 373px
- **Size:** 1700×100px
- **Border:** 1px solid `#888`, border-radius: 10px
- **Padding:** px: 55px (inner content)
- **Inner:** flex row, gap: 30px, align-items: center
  - "+" icon: 25×25px
  - "Start a new contract": Helvetica Bold 16px `#000`, uppercase

---

## RECEIVING section (left: 110px, top: 540px, w: 1700px)

### Eyebrow label
- **Font:** Helvetica Bold 18px `#c9a84c` uppercase
- "RECEIVING"

### Keeper row (signed state) — 1700×100px

- **Background:** `#eceee5` (sage-green tint)
- **Padding:** px: 55px, py: 18px
- **Inner:** w: 1600px, flex row, justify-between, align-items: center

#### Left group (w: 440px, flex col, gap: 9px)
- "KEEPER" — Helvetica Bold 16px `#5c6b4a` uppercase
- "From Leila" — Georgia Bold 30px `#1a1a1a`

#### Status group (flex row, gap visible)
- "Signed on Jan 23, 2026" — Helvetica Oblique 18px `#888`
- "Held for you" — Helvetica Oblique 18px `#888`

#### Actions (flex row, gap: 64px)
- "View" — Helvetica Oblique 18px `#1a1a1a`
- "Download ⤓" — Helvetica Oblique 18px `#1a1a1a`

---

## Typography Scale

| Element | Font | Size | Weight | Color |
|---|---|---|---|---|
| Page title | Georgia | 64px | Italic | `#1a1a1a` |
| Section eyebrow | Helvetica | 18px | Bold | `#c9a84c` |
| Empty row CTA | Helvetica | 16px | Bold | `#000` |
| Keeper role label | Helvetica | 16px | Bold | `#5c6b4a` |
| Keeper from-name | Georgia | 30px | Bold | `#1a1a1a` |
| Signed date | Helvetica | 18px | Oblique | `#888` |
| "Held for you" | Helvetica | 18px | Oblique | `#888` |
| View / Download | Helvetica | 18px | Oblique | `#1a1a1a` |

---

## Color Tokens

| Token | Value | Usage |
|---|---|---|
| sage-green-tint | `#eceee5` | Keeper row bg |
| sage-green | `#5c6b4a` | Keeper role label |
| gold | `#c9a84c` | Section eyebrow |
| ink | `#1a1a1a` | Titles, names, actions |
| muted | `#888` | Status text |
| border | `#888` | Empty row border |
