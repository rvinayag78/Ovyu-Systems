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
3. **Output the spec table** — write it in the response, do NOT keep it mental. One row per element: `node name | property | Figma value`. If you skip this step and go straight to code, you WILL miss values.
4. **Read the existing code** for the page being changed
5. **Output the discrepancy table** — write it in the response before touching any file. Columns: `element | property | Figma value | current code value | match?`. Mark each row ✓ or ✗.
6. **Fix everything in one pass** — no incremental patching
7. **Completion gate** — do NOT report done until every ✗ row in the discrepancy table has been resolved and re-marked ✓. A task is not done because the code was written; it is done when all discrepancies are closed.

> **Why steps 3 and 5 must be written out:** Mental spec tables get skipped under time pressure. A written table is the only proof the check happened. If it is not in the response, it did not happen.

---

## Verification Rules (added after repeated real misses — every one of these caused a shipped bug)

### V1 — One Figma state is not evidence for another state
**Rule:** Every distinct visual state of a screen (empty list / populated list / first-time edit / re-edit / recording / recorded) has its own frame. A value read from one state's frame applies ONLY to that state.

**Why:** The ENTRIES label→card gap was read as 50px from the *empty*-list frame and wrongly reused for the *populated*-list frame (actual: 15px). If no fetched frame shows the state you're coding (e.g. no frame showed 2+ stacked cards), say so explicitly and ask — never silently assume the value carries over.

**When to apply:** Before reusing any number, name which frame (node ID) it came from and confirm that frame shows the state being coded.

### V2 — Width/height are first-class checks, not optional ones
**Rule:** For every container-like node (card, banner, row, column, panel), explicitly pull its Figma width/height (`w-[...]`/`h-[...]` or absoluteBoundingBox) and confirm the code has a real `width`/`height` — or a written reason why it intentionally doesn't.

**Why:** An element with no explicit width still renders — it silently stretches to fill its parent. Three shipped bugs came from this: the History banner (no width at all → stretched past the 1700px row), the entry editor card (`flex: 1` → ballooned to full page instead of 1300px), and the composer card (`width: 100%` instead of 800px). Color/padding/typography audits all passed while the sizing was wrong, and the visible symptom appeared *elsewhere* (as a misaligned neighbor), hiding the real cause.

**When to apply:** Every discrepancy table must contain a width row and a height row for every container. "Renders fine" is not evidence — only the number is.

### V3 — Parallel twins get the same fix
**Rule:** After fixing any field/row/button, check every structurally-identical sibling in the same component and apply the identical fix before reporting done.

**Why:** `what_happened`/`when` persistence was fixed while the visually-parallel `call_them`/`full_name` fields right next to them were left broken — an asymmetry that inspection should catch, not the user testing live.

**When to apply:** Ask explicitly: "does this component have a twin of the element I just changed?" If yes, fix it in the same pass.

### V4 — Agreed fixes must appear in the diff, not just the conversation
**Rule:** At the end of any multi-part batch, re-scan the conversation for every discrete "yes, do that" decision and verify each one is present in the actual diff (`git diff`) before committing.

**Why:** The saved-card body-preview removal was agreed, acknowledged — and never executed, because a larger batch of work absorbed the attention. It shipped still broken.

### V5 — Static frame text does not override an agreed interaction spec
**Rule:** Figma frames are static; they cannot depict intermediate interaction states. When frame text conflicts with an explicitly agreed interaction flow (e.g. frames only ever say "♪ Voice" but the agreed flow is Record → Stop → Save), the agreed flow wins — flag the conflict, don't silently match the literal text.

**Why:** Matching the literal "♪ Voice" label deleted the visible Record state and collapsed a 3-stage flow into 2.

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

### Form card save-column height
**Rule:** In a 3-column form card that uses `justify-content: space-between`, the save-button column MUST have an explicit `height` equal to the Figma-specified column height. Without it, `justify-between` has nothing to push against and the save button floats up next to the fields instead of pinning to the bottom.

**Always read the Figma column height** for the save column (col3) — it is specified per dimension and differs (e.g. history/beliefs/heart = 667px, how-you-live = 619px, how-you-think = 521px, how-you-talk = 376px).

```tsx
// WRONG — save button floats, not pinned to bottom
<div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
  <div>...fields...</div>
  <button>Save →</button>
</div>

// CORRECT — explicit height from Figma locks the column so save button pins to bottom
<div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", height: "667px" }}>
  <div>...fields...</div>
  <button>Save →</button>
</div>
```

**When to apply:** Every time you write a form card with a save button in the rightmost column.

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
