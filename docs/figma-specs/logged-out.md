# Logged Out

**Figma node:** 189:1254  
**Frame:** 1920×1080px  
**Background:** `#f8f7f5`

---

## Reusable Components

| Component | Used here |
|---|---|
| Header (account open) | Logged-in header (avatar shown even on logout confirmation) |
| Footer | Black footer |

---

## Layout Hierarchy

```
Frame 1920×1080
├── Header (account open) — top: 0, 1924×103px
├── Content block — absolute, left: 644px, top: 297px, w: 632px, h: 456px
│   ├── Checkmark circle — 123×123px, absolute, left: 254.5px, top: 0
│   └── Text + actions — absolute, left: 0, right: 0, top: 170px, h: 286px
│       ├── Headline block — absolute, top: 0, w: 511px, left: 60.5px, h: 141px
│       │   ├── H1 "You're logged out." — y-center: 36.5px
│       │   └── Subtitle — y-center: 116px
│       └── CTA block — absolute, top: 164px, w: 632px, h: 103px
│           ├── "Log back in →" button — left: 164px, top: 0, 304×48px
│           └── Footer note — y-center: 84px, w: 632px
└── Footer — top: 977px, h: 103px
```

---

## Header (account open)

- **Size:** 1924×103px, bg `#fff`, border-bottom: 3px solid `#e1e1e1`
- **Inner:** 1800px centered, flex row, justify-between
  - Wordmark: Georgia Bold/Bold Italic 40px `#000`, 113×50px
  - Right: gap: 117px
    - "Activate Transfer": Helvetica Neue Regular 16px `#000`, 150×24px
    - Avatar: 51×51px, bg `#4b3c5e`, border-radius: 25.5px, Georgia Regular 32.66px `#fff`

---

## Checkmark circle

- **Size:** 123×123px
- **Background:** `#4b3c5e`
- **Border-radius:** 61.5px (full circle)
- **Padding:** pl: 35px, pr: 34px, py: 25px
- **Content:** "✓" — Georgia Italic 64px `#fff`, text-center

---

## H1

- **Font:** Georgia Regular 64px `#1a1a1a`
- **Text:** "You're logged out."
- **Alignment:** text-center, y-center: 36.5px within headline block

---

## Subtitle

- **Font:** Helvetica Regular 22px `#444`
- **Text:** "Your account is closed on this device." + empty line
- **Alignment:** text-center, y-center: 116px

---

## "Log back in →" button

- **Position:** left: 164px within CTA block (i.e., centered in the 632px wide block)
- **Size:** 304×48px
- **Background:** `#000`, border-radius: 8px
- **Padding:** px: 51px, py: 15px
- **Label:** "Log back in →" — Helvetica Bold 16px `#f5f0e8`, text-center

---

## Footer note (below button)

- **Position:** y-center: 84px within CTA block, w: 632px
- **Font:** Helvetica Oblique 16px `#444`
- **Line-height:** 1.35
- **Text:** "ovyu.com sends a sign-in link to your email each time. There's no password to remember, and no one can access your account without that link."
- **Alignment:** text-center

---

## Footer

- **Size:** 1920×103px, bg `#000`
- Same layout as all other pages — left: 68px, top: 44px, gap: 199px

---

## Typography Scale

| Element | Font | Size | Weight | Color |
|---|---|---|---|---|
| Checkmark | Georgia | 64px | Italic | `#fff` |
| H1 | Georgia | 64px | Regular | `#1a1a1a` |
| Subtitle | Helvetica | 22px | Regular | `#444` |
| Button | Helvetica | 16px | Bold | `#f5f0e8` |
| Footer note | Helvetica | 16px | Oblique | `#444` |
