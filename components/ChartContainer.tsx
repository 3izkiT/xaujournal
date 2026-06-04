"use client";

import { ReactNode } from "react";

/** Explicit height wrapper — Recharts needs a real pixel height, not a collapsed h-full chain. */
export function ChartContainer({ children, className = "h-72" }: { children: ReactNode; className?: string }) {
  return <div className={`${className} relative w-full min-w-0`}>{children}</div>;
}
