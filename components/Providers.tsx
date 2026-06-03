"use client";

import { ReactNode } from "react";
import { AuthModalProvider } from "@/components/auth/AuthModalProvider";
import { ThemeProvider } from "@/components/ThemeProvider";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <AuthModalProvider>{children}</AuthModalProvider>
    </ThemeProvider>
  );
}
