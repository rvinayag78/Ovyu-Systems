# Signed Contract (Maker & Keeper)

## Overview
- **Dimensions:** 1920 × 1080 px
- **Background:** #f8f7f5
- **Frame type:** Full page / viewport-locked
- **Node ID:** 189:1972
- **State:** Both Maker and Keeper have signed — contract is LOCKED

---

## Header

Logged-in variant with avatar.

| Property | Value |
|---|---|
| Position | absolute, left: 50% (translate-x -50%), top: 0 |
| Size | 1924 × 103 px |
| Background | #ffffff |
| Border | border-bottom: 3px solid #e1e1e1 |
| Inner width | 1800px centered |
| Wordmark | Georgia Bold/Bold Italic 40px #000, 113 × 50 px |
| Nav gap | 117px |
| "Activate Transfer" | Helvetica Neue Regular 16px #000, 150 × 24 px |
| Avatar | 51 × 51 px, bg #4b3c5e, border-radius: 25.5px, Georgia Regular 32.66px #fff |

---

## Main Content Block

| Property | Value |
|---|---|
| Position | absolute, left: 58px, top: 143px |
| Width | 1804px |
| Layout | flex col, gap: 23px, items-start |

### H1 — "ov*yu* Agreement"

| Property | Value |
|---|---|
| Font | Georgia 64px #1a1a1a |
| Text runs | "ov" Regular + "yu " Italic + "Agreement" Regular |

### Meta Row

| Property | Value |
|---|---|
| Layout | flex row, justify-content: space-between, whitespace-nowrap, w: full |

| Element | Font | Size | Style | Color |
|---|---|---|---|---|
| "Between [Maker] and [Keeper]" | Helvetica | 22px | Oblique | #1a1a1a |
| "Signed by [Maker] on [date]" | Helvetica | 18px | Oblique | #888888 |
| "Signed by [Keeper] on [date]" | Helvetica | 18px | Oblique | #888888 |
| "Download ⤓" | Helvetica | 18px | Regular | #1a1a1a |

---

## Contract Body Card

| Property | Value |
|---|---|
| Background | #ffffff |
| Padding | 40px (all sides) |
| Layout | flex row, gap: 66px, align-items: center, w: full |

### Left Column

| Property | Value |
|---|---|
| Width | 760px |
| Layout | flex col, gap: 14px |

Section headers: **Helvetica Bold 22px #c9a84c uppercase**
Body text: **Helvetica Regular 16px #444444**

| Section | Header text |
|---|---|
| 1 | WHAT THIS IS |
| 2 | WHAT [MAKER] IS LEAVING FOR [KEEPER]. |
| 3 | WHEN [KEEPER] RECEIVES IT. |
| 4 | WHAT [KEEPER] AGREES TO. |

### Right Column

| Property | Value |
|---|---|
| Width | 888px |
| Layout | flex col, gap: 21px |

Section headers: **Helvetica Bold 22px #c9a84c uppercase**

| Section | Header text | Body width |
|---|---|---|
| 1 | WITHDRAWING. | (fills column) |
| 2 | WHAT OVYU DOES. | 855px |
| 3 | WHAT OVYU DOES NOT DO. | 815px |

---

## Disclaimer (below body card)

| Property | Value |
|---|---|
| Font | Helvetica Oblique 16px |
| Color | #888888 |
| Align | text-right, whitespace-nowrap |
| Text | "Your digital signature carries the same intent as a handwritten signature within the Ovyu platform." |

---

## Footer

| Property | Value |
|---|---|
| Position | absolute, left: 0, top: 977px |
| Size | 1920 × 103 px |
| Background | #000000 |
| Inner | left: 68px, top: 44px, flex row, gap: 199px |

---

## Typography Scale

| Element | Font | Size | Weight/Style | Color |
|---|---|---|---|---|
| Wordmark | Georgia | 40px | Bold + Bold Italic | #000000 |
| Avatar initial | Georgia | 32.66px | Regular | #ffffff |
| H1 "ov" + "Agreement" | Georgia | 64px | Regular | #1a1a1a |
| H1 "yu " | Georgia | 64px | Italic | #1a1a1a |
| Meta "Between..." | Helvetica | 22px | Oblique | #1a1a1a |
| Meta signed dates | Helvetica | 18px | Oblique | #888888 |
| Meta "Download ⤓" | Helvetica | 18px | Regular | #1a1a1a |
| Section headers | Helvetica | 22px | Bold | #c9a84c |
| Body paragraphs | Helvetica | 16px | Regular | #444444 |
| Disclaimer | Helvetica | 16px | Oblique | #888888 |
| Nav header link | Helvetica Neue | 16px | Regular | #000000 |
| Footer text | Helvetica | 11-13px | Regular/Light Oblique | #f5f0e8 |

---

## Color Summary

| Token | Hex | Usage |
|---|---|---|
| Page bg | #f8f7f5 | Frame |
| Ink | #1a1a1a | H1, meta |
| Muted | #888888 | Signed dates, disclaimer |
| Gold | #c9a84c | Section headers |
| Ink soft | #444444 | Body paragraphs |
| Card bg | #ffffff | Contract body card |
| Avatar bg | #4b3c5e | Avatar circle |
| Footer bg | #000000 | Footer bar |

---

## Design Notes

- Left content column (58px) + 1804px = 1862px right edge. Asymmetric — 58px from left, 58px from right (1920-1804-58=58) — perfectly centered.
- Top of content (143px) − header height (103px) = 40px padding-top for main, matching `.ovyu-main--contract-view` CSS.
- Section gap: left col uses 14px, right col uses 21px — intentionally different rhythms per column.
- Body card uses `align-items: center` (not `flex-start`) so columns align vertically at their tops when they're the same height.
