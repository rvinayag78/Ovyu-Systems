import { KeeperSectionClient } from "./KeeperSectionClient";

export function generateStaticParams() {
  // Static-export placeholder — the client recovers the real IDs from the URL.
  // "welcome" is NOT a section: it has its own static route (keeper/welcome),
  // which Next resolves ahead of this dynamic one.
  return [{ contractId: "_", section: "_" }];
}

export default function KeeperSectionPage() {
  return <KeeperSectionClient />;
}
