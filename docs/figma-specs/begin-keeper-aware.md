# Begin (keeper aware)

**Figma node:** 78:779  
**Frame:** 1920×1080px  
**Background:** `#f8f7f5`

---

## Difference from "keeper not aware" variant

The **Aware** variant of the Begin/signup form has one key difference: the "Does the Keeper know about this?" checkbox shows **"Yes"** checked (bg `#444`, checkmark visible) and the **TC Callout is hidden** (no Transfer Contact fields). Layout, dimensions, and typography are otherwise identical.

---

## Reusable Components

| Component | Used here |
|---|---|
| Header (log in) | Logged-out header with "Log In" button |
| Footer | Black footer |
| Input Label | Labelled text input field |
| Dropdown | Relationship select (with open dropdown state shown) |
| Checkbox | Awareness toggle — "Yes" is checked |

---

## Layout Hierarchy

```
Frame 1920×1080
├── Header (log in) — top: 0, left: -2px, w: 1924px, h: 103px
├── Content box — absolute, left: 60px, top: 241px, w: 1800px, h: 666px
│   ├── H1 — y-center: 36.5px
│   ├── Subtitle — y-center: 93.83px
│   ├── Section label "About You" — y-center: 162.35px
│   ├── Row 1: 4 inputs at top: 185px (left: 0, 414, 828, 1242px)
│   ├── Divider line — top: 317px
│   ├── Row 2 — top: 351px
│   │   ├── Keeper name — left: 0, w: 400px
│   │   ├── Keeper email — left: 0, top: 453px, w: 400px
│   │   ├── Dropdown — left: 414px, w: 247px (open state visible)
│   │   ├── Awareness label — left: 696px
│   │   ├── "Yes" checkbox (checked) — left: 696px, top: 382px
│   │   └── "No" checkbox (unchecked) — left: 696px, top: 418px
│   └── Continue button — left: 1496px, top: 618px, 304×48px
└── Footer — bottom: 0
```

---

## Dropdown (open state)

This frame shows the relationship dropdown in its **open/expanded state**:
- Trigger: bg `#fff`, border: 1px solid `#888`, border-radius: 8px, h: 57px, padding: 14px
  - Placeholder: Helvetica Regular 14px `#888` — "Select Relationship"
  - Chevron icon: 24×24px (lucide chevron-down SVG)
- Menu overlay: bg `#fff`, border: 1px solid `#e7e7e7`, box-shadow: `0 4px 2px rgba(0,0,0,0.15)`, border-radius: 4px, padding: 4px
  - Items: each h: 52px, padding: 14px, Helvetica Regular 14px `#888`
  - 12 items total (6 relationship options × 2 rows visible)

---

## Awareness checkboxes

### "Yes" — checked state (left: 696px, top: 382px)
- **Checkbox:** 24×24px, bg `#444`, border-radius: 4px
- **Checkmark:** "✓" Helvetica Regular 14px `#f5f0e8`, centered
- **Label:** "Yes, they know and we're doing this together." — Helvetica Regular 14px `#444`
- Flex row, gap: 10px, align-items: center

### "No" — unchecked state (left: 696px, top: 418px)
- **Checkbox:** 24×24px, bg `#fff`, border: 1px solid `#888`, border-radius: 4px
- **Label:** "No, this is something I'm doing privately." — Helvetica Regular 14px `#444`

---

## Continue button

- **Position:** absolute, left: 1496px, top: 618px
- **Size:** 304×48px
- **Background:** `#000`, border-radius: 8px
- **Label:** "Continue to verify email →" — Helvetica Bold 16px `#f5f0e8`

---

## All other dimensions

Identical to `begin-keeper-not-aware.md`:
- Content box: left: 60px, top: 241px, w: 1800px, h: 666px
- H1: Georgia Italic/Regular 64px `#1a1a1a`
- Subtitle: Helvetica Regular 22px `#444`
- Section label: Helvetica Bold 18px `#c9a84c`
- Row 1 inputs: h: 57px each, 400px wide, border: 1px solid `#888`, border-radius: 10px
- Divider: top: 317px, 1800×3px line
- Keeper name/email: 400×57px inputs at left: 0
- Dropdown: left: 414px, 247×57px trigger
