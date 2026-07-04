import type { CSSProperties } from "react";

// Colors — exact values from Figma get_variable_defs (file 7eUxhN3sNdvXaPcwUhIlfh)
export const tokens = {
  color: {
    // Figma variable: "Black"
    black: "#1a1a1a",
    // Figma variable: "Maker Deep Lavender" / "For X"
    lavender: "#6a4d7d",
    // Figma variable: "Maker Contract" / "For X Fill"
    lavenderFill: "#efeaf2",
    // Figma variable: "Dark Grey"
    darkGrey: "#888888",
    // Figma variable: "Light Grey"
    lightGrey: "#bababa",
    // Figma variable: "Upload Messages"
    pink: "#8e5e6e",
    // Figma variable: "Upload Messages Fill"
    pinkFill: "#f4e8ec",

    // Not Figma variables — read directly from frame fills
    pageBg: "#f8f7f5",
    gold: "#c9a84c",
    cream: "#f7f4ef",
    creamStroke: "#ddd6c6",
    headerBorder: "#e1e1e1",
    footerBg: "#1a1a1a",
    footerText: "#f5f0e8",
    divider: "#d9d9d9",
    white: "#ffffff",

    // YOU-bar progress circle (not a named Figma variable — read directly
    // from the YouBar frame; only used by components/YouBar.tsx)
    circleFull: "#5b4b7a",
    circleEmptyRing: "#b9a4cf",
  },

  // Spacing — plain numbers (React turns them into px automatically)
  // Fill these in from get_design_context reads per frame before using
  space: {
    // Chrome / structural
    headerHeight: 103,
    footerHeight: 103,
    youBarHeight: 70,

    // Page content left margin (from frame reads — update per frame)
    contentLeft: 108,

    // Header inner container
    headerPaddingX: 60,   // maxWidth 1800 centered in 1920 → 60px each side

    // Footer inner content
    footerLeft: 68,       // absolute left offset of footer content block
    footerTop: 44,        // absolute top of footer content
    footerGroupGap: 199,  // gap between the 3 footer groups

    // Common gaps
    xs: 8,
    sm: 16,
    md: 22,
    lg: 27,
    xl: 40,
  },

  radius: {
    sm: 4,
    md: 8,
    lg: 12,
  },

  shadow: {
    sm: "0 1px 4px rgba(0,0,0,0.08)",
    md: "0 2px 12px rgba(0,0,0,0.10)",
  },

  // Canvas width — all pages extend to this
  canvasWidth: 1920,

  font: {
    sans: "Helvetica Neue, Helvetica, Arial, sans-serif",
    serif: "Georgia, serif",
  },
} as const;

const sans = tokens.font.sans;
const serif = tokens.font.serif;

// Text styles — spread directly into style objects
// e.g. <h1 style={{ ...textStyles.pageTitle, color: tokens.color.black }}>
export const textStyles = {
  pageTitle: {
    fontFamily: serif,
    fontWeight: 400,
    fontStyle: "italic",
    fontSize: 64,
    lineHeight: "normal",
  },
  pageSubtitle: {
    fontFamily: sans,
    fontWeight: 300,
    fontStyle: "oblique",
    fontSize: 22,
    lineHeight: "normal",
  },
  sectionLabel: {
    fontFamily: sans,
    fontWeight: 700,
    fontSize: 18,
    letterSpacing: "0.05em",
  },
  navItem: {
    fontFamily: sans,
    fontWeight: 400,
    fontSize: 18,
    fontStyle: "italic",
  },
  body: {
    fontFamily: sans,
    fontWeight: 400,
    fontSize: 16,
    lineHeight: 1.5,
  },
  bodySmall: {
    fontFamily: sans,
    fontWeight: 400,
    fontSize: 13,
    lineHeight: "normal",
  },
  caption: {
    fontFamily: sans,
    fontWeight: 400,
    fontSize: 11,
    lineHeight: "normal",
  },
  footerLink: {
    fontFamily: sans,
    fontWeight: 400,
    fontSize: 13,
    color: "#f5f0e8",
    textDecoration: "none" as const,
  },
  logoText: {
    fontFamily: serif,
    fontWeight: 700,
    fontSize: 40,
  },
} satisfies Record<string, CSSProperties>;
