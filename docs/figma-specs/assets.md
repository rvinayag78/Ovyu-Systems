# Assets

**Figma node:** 185:1226
**Frame:** 1920×1080px
**Background:** `#f8f7f5` (cream)
**Purpose:** Reference frame listing all SVG assets to export as image files. Not a user-facing screen.

---

## Overview

This frame catalogues the four core SVG assets used across the product. Each asset is shown at its natural size. The frame includes a black header panel with a title.

---

## Layout Hierarchy

```
Frame 1920×1080 — bg #f8f7f5
├── Header panel — absolute, centered (left: 50% translate), top: 0
│   w: 1920px, h: 214px, bg: #000000
│   padding: top 57px / bottom 36px / left 151px / right 1307px
│   flex col, items-start, justify-start
│   ├── "MVP Assets" — Georgia Regular 88px #ffffff
│   └── "To svg export and treat as image files" — Helvetica Regular 18px #ffffff
├── ovyu wordmark SVG — absolute, left: 199px, top: 456px
│   w: 257.104px, h: 73.223px
├── 01 The Contract SVG — absolute, left: 658px, top: 433px
│   w: 302.46px, h: 45.524px
├── 02 The Upload SVG — absolute, left: 658px, top: 510.6px
│   w: 280.562px, h: 45.524px
└── 03 The Transfer SVG — absolute, left: 658px, top: 588px
    w: 301.106px, h: 58.857px
```

---

## Header Panel

| Property | Value |
|---|---|
| Position | absolute, centered horizontally |
| Width | 1920px |
| Height | 214px |
| Background | `#000000` |
| Padding top | 57px |
| Padding bottom | 36px |
| Padding left | 151px |
| Padding right | 1307px |
| Layout | flex column, items-start |

### Title
| Property | Value |
|---|---|
| Text | "MVP Assets" |
| Font | Georgia Regular |
| Size | 88px |
| Color | `#ffffff` |
| Line-height | normal |

### Subtitle
| Property | Value |
|---|---|
| Text | "To svg export and treat as image files" |
| Font | Helvetica Regular |
| Size | 18px |
| Color | `#ffffff` |
| Line-height | normal |

---

## SVG Assets

### ovyu Wordmark
| Property | Value |
|---|---|
| Position | absolute, left: 199px, top: 456px |
| Natural width | 257.104px |
| Natural height | 73.223px |
| Usage | Header wordmark container, rendered at w: 113px, h: auto |
| Export name | `ovyu-wordmark.svg` |

### 01 The Contract
| Property | Value |
|---|---|
| Position | absolute, left: 658px, top: 433px |
| Natural width | 302.46px |
| Natural height | 45.524px |
| Usage | Sidebar step 1 in home page |
| Export name | `ovyu-01-contract.svg` |

### 02 The Upload
| Property | Value |
|---|---|
| Position | absolute, left: 658px, top: 510.6px |
| Natural width | 280.562px |
| Natural height | 45.524px |
| Usage | Sidebar step 2 in home page |
| Export name | `ovyu-02-upload.svg` |

### 03 The Transfer
| Property | Value |
|---|---|
| Position | absolute, left: 658px, top: 588px |
| Natural width | 301.106px |
| Natural height | 58.857px |
| Usage | Sidebar step 3 in home page |
| Export name | `ovyu-03-transfer.svg` |

---

## Typography Reference

| Element | Font | Weight | Size | Color |
|---|---|---|---|---|
| Panel title | Georgia | Regular (400) | 88px | `#ffffff` |
| Panel subtitle | Helvetica | Regular (400) | 18px | `#ffffff` |

---

## Color Reference

| Value | Usage |
|---|---|
| `#000000` | Header panel background |
| `#f8f7f5` | Frame background |
| `#ffffff` | Header text |

---

## Implementation Notes

- All 4 SVGs are already exported to `frontend/public/` as static assets
- Wordmark rendered in header at `width: 113px` (scales proportionally to ~32px tall)
- Step SVGs rendered inside the home page sidebar at their natural width; capped with `max-width: 100%`
- Do not rasterize — keep as SVG for crisp rendering at all DPRs
