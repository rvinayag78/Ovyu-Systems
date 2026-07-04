import type { CSSProperties } from "react";
import Link from "next/link";
import { tokens } from "@/styles/tokens";

/**
 * The 12×21 chevron + label back-navigation link used across OVYU pages.
 * `marginBottom` is exposed since Figma specifies a different value per frame.
 */
export function BackLink({
  href,
  label,
  marginBottom,
}: {
  href: string;
  label: string;
  marginBottom?: string | number;
}) {
  const style: CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    fontFamily: tokens.font.sans,
    fontSize: "16px",
    color: tokens.color.darkGrey,
    textDecoration: "none",
    marginBottom,
  };

  return (
    <Link href={href} style={style}>
      <svg width="12" height="21" viewBox="0 0 12 21" fill="none" style={{ flexShrink: 0 }}>
        <path
          d="M11 1L1 10.5L11 20"
          stroke={tokens.color.darkGrey}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      {label}
    </Link>
  );
}
