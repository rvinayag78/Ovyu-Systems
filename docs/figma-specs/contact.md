# Contact

**Figma node:** 189:1288  
**Frame:** 1920×1080px  
**Background:** `#f8f7f5`

---

## Reusable Components

| Component | Used here |
|---|---|
| Header (account open) | Logged-in header with avatar |
| Footer | Black footer |
| Input Label | Labelled text input |

---

## Layout Hierarchy

```
Frame 1920×1080
├── Header (account open) — top: 0, 1924×103px
├── Contact Content — absolute, left: 210px, top: 185px, w: 1500px, flex col, gap: 51px
│   ├── Title block — w: 1029px, flex col, gap: 12px
│   │   ├── "Contact." — Georgia Regular 64px
│   │   └── Tagline — Georgia Italic 30px
│   └── Two-column row — flex row, gap: 211px, w: 1500px
│       ├── Left (form) — w: 920px, flex col, gap: 30px
│       │   ├── "SEND A MESSAGE" eyebrow
│       │   ├── Name + Email fields row — flex row, gap: 35px
│       │   ├── Message textarea area
│       │   └── Send button — 158×57px
│       └── Right (direct email) — w: 300px, flex col, gap: 30px
│           ├── "OR EMAIL US DIRECTLY" eyebrow
│           └── hello@ovyu.com block
└── Footer — top: 977px
```

---

## Header

Same as all logged-in pages — see `email-verified.md`.

---

## Title block (w: 1029px, flex col, gap: 12px)

### "Contact."
- **Font:** Georgia Regular 64px `#1a1a1a`

### Tagline
- **Font:** Georgia Italic 30px `#1a1a1a`
- **Text:** "We read every message. We'll get back to you within two business days."

---

## Left column — form (w: 920px)

### "SEND A MESSAGE" eyebrow
- **Font:** Helvetica Bold 18px `#c9a84c`, uppercase

### Name + Email row (flex row, gap: 35px)

Two Input Label components, each w: 400px:

#### Input Label component
- **Label:** Helvetica Bold 16px `#444`
- **Input:** h: 57px, bg `#fff`, border: 1px solid `#888`, border-radius: 10px, padding: 10px
  - Placeholder: Helvetica Regular 14px `#888` (left-aligned)

| Field | Label | Placeholder |
|---|---|---|
| Name | "Name" | "First, middle, and last name" |
| Email | "Email" | "you@example.com" |

### Message area (flex col, gap: 12px, w: 920px)

#### Message label
- **Font:** Helvetica Bold 16px `#444`
- **Text:** "Message"

#### Textarea
- **Size:** 920×178px (w: full of column, h: 178px)
- **Background:** `#fff`
- **Border:** 1px solid `#888`, border-radius: 10px
- **Padding:** 20px
- **Placeholder:** Helvetica Regular 14px `#888` — "Tell us what's on your mind"

#### Helper text
- **Font:** Helvetica Regular 18px `#888`
- **Text:** "If your message is about an active contract or transfer, please include the name on the agreement so we can find it."

### Send button
- **Size:** 158×57px
- **Background:** `#000`
- **No border-radius** specified (appears squared — check if 0 or small)
- **Padding:** px: 51px, py: 15px
- **Label:** "Send" — Helvetica Regular 22px `#f5f0e8`, text-center

---

## Right column — direct email (w: 300px, flex col, gap: 30px)

### "OR EMAIL US DIRECTLY" eyebrow
- **Font:** Helvetica Bold 18px `#c9a84c`, uppercase

### Email block (flex col, gap: 12px)

#### Email address
- **Font:** Georgia Italic 30px `#000`
- **Text:** "hello@ovyu.com"

#### Underline separator
- **Height:** 1px, bg `#000`, w: full

#### Subtext
- **Font:** Helvetica Regular 18px `#888`
- **Text:** "Either reaches the same place."

---

## Typography Scale

| Element | Font | Size | Weight | Color |
|---|---|---|---|---|
| Title | Georgia | 64px | Regular | `#1a1a1a` |
| Tagline | Georgia | 30px | Italic | `#1a1a1a` |
| Section eyebrow | Helvetica | 18px | Bold | `#c9a84c` |
| Input label | Helvetica | 16px | Bold | `#444` |
| Input placeholder | Helvetica | 14px | Regular | `#888` |
| Message label | Helvetica | 16px | Bold | `#444` |
| Textarea placeholder | Helvetica | 14px | Regular | `#888` |
| Helper text | Helvetica | 18px | Regular | `#888` |
| Send button | Helvetica | 22px | Regular | `#f5f0e8` |
| Email address | Georgia | 30px | Italic | `#000` |
| Email subtext | Helvetica | 18px | Regular | `#888` |
