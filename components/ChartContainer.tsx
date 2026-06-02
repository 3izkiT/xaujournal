"use client";

import { ReactNode, useEffect, useState } from "react";

export function ChartContainer({ children, className = "h-72" }: { children: ReactNode; className?: string }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className={`${className} animate-pulse rounded-2xl bg-xau-app`} aria-hidden="true" />
    );
  }

  return <div className={`${className} min-h-[288px] min-w-0 w-full`}>{children}</div>;
}
