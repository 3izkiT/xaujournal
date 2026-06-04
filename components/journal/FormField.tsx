import { ReactNode } from "react";
import { HelpTooltip } from "@/components/ui/HelpTooltip";
import type { TooltipTerm } from "@/lib/term-tooltips";

type Props = {
  label: string;
  hint?: string;
  tooltipTerm?: TooltipTerm;
  children: ReactNode;
  className?: string;
};

export function FormField({ label, hint, tooltipTerm, children, className = "" }: Props) {
  return (
    <label className={`block space-y-2 ${className}`}>
      <span className="inline-flex items-center gap-1 text-sm font-medium text-xau-ink">
        {label}
        {tooltipTerm ? <HelpTooltip term={tooltipTerm} label={`About ${label}`} size="sm" placement="above" /> : null}
      </span>
      {hint ? <span className="block text-xs leading-snug text-xau-muted">{hint}</span> : null}
      {children}
    </label>
  );
}
