import { HelpTooltip } from "@/components/ui/HelpTooltip";
import type { TooltipTerm } from "@/lib/term-tooltips";

type MetricCellProps = {
  label: string;
  value: string;
  hint?: string;
  valueClassName?: string;
  tooltipTerm?: TooltipTerm;
  extraTooltip?: TooltipTerm;
};

function MetricCell({ label, value, hint, valueClassName = "text-xau-ink", tooltipTerm, extraTooltip }: MetricCellProps) {
  return (
    <div className="flex flex-col justify-center bg-xau-card p-4 sm:p-5">
      <p className="inline-flex items-center gap-1 text-[11px] font-medium uppercase tracking-wide text-xau-muted">
        {label}
        {tooltipTerm ? <HelpTooltip term={tooltipTerm} label={`About ${label}`} size="sm" placement="above" /> : null}
      </p>
      <p className={`mt-1.5 text-xl font-semibold tracking-tight sm:text-2xl ${valueClassName}`}>{value}</p>
      {hint ? (
        <p className="mt-1 inline-flex items-center gap-1 text-xs text-xau-muted">
          {hint}
          {extraTooltip ? <HelpTooltip term={extraTooltip} label="About monthly discipline" size="sm" placement="above" /> : null}
        </p>
      ) : null}
    </div>
  );
}

type Props = {
  winRate: number;
  avgDiscipline: number;
  monthlyDiscipline: number;
  totalPnl: number;
  profitFactor: number | string;
};

export function DashboardMetricsHero({
  winRate,
  avgDiscipline,
  monthlyDiscipline,
  totalPnl,
  profitFactor,
}: Props) {
  const pnlPositive = totalPnl >= 0;
  const pnlFormatted = `${pnlPositive ? "+" : "-"}$${Math.abs(totalPnl).toFixed(2)}`;

  return (
    <section className="xau-card-bordered overflow-hidden" aria-label="Key metrics">
      <div className="grid grid-cols-1 gap-px bg-xau-border sm:grid-cols-2 lg:grid-cols-4">
        <div
          className={`flex min-h-[7.5rem] flex-col justify-center p-5 sm:min-h-0 sm:p-6 lg:col-span-1 ${
            pnlPositive ? "bg-[var(--xau-profit-bg)]" : "bg-[var(--xau-loss-bg)]"
          }`}
        >
          <p className="inline-flex items-center gap-1 text-[11px] font-medium uppercase tracking-wide text-xau-muted">
            Net P&L
            <HelpTooltip term="netPnl" label="About Net P&L" size="sm" placement="above" />
          </p>
          <p className={`mt-2 text-3xl font-bold tracking-tight sm:text-4xl ${pnlPositive ? "text-tv-profit" : "text-tv-loss"}`}>
            {pnlFormatted}
          </p>
          <p className="mt-1 text-xs text-xau-muted">Cumulative across all logged trades</p>
        </div>
        <MetricCell label="Win rate" value={`${winRate}%`} tooltipTerm="winRate" />
        <MetricCell
          label="Discipline"
          value={`${avgDiscipline}%`}
          hint={`This month ${monthlyDiscipline}%`}
          tooltipTerm="discipline"
          extraTooltip="monthDiscipline"
        />
        <MetricCell label="Profit factor" value={String(profitFactor)} tooltipTerm="profitFactor" />
      </div>
    </section>
  );
}
