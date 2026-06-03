import { ReactNode } from "react";

import { BRAND_NAME } from "@/lib/brand";

export function DeviceFrame({ children, label = BRAND_NAME }: { children: ReactNode; label?: string }) {
  return (
    <div className="overflow-hidden rounded-[1.75rem] border border-xau-border bg-xau-card shadow-card">
      <div className="flex items-center gap-2 border-b border-xau-border bg-xau-app px-4 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-xau-rose" />
        <span className="h-2.5 w-2.5 rounded-full bg-xau-gold" />
        <span className="h-2.5 w-2.5 rounded-full bg-xau-mint" />
        <span className="ml-2 text-xs font-medium text-xau-muted">{label}</span>
      </div>
      <div className="bg-xau-app p-3 sm:p-4">{children}</div>
    </div>
  );
}
