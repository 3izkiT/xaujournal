"use client";

import { FormEvent, useMemo, useState } from "react";
import Link from "next/link";
import { useXauJournal } from "@/components/XauJournalContext";
import {
  calculateDisciplineScore,
  emotionOptions,
  sessionOptions,
  setupTagOptions,
  tradeTypeOptions,
} from "@/lib/data";
import { isOpenAccessActive, PAYMENTS_ENABLED } from "@/lib/monetization";
import { FREE_TRADE_LIMIT } from "@/lib/plans";

export default function JournalEntryPage() {
  const { addTrade, canAddMore, tradeCount, tradeLimit, plan } = useXauJournal();
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [entryTime, setEntryTime] = useState("13:00");
  const [exitTime, setExitTime] = useState("");
  const [type, setType] = useState<"Buy" | "Sell">("Buy");
  const [netProfitLoss, setNetProfitLoss] = useState("0");
  const [rMultiple, setRMultiple] = useState("+2R");
  const [entryPrice, setEntryPrice] = useState("2380");
  const [exitPrice, setExitPrice] = useState("2388");
  const [mae, setMae] = useState("");
  const [mfe, setMfe] = useState("");
  const [session, setSession] = useState(sessionOptions[0]);
  const [setupTags, setSetupTags] = useState<string[]>(["Liquidity Sweep"]);
  const [emotion, setEmotion] = useState("Calm");
  const [beforeChartUrl, setBeforeChartUrl] = useState("");
  const [afterChartUrl, setAfterChartUrl] = useState("");
  const [followedPlan, setFollowedPlan] = useState(true);
  const [rrAtLeastOneToTwo, setRrAtLeastOneToTwo] = useState(true);
  const [calmMindset, setCalmMindset] = useState(true);
  const [noteContext, setNoteContext] = useState("");
  const [noteMistake, setNoteMistake] = useState("");
  const [noteNextAction, setNoteNextAction] = useState("");
  const [submitError, setSubmitError] = useState<string | null>(null);

  const score = useMemo(
    () => calculateDisciplineScore({ followedPlan, rrAtLeastOneToTwo, calmMindset }),
    [followedPlan, rrAtLeastOneToTwo, calmMindset]
  );

  const openAccess = isOpenAccessActive();
  const limitLabel = openAccess
    ? `${tradeCount} logs · Full access`
    : tradeLimit != null
      ? `${tradeCount}/${tradeLimit} logs`
      : `${tradeCount} logs (Premium)`;

  const handleSetupTagChange = (tag: string) => {
    setSetupTags((prev) => (prev.includes(tag) ? prev.filter((v) => v !== tag) : [...prev, tag]));
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!canAddMore) return;
    setSubmitError(null);

    const entryAt = new Date(`${date}T${entryTime}:00`).toISOString();
    const exitAt = exitTime ? new Date(`${date}T${exitTime}:00`).toISOString() : null;
    let holdTimeMinutes: number | null = null;
    if (exitAt) {
      holdTimeMinutes = Math.max(0, Math.round((new Date(exitAt).getTime() - new Date(entryAt).getTime()) / 60000));
    }

    const result = await addTrade({
      date,
      entryAt,
      exitAt,
      holdTimeMinutes,
      type,
      netProfitLoss: Number(netProfitLoss),
      rMultiple,
      entryPrice: Number(entryPrice),
      exitPrice: Number(exitPrice),
      mae: mae !== "" ? Number(mae) : null,
      mfe: mfe !== "" ? Number(mfe) : null,
      session,
      setupTags: setupTags as ("Liquidity Sweep" | "FVG Mitigation" | "Break of Structure" | "Order Block")[],
      emotion: emotion as "Calm" | "Greed" | "Fear" | "FOMO" | "Revenge Trading" | "Overlot",
      beforeChartUrl:
        beforeChartUrl ||
        "https://images.unsplash.com/photo-1642543348745-f0466dbf8348?auto=format&fit=crop&w=1200&q=80",
      afterChartUrl:
        afterChartUrl ||
        "https://images.unsplash.com/photo-1642790551116-f2f5204f9ec6?auto=format&fit=crop&w=1200&q=80",
      disciplineChecklist: {
        followedPlan,
        rrAtLeastOneToTwo,
        calmMindset,
      },
      noteContext,
      noteMistake,
      noteNextAction,
    });

    if (!result.ok) {
      setSubmitError(result.error ?? "Could not save trade.");
    }
  };

  const handleFileSelect = (file: File | null, target: "before" | "after") => {
    if (!file) return;
    const localUrl = URL.createObjectURL(file);
    if (target === "before") setBeforeChartUrl(localUrl);
    else setAfterChartUrl(localUrl);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-3xl font-semibold text-xau-ink">Journal Entry</h2>
          <p className="mt-2 text-sm text-xau-muted">Complete the discipline checklist and reflection notes before saving.</p>
        </div>
        <div className="rounded-2xl border border-xau-gold bg-xau-gold-soft px-4 py-2 text-sm text-xau-ink">
          {openAccess ? "Early access · " : plan === "PREMIUM_GOLD" ? "Premium · " : "Free · "}
          {limitLabel}
        </div>
      </div>

      {submitError && (
        <div className="rounded-2xl border border-xau-border bg-xau-rose px-4 py-3 text-sm text-xau-loss">{submitError}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <section className="rounded-2xl border border-xau-border bg-xau-app p-5">
          <h3 className="text-lg font-medium text-xau-ink">Pre-Trade Discipline Checklist</h3>
          <div className="mt-4 space-y-3">
            <label className="flex items-center gap-3 text-sm text-xau-ink">
              <input type="checkbox" checked={followedPlan} onChange={(e) => setFollowedPlan(e.target.checked)} />
              Did I follow my strict trading plan/strategy?
            </label>
            <label className="flex items-center gap-3 text-sm text-xau-ink">
              <input
                type="checkbox"
                checked={rrAtLeastOneToTwo}
                onChange={(e) => setRrAtLeastOneToTwo(e.target.checked)}
              />
              Is my Risk-to-Reward ratio at least 1:2?
            </label>
            <label className="flex items-center gap-3 text-sm text-xau-ink">
              <input type="checkbox" checked={calmMindset} onChange={(e) => setCalmMindset(e.target.checked)} />
              Is my mindset completely calm and free of FOMO?
            </label>
          </div>
          <div className="mt-4 rounded-2xl border border-xau-border bg-xau-calm px-4 py-3 text-sm text-xau-ink">
            Discipline Score: <span className="font-semibold">{score}%</span>
          </div>
        </section>

        <section className="rounded-2xl border border-violet-200 bg-violet-50/50 p-5">
          <h3 className="text-lg font-medium text-xau-ink">Reflection notes (required)</h3>
          <p className="mt-1 text-xs text-xau-muted">Min 3 characters each — context, mistake, next action.</p>
          <div className="mt-4 space-y-3">
            <textarea
              required
              minLength={3}
              rows={2}
              className="w-full rounded-2xl border border-xau-border px-4 py-3 text-sm"
              placeholder="Context: What was the market telling you?"
              value={noteContext}
              onChange={(e) => setNoteContext(e.target.value)}
            />
            <textarea
              required
              minLength={3}
              rows={2}
              className="w-full rounded-2xl border border-xau-border px-4 py-3 text-sm"
              placeholder="Mistake: What went wrong (or 'none')?"
              value={noteMistake}
              onChange={(e) => setNoteMistake(e.target.value)}
            />
            <textarea
              required
              minLength={3}
              rows={2}
              className="w-full rounded-2xl border border-xau-border px-4 py-3 text-sm"
              placeholder="Next action: What will you do differently?"
              value={noteNextAction}
              onChange={(e) => setNoteNextAction(e.target.value)}
            />
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2">
          <input className="rounded-2xl border border-xau-border px-4 py-3" value="XAUUSD (Gold)" disabled />
          <input
            type="date"
            className="rounded-2xl border border-xau-border px-4 py-3"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
          <label className="block text-sm text-xau-muted">
            Entry time
            <input
              type="time"
              className="mt-1 w-full rounded-2xl border border-xau-border px-4 py-3"
              value={entryTime}
              onChange={(e) => setEntryTime(e.target.value)}
            />
          </label>
          <label className="block text-sm text-xau-muted">
            Exit time (optional)
            <input
              type="time"
              className="mt-1 w-full rounded-2xl border border-xau-border px-4 py-3"
              value={exitTime}
              onChange={(e) => setExitTime(e.target.value)}
            />
          </label>
          <select className="rounded-2xl border border-xau-border px-4 py-3" value={type} onChange={(e) => setType(e.target.value as "Buy" | "Sell")}>
            {tradeTypeOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <input
            type="number"
            step="0.01"
            className="rounded-2xl border border-xau-border px-4 py-3"
            placeholder="Net Profit/Loss ($)"
            value={netProfitLoss}
            onChange={(e) => setNetProfitLoss(e.target.value)}
          />
          <input
            className="rounded-2xl border border-xau-border px-4 py-3"
            placeholder="R-Multiple (e.g. +3R)"
            value={rMultiple}
            onChange={(e) => setRMultiple(e.target.value)}
          />
          <select className="rounded-2xl border border-xau-border px-4 py-3" value={session} onChange={(e) => setSession(e.target.value as typeof session)}>
            {sessionOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <input
            type="number"
            step="0.1"
            className="rounded-2xl border border-xau-border bg-xau-rose/50 px-4 py-3"
            placeholder="MAE ($ adverse excursion)"
            value={mae}
            onChange={(e) => setMae(e.target.value)}
          />
          <input
            type="number"
            step="0.1"
            className="rounded-2xl border border-xau-border bg-xau-mint/50 px-4 py-3"
            placeholder="MFE ($ favorable excursion)"
            value={mfe}
            onChange={(e) => setMfe(e.target.value)}
          />
          <input
            type="number"
            step="0.1"
            min="2000"
            max="2600"
            className="rounded-2xl border border-xau-border px-4 py-3"
            placeholder="Entry Price"
            value={entryPrice}
            onChange={(e) => setEntryPrice(e.target.value)}
          />
          <input
            type="number"
            step="0.1"
            min="2000"
            max="2600"
            className="rounded-2xl border border-xau-border px-4 py-3"
            placeholder="Exit Price"
            value={exitPrice}
            onChange={(e) => setExitPrice(e.target.value)}
          />
        </section>

        <section className="space-y-4 rounded-2xl border border-xau-border p-5">
          <h3 className="text-lg font-medium text-xau-ink">Setup Tags & Emotion</h3>
          <div className="flex flex-wrap gap-2">
            {setupTagOptions.map((tag) => (
              <button
                type="button"
                key={tag}
                onClick={() => handleSetupTagChange(tag)}
                className={`rounded-full px-4 py-2 text-sm transition ${
                  setupTags.includes(tag)
                    ? "bg-xau-calm text-xau-ink"
                    : "bg-xau-app text-xau-muted hover:bg-xau-calm"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
          <select className="w-full rounded-2xl border border-xau-border px-4 py-3" value={emotion} onChange={(e) => setEmotion(e.target.value)}>
            {emotionOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </section>

        <section className="grid gap-4 md:grid-cols-2">
          <label
            className="rounded-2xl border border-dashed border-xau-border bg-xau-calm p-4 text-sm text-xau-ink"
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              handleFileSelect(e.dataTransfer.files?.[0] || null, "before");
            }}
          >
            <span className="mb-2 block font-medium">Before Trade Chart</span>
            <input type="file" accept="image/*" className="mb-2 block text-xs" onChange={(e) => handleFileSelect(e.target.files?.[0] || null, "before")} />
            <input
              className="w-full rounded-xl border border-xau-border bg-white px-3 py-2 text-xs text-xau-muted"
              placeholder="or paste image URL"
              value={beforeChartUrl}
              onChange={(e) => setBeforeChartUrl(e.target.value)}
            />
          </label>
          <label
            className="rounded-2xl border border-dashed border-xau-border bg-xau-mint p-4 text-sm text-xau-profit"
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              handleFileSelect(e.dataTransfer.files?.[0] || null, "after");
            }}
          >
            <span className="mb-2 block font-medium">After Trade Chart</span>
            <input type="file" accept="image/*" className="mb-2 block text-xs" onChange={(e) => handleFileSelect(e.target.files?.[0] || null, "after")} />
            <input
              className="w-full rounded-xl border border-xau-border bg-white px-3 py-2 text-xs text-xau-muted"
              placeholder="or paste image URL"
              value={afterChartUrl}
              onChange={(e) => setAfterChartUrl(e.target.value)}
            />
          </label>
        </section>

        <button
          type="submit"
          disabled={!canAddMore}
          className="rounded-2xl bg-xau-calm px-6 py-3 font-medium text-xau-ink transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {canAddMore
            ? "Save Trade Log"
            : PAYMENTS_ENABLED
              ? `Upgrade for more than ${FREE_TRADE_LIMIT} logs`
              : "Log limit reached"}
        </button>
        {!canAddMore && PAYMENTS_ENABLED && (
          <p className="text-sm text-xau-muted">
            <Link href="/pricing" className="text-xau-ink underline">
              View plans
            </Link>{" "}
            for unlimited logs.
          </p>
        )}
      </form>
    </div>
  );
}
