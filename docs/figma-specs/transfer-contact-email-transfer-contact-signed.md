# Transfer Contact Email (Transfer Contact Signed)

**Figma node:** 185:1200
**Frame:** 1500×900px
**Background:** `#f8f7f5` (cream)
**Purpose:** Confirmation email sent to the Transfer Contact (TC) after they sign the contract. Explains their one responsibility clearly, confirms no further action is needed until the Maker passes, and attaches a copy of what they signed.

---

## Layout Hierarchy

```
Frame 1500×900 — bg #f8f7f5
├── Email Header — absolute, centered, top: 0
│   w: 1500px, h: 184px, bg: #000000
│   └── Wordmark "ovyu" — 164px wide, Georgia Bold+Bold Italic 64px, #ffffff
├── Email Footer — absolute, left: 1px, top: 816px
│   w: 1499px, h: 84px, bg: #d9d9d9
│   └── Footer note — Helvetica Regular 16px #888
└── Email Body — absolute, centered (left: 50% + 0.5px), top: 256px
    w: 801px
    flex col, gap: 45px, items-center, text-center
    ├── Title group — flex col, gap: 12px, w: 100%
    │   ├── Heading — Georgia Italic 44px #1a1a1a
    │   └── Subheading — Helvetica Regular 22px #444
    └── Long body copy — Helvetica Regular 18px #444, w: 647px
```

---

## Email Header

Identical to all other Ovyu email headers:

| Property | Value |
|---|---|
| Width | 1500px |
| Height | 184px |
| Background | `#000000` |
| Padding top/bottom | 55px / 56px |
| Padding left/right | 890px each |
| Layout | flex, items-center, justify-center |
| Wordmark "ov" | Georgia Bold 64px `#ffffff` |
| Wordmark "yu" | Georgia Bold Italic 64px `#ffffff` |
| Wordmark container | w: 164px, h: full, text-center |

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
| Content | "ovyu.com · This is a transactional email sent because you signed as a Transfer Contact." |
| Font | Helvetica Regular |
| Size | 16px |
| Color | `#888888` |
| Alignment | text-center |

*Note: Unlike other emails, this footer text does NOT use whitespace-nowrap / pre — it is a standard single-line text block.*

---

## Email Body

| Property | Value |
|---|---|
| Position | absolute, left: 50% + 0.5px (translate -50%), top: 256px |
| Width | 801px |
| Layout | flex column, gap: 45px, items-center, text-center |
| Line-height | 0 (set on container — each child overrides individually) |
| Font style | not-italic (container default) |

*Note: 801px body is wider than other emails (565px, 756px) to accommodate the longer body copy without excessive wrapping.*

---

### Title Group

| Property | Value |
|---|---|
| Layout | flex column, gap: 12px |
| Width | 100% of parent (801px) |
| Alignment | items-start (children align left within their own text-align: center) |

#### Heading
| Property | Value |
|---|---|
| Content | "Thank you for signing." |
| Font | Georgia Italic |
| Size | 44px |
| Color | `#1a1a1a` |
| Alignment | text-center, full width |
| Line-height | normal |

#### Subheading
| Property | Value |
|---|---|
| Content | "[Maker name] has been notified." |
| Font | Helvetica Regular |
| Size | 22px |
| Color | `#444444` |
| Alignment | text-center, full width |
| Line-height | normal |

---

### Long Body Copy

| Property | Value |
|---|---|
| Width | 647px |
| Font | Helvetica Regular |
| Size | 18px |
| Color | `#444444` |
| Alignment | text-center |
| White-space | pre-wrap |
| Line-height | normal |

**Content (6 paragraphs with blank line separators):**

1. "You've agreed to one thing: when [Maker name] passes, you'll let Ovyu know. That's what activates the transfer to [Keeper name]."

2. "You won't see what [Maker name] is leaving. You won't be involved in what [Keeper name] receives. Your role begins and ends with that one notification."

3. "[Maker name] is recording a welcome message for [Keeper name] that will play when the transfer begins. You don't need to explain anything to [Keeper name], or speak with them at all. Once you've notified Ovyu, we take it from there."

4. "A copy of what you signed is attached to this email. Please save it. You won't have an Ovyu account, so this is your record."

5. "Until [Maker name] passes, there's nothing you need to do."

---

## Typography Reference

| Element | Font | Weight | Size | Color | Style |
|---|---|---|---|---|---|
| Wordmark "ov" | Georgia | Bold (700) | 64px | `#ffffff` | normal |
| Wordmark "yu" | Georgia | Bold (700) | 64px | `#ffffff` | italic |
| Heading | Georgia | Regular (400) | 44px | `#1a1a1a` | italic |
| Subheading | Helvetica | Regular (400) | 22px | `#444444` | normal |
| Body copy | Helvetica | Regular (400) | 18px | `#444444` | normal |
| Footer note | Helvetica | Regular (400) | 16px | `#888888` | normal |

---

## Color Reference

| Value | Usage |
|---|---|
| `#f8f7f5` | Frame background |
| `#000000` | Email header background |
| `#d9d9d9` | Email footer background |
| `#ffffff` | Wordmark text |
| `#1a1a1a` | Heading text |
| `#444444` | Subheading, body copy |
| `#888888` | Footer note |

---

## Key Characteristics

**No CTA button.** Unlike every other email in the system, this email has no call-to-action button. The TC has already signed; there is nothing for them to do next. The email is purely informational.

**No gold.** This is the only email with no `#c9a84c` anywhere — no button, no callout border. The design deliberately avoids urgency cues.

**Longest body copy.** 5 substantive paragraphs vs 2–3 in other emails. The TC needs full clarity on what their role entails.

**Attachment mentioned.** The copy references a PDF attachment of the signed contract. This is the TC's only record — they have no Ovyu account.

---

## Comparison with Email (Transfer Contact) — Pre-signing

| Aspect | Email (Transfer Contact) | Transfer Contact Email (TC Signed) |
|---|---|---|
| Trigger | Maker names TC | TC signs contract |
| Heading | "[Name] has chosen you..." | "Thank you for signing." |
| Has CTA | Yes — "Review the contract..." | **No CTA** |
| Has callout box | Yes — gold-bordered responsibility list | **No callout box** |
| Body width | Not explicitly set | 647px |
| Gap | 20px | 45px |
| Footer text | "...you may decline." | "...you signed as a Transfer Contact." |

---

## Tailwind Class Mapping

| Property | Value | Tailwind |
|---|---|---|
| Body top | 256px | `top-[256px]` |
| Body width | 801px | `w-[801px]` |
| Gap (body) | 45px | `gap-[45px]` |
| Title gap | 12px | `gap-[12px]` |
| Copy width | 647px | `w-[647px]` |
| Heading | Georgia Italic 44px | `font-['Georgia:Italic'] text-[44px]` |
| Heading color | `#1a1a1a` | `text-[#1a1a1a]` |
| Subheading color | `#444` | `text-[#444]` |
| Copy pre-wrap | pre-wrap | `whitespace-pre-wrap` |
