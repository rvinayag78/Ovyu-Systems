# /figma-ui — Figma-to-Code for OVYU

Implement or fix a UI page/component from a Figma frame.

**Usage:** `/figma-ui <node-id> [page-file-path]`

- `<node-id>` — the Figma node ID (e.g. `2026:583`). Find it in the Figma URL after `node-id=` or from the frame name in Figma.
- `[page-file-path]` — optional path to the file being changed. If omitted, infer from context.

---

## Mandatory workflow (no exceptions, no shortcuts)

### Step 1 — Fetch the Figma frame
Call `get_design_context` with:
- `fileKey`: `7eUxhN3sNdvXaPcwUhIlfh` (OVYU Figma file — always this key)
- `nodeId`: the node ID provided

### Step 2 — Write the spec table
Output a markdown table with **every node** in the frame. One row per element:

| Node name | Property | Figma value |
|-----------|----------|-------------|

Extract every applicable property from the checklist below. Do NOT skip any node or any category. If a property is not set (e.g. no effects), note "none". This table must appear in the response — a mental spec is not a spec.

**Property checklist per node:**
- Geometry: width, height, x/y position
- Auto layout: direction, gap, padding (L/R/T/B), alignment (primary + counter axis)
- Fill: type, hex color, opacity
- Stroke: color, weight, align
- Corner radius
- Effects: type, color, offset, radius
- Typography (TEXT nodes): fontFamily, fontStyle, fontWeight, fontSize, lineHeight, letterSpacing, color, textCase

### Step 3 — Read the existing code
Read the target file(s). If the path was not provided, search for the component/page.

### Step 4 — Write the discrepancy table
Output a markdown table comparing Figma spec vs. current code:

| Element | Property | Figma value | Current code | Match? |
|---------|----------|-------------|--------------|--------|

Mark each row **✓** (match) or **✗** (mismatch/missing). Every row must appear — do not filter out the ✓ rows.

### Step 5 — Fix everything in one pass
Apply all ✗ rows in a single edit. Do not make incremental partial fixes and re-check.

### Step 6 — Completion gate
Before reporting done, re-read the discrepancy table. Every ✗ row must be re-marked ✓. A task is **not done** when the code is written — it is done when all discrepancies are closed.

---

## Layout rules to check before shipping

### Root container
Always `width: "1920px"` — never `minWidth: "1920px"`.

### justify-between + conditional children
Never conditionally remove (`{condition && <El />}`) a flex child inside a `justify-between` container. Use `visibility: "hidden"` + `pointerEvents: "none"` instead to preserve item count.

### Save-column height
In any 3-column form card with `justifyContent: "space-between"`, the save-button column must have an explicit `height` from Figma (differs per dimension — always read it).

### Back links
Back links across all OVYU pages use a 12×21px SVG chevron, not a text character:
```tsx
<svg width="12" height="21" viewBox="0 0 12 21" fill="none" style={{ flexShrink: 0 }}>
  <path d="M11 1L1 10.5L11 20" stroke="#888" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
</svg>
```

---

## Design tokens (quick reference)

| Token | Value | Used for |
|-------|-------|---------|
| `--page-bg` | `#f8f7f5` | Page background |
| `--black` | `#1a1a1a` | Body text, headings |
| `--dark-grey` | `#888` | Subtitles, labels |
| `--light-grey` | `#bababa` | Disabled, locked |
| `--maker-deep-lavender` | `#6a4d7d` | Maker accents |
| `--maker-contract` | `#efeaf2` | Maker card fills |
| `--aubergine` | `#4b3c5e` | Recording active |
| `--pink` | `#8e5e6e` | Messages label |
| `--pink-fill` | `#f4e8ec` | Messages card bg |
| `--cream-fill` | `#f7f4ef` | Dimension row bg |
| `--cream-stroke` | `#ddd6c6` | Dimension row border |

Typography: `serif = "Georgia, serif"` · `sans = "Helvetica Neue, Helvetica, Arial, sans-serif"`
