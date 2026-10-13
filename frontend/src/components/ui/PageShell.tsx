import type { CSSProperties, ComponentProps, ReactNode } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { YouBar } from "@/components/YouBar";
import { tokens } from "@/styles/tokens";

/**
 * Shared page composition for every Flow 2 (and contracts) screen:
 * Header — flexible content — YouBar — Footer, all in normal document flow
 * inside a `minHeight: 100vh` wrapper. The whole page scrolls together when
 * content is taller than the viewport — there is no per-page fixed/pinned
 * footer variant. Extracted after UploadHubClient was found pinning its
 * Footer to the viewport while every other page let it flow normally,
 * producing inconsistent scroll behavior across otherwise-identical frames.
 */
export function PageShell({
  headerVariant = "loggedIn",
  headerInitial,
  contentStyle,
  youBar,
  children,
}: {
  headerVariant?: ComponentProps<typeof Header>["variant"];
  headerInitial?: string;
  contentStyle?: CSSProperties;
  youBar: ComponentProps<typeof YouBar>;
  children: ReactNode;
}) {
  return (
    <div style={{ width: `${tokens.canvasWidth}px`, background: tokens.color.pageBg, display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Header variant={headerVariant} initial={headerInitial} />
      <div style={{ flex: 1, ...contentStyle }}>
        {children}
      </div>
      <YouBar {...youBar} />
      <Footer />
    </div>
  );
}
