import { DimensionClient } from "./DimensionClient";

export function generateStaticParams() {
  return [{ contractId: "_", dimension: "_" }];
}

export default function DimensionPage() {
  return <DimensionClient />;
}
