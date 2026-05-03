# Paywall

**Figma node:** 78:1018  
**Frame:** 1920×1080px  
**Background:** `#f8f7f5`

---

## Reusable Components

| Component | Used here |
|---|---|
| Header (account open) | Logged-in header with avatar |
| Footer | Black footer |
| Button / Primary | CTA on plan cards |

---

## Layout Hierarchy

```
Frame 1920×1080
├── Header — top: 0, 1924×103px
├── Title block — centered, top: 165px, w: 491px, flex col, gap: 7px
│   ├── "Choose your plan" — Georgia Regular 64px, h: 73px
│   └── Subtitle — Helvetica Regular 22px #444
└── Plan cards row — absolute, left: 165px, top: 325px, flex row, gap: 45px
    ├── Free card — 500×600px, active (black border)
    ├── Standard card — 500×600px, grayed out (opacity 50%)
    └── Legacy card — 500×600px, grayed out (opacity 50%)
└── Footer — top: 977px
```

---

## Title block (centered, top: 165px, w: 491px)

### "Choose your plan"
- **Font:** Georgia Regular 64px `#1a1a1a`, h: 73px
- **Alignment:** text-center

### Subtitle
- **Font:** Helvetica Regular 22px `#444`
- **Text:** "Start free. Everything you build here is yours"
- **Alignment:** text-center

---

## Plan cards row (left: 165px, top: 325px)

- **Layout:** flex row, gap: 45px, align-items: center

---

### Free card (500×600px) — active

- **Background:** `#fff`
- **Border:** 3px solid `#000`
- **Border-radius:** 15.67px
- **Padding:** top: 15px, px: 37px
- **Layout:** flex col, gap: 64px, align-items: center, justify-center

#### Pricing block (flex col, gap: 7px, items-center, white-space: nowrap)
- "Free" — Georgia Bold 36px `#000`, text-center
- "$0" — Georgia Bold 48px `#000`, text-center
- "Forever free" — Helvetica Regular 18px `#888`

#### Features list (flex col, gap: 8px, Helvetica Regular 24px `#444`)
- 1 Keeper
- Voice upload
- Messages
- Story prompts
- Data collection (up to X amount)
- Basic contract
- (Each as bullet list item, list-style: disc, margin-start: 36px)

#### CTA button — 456×72px
- **Background:** `#000`, border-radius: 8px
- **Padding:** px: 76.5px, py: 22.5px
- **Label:** "Start free" — Helvetica Bold 24px `#f5f0e8`, text-center

---

### Standard card (500×600px) — grayed out

- **Background:** `#e7e7e7`
- **Border:** 3px solid `rgba(136,136,136,0.4)`
- **Border-radius:** 15.67px
- **Opacity:** 0.5
- **Padding:** top: 30px, px: 37px
- **Layout:** flex col, gap: 89px, items-center, justify-center

#### Header block
- "Standard" — Georgia Bold 36px `#000`
- "Coming soon" — Helvetica Regular 18px `#888`

#### Features (Helvetica Regular 24px `#444`, disc list, ms: 36px)
- Everything in Free, 3 Keepers, Voice & video upload, Messages and scheduled deliveries, Data collection, Extended contract options

#### Disabled button — 456×72px
- **Background:** `#e7e7e7`, border: 3px solid `#888`, opacity: 0.5, border-radius: 12px
- **Label:** "Notify me" — Helvetica Bold 24px `#888`

---

### Legacy card (500×600px) — grayed out

- Identical structure to Standard
- **Header:** "Legacy" + "Coming soon"
- **Features:** Everything in Standard, 5 Keepers, Priority Upload & Transfer support, Dedicated Transfer Contact assist, Data collection, Lifetime storage
- Same disabled button

---

## Typography Scale

| Element | Font | Size | Weight | Color |
|---|---|---|---|---|
| Page title | Georgia | 64px | Regular | `#1a1a1a` |
| Page subtitle | Helvetica | 22px | Regular | `#444` |
| Plan name | Georgia | 36px | Bold | `#000` |
| Plan price | Georgia | 48px | Bold | `#000` |
| Price subtext | Helvetica | 18px | Regular | `#888` |
| Feature item | Helvetica | 24px | Regular | `#444` |
| CTA button | Helvetica | 24px | Bold | `#f5f0e8` |
| Disabled button | Helvetica | 24px | Bold | `#888` |

---

## Color Tokens

| Token | Value | Usage |
|---|---|---|
| active card border | `#000` | Free plan card |
| disabled card bg | `#e7e7e7` | Standard / Legacy |
| disabled border | `rgba(136,136,136,0.4)` | Standard / Legacy border |
| plan price | `#000` | "$0" |
| feature text | `#444` | Feature list items |
| coming-soon | `#888` | "Coming soon" text |
