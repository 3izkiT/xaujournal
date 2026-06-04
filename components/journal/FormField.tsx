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
      <span className="inline-flex items-center gap-1.5 text-sm font-medium text-xau-ink">
        <span>{label}</span>
        {tooltipTerm ? (
          <HelpTooltip term={tooltipTerm} label={`About ${label}`} size="sm" placement="above" />
        ) : null}
      </span>
      {hint ? <span className="block text-xs leading-snug text-xau-muted">{hint}</span> : null}
      {children}
    </label>
  );
}

type SectionProps = {
  title: string;
  term?: TooltipTerm;
  description?: string;
};

export function FormSectionHeading({ title, term, description }: SectionProps) {
  return (
    <div>
      <h2 className="inline-flex items-center gap-1.5 text-lg font-medium text-xau-ink">
        {title}
        {term ? <HelpTooltip term={term} label={`About ${title}`} size="sm" placement="above" /> : null}
      </h2>
      {description ? <p className="mt-1 text-xs leading-relaxed text-xau-muted">{description}</p> : null}
    </div>
  );
}

type CheckProps = {
  label: string;
  term?: TooltipTerm;
  checked: boolean;
  onChange: (checked: boolean) => void;
};

export function FormCheckRow({ label, term, checked, onChange }: CheckProps) {
  return (
    <label className="flex items-start gap-3 text-sm text-xau-ink">
      <input
        type="checkbox"
        className="mt-0.5"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span className="inline-flex flex-1 flex-wrap items-center gap-1.5">
        <span>{label}</span>
        {term ? <HelpTooltip term={term} label={`About: ${label}`} size="sm" placement="above" /> : null}
      </span>
    </label>
  );
}
