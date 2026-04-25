import { DoneClient } from "./DoneClient";

export function generateStaticParams() {
  return [{ token: "_" }];
}

export default function DonePage() {
  return <DoneClient />;
}
