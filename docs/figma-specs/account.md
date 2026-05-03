# Account

**Figma node:** 189:1322  
**Frame:** 1920×1080px  
**Background:** `#f8f7f5`

---

## Reusable Components

| Component | Used here |
|---|---|
| Header (account open) | Logged-in header with avatar |
| Footer | Black footer |
| Input (no label) | Email display input |

---

## Layout Hierarchy

```
Frame 1920×1080
├── Header — top: 0, 1924×103px
├── Content — absolute, left: 110px, top: 181px, w: 1700px, flex col, gap: 50px
│   ├── Title "Account." — Georgia Italic 64px #1a1a1a
│   ├── EMAIL section — w: 591px, flex col, gap: 15px
│   │   ├── Label+desc block — w: 247px, flex col, gap: 12px
│   │   │   ├── "EMAIL" — Helvetica Bold 18px #c9a84c
│   │   │   └── desc — Helvetica Regular 18px #888
│   │   └── Email row — flex row, gap: 41px, align-items: center
│   │       ├── Input (no label) — w: 400px, h: 57px
│   │       └── "Change email" link — w: 150px, with underline
│   └── PLAN section — w: 293px, flex col, gap: 12px
│       ├── "PLAN" — Helvetica Bold 18px #c9a84c
│       └── Plan info row — flex row, gap: 19px
└── Footer — top: 977px
```

---

## Title

- **Font:** Georgia Italic 64px `#1a1a1a`
- **Text:** "Account."

---

## EMAIL section (w: 591px, flex col, gap: 15px)

### Label + description (w: 247px, flex col, gap: 12px)

- "EMAIL" — Helvetica Bold 18px `#c9a84c`
- "The email tied to your account." — Helvetica Regular 18px `#888`

### Email row (flex row, gap: 41px)

#### Input (no label) — w: 400px
- **Height:** 57px
- **Background:** `#fff`
- **Border:** 1px solid `#888`, border-radius: 10px
- **Padding:** 10px
- **Placeholder:** "you@example.com" — Helvetica Regular 14px `#888`, left-aligned

#### "Change email" link (w: 150px, flex col, gap: 4px)
- "Change email" — Helvetica Oblique 18px `#000`
- Underline bar: 1px `#000`, w: full (acts as underline beneath the text)

---

## PLAN section (w: 293px, flex col, gap: 12px)

### "PLAN"
- **Font:** Helvetica Bold 18px `#c9a84c`

### Plan info row (flex row, gap: 19px, white-space: nowrap)
- "Free plan. " — Helvetica Regular 18px `#000`
- "Paid plans coming later." — Helvetica Oblique 18px `#888`

---

## Typography Scale

| Element | Font | Size | Weight | Color |
|---|---|---|---|---|
| Title | Georgia | 64px | Italic | `#1a1a1a` |
| Section label | Helvetica | 18px | Bold | `#c9a84c` |
| Description | Helvetica | 18px | Regular | `#888` |
| Input placeholder | Helvetica | 14px | Regular | `#888` |
| "Change email" | Helvetica | 18px | Oblique | `#000` |
| Plan current | Helvetica | 18px | Regular | `#000` |
| Plan subtext | Helvetica | 18px | Oblique | `#888` |
