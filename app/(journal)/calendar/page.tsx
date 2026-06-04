"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function CalendarPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/dashboard#calendar");
  }, [router]);
  return <p className="text-sm text-xau-muted">Opening calendar…</p>;
}
