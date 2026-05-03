# Keeper Email (Keeper Signed)

## Overview
- **Dimensions:** 1920 × 1080 px
- **Background:** #f8f7f5
- **Frame type:** Email design
- **Node ID:** 185:1187
- **Purpose:** Sent to the Keeper after they sign — confirms receipt and explains what happens next

---

## Logo Bar
Identical to all email frames.

| Property | Value |
|---|---|
| Position | absolute, left: 50% (translate-x -50%), top: 0 |
| Size | 1500 × 184 px, bg #000000 |
| Padding | top: 55px, bottom: 56px, left: 890px, right: 890px |
| Wordmark | "ov" Georgia Bold 64px + "yu" Georgia Bold Italic 64px, #ffffff, 164px wide |

---

## Content Block

| Property | Value |
|---|---|
| Position | absolute, left: calc(50% + 0.5px) (translate-x -50%), top: 270px |
| Width | 565px |
| Layout | flex col, gap: 41px, align-items: center |

### Title + Subtitle Group
| Property | Value |
|---|---|
| Layout | flex col, gap: 12px, text-center, w: full |
| H1 | "Thank you for signing." — Georgia Italic 44px #1a1a1a |
| Subtitle | "[Maker name] has been notified." — Helvetica Regular 22px #444444 |

### Body Text
| Property | Value |
|---|---|
| Width | 527px |
| Font | Helvetica Regular 18px #444444 |
| Align | text-center, whitespace-pre-wrap |
| Para 1 | "What you signed is now in place. [Maker name] will begin putting together what they want to leave for you, in their own time." |
| Para 2 | "When [Maker name] passes, it will be on you to come back and activate the transfer. That's how you'll receive what they've left. Nothing happens automatically." |

### CTA + Note Group
| Property | Value |
|---|---|
| Layout | flex col, gap: 14px, align-items: center, w: full |

#### CTA Button — "Log in to view contract"
| Property | Value |
|---|---|
| Size | 418 × 63 px |
| Background | #c9a84c |
| Border radius | 11px |
| Padding | top: 19px, bottom: 19px, left: 128px, right: 129px |
| Font | Helvetica Bold 22px #ffffff, text-center |

#### Note (2 lines)
| Property | Value |
|---|---|
| Font | Helvetica Oblique 14px #444444 |
| Line height | 1.35 |
| Line 1 | "By continuing you agree to Ovyu's Terms of Use and Privacy Policy." |
| Line 2 | "You can return to your agreement at any time by logging in to ovyu.com." |

---

## Footer Bar

| Property | Value |
|---|---|
| Position | absolute, left: 1px, top: 816px |
| Size | 1499 × 84 px, bg #d9d9d9 |
| Padding | top: 33px, bottom: 33px, left: 403px, right: 404px |
| Font | Helvetica Regular 16px #888888 text-center whitespace-nowrap |
| Text | "ovyu.com · This is a transactional email sent because you signed your agreement." |
