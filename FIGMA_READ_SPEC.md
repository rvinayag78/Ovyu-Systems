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

### Fixed component heights
| Component | Height |
|-----------|--------|
| Header | 103px |
| Footer | 103px |
| YOU bar | 70px |
| Dimension row (expanded) | 73px |
| Contract row | 100px |
