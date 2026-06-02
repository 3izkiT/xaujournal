import Link from "next/link";

const showcaseSections = [
  {
    id: "dashboard",
    step: "01",
    badgeTone: "text-sky-500",
    title: "Immediate clarity before decision-making",
    description:
      "KPI cards and smooth charts prioritize signal over noise, so traders quickly see discipline quality and performance direction.",
  },
  {
    id: "journal",
    step: "02",
    badgeTone: "text-emerald-500",
    title: "Structured reflection, not impulsive logging",
    description:
      "Traders pass a 3-step discipline filter, then attach setup, emotion, and chart evidence for each trade.",
  },
  {
    id: "review",
    step: "03",
    badgeTone: "text-rose-500",
    title: "Calendar and gallery expose patterns fast",
    description:
      "Performance heatmap and before/after chart archive reveal recurring mistakes and repeatable gold setups.",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-50">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <p className="text-xl font-semibold text-slate-900">XAUJournal</p>
        <div className="flex gap-3">
          <Link href="/login" className="rounded-2xl px-4 py-2 text-sm text-slate-600 transition hover:bg-slate-50">
            Sign in
          </Link>
          <Link
            href="/register"
            className="rounded-2xl bg-sky-100 px-4 py-2 text-sm font-medium text-sky-700 shadow-sm transition hover:bg-sky-200"
          >
            Create account
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 pb-24 pt-10 lg:snap-y lg:snap-mandatory lg:space-y-6">
        <section className="animate-rise-up snap-start rounded-3xl border border-slate-200 bg-gradient-to-br from-sky-50 via-white to-emerald-50 p-10 shadow-sm md:p-14 lg:min-h-[82vh] lg:content-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-500">Silent Luxury · XAUUSD Only</p>
          <h1 className="mt-4 max-w-2xl text-4xl font-semibold leading-tight text-slate-900 md:text-5xl">
            Manual reflection for high discipline Gold trading
          </h1>
          <p className="mt-5 max-w-xl text-lg text-slate-600">
            No broker API. Just you, your checklist, and a clean pastel journal built for London, New York, and Asian
            sessions.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/register"
              className="rounded-2xl bg-sky-100 px-6 py-3 text-sm font-medium text-sky-800 shadow-sm hover:bg-sky-200"
            >
              Start free journal
            </Link>
            <Link
              href="/pricing"
              className="rounded-2xl border border-slate-200 bg-white px-6 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              View pricing
            </Link>
          </div>
        </section>

        <section className="mt-12 grid snap-start gap-5 md:grid-cols-3 lg:min-h-[48vh] lg:content-center">
          <article className="animate-rise-up rounded-2xl border border-emerald-100 bg-emerald-50 p-6">
            <h2 className="font-medium text-emerald-800">Pre-trade checklist</h2>
            <p className="mt-2 text-sm text-emerald-700">Plan, R:R, and calm mindset scored 0–100% automatically.</p>
          </article>
          <article className="animate-rise-up rounded-2xl border border-sky-100 bg-sky-50 p-6">
            <h2 className="font-medium text-sky-800">Pastel dashboard</h2>
            <p className="mt-2 text-sm text-sky-700">Win rate, discipline, P&L, equity curve, and session analytics.</p>
          </article>
          <article className="animate-rise-up rounded-2xl border border-rose-100 bg-rose-50 p-6">
            <h2 className="font-medium text-rose-800">Private member area</h2>
            <p className="mt-2 text-sm text-rose-700">Your trades stay in your account — sign in to access your journal.</p>
          </article>
        </section>

        <section className="mt-16 grid snap-start gap-6 lg:min-h-[95vh] lg:grid-cols-[220px_1fr] lg:items-start">
          <aside className="hidden h-fit rounded-2xl border border-slate-200 bg-white p-4 shadow-sm lg:sticky lg:top-5 lg:block">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Explore Flow</p>
            <div className="space-y-2">
              {showcaseSections.map((section) => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  className="block rounded-xl border border-transparent px-3 py-2 text-sm text-slate-600 transition hover:border-slate-200 hover:bg-slate-50 hover:text-slate-900"
                >
                  {section.step}. {section.id}
                </a>
              ))}
            </div>
          </aside>

          <div>
          <div className="mb-6">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Product Experience</p>
            <h2 className="mt-2 text-3xl font-semibold text-slate-900">How the platform flows in real use</h2>
            <p className="mt-2 max-w-2xl text-sm text-slate-600">
              Patterned after high-end SaaS landing pages: clear sequence, visual hierarchy, and focused workflows.
            </p>
          </div>

          <div className="space-y-6">
            <article
              id="dashboard"
              className="animate-rise-up grid scroll-mt-8 gap-5 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:grid-cols-[1.1fr_0.9fr]"
            >
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="mb-3 flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-rose-300" />
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-300" />
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-300" />
                </div>
                <div className="grid grid-cols-[190px_1fr] gap-4">
                  <div className="space-y-2 rounded-2xl border border-slate-200 bg-white p-3">
                    <div className="h-10 rounded-xl bg-sky-100" />
                    <div className="h-8 rounded-xl bg-slate-100" />
                    <div className="h-8 rounded-xl bg-slate-100" />
                    <div className="h-8 rounded-xl bg-slate-100" />
                  </div>
                  <div className="space-y-3 rounded-2xl border border-slate-200 bg-white p-3">
                    <div className="grid grid-cols-3 gap-2">
                      <div className="h-14 rounded-xl bg-emerald-100" />
                      <div className="h-14 rounded-xl bg-sky-100" />
                      <div className="h-14 rounded-xl bg-rose-100" />
                    </div>
                    <div className="h-28 rounded-xl bg-slate-100" />
                  </div>
                </div>
              </div>
              <div className="flex flex-col justify-center">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-500">01 · Dashboard</p>
                <h3 className="mt-2 text-2xl font-semibold text-slate-900">Immediate clarity before decision-making</h3>
                <p className="mt-3 text-sm text-slate-600">
                  KPI cards and smooth charts prioritize signal over noise, so traders quickly see discipline quality and
                  performance direction.
                </p>
              </div>
            </article>

            <article
              id="journal"
              className="animate-rise-up grid scroll-mt-8 gap-5 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:grid-cols-[0.9fr_1.1fr]"
            >
              <div className="flex flex-col justify-center">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-500">02 · Journal Entry</p>
                <h3 className="mt-2 text-2xl font-semibold text-slate-900">Structured reflection, not impulsive logging</h3>
                <p className="mt-3 text-sm text-slate-600">
                  Traders must pass the 3-step discipline filter, then attach setup/emotion/chart evidence for each trade.
                </p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="space-y-2 rounded-2xl border border-slate-200 bg-white p-4">
                  <div className="h-9 rounded-xl bg-emerald-100" />
                  <div className="grid grid-cols-2 gap-2">
                    <div className="h-9 rounded-xl bg-slate-100" />
                    <div className="h-9 rounded-xl bg-slate-100" />
                  </div>
                  <div className="h-9 rounded-xl bg-slate-100" />
                  <div className="h-20 rounded-xl border border-dashed border-sky-200 bg-sky-50" />
                </div>
              </div>
            </article>

            <article
              id="review"
              className="animate-rise-up grid scroll-mt-8 gap-5 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:grid-cols-[1.1fr_0.9fr]"
            >
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="grid grid-cols-7 gap-2">
                  {Array.from({ length: 35 }).map((_, i) => (
                    <div
                      key={i}
                      className={`h-10 rounded-lg ${
                        i % 9 === 0 ? "bg-emerald-100" : i % 7 === 0 ? "bg-rose-100" : "bg-slate-100"
                      }`}
                    />
                  ))}
                </div>
              </div>
              <div className="flex flex-col justify-center">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-rose-500">03 · Review Layer</p>
                <h3 className="mt-2 text-2xl font-semibold text-slate-900">Calendar + gallery make behavior visible</h3>
                <p className="mt-3 text-sm text-slate-600">
                  Performance heatmap and before/after chart archive expose recurring mistakes and repeatable setups.
                </p>
              </div>
            </article>

            <article className="animate-rise-up rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Conversion Pattern</p>
              <h3 className="mt-2 text-2xl font-semibold text-slate-900">Pricing and CTA placement follow proven SaaS flow</h3>
              <p className="mt-3 max-w-3xl text-sm text-slate-600">
                Problem-to-solution structure, visual proof blocks, then action CTAs. This sequence is widely used by top
                product landing pages because it reduces bounce and clarifies decision timing.
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <Link
                  href="/register"
                  className="rounded-2xl bg-slate-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800"
                >
                  Create your account
                </Link>
                <Link
                  href="/pricing"
                  className="rounded-2xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                >
                  Compare plans
                </Link>
              </div>
            </article>
          </div>
          </div>
        </section>
      </main>
    </div>
  );
}
