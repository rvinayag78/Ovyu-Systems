# Home Page (keeper not aware)

**Figma node:** 3:2  
**Frame:** 1920×1080px  
**Background:** `#f8f7f5` (cream)

---

## Reusable Components

| Component | Used here |
|---|---|
| Header (log in) | Top bar, logged-out variant with "Log In" button |
| Footer | Bottom bar, black |

---

## Layout Hierarchy

```
Frame 1920×1080
├── Header (log in) — absolute, top: 0, left: 0, w: 1924px, h: 103px
├── Home Page Content — absolute, left: 179px, top: 148px, w: 1500px
│   ├── LeftSide — flex col, gap: 25px, w: 532.825px
│   │   ├── H1
│   │   ├── Subtitle
│   │   ├── Body — w: 473.85px
│   │   └── Begin button — 263.351×63.068px
│   └── SideBar — 378.172×783px
│       └── SideContent — flex col, gap: 50px, items-center
│           ├── 01 The Contract — h: 154.101px
│           ├── Divider — 284.046×2.499px bg #d9d9d9
│           ├── 02 The Upload — h: 153.268px
│           ├── Divider
│           └── 03 The Transfer — h: 153.268px
└── Footer — absolute, top: 977px, w: 1920px, h: 103px
```

---

## Header (log in)

- **Size:** 1924×103px, `overflow: hidden`
- **Background:** `#ffffff`
- **Border:** `border-bottom: 3px solid #e1e1e1`
- **Inner container:** w: 1800px, centered (`left: 50%` translate), flex row, `justify-between`, `align-items: center`
  - **Wordmark:** w: 113px, h: 50px — Georgia Bold 40px `#000`
    - "ov" = Georgia Bold; "yu" = Georgia Bold Italic
  - **Right nav group:** flex row, gap: 117px, align-items: center
    - "Activate Transfer": Helvetica Neue Regular 16px `#000`, w: 150px, h: 24px, text-center
    - Log In button: `background: #1a1a1a`, `border-radius: 8px`, w: 136px, h: 52px — Helvetica Bold 16px `#ffffff`

---

## Home Page Content

- **Position:** absolute, left: 179px, top: 148px
- **Size:** w: 1500px
- **Layout:** flex row, `justify-between`, `align-items: center`

### LeftSide (w: 532.825px)

- **Layout:** flex col, gap: 25px

#### H1
- "A bit" — Georgia Regular 88px `#1a1a1a`
- " of you." — Georgia Italic 88px `#1a1a1a`
- **white-space:** nowrap

#### Subtitle
- Helvetica Regular 22px `#444`
- "Keep yourself for the one person who needs you most."

#### Body paragraph
- Helvetica Light 18px `#888`, w: 473.85px, line-height: normal

#### Begin button
- **Size:** 263.351×63.068px
- **Background:** gold fill (SVG asset)
- **Label:** "Begin  →" — Helvetica Regular 22px `#ffffff`, cursor: pointer

---

### SideBar (378.172×783px)

- **Background:** `#ffffff`
- **Border:** `1.666px solid #ddd`
- **Padding:** top: 40.816px / bottom: 39.983px / left: 34.985px / right: 34.152px
- **Inner (SideContent):** flex col, gap: 50px, items-center

#### 01 The Contract step — h: 154.101px
- SVG: 302.46×45.524px at x: 3.96px, y: 32.76px
- Caption: Helvetica Oblique 16px `#888`, w: 309.035px, y-center: 134.78px
- "You and your Keeper agree on the terms before anything begins."

#### Divider — 284.046×2.499px, bg `#d9d9d9`

#### 02 The Upload step — h: 153.268px
- SVG: 280.562×45.524px at x: 3.96px, y: 32.76px
- Caption: Helvetica Oblique 16px `#888`, w: 285.712px
- "You share your voice, memories, and stories at your own pace."

#### Divider — 284.046×2.499px, bg `#d9d9d9`

#### 03 The Transfer step — h: 153.268px
- SVG: 301.106×58.857px at x: 3.96px, y: 32.76px
- Caption: Helvetica Oblique 16px `#888`, w: 285.712px
- "When the time comes, your Keeper receives what you left for them."

---

## Footer

- **Size:** 1920×103px, **Background:** `#000000`
- **Content group:** absolute, left: 68px, top: 44px — flex row, gap: 199px, align-items: center
  - Nav links: Helvetica Regular 13px `#f5f0e8`, gap: 27px — "CONTACT", "ABOUT"
  - Privacy notice: Helvetica Light Oblique 11px `#f5f0e8`, w: 918px
  - Legal row (350×13px):
    - "@ 2026 OVYU" left: 0
    - "MANAGE COOKIES" left: 91px
    - Separator: 1×10px `#d9d9d9`, left: 210px, top: 1.5px
    - "LEGAL" left: 229px
    - Separator: left: 283px
    - "PRIVACY" left: 302px
    - All: Helvetica Regular 11px `#f5f0e8`

---

## Typography Scale

| Element | Font | Size | Weight | Color |
|---|---|---|---|---|
| Wordmark "ov" | Georgia | 40px | Bold | `#000` |
| Wordmark "yu" | Georgia | 40px | Bold Italic | `#000` |
| Nav link | Helvetica Neue | 16px | Regular | `#000` |
| Log In btn | Helvetica | 16px | Bold | `#fff` |
| H1 regular | Georgia | 88px | Regular | `#1a1a1a` |
| H1 italic | Georgia | 88px | Italic | `#1a1a1a` |
| Subtitle | Helvetica | 22px | Regular | `#444` |
| Body | Helvetica | 18px | Light | `#888` |
| Begin btn label | Helvetica | 22px | Regular | `#fff` |
| Sidebar caption | Helvetica | 16px | Oblique | `#888` |
| Footer nav | Helvetica | 13px | Regular | `#f5f0e8` |
| Footer notice | Helvetica | 11px | Light Oblique | `#f5f0e8` |
| Footer legal | Helvetica | 11px | Regular | `#f5f0e8` |

---

## Color Tokens

| Token | Value | Usage |
|---|---|---|
| `--ovyu-cream` | `#f8f7f5` | Page background |
| `--ovyu-ink` | `#1a1a1a` | H1, button bg |
| `--ovyu-muted` | `#888` | Body, sidebar captions |
| `--ovyu-gold` | `#c9a84c` | Begin button fill |
| white | `#ffffff` | Header, sidebar bg |
| border | `#e1e1e1` | Header border |
| divider | `#d9d9d9` | Sidebar step dividers |
| footer-bg | `#000000` | Footer |
| `--ovyu-cream-light` | `#f5f0e8` | Footer text |

---

## Path Difference vs. Keeper Aware

This frame uses `Header (log in)` (logged-out state). The `Home Page (keeper aware)` frame is pixel-identical in content — same header variant, same content. Both show the pre-login landing page.
