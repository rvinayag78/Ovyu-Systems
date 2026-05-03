# Maker Email (Keeper Signed)

## Overview
- **Dimensions:** 1920 × 1080 px
- **Background:** #f8f7f5
- **Frame type:** Email design (not a web page)
- **Node ID:** 124:1844
- **Purpose:** Sent to the Maker when their Keeper has signed the contract — invites Maker to begin upload

---

## Difference from "Email" (46:1874)

Same logo bar and footer bar layout. Content block is at top:254px (32px higher). Key content differences:

| Element | Email (46:1874) | Maker Email Keeper Signed (124:1844) |
|---|---|---|
| Content top | 286px | 254px |
| H1 | "Confirm your email address" | "Your contract is locked." |
| H1 style | Mixed Regular+Italic | Georgia Italic (whole line) |
| Subtitle | "You're one step away..." | "[Keeper name] has signed. You're ready to begin." |
| Body | 1 paragraph (link warning) | 2 paragraphs (encouragement) |
| Terms line | Yes (before button) | No (merged into note after button) |
| CTA label | "Verify my email" | "Begin my upload" |
| Footer text | "...you created an account." | "...your Keeper completed the contract." |

---

## Logo Bar

Identical to "Email" frame.

| Property | Value |
|---|---|
| Position | absolute, left: 50% (translate-x -50%), top: 0 |
| Size | 1500 × 184 px |
| Background | #000000 |
| Padding | top: 55px, bottom: 56px, left: 890px, right: 890px |
| Wordmark | "ov" Georgia Bold 64px #fff + "yu" Georgia Bold Italic 64px #fff, 164px wide |

---

## Content Block

| Property | Value |
|---|---|
| Position | absolute, left: calc(50% + 0.5px) (translate-x -50%), top: 254px |
| Width | 565px |
| Layout | flex col, gap: 39px, align-items: center |

### Title + Subtitle Group
| Property | Value |
|---|---|
| Layout | flex col, gap: 12px, text-center, w: full |

#### H1 — "Your contract is locked."
| Property | Value |
|---|---|
| Font | Georgia Italic 44px |
| Color | #1a1a1a |
| Align | text-center, w: full |

#### Subtitle
| Property | Value |
|---|---|
| Font | Helvetica Regular 22px |
| Color | #444444 |
| Align | text-center, w: full |
| Text | "[Keeper name] has signed. You're ready to begin." |

### Body Text
| Property | Value |
|---|---|
| Width | 451px |
| Font | Helvetica Regular 18px |
| Color | #444444 |
| Align | text-center |
| White space | whitespace-pre-wrap |
| Para 1 | "Everything is in place. When you're ready, start with a welcome message to [Keeper name] a short video or voice recording that will be the first thing they receive." |
| Para 2 | "You can take as long as you need. Come back whenever you like. There's no deadline." |

### CTA + Note Group
| Property | Value |
|---|---|
| Layout | flex col, gap: 14px, align-items: center, w: full |

#### CTA Button — "Begin my upload"
| Property | Value |
|---|---|
| Size | 418 × 63 px |
| Background | #c9a84c (gold) |
| Border radius | 11px |
| Padding | top: 19px, bottom: 19px, left: 128px, right: 129px |
| Font | Helvetica Bold 22px |
| Color | #ffffff |
| Align | text-center |

#### Note (2 lines)
| Property | Value |
|---|---|
| Font | Helvetica Oblique 14px |
| Color | #444444 |
| Align | text-center |
| Line height | 1.35 |
| Line 1 | "By continuing you agree to Ovyu's Terms of Use and Privacy Policy." |
| Line 2 | "You can return to your upload at any time by logging in to ovyu.com." |

---

## Footer Bar

| Property | Value |
|---|---|
| Position | absolute, left: 1px, top: 816px |
| Size | 1499 × 84 px |
| Background | #d9d9d9 |
| Padding | top: 33px, bottom: 33px, left: 403px, right: 404px |
| Font | Helvetica Regular 16px |
| Color | #888888 |
| Align | text-center, whitespace-nowrap |
| Text | "ovyu.com  ·  This is a transactional email sent because your Keeper completed the contract." |

---

## Typography Scale

| Element | Font | Size | Weight/Style | Color |
|---|---|---|---|---|
| Wordmark "ov" | Georgia | 64px | Bold | #ffffff |
| Wordmark "yu" | Georgia | 64px | Bold Italic | #ffffff |
| H1 | Georgia | 44px | Italic | #1a1a1a |
| Subtitle | Helvetica | 22px | Regular | #444444 |
| Body text | Helvetica | 18px | Regular | #444444 |
| Note / terms | Helvetica | 14px | Oblique | #444444 |
| CTA button | Helvetica | 22px | Bold | #ffffff |
| Footer bar text | Helvetica | 16px | Regular | #888888 |

---

## Color Summary

Same as "Email" frame.

| Token | Hex | Usage |
|---|---|---|
| Page bg | #f8f7f5 | Frame |
| Logo bar bg | #000000 | Top bar |
| Wordmark | #ffffff | Logo text |
| Ink | #1a1a1a | H1 |
| Ink soft | #444444 | Subtitle, body, note |
| Gold | #c9a84c | CTA button bg |
| CTA text | #ffffff | Button label |
| Footer bg | #d9d9d9 | Bottom gray bar |
| Footer text | #888888 | Footer text |
