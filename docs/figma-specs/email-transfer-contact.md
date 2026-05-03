# Email (Transfer Contact)

**Figma node:** 141:556
**Frame:** 1500×900px
**Background:** `#f8f7f5` (cream)
**Purpose:** Transactional email sent to the Transfer Contact (TC) when the Maker names them. Explains their role and asks them to accept.

---

## Layout Hierarchy

```
Frame 1500×900 — bg #f8f7f5
├── Email Header — absolute, centered, top: 0
│   w: 1500px, h: 184px, bg: #000000
│   └── Wordmark "ovyu" — 164px wide, Georgia Bold+Bold Italic, 64px, #ffffff
├── Email Footer — absolute, left: 1px, top: 816px
│   w: 1499px, h: 84px, bg: #d9d9d9
│   └── Footer note — Helvetica Regular 16px #888, text-center
└── Email Body — absolute, left: 200px, top: 235px
    flex col, gap: 20px, items-center, justify-center
    ├── Heading — Georgia Regular 44px #1a1a1a, text-center, whitespace-nowrap
    ├── Subheading — Helvetica Regular 22px #888, text-center, whitespace-nowrap
    ├── Body copy — Helvetica Regular 18px #444, w: 960px
    ├── Responsibility callout box — 1100×167px, gold border
    ├── Legal note — Helvetica Oblique 14px #444, text-center
    ├── CTA button — gold, 500×63px, radius 11px
    └── Button note — Helvetica Oblique 14px #444, text-center, w: 756px
```

---

## Email Header

Identical to Email (Keeper) header — see that spec. Summary:

| Property | Value |
|---|---|
| Width | 1500px |
| Height | 184px |
| Background | `#000000` |
| Padding top/bottom | 55px / 56px |
| Padding left/right | 890px each |
| Wordmark | Georgia Bold "ov" + Georgia Bold Italic "yu", 64px, `#ffffff`, w: 164px |

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

### Footer Text
| Property | Value |
|---|---|
| Content | "ovyu.com  ·  You received this because [Name] named you as their Transfer Contact. If this is a mistake, you may decline." |
| Font | Helvetica Regular |
| Size | 16px |
| Color | `#888888` |
| Alignment | text-center, whitespace-nowrap |

---

## Email Body

| Property | Value |
|---|---|
| Position | absolute, left: 200px, top: 235px |
| Layout | flex column, gap: 20px, items-center, justify-center |

### Heading
| Property | Value |
|---|---|
| Content | "[Name] has chosen you as their Transfer Contact." |
| Font | Georgia Regular |
| Size | 44px |
| Color | `#1a1a1a` |
| Alignment | text-center |
| White-space | nowrap |

### Subheading
| Property | Value |
|---|---|
| Content | "This comes with a responsibility. Please read carefully." |
| Font | Helvetica Regular |
| Size | 22px |
| Color | `#888888` |
| Alignment | text-center |
| White-space | nowrap |

### Body Copy
| Property | Value |
|---|---|
| Width | 960px |
| Font | Helvetica Regular |
| Size | 18px |
| Color | `#444444` |
| White-space | pre-wrap |
| Content (para 1) | "[Name] is using Ovyu to leave a piece of themselves for someone they love. They have named you as their Transfer Contact, the person responsible for initiating the Transfer when the time comes." |
| Content (para 2) | "As Transfer Contact, your role is specific:" |

---

## Responsibility Callout Box

| Property | Value |
|---|---|
| Width | 1100px |
| Height | 167px |
| Background | `#f5edd6` (warm cream) |
| Border | 3px solid `#c9a84c` (gold) |
| Border-radius | 27px |
| Padding top | 35px |
| Padding bottom | 33px |
| Padding left | 157px |
| Padding right | 206px |
| Layout | flex, items-center, justify-center |

### Callout Content
| Property | Value |
|---|---|
| Font | Helvetica Regular |
| Size | 18px |
| Color | `#444444` |
| White-space | nowrap |
| Line 1 | "1.  When [Name] passes, provide Ovyu with evidence of their passing (such as a death certificate or official notice)." |
| Line 2 (margin-bottom: 18px) | "2.  Confirm the Keeper's name and email so we can reach them." |
| Line 3 | "3.  You have all the time you need." |

---

## Legal Note
| Property | Value |
|---|---|
| Content | "By continuing you agree to Ovyu's Terms of Use and Privacy Policy." |
| Font | Helvetica Oblique |
| Size | 14px |
| Color | `#444444` |
| Alignment | text-center |

---

## CTA Button

| Property | Value |
|---|---|
| Width | 500px |
| Height | 63px |
| Background | `#c9a84c` (gold) |
| Border-radius | 11px |
| Padding top/bottom | 19px |
| Padding left | 128px |
| Padding right | 129px |
| Layout | flex, items-center, justify-center |
| Label | "Review the contract and accept this role" |
| Label font | Helvetica Bold |
| Label size | 22px |
| Label color | `#ffffff` |

*Note: This CTA is 82px wider than the Keeper email CTA (500px vs 418px) to accommodate the longer label.*

---

## Button Note
| Property | Value |
|---|---|
| Width | 756px |
| Content | "This button takes you to ovyu.com where you can read the full contract and sign." |
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
| Callout body | Helvetica | Regular (400) | 18px | `#444444` | normal |
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
| `#888888` | Subheading, footer note |
| `#444444` | Body copy, legal, notes |
| `#f5edd6` | Callout box background (warm cream) |
| `#c9a84c` | Callout border, CTA button (gold) |

---

## Key Differences vs. Email (Keeper)

| Element | Email (Keeper) | Email (Transfer Contact) |
|---|---|---|
| Heading | "[Name] has created something for you." | "[Name] has chosen you as their Transfer Contact." |
| Subheading | "They've chosen you as their Keeper on Ovyu." | "This comes with a responsibility. Please read carefully." |
| Extra element | — | Gold-bordered responsibility callout box |
| CTA width | 418px | 500px |
| CTA label | "Review and sign the agreement" | "Review the contract and accept this role" |
| Footer context | Names recipient as Keeper | Names recipient as Transfer Contact |
| Body position | Centered (50% + 49.5px) | Fixed: left 200px, top 235px |

---

## Tailwind Class Mapping

| Property | Value | Tailwind |
|---|---|---|
| Callout bg | `#f5edd6` | `bg-[#f5edd6]` |
| Callout border | 3px solid `#c9a84c` | `border-3 border-[#c9a84c] border-solid` |
| Callout radius | 27px | `rounded-[27px]` |
| CTA width | 500px | `w-[500px]` |
| Body left | 200px | `left-[200px]` |
| Body top | 235px | `top-[235px]` |
