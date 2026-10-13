import { WelcomeMessageClient } from "./WelcomeMessageClient";

export function generateStaticParams() {
  return [{ contractId: "_" }];
}

export default function WelcomeMessagePage() {
  return <WelcomeMessageClient />;
}
