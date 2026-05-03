# Home Page (keeper aware)

**Figma node:** 78:871  
**Frame:** 1920×1080px  
**Background:** `#f8f7f5` (cream)

---

## Difference from "keeper not aware" variant

This frame is **pixel-identical** to `Home Page (keeper not aware)` (3:2). Both use `Header (log in)` (logged-out, black "Log In" button). The "aware" label describes the intended signup path, not a visual difference on the landing page itself.

---

## Reusable Components

| Component | Used here |
|---|---|
| Header (log in) | Logged-out header with black "Log In" button |
| Footer | Black footer |

---

## Layout (identical to home-page-keeper-not-aware.md)

```
Frame 1920×1080
├── Header (log in) — top: 0, left: -2px, w: 1924px, h: 103px
├── Home Page Content — absolute, left: 179px, top: 148px, w: 1500px
│   ├── LeftSide — flex col, gap: 25px, w: 532.825px
│   │   ├── H1 — Georgia 88px, "A bit" Regular + " of you." Italic, #1a1a1a
│   │   ├── Subtitle — Helvetica Regular 22px #444
│   │   ├── Body — Helvetica Light 18px #888, w: 473.85px
│   │   └── Begin button — gold SVG, 263.351×63.068px
│   └── SideBar — 378.172×783px, bg #fff, border 1.666px #ddd
│       └── SideContent — flex col, gap: 50px, items-center
│           ├── 01 Contract — h: 154.101px, SVG 302.46×45.524px
│           ├── Divider — 284.046×2.499px #d9d9d9
│           ├── 02 Upload — h: 153.268px, SVG 280.562×45.524px
│           ├── Divider
│           └── 03 Transfer — h: 153.268px, SVG 301.106×58.857px
└── Footer — top: 977px, w: 1920px, h: 103px, bg #000
```

## Header

- **Size:** 1924×103px, bg `#fff`, border-bottom: 3px solid `#e1e1e1`
- **Inner:** 1800px centered, flex row, justify-between
  - Wordmark: Georgia Bold/Bold-Italic 40px `#000`, 113×50px
  - "Activate Transfer": Helvetica Neue Regular 16px `#000`, 150×24px
  - Log In button: bg `#1a1a1a`, border-radius: 8px, 136×52px, Helvetica Bold 16px `#fff`

## SideBar

- **Size:** 378.172×783px
- **Background:** `#fff`, **Border:** 1.666px solid `#ddd`
- **Padding:** top 40.816 / bottom 39.983 / left 34.985 / right 34.152px
- **SideContent:** flex col, gap: 50px, items-center

| Step | SVG size (px) | Caption font | Caption width |
|---|---|---|---|
| 01 Contract (h: 154.101) | 302.46×45.524 | Helvetica Oblique 16px `#888` | 309.035px |
| Divider | 284.046×2.499 `#d9d9d9` | — | — |
| 02 Upload (h: 153.268) | 280.562×45.524 | Helvetica Oblique 16px `#888` | 285.712px |
| Divider | 284.046×2.499 `#d9d9d9` | — | — |
| 03 Transfer (h: 153.268) | 301.106×58.857 | Helvetica Oblique 16px `#888` | 285.712px |

## Footer

- **Size:** 1920×103px, bg `#000`
- Left: 68px, top: 44px — flex row, gap: 199px
  - Nav: Helvetica Regular 13px `#f5f0e8`, gap: 27px
  - Notice: Helvetica Light Oblique 11px `#f5f0e8`, w: 918px
  - Legal: 350×13px, Helvetica Regular 11px `#f5f0e8`

## Full spec reference

See `home-page-keeper-not-aware.md` for complete typography, color token, and measurement tables — all values are identical.
