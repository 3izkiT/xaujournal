type Accent = "mint" | "calm" | "rose" | "gold";

const accentBar: Record<Accent, string> = {
  mint: "border-l-[#A8C4A0]",
  calm: "border-l-[#9BB3C9]",
  rose: "border-l-[#D4A8A4]",
  gold: "border-l-xau-gold-accent",
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
    <article className={`xau-card-bordered border-l-4 ${accentBar[accent]} px-5 py-4`}>
      <p className="text-xs font-medium uppercase tracking-wide text-xau-muted">{label}</p>
      <p className={`mt-2 text-2xl font-semibold tracking-tight md:text-3xl ${valueClassName}`}>{value}</p>
      {hint ? <p className="mt-1 text-xs text-xau-muted">{hint}</p> : null}
    </article>
  );
}
