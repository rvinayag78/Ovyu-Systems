import { KeeperBeginClient } from "./KeeperBeginClient";

export function generateStaticParams() {
  return [{ token: "_" }];
}

export default function KeeperBeginPage() {
  return <KeeperBeginClient />;
}
