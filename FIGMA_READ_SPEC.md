# Figma Frame Read Spec

Use this checklist every time a Figma frame is fetched before writing code.
Extract every property below for every node. Never skip a category.

---

## 1. Node Basics
- [ ] **type** — FRAME, GROUP, COMPONENT, INSTANCE, TEXT, RECTANGLE, VECTOR, etc.
- [ ] **id** and **name**
- [ ] **visible**, **locked**

---

## 2. Geometry & Position
- [ ] **absoluteBoundingBox** — x, y, width, height (in px)
- [ ] **relativeTransform** — position + rotation as matrix
- [ ] **rotation** — degrees
- [ ] **constraints** — horizontal/vertical pinning (LEFT, RIGHT, CENTER, SCALE, STRETCH)
- [ ] **clipsContent** — whether overflow is hidden

---

## 3. Auto Layout
- [ ] **layoutMode** — HORIZONTAL, VERTICAL, GRID, NONE
- [ ] **primaryAxisSizingMode** — FIXED, HUG, FILL
- [ ] **counterAxisSizingMode** — FIXED, HUG, FILL
- [ ] **primaryAxisAlignItems** — MIN, CENTER, MAX, SPACE_BETWEEN
- [ ] **counterAxisAlignItems** — MIN, CENTER, MAX, BASELINE
- [ ] **itemSpacing** — gap between children (px)
- [ ] **paddingLeft, paddingRight, paddingTop, paddingBottom** (px)
- [ ] **layoutGrow**, **layoutAlign**, **layoutWrap**
- [ ] **layoutGrids** — column/row grid definitions

---

## 4. Fills (Paint)
- [ ] **fills** — array of Paint objects
- [ ] **Paint type** — SOLID, GRADIENT_LINEAR, GRADIENT_RADIAL, GRADIENT_ANGULAR, GRADIENT_DIAMOND, IMAGE, VIDEO
- [ ] **color** — hex value (Figma returns RGBA 0–1, convert to hex)
- [ ] **opacity**, **blendMode**
- [ ] **gradientStops**, **gradient handles** (for gradients)
- [ ] **imageHash**, **scaleMode** — FILL, FIT, CROP, TILE (for images)

---

## 5. Strokes
- [ ] **strokes** — array of Paint objects (same structure as fills)
- [ ] **strokeWeight** (px)
- [ ] **strokeAlign** — INSIDE, OUTSIDE, CENTER
- [ ] **strokeCap** — NONE, ROUND, SQUARE, LINE_ARROW, etc.
- [ ] **strokeJoin** — MITER, BEVEL, ROUND
- [ ] **dashPattern** — array of dash/gap lengths

---

## 6. Corners
- [ ] **cornerRadius** — uniform radius (px)
- [ ] **rectangleCornerRadii** — [topLeft, topRight, bottomRight, bottomLeft] for per-corner
- [ ] **cornerSmoothing** — 0–1 (iOS squircle; 0.6 = Apple-style)

---

## 7. Effects
- [ ] **effects** — array of effect objects
- [ ] **type** — DROP_SHADOW, INNER_SHADOW, LAYER_BLUR, BACKGROUND_BLUR
- [ ] Per effect: **color** (hex), **offset** (x, y), **radius** (px), **spread** (px), **visible**

---

## 8. Typography (TEXT nodes only)
- [ ] **characters** — the actual text content
- [ ] **fontName** — family + style (e.g. "Helvetica Neue, Bold Italic")
- [ ] **fontSize** (px)
- [ ] **fontWeight** — 100–900
- [ ] **letterSpacing** — value + unit (px or %)
- [ ] **lineHeight** — value + unit (px, % or AUTO)
- [ ] **paragraphSpacing**, **paragraphIndent** (px)
- [ ] **textAlignHorizontal** — LEFT, CENTER, RIGHT, JUSTIFIED
- [ ] **textAlignVertical** — TOP, CENTER, BOTTOM
- [ ] **textCase** — ORIGINAL, UPPER, LOWER, TITLE
- [ ] **textDecoration** — NONE, UNDERLINE, STRIKETHROUGH
- [ ] **textAutoResize** — NONE, WIDTH_AND_HEIGHT, HEIGHT, TRUNCATE
- [ ] **Mixed styles** — flag if one text node has multiple style segments

---

## 9. Design Tokens & Styles
- [ ] **boundVariables** — which variables are linked to which property
- [ ] **Variable collections** — COLOR, FLOAT (number), STRING, BOOLEAN; note modes (light/dark)
- [ ] **Style IDs** — paint styles, text styles, effect styles, grid styles

---

## 10. Components
- [ ] **componentPropertyDefinitions** — props and variant properties
- [ ] **Instance overrides** — what was changed from the master component
- [ ] **Exposed nested instances**

---

## 11. Prototyping / Interactions
- [ ] **reactions** — triggers (ON_CLICK, ON_HOVER, etc.) + actions (navigate, overlay, etc.)
- [ ] **Animation type**, **easing**, **duration**
- [ ] **Flow starting points**

---

## 12. Vector Geometry (VECTOR nodes)
- [ ] **vectorNetwork**, **vectorPaths** — raw bezier path data
- [ ] **fillGeometry**, **strokeGeometry**
- [ ] **booleanOperation** — UNION, SUBTRACT, INTERSECT, EXCLUDE

---

## 13. Export & Dev Metadata
- [ ] **exportSettings** — format (PNG/JPG/SVG/PDF), scale, suffix
- [ ] **annotations**, **devStatus**, **measurements**

---

## Workflow: Frame → Code (non-negotiable order)

1. **Fetch** the Figma frame with `get_design_context`
2. **Extract** every property above for every node
3. **Build a spec table** — one row per element, columns: node name | property | Figma value
4. **Read the existing code** for the page being changed
5. **List ALL discrepancies** between spec and code
6. **Fix everything in one pass** — no incremental patching

---

## Layout Rules (catch before shipping)

### justify-between + conditional children
**Rule:** Never conditionally remove (`{condition && <El />}`) a flex child inside a `justify-between` container.

**Why:** A Figma frame typically shows one state (e.g. voice-complete). The layout looks balanced with N items. When a child is hidden via conditional render in another state, N−1 items remain and `justify-between` redistributes space — the remaining items shift to the wrong positions.

**Fix:** Always render the element; use `visibility: hidden` + `pointerEvents: "none"` to hide it without removing it from the layout. This preserves the item count and spacing across all states.

```tsx
// WRONG — breaks justify-between when voiceComplete is false
{voiceComplete && <Link href="...">Upload</Link>}

// CORRECT — layout stable in all states
<Link
  href={voiceComplete ? `/upload/${id}` : "#"}
  style={{ visibility: voiceComplete ? "visible" : "hidden", pointerEvents: voiceComplete ? "auto" : "none" }}
>
  Upload
</Link>
```

**When to apply:** Any time you write `{condition && <El />}` and the parent has `justifyContent: "space-between"` (or Figma class `justify-between`), stop and use `visibility` instead.

---

### Fixed 1920px frame rule
**Rule:** Every Figma frame in this project is W Fixed 1920px, H Fixed 1340px.

**Root container must always be:**
```tsx
<div style={{ width: "1920px", ... }}>
```
**Never** use `minWidth: "1920px"`. `minWidth` allows the root to grow wider than 1920px on large monitors, which causes the Header's `margin: 0 auto` inner content to re-center within the wider root — the logo drifts right while fixed `marginLeft` content stays put.

`width: "1920px"` locks the layout exactly. On narrow viewports the browser adds a horizontal scrollbar; on wide viewports the page stays 1920px with empty space to the right. Both are correct for this fixed-width design.

**Apply to:** every page root div, every prototype page.

---

## Ovyu Design Tokens (quick reference)

| Token | Value | Used for |
|-------|-------|---------|
| `--black` | `#1a1a1a` | Body text, headings |
| `--dark-grey` | `#888` | Subtitles, labels |
| `--light-grey` | `#bababa` | Disabled, locked states |
| `--maker-deep-lavender` | `#6a4d7d` | Maker accents, links |
| `--maker-contract` | `#efeaf2` | Maker card fills, YOU bar open bg |
| `--cream-fill` | `#f7f4ef` | Dimension row bg |
| `--cream-stroke` | `#ddd6c6` | Dimension row border |
| `--pink` | `#8e5e6e` | Messages label |
| `--pink-fill` | `#f4e8ec` | Messages card bg |
| `--gold` | `#c9a84c` | Section labels (MAKING, MESSAGES) |
| `--page-bg` | `#f8f7f5` | Page background |
| `--header-border` | `#e1e1e1` | Header bottom border |
| `--footer-bg` | `#1a1a1a` | Footer background |
| `--aubergine` | `#4b3c5e` | Profile avatar bg, recording active |

### Typography stacks
```
serif:  "Georgia, serif"
sans:   "Helvetica Neue, Helvetica, Arial, sans-serif"
```

### Fixed component dimensions & alignment

| Component | Figma size | Padding | Notes |
|-----------|-----------|---------|-------|
| Page frame | W 1920px × H 1340px | — | Root: `width: "1920px"` never `minWidth` |
| Header | W 1924px × H 103px | 62px L/R, 26.5px top, 25.5px bottom | Centered in 1920px → logo at x=60px, avatar right at x=1860px |
| Footer | W 1920px × H 103px | **68px left, 52px right** (asymmetric) | bg `#1a1a1a`; CONTACT/ABOUT left; © COOKIES LEGAL PRIVACY right with `\|` separators |
| YOU bar (locked) | W 1920px × H 70px | 50px L/R | bg `#f0f0f0`, border-top 3px `#bababa`, lock icon right |
| YOU bar (unlocked) | W 1920px × H 70px | 50px L/R | bg `#fff`, border-top 3px `#bababa`, `›` arrow right |
| YOU bar (expanded) | W 1920px, variable H | 50px L/R bar; rows inside | bg `#efeaf2` bar, rows in white panel below |
| Dimension row (expanded) | H 73px | 40px L/R | bg `#f7f4ef`, border 1.5px `#ddd6c6`, radius 8px |
| Contract row | H 100px | 55px L/R | |
