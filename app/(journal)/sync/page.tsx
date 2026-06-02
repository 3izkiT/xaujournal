import Link from "next/link";

export default function SyncPage() {
  return (
    <div className="mx-auto max-w-lg space-y-6 py-8">
      <header className="text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-xau-gold-accent">Coming soon</p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight md:text-3xl">Broker sync</h1>
        <p className="mt-3 text-sm leading-relaxed text-xau-muted">
          XAUJournal is discipline-first and manual today. MT5/MT4 auto-sync is planned for Premium — we will not
          advertise it until it works.
        </p>
      </header>
      <div className="xau-card-bordered space-y-4 p-6 text-sm text-xau-muted">
        <p>What you get now:</p>
        <ul className="list-inside list-disc space-y-1">
          <li>Manual journal with checklist scoring</li>
          <li>Full analytics on logged trades</li>
          <li>Calendar, gallery, and coach share links</li>
        </ul>
      </div>
      <div className="flex flex-wrap justify-center gap-3">
        <Link href="/journal-entry" className="xau-btn-gold">
          Log a trade
        </Link>
        <Link href="/pricing" className="xau-btn-ghost">
          View pricing
        </Link>
      </div>
    </div>
  );
}
