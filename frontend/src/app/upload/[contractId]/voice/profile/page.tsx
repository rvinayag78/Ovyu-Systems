import { VoiceProfileClient } from "./VoiceProfileClient";

export function generateStaticParams() {
  return [{ contractId: "_" }];
}

export default function VoiceProfilePage() {
  return <VoiceProfileClient />;
}
