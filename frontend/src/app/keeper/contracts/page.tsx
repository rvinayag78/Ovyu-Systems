"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function KeeperContractsRedirect() {
  const router = useRouter();
  useEffect(() => { router.replace("/contracts"); }, [router]);
  return null;
}
