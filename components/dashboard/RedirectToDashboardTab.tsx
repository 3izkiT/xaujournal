"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

type Props = {
  hash: string;
};

export function RedirectToDashboardTab({ hash }: Props) {
  const router = useRouter();
  useEffect(() => {
    router.replace(`/dashboard${hash}`);
  }, [router, hash]);
  return <p className="text-sm text-xau-muted">Opening dashboard…</p>;
}
