import { VoiceNameClient } from "./VoiceNameClient";

export function generateStaticParams() {
  return [{ contractId: "_" }];
}

export default function VoiceNamePage() {
  return <VoiceNameClient />;
}
