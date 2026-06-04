"use client";

import { FormEvent, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChartImage } from "@/components/journal/ChartImage";
import { FormCheckRow, FormField, FormSectionHeading } from "@/components/journal/FormField";
import { HelpTooltip } from "@/components/ui/HelpTooltip";
import { SavingOverlay, type SavingOverlayPhase } from "@/components/ui/SavingOverlay";
import { useXauJournal } from "@/components/XauJournalContext";
import {
  afterPlaceholder,
  beforePlaceholder,
  readImageFileAsDataUrl,
} from "@/lib/chart-upload";
import {
  calculateDisciplineScore,
  emotionOptions,
  sessionOptions,
  setupTagOptions,
  tradeTypeOptions,
  XAU_SPOT_PRICE_MAX,
  XAU_SPOT_PRICE_MIN,
} from "@/lib/data";
import { isOpenAccessActive, PAYMENTS_ENABLED } from "@/lib/monetization";
import { FREE_TRADE_LIMIT } from "@/lib/plans";

export default function JournalEntryPage() {
  const router = useRouter();
  const { addTrade, canAddMore, tradeCount, tradeLimit, plan } = useXauJournal();
  const [saveOverlay, setSaveOverlay] = useState<SavingOverlayPhase | null>(null);
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [entryTime, setEntryTime] = useState("13:00");
  const [exitTime, setExitTime] = useState("");
  const [type, setType] = useState<"Buy" | "Sell">("Buy");
  const [netProfitLoss, setNetProfitLoss] = useState("0");
  const [rMultiple, setRMultiple] = useState("+2R");
  const [entryPrice, setEntryPrice] = useState("");
  const [exitPrice, setExitPrice] = useState("");
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
  const [chartUploadError, setChartUploadError] = useState<string | null>(null);

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

    const entry = Number(entryPrice);
    const exit = Number(exitPrice);
    if (!Number.isFinite(entry) || entry < XAU_SPOT_PRICE_MIN || entry > XAU_SPOT_PRICE_MAX) {
      setSubmitError(`Enter a valid entry price (${XAU_SPOT_PRICE_MIN}–${XAU_SPOT_PRICE_MAX}).`);
      return;
    }
    if (!Number.isFinite(exit) || exit < XAU_SPOT_PRICE_MIN || exit > XAU_SPOT_PRICE_MAX) {
      setSubmitError(`Enter a valid exit price (${XAU_SPOT_PRICE_MIN}–${XAU_SPOT_PRICE_MAX}).`);
      return;
    }

    const entryAt = new Date(`${date}T${entryTime}:00`).toISOString();
    const exitAt = exitTime ? new Date(`${date}T${exitTime}:00`).toISOString() : null;
    let holdTimeMinutes: number | null = null;
    if (exitAt) {
      holdTimeMinutes = Math.max(0, Math.round((new Date(exitAt).getTime() - new Date(entryAt).getTime()) / 60000));
    }

    setSaveOverlay("saving");
    const result = await addTrade({
      date,
      entryAt,
      exitAt,
      holdTimeMinutes,
      type,
      netProfitLoss: Number(netProfitLoss),
      rMultiple,
      entryPrice: entry,
      exitPrice: exit,
      mae: mae !== "" ? Number(mae) : null,
      mfe: mfe !== "" ? Number(mfe) : null,
      session,
      setupTags: setupTags as ("Liquidity Sweep" | "FVG Mitigation" | "Break of Structure" | "Order Block")[],
      emotion: emotion as "Calm" | "Greed" | "Fear" | "FOMO" | "Revenge Trading" | "Overlot",
      beforeChartUrl: beforeChartUrl.trim() || beforePlaceholder,
      afterChartUrl: afterChartUrl.trim() || afterPlaceholder,
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
      setSaveOverlay(null);
      setSubmitError(result.error ?? "Could not save trade.");
      return;
    }

    setSaveOverlay("success");
    await new Promise((resolve) => setTimeout(resolve, 700));
    router.push("/history?saved=1");
  };

  const handleFileSelect = async (file: File | null, target: "before" | "after") => {
    if (!file) return;
    setChartUploadError(null);
    try {
      const dataUrl = await readImageFileAsDataUrl(file);
      if (target === "before") setBeforeChartUrl(dataUrl);
      else setAfterChartUrl(dataUrl);
    } catch (err) {
      setChartUploadError(err instanceof Error ? err.message : "Could not load image.");
    }
  };

  return (
    <>
      <SavingOverlay open={saveOverlay !== null} phase={saveOverlay ?? "saving"} />
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
          <FormSectionHeading title="Pre-trade discipline" term="disciplineChecklist" />
          <div className="space-y-3">
            <FormCheckRow
              label="Did I follow my strict trading plan/strategy?"
              term="followedPlan"
              checked={followedPlan}
              onChange={setFollowedPlan}
            />
            <FormCheckRow
              label="Is my Risk-to-Reward ratio at least 1:2?"
              term="riskRewardRule"
              checked={rrAtLeastOneToTwo}
              onChange={setRrAtLeastOneToTwo}
            />
            <FormCheckRow
              label="Is my mindset completely calm and free of FOMO?"
              term="calmMindsetRule"
              checked={calmMindset}
              onChange={setCalmMindset}
            />
          </div>
          <p className="inline-flex flex-wrap items-center gap-1.5 rounded-2xl border border-xau-border bg-xau-calm px-4 py-3 text-sm text-xau-ink">
            <span>
              Discipline score: <span className="font-semibold">{score}%</span>
            </span>
            <HelpTooltip term="disciplineShort" label="About discipline score" size="sm" placement="above" />
          </p>
        </section>

        <section className="xau-panel-accent space-y-4">
          <FormSectionHeading
            title="Reflection notes"
            term="reflectionNotes"
            description={'Optional but recommended — builds discipline. If you fill a field, use at least 3 characters (e.g. "none" for mistakes).'}
          />
          <div className="space-y-4">
            <label className="block space-y-2">
              <span className="inline-flex items-center gap-1.5 text-sm font-medium text-xau-ink">
                Context
                <HelpTooltip term="noteContext" label="About context" size="sm" placement="above" />
              </span>
              <textarea
                rows={3}
                className="xau-textarea"
                placeholder="What was the market telling you?"
                value={noteContext}
                onChange={(e) => setNoteContext(e.target.value)}
              />
            </label>
            <label className="block space-y-2">
              <span className="inline-flex items-center gap-1.5 text-sm font-medium text-xau-ink">
                Mistake
                <HelpTooltip term="noteMistake" label="About mistake" size="sm" placement="above" />
              </span>
              <textarea
                rows={3}
                className="xau-textarea"
                placeholder="What went wrong (or 'none')?"
                value={noteMistake}
                onChange={(e) => setNoteMistake(e.target.value)}
              />
            </label>
            <label className="block space-y-2">
              <span className="inline-flex items-center gap-1.5 text-sm font-medium text-xau-ink">
                Next action
                <HelpTooltip term="noteNextAction" label="About next action" size="sm" placement="above" />
              </span>
              <textarea
                rows={3}
                className="xau-textarea"
                placeholder="What will you do differently?"
                value={noteNextAction}
                onChange={(e) => setNoteNextAction(e.target.value)}
              />
            </label>
          </div>
        </section>

        <section className="xau-form-section">
          <FormSectionHeading title="Trade details" />
          <div className="grid gap-5 sm:grid-cols-2">
            <FormField label="Instrument" tooltipTerm="instrument">
              <input className="xau-field" value="XAUUSD (Gold)" disabled />
            </FormField>
            <FormField label="Date" tooltipTerm="tradeDate">
              <input type="date" className="xau-field" value={date} onChange={(e) => setDate(e.target.value)} />
            </FormField>
            <FormField label="Entry time" tooltipTerm="entryTime">
              <input type="time" className="xau-field" value={entryTime} onChange={(e) => setEntryTime(e.target.value)} />
            </FormField>
            <FormField label="Exit time" hint="Optional" tooltipTerm="exitTime">
              <input type="time" className="xau-field" value={exitTime} onChange={(e) => setExitTime(e.target.value)} />
            </FormField>
            <FormField label="Direction" tooltipTerm="tradeType">
              <select className="xau-select" value={type} onChange={(e) => setType(e.target.value as "Buy" | "Sell")}>
                {tradeTypeOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </FormField>
            <FormField label="Session" tooltipTerm="session">
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
            <FormField label="Net P&amp;L ($)" tooltipTerm="netPnl">
              <input
                type="number"
                step="0.01"
                className="xau-field"
                value={netProfitLoss}
                onChange={(e) => setNetProfitLoss(e.target.value)}
              />
            </FormField>
            <FormField label="R-multiple" hint="e.g. +3R" tooltipTerm="rMultiple">
              <input className="xau-field" value={rMultiple} onChange={(e) => setRMultiple(e.target.value)} />
            </FormField>
          </div>
        </section>

        <section className="xau-form-section">
          <FormSectionHeading title="Prices &amp; excursions" />
          <div className="grid gap-5 sm:grid-cols-2">
            <FormField label="Entry price" tooltipTerm="entryPrice" hint={`Spot XAUUSD, typically ${XAU_SPOT_PRICE_MIN}–${XAU_SPOT_PRICE_MAX.toLocaleString()}`}>
              <input
                type="number"
                step="0.01"
                min={XAU_SPOT_PRICE_MIN}
                max={XAU_SPOT_PRICE_MAX}
                required
                className="xau-field"
                placeholder="e.g. 4448"
                value={entryPrice}
                onChange={(e) => setEntryPrice(e.target.value)}
              />
            </FormField>
            <FormField label="Exit price" tooltipTerm="exitPrice" hint="Leave blank only if still open (use exit time)">
              <input
                type="number"
                step="0.01"
                min={XAU_SPOT_PRICE_MIN}
                max={XAU_SPOT_PRICE_MAX}
                required
                className="xau-field"
                placeholder="e.g. 4430"
                value={exitPrice}
                onChange={(e) => setExitPrice(e.target.value)}
              />
            </FormField>
            <FormField label="MAE ($)" tooltipTerm="mae" hint="Optional — from your platform after close.">
              <input
                type="number"
                step="0.1"
                className="xau-field bg-xau-loss-bg"
                placeholder="Optional"
                value={mae}
                onChange={(e) => setMae(e.target.value)}
              />
            </FormField>
            <FormField label="MFE ($)" tooltipTerm="mfe" hint="Optional — best unrealized profit before exit.">
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
          <FormSectionHeading title="Setup tags &amp; emotion" term="setupTags" />
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
          <FormField label="Emotion during trade" tooltipTerm="emotion">
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
          <FormSectionHeading title="Chart screenshots" term="chartBefore" description="Upload saves into your log (max 2.5 MB). Or paste a public https:// image link." />
                    {chartUploadError && (
            <p className="text-sm text-xau-loss" role="alert">
              {chartUploadError}
            </p>
          )}
          <div className="grid gap-5 md:grid-cols-2">
            <label
              className="space-y-3 rounded-2xl border border-dashed border-xau-border bg-xau-calm p-4"
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                handleFileSelect(e.dataTransfer.files?.[0] || null, "before");
              }}
            >
              <span className="inline-flex items-center gap-1.5 text-sm font-medium text-xau-ink">Before trade<HelpTooltip term="chartBefore" label="About before chart" size="sm" placement="above" /></span>
              <input
                type="file"
                accept="image/*"
                className="block w-full text-xs text-xau-muted file:mr-3 file:rounded-lg file:border-0 file:bg-xau-card file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-xau-ink"
                onChange={(e) => handleFileSelect(e.target.files?.[0] || null, "before")}
              />
              <input
                className="xau-field text-xs"
                placeholder="Or paste https:// image URL"
                value={beforeChartUrl.startsWith("data:") ? "" : beforeChartUrl}
                onChange={(e) => setBeforeChartUrl(e.target.value)}
              />
              {beforeChartUrl && (
                <div className="relative h-32 overflow-hidden rounded-xl bg-xau-app">
                  <ChartImage src={beforeChartUrl} alt="Before preview" />
                </div>
              )}
            </label>
            <label
              className="space-y-3 rounded-2xl border border-dashed border-xau-border bg-xau-profit-bg p-4"
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                handleFileSelect(e.dataTransfer.files?.[0] || null, "after");
              }}
            >
              <span className="inline-flex items-center gap-1.5 text-sm font-medium text-xau-ink">After trade<HelpTooltip term="chartAfter" label="About after chart" size="sm" placement="above" /></span>
              <input
                type="file"
                accept="image/*"
                className="block w-full text-xs text-xau-muted file:mr-3 file:rounded-lg file:border-0 file:bg-xau-card file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-xau-ink"
                onChange={(e) => handleFileSelect(e.target.files?.[0] || null, "after")}
              />
              <input
                className="xau-field text-xs"
                placeholder="Or paste https:// image URL"
                value={afterChartUrl.startsWith("data:") ? "" : afterChartUrl}
                onChange={(e) => setAfterChartUrl(e.target.value)}
              />
              {afterChartUrl && (
                <div className="relative h-32 overflow-hidden rounded-xl bg-xau-app">
                  <ChartImage src={afterChartUrl} alt="After preview" />
                </div>
              )}
            </label>
          </div>
        </section>

        <div className="flex flex-col gap-3 border-t border-xau-border pt-6 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="submit"
            disabled={!canAddMore || saveOverlay !== null}
            className="xau-btn-gold px-8 py-3 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saveOverlay
              ? "Saving…"
              : canAddMore
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
    </>
  );
}
