# Email

## Overview
- **Dimensions:** 1920 × 1080 px
- **Background:** #f8f7f5
- **Frame type:** Email design (not a web page — no standard header/footer chrome)
- **Node ID:** 46:1874
- **Purpose:** Verify email address (sent after Maker completes the Begin form)

---

## Layout Structure

```
Frame 1920×1080
├── Logo bar — top: 0, w: 1500px, h: 184px (black, centered)
├── Content block — centered, top: 286px, w: 565px
│   ├── H1 (mixed weight)
│   ├── Subtitle
│   ├── Body text
│   ├── Terms line
│   ├── "Verify my email" button
│   └── Button note
└── Footer bar — top: 816px, w: 1499px, h: 84px (gray)
```

---

## Logo Bar

| Property | Value |
|---|---|
| Position | absolute, left: 50% (translate-x -50%), top: 0 |
| Size | 1500 × 184 px |
| Background | #000000 |
| Padding | top: 55px, bottom: 56px, left: 890px, right: 890px |

### Wordmark inside logo bar
| Property | Value |
|---|---|
| Size | 164px wide, full height |
| Align | text-center |
| "ov" | Georgia Bold 64px #ffffff |
| "yu" | Georgia Bold Italic 64px #ffffff |

---

## Content Block

| Property | Value |
|---|---|
| Position | absolute, left: calc(50% + 0.5px) (translate-x -50%), top: 286px |
| Width | 565px |
| Layout | flex col, gap: 39px, align-items: center |

### H1 — "Confirm your email address"
| Property | Value |
|---|---|
| "Confirm" | Georgia Italic 44px #1a1a1a |
| " your email address" | Georgia Regular 44px #1a1a1a |
| Align | text-center |

### Subtitle
| Property | Value |
|---|---|
| Font | Helvetica Regular 22px |
| Color | #444444 |
| Align | text-center |
| Text | "You're one step away from starting your Ovyu." |

### Body Text
| Property | Value |
|---|---|
| Width | 451px |
| Font | Helvetica Regular 18px |
| Color | #444444 |
| Align | text-center |
| Text | "Click the button below to verify your email. This link expires in 24 hours. If you didn't create an Ovyu account, you can safely ignore this email." |

### Terms Line
| Property | Value |
|---|---|
| Font | Helvetica Oblique 14px |
| Color | #444444 |
| Align | text-center |
| Text | "By continuing you agree to Ovyu's Terms of Use and Privacy Policy." |

### CTA Button — "Verify my email"
| Property | Value |
|---|---|
| Size | 418 × 63 px |
| Background | #c9a84c (gold) |
| Border radius | 11px |
| Padding | top: 19px, bottom: 19px, left: 128px, right: 129px |
| Font | Helvetica Bold 22px |
| Color | #ffffff |
| Align | text-center |

### Button Note
| Property | Value |
|---|---|
| Font | Helvetica Oblique 14px |
| Color | #444444 |
| Align | text-center |
| Text | "This button takes you back to ovyu.com to confirm your account and continue." |

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
| Align | text-center, whitespace-nowrap (white-space: pre) |
| Text | "ovyu.com  ·  This is a transactional email. You are receiving this because you created an account." |

---

## Typography Scale

| Element | Font | Size | Weight/Style | Color |
|---|---|---|---|---|
| Wordmark "ov" | Georgia | 64px | Bold | #ffffff |
| Wordmark "yu" | Georgia | 64px | Bold Italic | #ffffff |
| H1 "Confirm" | Georgia | 44px | Italic | #1a1a1a |
| H1 " your email address" | Georgia | 44px | Regular | #1a1a1a |
| Subtitle | Helvetica | 22px | Regular | #444444 |
| Body text | Helvetica | 18px | Regular | #444444 |
| Terms / note | Helvetica | 14px | Oblique | #444444 |
| CTA button | Helvetica | 22px | Bold | #ffffff |
| Footer bar text | Helvetica | 16px | Regular | #888888 |

---

## Color Summary

| Token | Hex | Usage |
|---|---|---|
| Page bg | #f8f7f5 | Frame |
| Logo bar bg | #000000 | Top bar |
| Wordmark | #ffffff | Logo text |
| Ink | #1a1a1a | H1 |
| Ink soft | #444444 | Subtitle, body, terms |
| Gold | #c9a84c | CTA button bg |
| CTA text | #ffffff | Button label |
| Footer bg | #d9d9d9 | Bottom gray bar |
| Footer text | #888888 | Footer text |

---

## Design Notes

- This is an **email template design**, not a web page. The 1920×1080 frame shows how the email looks on screen.
- No standard site header or footer — uses a standalone black logo bar at top and a gray transactional footer at bottom.
- The gold (#c9a84c) CTA button is unique to email frames — web page CTAs use black (#000) buttons.
- Content block is 565px wide, centered — narrower than web page content to match email client column widths.
- Gap between logo bar bottom (184px) and content top (286px) = 102px of cream breathing space.
- Gap between content block bottom and gray footer: the footer starts at 816px. Content ends at approximately 286 + 39*5 + element heights ≈ 700-750px → ~66-116px gap above footer.
