import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <p className="text-xl font-semibold text-slate-900">XAUJournal</p>
        <div className="flex gap-3">
          <Link href="/login" className="rounded-2xl px-4 py-2 text-sm text-slate-600 hover:bg-slate-50">
            Sign in
          </Link>
          <Link href="/register" className="rounded-2xl bg-sky-100 px-4 py-2 text-sm font-medium text-sky-700">
            Create account
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 pb-20 pt-10">
        <section className="rounded-3xl border border-slate-200 bg-gradient-to-br from-sky-50 via-white to-emerald-50 p-10 shadow-sm md:p-14">
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

        <section className="mt-12 grid gap-5 md:grid-cols-3">
          <article className="rounded-2xl border border-emerald-100 bg-emerald-50 p-6">
            <h2 className="font-medium text-emerald-800">Pre-trade checklist</h2>
            <p className="mt-2 text-sm text-emerald-700">Plan, R:R, and calm mindset scored 0–100% automatically.</p>
          </article>
          <article className="rounded-2xl border border-sky-100 bg-sky-50 p-6">
            <h2 className="font-medium text-sky-800">Pastel dashboard</h2>
            <p className="mt-2 text-sm text-sky-700">Win rate, discipline, P&L, equity curve, and session analytics.</p>
          </article>
          <article className="rounded-2xl border border-rose-100 bg-rose-50 p-6">
            <h2 className="font-medium text-rose-800">Private member area</h2>
            <p className="mt-2 text-sm text-rose-700">Your trades stay in your account — sign in to access your journal.</p>
          </article>
        </section>
      </main>
    </div>
  );
}
