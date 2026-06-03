"use client";

import { FormEvent, useMemo, useState } from "react";
import Link from "next/link";
import { FormField } from "@/components/journal/FormField";
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
    <div className="xau-page-form">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-xau-ink md:text-3xl">Journal entry</h1>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-xau-muted">
            Complete the discipline checklist and reflection notes before saving.
          </p>
        </div>
        <div className="shrink-0 rounded-2xl border border-xau-gold bg-xau-gold-soft px-4 py-2 text-sm text-xau-ink">
          {openAccess ? "Early access · " : plan === "PREMIUM_GOLD" ? "Premium · " : "Free · "}
          {limitLabel}
        </div>
      </header>

      {submitError && (
        <div className="rounded-2xl border border-xau-border bg-xau-rose px-4 py-3 text-sm text-xau-loss">{submitError}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        <section className="xau-form-section">
          <h2 className="text-lg font-medium text-xau-ink">Pre-trade discipline</h2>
          <div className="space-y-3">
            <label className="flex items-start gap-3 text-sm text-xau-ink">
              <input type="checkbox" className="mt-0.5" checked={followedPlan} onChange={(e) => setFollowedPlan(e.target.checked)} />
              Did I follow my strict trading plan/strategy?
            </label>
            <label className="flex items-start gap-3 text-sm text-xau-ink">
              <input
                type="checkbox"
                className="mt-0.5"
                checked={rrAtLeastOneToTwo}
                onChange={(e) => setRrAtLeastOneToTwo(e.target.checked)}
              />
              Is my Risk-to-Reward ratio at least 1:2?
            </label>
            <label className="flex items-start gap-3 text-sm text-xau-ink">
              <input type="checkbox" className="mt-0.5" checked={calmMindset} onChange={(e) => setCalmMindset(e.target.checked)} />
              Is my mindset completely calm and free of FOMO?
            </label>
          </div>
          <p className="rounded-2xl border border-xau-border bg-xau-calm px-4 py-3 text-sm text-xau-ink">
            Discipline score: <span className="font-semibold">{score}%</span>
          </p>
        </section>

        <section className="xau-panel-accent">
          <div>
            <h2 className="text-lg font-medium text-xau-ink">Reflection notes</h2>
            <p className="mt-1 text-xs text-xau-muted">Min 3 characters each — context, mistake, next action.</p>
          </div>
          <div className="space-y-4">
            <textarea
              required
              minLength={3}
              rows={3}
              className="xau-textarea"
              placeholder="Context: What was the market telling you?"
              value={noteContext}
              onChange={(e) => setNoteContext(e.target.value)}
            />
            <textarea
              required
              minLength={3}
              rows={3}
              className="xau-textarea"
              placeholder="Mistake: What went wrong (or 'none')?"
              value={noteMistake}
              onChange={(e) => setNoteMistake(e.target.value)}
            />
            <textarea
              required
              minLength={3}
              rows={3}
              className="xau-textarea"
              placeholder="Next action: What will you do differently?"
              value={noteNextAction}
              onChange={(e) => setNoteNextAction(e.target.value)}
            />
          </div>
        </section>

        <section className="xau-form-section">
          <h2 className="text-lg font-medium text-xau-ink">Trade details</h2>
          <div className="grid gap-5 sm:grid-cols-2">
            <FormField label="Instrument">
              <input className="xau-field" value="XAUUSD (Gold)" disabled />
            </FormField>
            <FormField label="Date">
              <input type="date" className="xau-field" value={date} onChange={(e) => setDate(e.target.value)} />
            </FormField>
            <FormField label="Entry time">
              <input type="time" className="xau-field" value={entryTime} onChange={(e) => setEntryTime(e.target.value)} />
            </FormField>
            <FormField label="Exit time" hint="Optional">
              <input type="time" className="xau-field" value={exitTime} onChange={(e) => setExitTime(e.target.value)} />
            </FormField>
            <FormField label="Direction">
              <select className="xau-select" value={type} onChange={(e) => setType(e.target.value as "Buy" | "Sell")}>
                {tradeTypeOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </FormField>
            <FormField label="Session">
              <select
                className="xau-select"
                value={session}
                onChange={(e) => setSession(e.target.value as typeof session)}
              >
                {sessionOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </FormField>
            <FormField label="Net P&amp;L ($)">
              <input
                type="number"
                step="0.01"
                className="xau-field"
                value={netProfitLoss}
                onChange={(e) => setNetProfitLoss(e.target.value)}
              />
            </FormField>
            <FormField label="R-multiple" hint="e.g. +3R">
              <input className="xau-field" value={rMultiple} onChange={(e) => setRMultiple(e.target.value)} />
            </FormField>
          </div>
        </section>

        <section className="xau-form-section">
          <h2 className="text-lg font-medium text-xau-ink">Prices &amp; excursions</h2>
          <div className="grid gap-5 sm:grid-cols-2">
            <FormField label="Entry price">
              <input
                type="number"
                step="0.1"
                min="2000"
                max="2600"
                className="xau-field"
                value={entryPrice}
                onChange={(e) => setEntryPrice(e.target.value)}
              />
            </FormField>
            <FormField label="Exit price">
              <input
                type="number"
                step="0.1"
                min="2000"
                max="2600"
                className="xau-field"
                value={exitPrice}
                onChange={(e) => setExitPrice(e.target.value)}
              />
            </FormField>
            <FormField label="MAE ($)" hint="Max adverse excursion">
              <input
                type="number"
                step="0.1"
                className="xau-field bg-xau-loss-bg"
                placeholder="Optional"
                value={mae}
                onChange={(e) => setMae(e.target.value)}
              />
            </FormField>
            <FormField label="MFE ($)" hint="Max favorable excursion">
              <input
                type="number"
                step="0.1"
                className="xau-field bg-xau-profit-bg"
                placeholder="Optional"
                value={mfe}
                onChange={(e) => setMfe(e.target.value)}
              />
            </FormField>
          </div>
        </section>

        <section className="xau-form-section">
          <h2 className="text-lg font-medium text-xau-ink">Setup tags &amp; emotion</h2>
          <div className="flex flex-wrap gap-2">
            {setupTagOptions.map((tag) => (
              <button
                type="button"
                key={tag}
                onClick={() => handleSetupTagChange(tag)}
                className={`rounded-full px-4 py-2 text-sm transition ${
                  setupTags.includes(tag)
                    ? "bg-xau-calm font-medium text-xau-ink"
                    : "border border-xau-border bg-xau-app text-xau-muted hover:text-xau-ink"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
          <FormField label="Emotion during trade">
            <select className="xau-select" value={emotion} onChange={(e) => setEmotion(e.target.value)}>
              {emotionOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </FormField>
        </section>

        <section className="xau-form-section">
          <h2 className="text-lg font-medium text-xau-ink">Chart screenshots</h2>
          <div className="grid gap-5 md:grid-cols-2">
            <label
              className="space-y-3 rounded-2xl border border-dashed border-xau-border bg-xau-calm p-4"
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                handleFileSelect(e.dataTransfer.files?.[0] || null, "before");
              }}
            >
              <span className="block text-sm font-medium text-xau-ink">Before trade</span>
              <input
                type="file"
                accept="image/*"
                className="block w-full text-xs text-xau-muted file:mr-3 file:rounded-lg file:border-0 file:bg-xau-card file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-xau-ink"
                onChange={(e) => handleFileSelect(e.target.files?.[0] || null, "before")}
              />
              <input
                className="xau-field text-xs"
                placeholder="Or paste image URL"
                value={beforeChartUrl}
                onChange={(e) => setBeforeChartUrl(e.target.value)}
              />
            </label>
            <label
              className="space-y-3 rounded-2xl border border-dashed border-xau-border bg-xau-profit-bg p-4"
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                handleFileSelect(e.dataTransfer.files?.[0] || null, "after");
              }}
            >
              <span className="block text-sm font-medium text-xau-ink">After trade</span>
              <input
                type="file"
                accept="image/*"
                className="block w-full text-xs text-xau-muted file:mr-3 file:rounded-lg file:border-0 file:bg-xau-card file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-xau-ink"
                onChange={(e) => handleFileSelect(e.target.files?.[0] || null, "after")}
              />
              <input
                className="xau-field text-xs"
                placeholder="Or paste image URL"
                value={afterChartUrl}
                onChange={(e) => setAfterChartUrl(e.target.value)}
              />
            </label>
          </div>
        </section>

        <div className="flex flex-col gap-3 border-t border-xau-border pt-6 sm:flex-row sm:items-center sm:justify-between">
          <button type="submit" disabled={!canAddMore} className="xau-btn-gold px-8 py-3 disabled:cursor-not-allowed disabled:opacity-60">
            {canAddMore
              ? "Save trade log"
              : PAYMENTS_ENABLED
                ? `Upgrade for more than ${FREE_TRADE_LIMIT} logs`
                : "Log limit reached"}
          </button>
          {!canAddMore && PAYMENTS_ENABLED && (
            <p className="text-sm text-xau-muted">
              <Link href="/pricing" className="font-medium text-xau-ink underline-offset-2 hover:underline">
                View plans
              </Link>{" "}
              for unlimited logs.
            </p>
          )}
        </div>
      </form>
    </div>
  );
}
