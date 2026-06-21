# Figma → Code Workflow

Rules for reading Figma and turning it into pixel-exact inline CSS. Follow these every time a Figma frame is involved.

---

## Figma File

| Item | Value |
|------|-------|
| File key (Flow 1 + Flow 2 frames) | `7eUxhN3sNdvXaPcwUhIlfh` |
| Variable defs tool | `mcp__claude_ai_Figma__get_variable_defs` |
| Design context tool | `mcp__claude_ai_Figma__get_design_context` |
| Screenshot tool | `mcp__claude_ai_Figma__get_screenshot` |

---

## Step-by-Step Process

### 1. Fetch variables first
Before writing any component, run `get_variable_defs` on the target frame node. Map the returned color variables onto `src/styles/tokens.ts`. Never guess or reuse values from memory.

```
get_variable_defs(fileKey: "7eUxhN3sNdvXaPcwUhIlfh", nodeId: "<frame-node-id>")
```

### 2. Fetch design context
Run `get_design_context` on the same node to get exact dimensions, spacing, font sizes, and layout.

```
get_design_context(fileKey: "7eUxhN3sNdvXaPcwUhIlfh", nodeId: "<frame-node-id>")
```

Extract every value explicitly:
- Width, height, padding, gap
- Font size, font weight, font style, letter spacing, line height
- Border radius, border width, border color
- Position offsets (left, top) for absolutely positioned elements
- Z-index if layered

### 3. Call out Figma mistakes before coding
If a value looks wrong (misaligned element, inconsistent spacing, wrong color token, duplicate layer) — say so explicitly before writing any code. Don't silently implement a mistake.

### 4. Write the component
- **Inline CSS only** — no Tailwind, no CSS modules, no class names
- Use `tokens.color.*`, `tokens.space.*`, `textStyles.*` from `src/styles/tokens.ts`
- Spread text styles: `style={{ ...textStyles.pageTitle, color: tokens.color.black }}`
- Numbers for px values (React converts automatically): `padding: 16` not `padding: "16px"`
- One component at a time — do not batch-write multiple files in one pass

### 5. Verify with screenshot
After implementing, run `get_screenshot` on the same node and compare against the rendered output. Call out any remaining differences.

```
get_screenshot(fileKey: "7eUxhN3sNdvXaPcwUhIlfh", nodeId: "<frame-node-id>")
```

---

## Design Tokens File

**`frontend/src/styles/tokens.ts`** — single source of truth for all design values.

- Colors come from `get_variable_defs` — exact hex, no rounding
- Spacing values come from `get_design_context` frame reads
- Text styles are typed as `CSSProperties` and spread directly into `style={}`

Update this file whenever a new frame introduces new variables or spacing values.

---

## Rules Summary

| Rule | Detail |
|------|--------|
| Always fetch before coding | Never write dimensions or colors from memory |
| Exact values only | `#6a4d7d` not `#6b4d7e`; `64` not `60` |
| Call out inconsistencies | If Figma has a mistake, flag it before implementing |
| Inline CSS only | No Tailwind, no CSS vars, no class names |
| One component at a time | Fetch → implement → verify → next |
| Canvas width | All pages use `minWidth: 1920px` |
| Font stacks | Serif: `"Georgia, serif"` · Sans: `"Helvetica Neue, Helvetica, Arial, sans-serif"` |
