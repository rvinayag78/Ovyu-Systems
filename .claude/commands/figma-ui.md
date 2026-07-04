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

### Step 3 — Read the existing code AND the shared library
Read the target file(s). If the path was not provided, search for the component/page.

**Before writing any new markup or styles, check what's already reusable:**
- `frontend/src/styles/tokens.ts` — canonical colors (`tokens.color.*`) and fonts (`tokens.font.*`), Figma-variable-derived. Never hardcode a hex string or font-family that already exists here.
- `frontend/src/components/ui/BackLink.tsx` — the back-navigation chevron. Use `<BackLink href="..." label="..." marginBottom="..." />`, never hand-roll the SVG again.
- `frontend/src/components/ui/PageShell.tsx` — the Header + scrollable body + YouBar + Footer composition shared by every Flow 2 / contracts page. New full pages should use `<PageShell headerInitial={...} contentStyle={{...}} youBar={{...}}>{children}</PageShell>` instead of assembling Header/Footer/YouBar by hand.
- If the frame introduces a genuinely new repeating pattern (used 2+ times across pages, not just within one), add it to `components/ui/` rather than inlining it again — that's exactly the kind of drift this checklist exists to prevent. Don't force-fit an existing primitive onto a visually different pattern just to reuse it (e.g. card-shaped elements with different content shapes are not automatically the same component) — only extract what's actually the same thing repeated.

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
Every back-navigation chevron across OVYU pages is the shared `<BackLink/>` component (`frontend/src/components/ui/BackLink.tsx`) — never a hand-rolled SVG or a `‹`/`<` text character:
```tsx
import { BackLink } from "@/components/ui/BackLink";
<BackLink href="/contracts" label="Your contracts" marginBottom="32px" />
```
`marginBottom` is the one prop that legitimately varies per Figma frame — read its actual value from the frame, don't guess.

### Full pages (Header + body + YOU bar + Footer)
Every page that has all four of Header, scrollable content, the YOU bar, and Footer must use `<PageShell/>` (`frontend/src/components/ui/PageShell.tsx`) — never assemble these by hand. This is the one place page-level width (1920px), background, and the Header/Footer/YouBar wiring live; a hand-rolled copy is exactly how the same page ended up with a different footer scroll behavior than every other screen once already (see project memory on the Flow 2 scroll-consistency fix).

---

## Design tokens (quick reference)

**Canonical source: `frontend/src/styles/tokens.ts`.** The table below is a quick-glance reference — always import from `tokens.ts` (`tokens.color.*`, `tokens.font.*`, `tokens.space.*`) rather than retyping these hex values or font stacks inline.

| `tokens.color.*` | Value | Used for |
|-------|-------|---------|
| `pageBg` | `#f8f7f5` | Page background |
| `black` | `#1a1a1a` | Body text, headings |
| `darkGrey` | `#888888` | Subtitles, labels |
| `lightGrey` | `#bababa` | Disabled, locked |
| `lavender` | `#6a4d7d` | Maker accents |
| `lavenderFill` | `#efeaf2` | Maker card fills |
| `pink` | `#8e5e6e` | Messages label |
| `pinkFill` | `#f4e8ec` | Messages card bg |
| `cream` | `#f7f4ef` | Dimension row bg |
| `creamStroke` | `#ddd6c6` | Dimension row border |

Typography: `tokens.font.serif = "Georgia, serif"` · `tokens.font.sans = "Helvetica Neue, Helvetica, Arial, sans-serif"`

If a new frame needs a color or spacing value not yet in `tokens.ts`, verify it against Figma's `get_variable_defs` (not just eyeballing the frame) before adding it as a new token — that's what keeps this file trustworthy as ground truth instead of another place values can drift.
