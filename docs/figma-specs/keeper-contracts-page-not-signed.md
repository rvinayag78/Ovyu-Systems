# Keeper contracts page (not signed)

**Figma node:** 189:1876  
**Frame:** 1920×1080px  
**Background:** `#f8f7f5`

---

## Difference from Signed variant

The Keeper row shows a **pending state** instead of the signed state:
- "Pending signature" replaces "Signed on [date]" + "Held for you"
- "Sign Contract" link replaces View / Download actions
- Row background remains `#eceee5`

---

## Reusable Components

| Component | Used here |
|---|---|
| Header (account open) | Logged-in, avatar variant |
| Footer | Black footer |
| Keeper row | Pending/unsigned state |

---

## Layout (same as signed variant)

```
Frame 1920×1080
├── Header — top: 0, 1924×103px
├── Content — left: 110px, top: ~181px, w: 1700px, flex col gap: 50px
│   ├── Title — Georgia Italic 64px #1a1a1a "Your contracts"
│   ├── MAKING section
│   │   ├── "MAKING" eyebrow — Helvetica Bold 18px #c9a84c
│   │   └── Empty Making row — 1700×100px, border 1px #888, rounded-10px
│   └── RECEIVING section
│       ├── "RECEIVING" eyebrow
│       └── Keeper row (unsigned) — 1700×100px, bg #eceee5
└── Footer — top: 977px
```

---

## Keeper row (unsigned/pending state)

- **Size:** 1700×100px
- **Background:** `#eceee5`
- **Padding:** px: 55px, py: 18px
- **Inner:** w: 1600px, flex row, justify-between, align-items: center

### Left (w: 440px, flex col, gap: 9px)
- "KEEPER" — Helvetica Bold 16px `#5c6b4a` uppercase
- "From [Maker name]" — Georgia Bold 30px `#1a1a1a`

### Status (instead of date + "Held for you")
- "Pending signature" — Helvetica Oblique 18px `#888`, font-style: italic

### Action (instead of View + Download)
- "Sign Contract" — Helvetica Oblique 18px `#1a1a1a`
- No Download button

---

## Typography Scale

Same as `keeper-contracts-page-signed.md` with these differences:

| Element | Font | Size | Weight | Color | Note |
|---|---|---|---|---|---|
| Status text | Helvetica | 18px | Oblique | `#888` | "Pending signature" |
| Action link | Helvetica | 18px | Oblique | `#1a1a1a` | "Sign Contract" |
