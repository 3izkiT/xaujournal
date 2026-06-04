import { HelpTooltip } from "@/components/ui/HelpTooltip";
import type { TooltipTerm } from "@/lib/term-tooltips";

type Accent = "profit" | "calm" | "loss" | "gold";

const accentClass: Record<Accent, string> = {
  profit: "xau-kpi-profit border-l-[var(--xau-profit)]",
  calm: "xau-kpi-calm border-l-[#2962ff]",
  loss: "xau-kpi-loss border-l-[var(--xau-loss)]",
  gold: "xau-kpi-gold border-l-[var(--xau-gold)]",
};

type Props = {
  label: string;
  value: string;
  hint?: string;
  accent?: Accent;
  valueClassName?: string;
  tooltipTerm?: TooltipTerm;
};

export function KpiCard({ label, value, hint, accent = "calm", valueClassName = "text-xau-ink", tooltipTerm }: Props) {
  return (
    <article className={`border-l-4 ${accentClass[accent]} px-5 py-4`}>
      <p className="inline-flex items-center gap-1 text-xs font-medium uppercase tracking-wide text-xau-muted">
        {label}
        {tooltipTerm ? <HelpTooltip term={tooltipTerm} label={`About ${label}`} size="sm" placement="above" /> : null}
      </p>
      <p className={`mt-2 text-2xl font-semibold tracking-tight md:text-3xl ${valueClassName}`}>{value}</p>
      {hint ? (
        <p className="mt-1 inline-flex items-center gap-1 text-xs text-xau-muted">
          {hint}
          {tooltipTerm === "discipline" ? (
            <HelpTooltip term="monthDiscipline" label="About monthly discipline" size="sm" placement="above" />
          ) : null}
        </p>
      ) : null}
    </article>
  );
}
