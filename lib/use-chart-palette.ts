"use client";

import { useEffect, useState } from "react";
import { getChartPalette, type ChartPalette } from "@/lib/chart-colors";
import { getResolvedTheme, type ThemeMode } from "@/lib/theme";

export function useChartPalette(): ChartPalette {
  const [mode, setMode] = useState<ThemeMode>("light");

  useEffect(() => {
    const sync = () => setMode(getResolvedTheme());
    sync();
    const observer = new MutationObserver(sync);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    return () => observer.disconnect();
  }, []);

  return getChartPalette(mode);
}
