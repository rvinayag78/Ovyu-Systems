import { Suspense } from "react";
import { VerifyClient } from "./VerifyClient";

export default function MagicLinkVerifyPage() {
  return (
    <Suspense>
      <VerifyClient />
    </Suspense>
  );
}
