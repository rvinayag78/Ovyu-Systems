# Transfer Contact Signed

## Overview
- **Dimensions:** 1920 × 1080 px
- **Background:** #f8f7f5
- **Frame type:** Full page / viewport-locked
- **Node ID:** 142:770
- **Path:** Private path — shown to the Transfer Contact after they sign the agreement

---

## Difference from "Keeper Signed" (141:701)

This frame is **nearly identical** to Keeper Signed. The only differences are:

1. **Header:** Uses logged-out variant (`HeaderLogIn` with Log In button) instead of the logged-in avatar header
2. **Callout body text:** Instructions for the TC (submit evidence of passing, confirm Keeper details) instead of Keeper instructions

All card dimensions, paddings, colors, and typography are identical.

---

## Header

Logged-out variant ("Header log in") — shows Log In button, not avatar.

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
| "Log In" button | 136 × 52 px, bg #1a1a1a, border-radius: 8px, Helvetica Bold 16px #fff |

---

## Main Card

Identical dimensions and layout to Keeper Signed.

| Property | Value |
|---|---|
| Position | absolute, left: 395px, top: 170px |
| Size | 1130 × 687 px |
| Background | #ffffff |
| Border | 2px solid #e1e1e1 |
| Border radius | 15px |
| Padding | 60px (all sides) |
| Layout | flex col, align-items: center, justify-content: space-between |

### Gold Checkmark Circle
| Property | Value |
|---|---|
| Size | 123 × 123 px |
| Background | #fef3e2 |
| Border | 3px solid #c9a84c |
| Border radius | 61.5px (full circle) |
| Padding | top: 25px, bottom: 25px, left: 34px, right: 35px |
| Content | "✓", Georgia Bold 64px #c9a84c |

### H1
| Property | Value |
|---|---|
| Font | Georgia Italic 64px |
| Color | #1a1a1a |
| Align | text-left, whitespace-nowrap |
| Text | "You've signed." |

### Subtitle
| Property | Value |
|---|---|
| Font | Helvetica Regular 22px |
| Color | #888888 |
| Align | text-left, whitespace-nowrap |
| Text | "The contract between you and [Name] is now in place." |

### Divider
| Property | Value |
|---|---|
| Size | 500 × 5 px |
| Background | #d9d9d9 |

### "What happens when the time comes" Callout
| Property | Value |
|---|---|
| Size | 934 × 211 px |
| Background | #fef3e2 |
| Border | 2px solid #c9a84c |
| Border radius | 20px |
| Padding | top: 48px, bottom: 48px, left: 42px, right: 42px |

#### Callout Inner
| Property | Value |
|---|---|
| Width | 850px |
| Layout | flex col, gap: 29px, items-start, justify-center |
| Color | #444444 |

| Sub-element | Font | Size | Weight | Notes |
|---|---|---|---|---|
| Title | Helvetica | 20px | Bold | "What happens when the time comes" |
| Body text | Helvetica | 18px | Regular | Two separate `<p>` elements |
| Link "ovyu.com/activate-transfer" | Helvetica | 18px | Bold | Color #4472c4, text-decoration: underline solid |

**Body text (full — TC-specific):**
- Para 1: "When [Name] passes, you will need to go to [link: ovyu.com/activate-transfer]. There you will submit evidence of their passing and confirm the details for their Keeper. Once you do that, we take it from there."
- Para 2: "There is no deadline. Do this when you are ready and able."

---

## Footer Note (below card)

| Property | Value |
|---|---|
| Position | absolute, left: 68px, top: 917px (translate-y -50%) |
| Font | Helvetica Oblique 16px |
| Color | #888888 |
| Align | text-left, whitespace-nowrap |
| Text | "You will always be the one to decide when you are ready to access this. Nothing happens without your confirmation." |

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

Same as Keeper Signed except no avatar text (Log In button replaces avatar).

| Element | Font | Size | Weight/Style | Color |
|---|---|---|---|---|
| Wordmark | Georgia | 40px | Bold + Bold Italic | #000000 |
| Log In button | Helvetica | 16px | Bold | #ffffff on #1a1a1a |
| Checkmark | Georgia | 64px | Bold | #c9a84c |
| H1 | Georgia | 64px | Italic | #1a1a1a |
| Subtitle | Helvetica | 22px | Regular | #888888 |
| Callout title | Helvetica | 20px | Bold | #444444 |
| Callout body | Helvetica | 18px | Regular | #444444 |
| Callout link | Helvetica | 18px | Bold | #4472c4 |
| Footer note | Helvetica | 16px | Oblique | #888888 |
| Nav link | Helvetica Neue | 16px | Regular | #000000 |

---

## Color Summary

Same as Keeper Signed.

| Token | Hex | Usage |
|---|---|---|
| Page bg | #f8f7f5 | Frame |
| Header bg | #ffffff | Header bar |
| Header border | #e1e1e1 | Bottom border |
| Log In button | #1a1a1a | Nav button bg |
| Card bg | #ffffff | Main card |
| Card border | #e1e1e1 | Card border |
| Ink | #1a1a1a | H1 |
| Muted | #888888 | Subtitle, footer note |
| Ink soft | #444444 | Callout body |
| Gold | #c9a84c | Circle border, callout border, checkmark |
| Gold light bg | #fef3e2 | Circle bg, callout bg |
| Divider | #d9d9d9 | 500px horizontal rule |
| Link | #4472c4 | "ovyu.com/activate-transfer" |
| Footer bg | #000000 | Footer bar |
