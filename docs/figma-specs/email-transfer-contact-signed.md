# Email (Transfer Contact Signed)

**Figma node:** 124:1857
**Frame:** 1500×900px
**Background:** `#f8f7f5` (cream)
**Purpose:** Transactional email sent to the Maker after their Transfer Contact signs. Confirms the contract is locked and invites the Maker to begin their upload.

---

## Layout Hierarchy

```
Frame 1500×900 — bg #f8f7f5
├── Email Header — absolute, centered, top: 0
│   w: 1500px, h: 184px, bg: #000000
│   └── Wordmark "ovyu" — 164px wide, Georgia Bold+Bold Italic 64px, #ffffff
├── Email Footer — absolute, left: 1px, top: 816px
│   w: 1499px, h: 84px, bg: #d9d9d9
│   └── Footer note — Helvetica Regular 16px #888, text-center
└── Email Body — absolute, centered (left: 50% + 0.5px), top: 254px
    w: 565px
    flex col, gap: 58px, items-center
    ├── Title group — flex col, gap: 12px, w: 100%
    │   ├── Main heading — Georgia Italic 44px #1a1a1a, text-center
    │   └── Subheading — Helvetica Regular 22px #444, text-center
    ├── Body copy — Helvetica Regular 18px #444, text-center, w: 451px
    └── CTA group — flex col, gap: 14px, items-center, w: 100%
        ├── CTA button — gold, 418×63px, radius 11px
        └── Legal + return note — Helvetica Oblique 14px #444, text-center
```

---

## Email Header

Identical structure to Email (Keeper) and Email (Transfer Contact):

| Property | Value |
|---|---|
| Width | 1500px |
| Height | 184px |
| Background | `#000000` |
| Padding top/bottom | 55px / 56px |
| Padding left/right | 890px each |
| Layout | flex, items-center, justify-center |
| Wordmark container | w: 164px, h: full |
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
| Content | "ovyu.com  ·  This is a transactional email sent because your Transfer Contact completed the contract." |
| Font | Helvetica Regular |
| Size | 16px |
| Color | `#888888` |
| Alignment | text-center, whitespace-nowrap |

---

## Email Body

| Property | Value |
|---|---|
| Position | absolute, centered horizontally (left: 50% + 0.5px, translate -50%), top: 254px |
| Width | 565px |
| Layout | flex column, gap: 58px, items-center |

*Note: gap is 58px — significantly larger than the 30px used in Email (Keeper). Creates more spacious feel for this confirmation email.*

---

### Title Group

| Property | Value |
|---|---|
| Layout | flex column, gap: 12px |
| Width | 100% of parent (565px) |

#### Main Heading
| Property | Value |
|---|---|
| Content | "Your contract is locked." |
| Font | Georgia Italic |
| Size | 44px |
| Color | `#1a1a1a` |
| Alignment | text-center |
| Line-height | normal |

#### Subheading
| Property | Value |
|---|---|
| Content | "[Transfer Contact] has signed. You're ready to begin." |
| Font | Helvetica Regular |
| Size | 22px |
| Color | `#444444` |
| Alignment | text-center |
| Line-height | normal |

---

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
| Content (para 1) | "Everything is in place. When you're ready, start with a welcome message to [Keeper name] a short video or voice recording that will be the first thing they receive." |
| Content (para 2) | "You can take as long as you need. Come back whenever you like. There's no deadline." |

---

### CTA Group

| Property | Value |
|---|---|
| Layout | flex column, gap: 14px, items-center |
| Width | 100% of parent (565px) |

#### CTA Button
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
| Label | "Begin my upload" |
| Label font | Helvetica Bold |
| Label size | 22px |
| Label color | `#ffffff` |

#### Legal + Return Note
| Property | Value |
|---|---|
| Font | Helvetica Oblique |
| Size | 14px |
| Color | `#444444` |
| Alignment | text-center |
| Line-height | 1.35 |
| Content line 1 | "By continuing you agree to Ovyu's Terms of Use and Privacy Policy." |
| Content line 2 | "You can return to your upload at any time by logging in to ovyu.com." |

---

## Typography Reference

| Element | Font | Weight | Size | Color | Style |
|---|---|---|---|---|---|
| Wordmark "ov" | Georgia | Bold (700) | 64px | `#ffffff` | normal |
| Wordmark "yu" | Georgia | Bold (700) | 64px | `#ffffff` | italic |
| Main heading | Georgia | Regular (400) | 44px | `#1a1a1a` | italic |
| Subheading | Helvetica | Regular (400) | 22px | `#444444` | normal |
| Body copy | Helvetica | Regular (400) | 18px | `#444444` | normal |
| CTA label | Helvetica | Bold (700) | 22px | `#ffffff` | normal |
| Legal/note | Helvetica | Regular (400) | 14px | `#444444` | oblique |
| Footer note | Helvetica | Regular (400) | 16px | `#888888` | normal |

---

## Color Reference

| Value | Usage |
|---|---|
| `#f8f7f5` | Frame background |
| `#000000` | Email header background |
| `#d9d9d9` | Email footer background |
| `#ffffff` | Wordmark text |
| `#1a1a1a` | Main heading text |
| `#444444` | Subheading, body, legal text |
| `#888888` | Footer note |
| `#c9a84c` | CTA button (gold) |

---

## Key Differences from Other Emails

| Aspect | This Email | Email (Keeper) |
|---|---|---|
| Recipient | Maker | Keeper |
| Trigger | TC signed contract | Maker initiated contract |
| Heading style | Georgia **Italic** | Georgia Regular |
| Subheading color | `#444` | `#888` |
| Body gap | 58px | 30px |
| CTA label | "Begin my upload" | "Review and sign the agreement" |
| Body width | 565px | 756px |
| Body top | 254px | 50% + 49.5px offset |

---

## Tailwind Class Mapping

| Property | Value | Tailwind |
|---|---|---|
| Body top | 254px | `top-[254px]` |
| Body width | 565px | `w-[565px]` |
| Gap (body) | 58px | `gap-[58px]` |
| Title gap | 12px | `gap-[12px]` |
| CTA gap | 14px | `gap-[14px]` |
| Heading | Georgia Italic 44px `#1a1a1a` | `font-['Georgia:Italic'] text-[44px] text-[#1a1a1a]` |
| Subheading color | `#444` | `text-[#444]` |
| CTA bg | `#c9a84c` | `bg-[#c9a84c]` |
| CTA radius | 11px | `rounded-[11px]` |
| Legal line-height | 1.35 | `leading-[1.35]` |
