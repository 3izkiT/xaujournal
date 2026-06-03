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
};

export function KpiCard({ label, value, hint, accent = "calm", valueClassName = "text-xau-ink" }: Props) {
  return (
    <article className={`border-l-4 ${accentClass[accent]} px-5 py-4`}>
      <p className="text-xs font-medium uppercase tracking-wide text-xau-muted">{label}</p>
      <p className={`mt-2 text-2xl font-semibold tracking-tight md:text-3xl ${valueClassName}`}>{value}</p>
      {hint ? <p className="mt-1 text-xs text-xau-muted">{hint}</p> : null}
    </article>
  );
}
