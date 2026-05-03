# Styleguide

**Figma node:** 185:583  
**Frame:** 1920×1080px (full canvas)  
**Background:** `#f8f7f5`

---

## Description

The MVP typography reference frame. Documents all type styles used across the product. Not a UI screen — a design reference only.

---

## Layout Hierarchy

```
Frame 1920×1080
├── Black header — 1920×214px, top: 0
│   └── "MVP Fonts" — Georgia Regular 88px white (with "Fonts" in italic)
├── Left column — left: 151px, top: 322px, w: 470px, gap: 15px
│   └── Labels only (H1, H2, H3 displayed as styled text)
└── Right column — left: 837px, top: 322px, w: 854px, gap: 15px
    └── Full type specimen with font names
```

---

## Black header (1920×214px, top: 0)

- **Background:** `#000`
- **Padding:** left: 151px
- **Title:** "MVP Fonts" — Georgia Regular 88px white
  - "Fonts" displayed as Georgia Italic (stylistic choice visible in header)

---

## Type Scale

| Label | Font Family | Size | Weight/Style | Color | Notes |
|---|---|---|---|---|---|
| Headline 1 | Georgia | 88px | Regular (numeral in Italic) | `#1a1a1a` | Main page titles |
| Headline 2 | Georgia | 64px | Regular (numeral in Italic) | `#1a1a1a` | Section headings, modal titles |
| Headline 3 | Georgia | 30px | Regular (numeral in Italic) | `#1a1a1a` | Sub-headings |
| Paragraph 1 | Helvetica | 22px | Bold, all caps | `#c9a84c` | Section labels, category headers |
| Paragraph 2 | Helvetica | 22px | Regular | `#1a1a1a` | Body copy, primary text |
| Paragraph 3 | Helvetica | 18px | Bold, all caps | `#c9a84c` | Secondary section labels |
| Paragraph 4 | Helvetica | 18px | Light | `#888` | Supporting body text |
| Paragraph 5 | Helvetica | 18px | Light Oblique | `#888` | Captions, secondary supporting text |
| Paragraph 6 | Helvetica | 16px | Bold, all caps | `#000` | Labels, tags |
| Paragraph 7 | Helvetica | 16px | Light Oblique | `#888` | Legal notes, fine print |
| Paragraph 8 | Helvetica | 11px | Light Oblique | `#888` | Footer copy, used sparingly |

---

## Stylistic convention note

"You'll notice that in some instances, words within the titles are in italics. It helps with visual clarity."

- **Font:** Helvetica Regular 18px `#444`
- This note appears twice — once in each column as contextual explanation

---

## Button specimen

- Left column: Rectangle image 263.35×63.07px with centered "Button Text" Helvetica Regular 22.16px white
- Right column: Rectangle image 321×63px with centered "Helvetica Regular 22pt" Helvetica Regular 22.16px white

These are bitmap images of the primary button used as reference specimens.

---

## Typography Token Mapping

| P-scale | Usage context |
|---|---|
| P1 (Helvetica Bold 22px #c9a84c caps) | Contract section headers, table labels |
| P2 (Helvetica Regular 22px #1a1a1a) | Standard body, subtitle text |
| P3 (Helvetica Bold 18px #c9a84c caps) | Subsection labels |
| P4 (Helvetica Light 18px #888) | Subtitles, de-emphasised body |
| P5 (Helvetica Light Oblique 18px #888) | Captions, secondary notes |
| P6 (Helvetica Bold 16px #000 caps) | Small labels, metadata tags |
| P7 (Helvetica Light Oblique 16px #888) | Legal notices |
| P8 (Helvetica Light Oblique 11px #888) | Footer legal text |
