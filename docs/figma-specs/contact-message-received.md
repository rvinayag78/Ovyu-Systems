# Contact (message received)

**Figma node:** 189:2849  
**Frame:** 1920×1080px  
**Background:** `#f8f7f5`

---

## State Description

Success confirmation shown after a contact form message is submitted.

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
├── Header — top: 0, 1924×103px
├── Confirmation block — absolute, left: 643px, top: 364px, w: 634px
│   ├── Padding: px: 88px, py: 23px (outer wrapper)
│   └── flex col, gap: 37px, items-center
│       ├── Purple checkmark circle — 123×123px
│       └── Text group — flex col, gap: 13px, items-center, text-center
│           ├── "Got it." — Georgia Italic 64px #1a1a1a
│           ├── Subtitle — Helvetica Regular 22px #444
│           └── Note — Helvetica Oblique 16px #444
└── Footer — top: 977px
```

---

## Checkmark circle

- **Size:** 123×123px
- **Background:** `#4b3c5e`
- **Border-radius:** 61.5px (full circle)
- **Padding:** pl: 35px, pr: 34px, py: 25px
- **Content:** "✓" — Georgia Italic 64px `#fff`, text-center

---

## Text group

### "Got it."
- **Font:** Georgia Italic 64px `#1a1a1a`
- **Alignment:** text-center

### Subtitle
- **Font:** Helvetica Regular 22px `#444`
- **Text:** "We'll get back to you within two business days."
- **Alignment:** text-center

### Note
- **Font:** Helvetica Oblique 16px `#444`
- **Line-height:** 1.35
- **Text:** "A copy has been sent to your email."
- **Alignment:** text-center

---

## Typography Scale

| Element | Font | Size | Weight | Color |
|---|---|---|---|---|
| Checkmark | Georgia | 64px | Italic | `#fff` |
| "Got it." | Georgia | 64px | Italic | `#1a1a1a` |
| Subtitle | Helvetica | 22px | Regular | `#444` |
| Note | Helvetica | 16px | Oblique | `#444` |
