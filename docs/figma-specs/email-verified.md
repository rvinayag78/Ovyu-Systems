# Email Verified

**Figma node:** 71:185  
**Frame:** 1920×1080px  
**Background:** `#f8f7f5`

---

## Reusable Components

| Component | Used here |
|---|---|
| Header (account open) | Logged-in header with avatar |
| Footer | Black footer |

---

## Layout Hierarchy

```
Frame 1920×1080
├── Header (account open) — top: 0, w: 1924px, h: 103px (logged-in variant)
├── Content block — absolute, left: 575px, top: 238px, w: 770px
│   ├── Purple checkmark circle — 123×123px
│   └── Text block — flex col, gap: 42px, items-center, w: full
│       ├── H1 (2 lines)
│       ├── Subtitle (3 lines)
│       ├── CTA button — 304×48px
│       └── Footer note
└── Footer — bottom: 0, h: 103px
```

---

## Header (logged-in / account open)

- **Size:** 1924×103px
- **Background:** `#fff`, **Border:** 3px solid `#e1e1e1` (bottom)
- **Inner:** 1800px centered, flex row, justify-between
  - Wordmark: Georgia Bold/Italic 40px `#000`, w: 113px, h: 50px
  - Right group: gap: 117px
    - "Activate Transfer": Helvetica Neue Regular 16px `#000`, w: 150px, h: 24px
    - Avatar: 51×51px, bg `#4b3c5e`, border-radius: 25.5px (circle)
      - Initial letter: Georgia Regular 32.66px `#fff`, text-center

---

## Content Block (left: 575px, top: 238px, w: 770px)

- **Layout:** flex col, gap: 47px, items-center

### Purple checkmark circle
- **Size:** 123×123px
- **Background:** `#4b3c5e`
- **Border-radius:** 61.5px (full circle)
- **Padding:** top: 25px, bottom: 25px, left: 35px, right: 34px
- **Content:** "✓" — Georgia Italic 64px `#fff`, text-center

### Text block
- **Layout:** flex col, gap: 42px, items-center, w: full

#### H1 (2 lines)
- **Line 1:** "Your email is verified." — Georgia Regular 64px `#1a1a1a`
- **Line 2:** "Let's review your contract." — Georgia Italic 64px `#1a1a1a`
- **Alignment:** text-center
- Rendered as mixed-weight paragraph

#### Subtitle (3 lines)
- **Font:** Helvetica Regular 22px `#444`
- **Alignment:** text-center
- **Content:** Explains next step (review contract)

#### CTA button
- **Size:** 304×48px
- **Background:** `#000`
- **Border-radius:** 8px
- **Label:** "Review my contract →" — Helvetica Bold 16px `#f5f0e8`
- **Padding:** py: 15px, px: 51px

#### Footer note
- **Font:** Helvetica Oblique 16px `#444`
- **Alignment:** text-center

---

## Typography Scale

| Element | Font | Size | Weight | Color |
|---|---|---|---|---|
| Avatar initial | Georgia | 32.66px | Regular | `#fff` |
| Checkmark | Georgia | 64px | Italic | `#fff` |
| H1 line 1 | Georgia | 64px | Regular | `#1a1a1a` |
| H1 line 2 | Georgia | 64px | Italic | `#1a1a1a` |
| Subtitle | Helvetica | 22px | Regular | `#444` |
| CTA label | Helvetica | 16px | Bold | `#f5f0e8` |
| Footer note | Helvetica | 16px | Oblique | `#444` |

---

## Color Tokens

| Token | Value | Usage |
|---|---|---|
| avatar-purple | `#4b3c5e` | Avatar circle, checkmark circle |
| cream | `#f8f7f5` | Page bg |
| ink | `#1a1a1a` | H1, CTA bg |
| muted-dark | `#444` | Subtitle, footer note |
| cream-light | `#f5f0e8` | CTA text |
