import { UploadHubClient } from "./UploadHubClient";

export function generateStaticParams() {
  return [{ contractId: "_" }];
}

export default function UploadHubPage() {
  return <UploadHubClient />;
}
