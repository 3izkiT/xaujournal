"use client";

import { ReactNode, useEffect, useState } from "react";

function hasExplicitHeight(className: string) {
  return /\b(h-|min-h-|max-h-)\S/.test(className);
}

export function ChartContainer({ children, className = "h-72" }: { children: ReactNode; className?: string }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const sizeClass = hasExplicitHeight(className) ? className : `${className} min-h-[12rem]`;

  if (!mounted) {
    return <div className={`${sizeClass} min-w-0 w-full animate-pulse rounded-2xl bg-xau-app`} aria-hidden="true" />;
  }

  return <div className={`${sizeClass} relative min-w-0 w-full`}>{children}</div>;
}
