# Begin (keeper not aware)

**Figma node:** 6:404  
**Frame:** 1920×1080px  
**Background:** `#f8f7f5`

---

## Reusable Components

| Component | Used here |
|---|---|
| Header (log in) | Logged-out header with "Log In" button |
| Footer | Black footer |
| Input Label | Labelled text input field |
| Dropdown | Relationship select |
| Checkbox | Awareness toggle buttons |
| TC Callout | Gold-bordered callout (private path only) |

---

## Layout Hierarchy

```
Frame 1920×1080
├── Header (log in) — top: 0
├── Content box — absolute, left: 60px, top: 241px, w: 1800px, h: 666px
│   ├── H1 — y-center: 36.5px
│   ├── Subtitle — y-center: 93.83px
│   ├── Section label "About You" — y-center: 162.35px
│   ├── Row 1 inputs — top: 185px (4 fields)
│   ├── Horizontal divider — top: 317px
│   ├── Row 2 — top: 351px
│   │   ├── Keeper name input — left: 0, w: 400px
│   │   ├── Relationship dropdown — left: 414px, w: 247px
│   │   └── Awareness checkboxes — left: 696px
│   ├── TC Callout — visible only when "private" selected
│   └── Continue button — left: 1496px, top: 618px
└── Footer — bottom: 0
```

---

## Header (log in)

- **Size:** 1924×103px
- **Background:** `#fff`, **Border:** 3px solid `#e1e1e1` (bottom)
- **Inner:** 1800px centered, flex row, justify-between, align-items: center
  - Wordmark: Georgia Bold/Bold Italic 40px `#000`, w: 113px, h: 50px
  - Right group: gap: 117px
    - "Activate Transfer": Helvetica Neue Regular 16px `#000`, w: 150px, h: 24px
    - Log In button: bg `#1a1a1a`, border-radius: 8px, 136×52px, Helvetica Bold 16px `#fff`

---

## Content Box (left: 60px, top: 241px, w: 1800px, h: 666px)

### H1 (y-center: 36.5px)
- **Font mix:** Georgia Italic 64px "Let's " + Georgia Regular 64px "get started."
- **Color:** `#1a1a1a`
- **white-space:** nowrap

### Subtitle (y-center: 93.83px)
- **Font:** Helvetica Regular 22px `#444`
- **Text:** "A little about you and who this is for."
- **white-space:** nowrap

### Section label (y-center: 162.35px)
- **Font:** Helvetica Bold 18px `#c9a84c`
- **Text:** "About You"
- **white-space:** nowrap

---

## Row 1 — "About You" inputs (top: 185px, h: 92px)

4 fields, each 400px wide, stacked at left offsets: 0, 414px, 828px, 1242px

### Input Label component
- **Gap between label and input:** 8px
- **Label:** Helvetica Bold 16px `#444`
- **Input:** h: 57px, bg `#fff`, border: 1px solid `#888`, border-radius: 10px, padding: 10px
  - Placeholder text: Helvetica Regular 14px `#888`

| Field | Label | Placeholder | Left offset |
|---|---|---|---|
| First name | "First name" | "First name" | 0 |
| Middle name | "Middle name (if applicable)" — label part in `#888` Regular | "Middle name(s) or N/A" | 414px |
| Last name | "Last name" | "Last name" | 828px |
| Your email | "Your email" | "you@example.com" | 1242px |

---

## Horizontal Divider (top: 317px)
- **Size:** 1800×3px
- **Color:** stroke/bg line

---

## Row 2 — Keeper info (top: 351px)

### Keeper name input (left: 0, top: 351px, w: 400px)
- Label: Helvetica Bold 16px `#444` — "Keeper's full name"
- Input: h: 57px — placeholder "First, middle, and last name"

### Keeper email input (left: 0, top: 453px, w: 400px, h: 76px)
- Label: "Keeper's email"
- Input: h: 57px — placeholder "email@example.com"

### Relationship Dropdown (left: 414px, top: 351px, w: 247px, h: 86px)
- Label: Helvetica Bold 16px `#444` — "Your relationship to them"
- Select box: h: 57px, bg `#fff`, border: 1px solid `#888`, border-radius: 8px, padding: 14px
  - Placeholder: Helvetica Regular 14px `#888` — "Select Relationship"
  - Chevron icon: 24×24px, positioned right
- Dropdown menu: bg `#fff`, border: 1px solid `#e7e7e7`, box-shadow: `0px 4px 2px rgba(0,0,0,0.15)`, border-radius: 4px
  - Each item: h: 52px, padding: 14px — Helvetica Regular 14px `#888`

### Awareness label (left: 696px, y-center: 360px)
- **Font:** Helvetica Bold 16px `#444`
- **Text:** "Does the Keeper know about this?"
- **white-space:** nowrap

### Checkbox — "Yes" (left: 696px, top: 382px)
- Flex row, gap: 10px, align-items: center
- Checkbox: 24×24px, bg `#444` (checked state), border-radius: 4px, checkmark "✓" Helvetica Regular 14px `#f5f0e8`
- Label: Helvetica Regular 14px `#444` — "Yes, they know and we're doing this together."

### Checkbox — "No" (left: 696px, top: 418px)
- Checkbox: 24×24px, bg `#fff`, border: 1px solid `#888`, border-radius: 4px (unchecked state)
- Label: Helvetica Regular 14px `#444` — "No, this is something I'm doing privately."

---

## TC Callout (private path, conditionally rendered)

- **Position:** absolute, left: 343.99px, top: -73px (relative to row), w: 762px, h: 215px
- **Background:** `#f5edd6`
- **Border:** 1.667px solid `#c9a84c`
- **Border-radius:** 13.339px
- **Inner padding:** flex col, gap between header and fields
  - Header: "Transfer Contact" — Helvetica Bold 20px `#444`
  - Description: Helvetica Oblique 14px `#000`
  - Two input fields: each 297px wide, gap: 45px
    - "Their name" — placeholder "Full name"
    - "Their email" — placeholder "you@example.com"

---

## Continue button (left: 1496px, top: 618px)

- **Size:** 304×48px
- **Background:** `#000`
- **Border-radius:** 8px
- **Label:** Helvetica Bold 16px `#f5f0e8`, text-center
- **Text:** "Continue to verify email →"

---

## Typography Scale

| Element | Font | Size | Weight | Color |
|---|---|---|---|---|
| H1 "Let's " | Georgia | 64px | Italic | `#1a1a1a` |
| H1 "get started." | Georgia | 64px | Regular | `#1a1a1a` |
| Subtitle | Helvetica | 22px | Regular | `#444` |
| Section label | Helvetica | 18px | Bold | `#c9a84c` |
| Input label | Helvetica | 16px | Bold | `#444` |
| Input placeholder | Helvetica | 14px | Regular | `#888` |
| Awareness label | Helvetica | 16px | Bold | `#444` |
| Checkbox label | Helvetica | 14px | Regular | `#444` |
| TC title | Helvetica | 20px | Bold | `#444` |
| TC desc | Helvetica | 14px | Oblique | `#000` |
| CTA button | Helvetica | 16px | Bold | `#f5f0e8` |

---

## Path Difference vs. Keeper Aware

- **Not-aware** (this frame): awareness = "No, this is something I'm doing privately" is pre-selected; TC Callout is visible
- **Aware** (78:779): awareness = "Yes" is pre-selected (checkbox filled); no TC Callout; no TC fields
