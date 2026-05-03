# Email (Keeper)

**Figma node:** 141:542
**Frame:** 1500×900px
**Background:** `#f8f7f5` (cream)
**Purpose:** Transactional email sent to the Keeper when the Maker initiates a contract. Invites them to review and sign the agreement.

---

## Layout Hierarchy

```
Frame 1500×900 — bg #f8f7f5
├── Email Header — absolute, centered, top: 0
│   w: 1500px, h: 184px, bg: #000000
│   padding: top 55px / bottom 56px / left 890px / right 890px (centered wordmark)
│   └── Wordmark "ovyu" — 164×full-height, Georgia Bold+Bold Italic, 64px, #ffffff
├── Email Footer — absolute, left: 1px, top: 816px
│   w: 1499px, h: 84px, bg: #d9d9d9
│   padding: top 33px / bottom 33px / left 403px / right 404px
│   layout: flex, items-center, justify-center
│   └── Footer note — Helvetica Regular 16px #888, text-center, whitespace-pre
└── Email Body — absolute, centered (left: 50% translate), top: 50% + 49.5px offset
    w: 756px
    flex col, gap: 30px, items-center
    ├── Heading — Georgia Regular 44px #1a1a1a, text-center
    ├── Subheading — Helvetica Regular 22px #888, text-center
    ├── Body copy — Helvetica Regular 18px #444, text-center, w: 451px
    ├── Legal note — Helvetica Oblique 14px #444, text-center
    ├── CTA button — gold, 418×63px, radius 11px
    └── Button note — Helvetica Oblique 14px #444, text-center
```

---

## Email Header

| Property | Value |
|---|---|
| Position | absolute, centered horizontally (left: 50% + translate) |
| Width | 1500px |
| Height | 184px |
| Background | `#000000` |
| Padding top | 55px |
| Padding bottom | 56px |
| Padding left/right | 890px each (forces wordmark to center) |
| Layout | flex, items-center, justify-center |

### Wordmark
| Property | Value |
|---|---|
| Container | w: 164px, h: 100% |
| Layout | flex col, justify-center, text-center |
| "ov" | Georgia Bold 64px `#ffffff` |
| "yu" | Georgia Bold Italic 64px `#ffffff` |

---

## Email Footer

| Property | Value |
|---|---|
| Position | absolute, left: 1px, top: 816px |
| Width | 1499px |
| Height | 84px |
| Background | `#d9d9d9` |
| Padding top/bottom | 33px |
| Padding left | 403px |
| Padding right | 404px |
| Layout | flex, items-center, justify-center |

### Footer Text
| Property | Value |
|---|---|
| Content | "ovyu.com  ·  You received this because someone named you as their Keeper. If this is a mistake, you may decline." |
| Font | Helvetica Regular |
| Size | 16px |
| Color | `#888888` |
| Alignment | text-center |
| White-space | pre (preserves spacing around ·) |

---

## Email Body

| Property | Value |
|---|---|
| Position | absolute, centered horizontally, top: 50% + 49.5px |
| Width | 756px |
| Layout | flex column, gap: 30px, items-center |

### Heading
| Property | Value |
|---|---|
| Content | "[Name] has created something for you." |
| Font | Georgia Regular |
| Size | 44px |
| Color | `#1a1a1a` |
| Alignment | text-center |
| Line-height | normal |

### Subheading
| Property | Value |
|---|---|
| Content | "They've chosen you as their Keeper on Ovyu." |
| Font | Helvetica Regular |
| Size | 22px |
| Color | `#888888` |
| Alignment | text-center |
| Line-height | normal |

### Body Copy
| Property | Value |
|---|---|
| Width | 451px |
| Font | Helvetica Regular |
| Size | 18px |
| Color | `#444444` |
| Alignment | text-center |
| White-space | pre-wrap |
| Line-height | normal |
| Content (para 1) | "Ovyu is a private platform where a person leaves a piece of themselves, their voice, stories, and memories, for one person they love. [Name] chose you." |
| Content (para 2) | "Before anything begins, you'll need to review and sign a short agreement. It explains what you're receiving, on what terms, and what it means to say yes." |

### Legal Note
| Property | Value |
|---|---|
| Content | "By continuing you agree to Ovyu's Terms of Use and Privacy Policy." |
| Font | Helvetica Oblique |
| Size | 14px |
| Color | `#444444` |
| Alignment | text-center |

### CTA Button
| Property | Value |
|---|---|
| Width | 418px |
| Height | 63px |
| Background | `#c9a84c` (gold) |
| Border-radius | 11px |
| Padding top/bottom | 19px |
| Padding left | 128px |
| Padding right | 129px |
| Layout | flex, items-center, justify-center |
| Label text | "Review and sign the agreement" |
| Label font | Helvetica Bold |
| Label size | 22px |
| Label color | `#ffffff` |

### Button Note
| Property | Value |
|---|---|
| Content | "This button takes you back to ovyu.com to confirm your account and continue." |
| Font | Helvetica Oblique |
| Size | 14px |
| Color | `#444444` |
| Alignment | text-center |

---

## Typography Reference

| Element | Font | Weight | Size | Color | Style |
|---|---|---|---|---|---|
| Wordmark "ov" | Georgia | Bold (700) | 64px | `#ffffff` | normal |
| Wordmark "yu" | Georgia | Bold (700) | 64px | `#ffffff` | italic |
| Heading | Georgia | Regular (400) | 44px | `#1a1a1a` | normal |
| Subheading | Helvetica | Regular (400) | 22px | `#888888` | normal |
| Body copy | Helvetica | Regular (400) | 18px | `#444444` | normal |
| Legal note | Helvetica | Regular (400) | 14px | `#444444` | oblique |
| CTA label | Helvetica | Bold (700) | 22px | `#ffffff` | normal |
| Button note | Helvetica | Regular (400) | 14px | `#444444` | oblique |
| Footer note | Helvetica | Regular (400) | 16px | `#888888` | normal |

---

## Color Reference

| Value | Usage |
|---|---|
| `#f8f7f5` | Frame/email background |
| `#000000` | Email header background |
| `#d9d9d9` | Email footer background |
| `#ffffff` | Wordmark text |
| `#1a1a1a` | Heading text |
| `#888888` | Subheading, footer note text |
| `#444444` | Body copy, legal/button notes |
| `#c9a84c` | CTA button background (gold) |

---

## Responsive / Implementation Notes

- Frame is 1500×900px — this is an **email template**, not a web page
- Horizontal centering via absolute positioning + translate(-50%)
- The body section is vertically centered at 50% + 49.5px offset — positions it slightly below center in the 900px frame
- `[Name]` is a template variable, replaced with the Maker's first name
- Button links to the Keeper's invitation URL on ovyu.com
- No header/footer nav — this is a standalone email layout

---

## Tailwind Class Mapping

| Property | Value | Tailwind |
|---|---|---|
| Frame bg | `#f8f7f5` | `bg-[#f8f7f5]` |
| Email header bg | `#000000` | `bg-black` |
| Email footer bg | `#d9d9d9` | `bg-[#d9d9d9]` |
| Heading font/size | Georgia Regular 44px | `font-['Georgia:Regular'] text-[44px]` |
| Subheading color | `#888` | `text-[#888]` |
| Body color | `#444` | `text-[#444]` |
| CTA bg | `#c9a84c` | `bg-[#c9a84c]` |
| CTA radius | 11px | `rounded-[11px]` |
| Body gap | 30px | `gap-[30px]` |
