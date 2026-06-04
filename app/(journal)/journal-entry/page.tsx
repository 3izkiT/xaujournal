"use client";

import { FormEvent, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChartImage } from "@/components/journal/ChartImage";
import { FormField } from "@/components/journal/FormField";
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
  tradeTypeOptions,
  XAU_SPOT_PRICE_MAX,
  XAU_SPOT_PRICE_MIN,
} from "@/lib/data";
import { DEFAULT_CHECKLIST } from "@/lib/user-settings";
import type { EmotionType, SessionType, SetupTag } from "@/lib/types";
import { isOpenAccessActive, PAYMENTS_ENABLED } from "@/lib/monetization";
import { FREE_TRADE_LIMIT } from "@/lib/plans";

export default function JournalEntryPage() {
  const router = useRouter();
  const { addTrade, canAddMore, tradeCount, tradeLimit, plan, settings, setupTagOptions, settingsLoading } = useXauJournal();
  const [saving, setSaving] = useState(false);
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

  const checklistItems = settings.customChecklist.length > 0 ? settings.customChecklist : DEFAULT_CHECKLIST;

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

    setSaving(true);
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
      session: session as SessionType,
      setupTags: setupTags as SetupTag[],
      emotion: emotion as EmotionType,
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

    setSaving(false);

    if (!result.ok) {
      setSubmitError(result.error ?? "Could not save trade.");
      return;
    }

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
          {settingsLoading ? (
            <p className="text-sm text-xau-muted">Loading your checklist…</p>
          ) : (
            <div className="space-y-3">
              {checklistItems.slice(0, 3).map((item, index) => {
                const checked = index === 0 ? followedPlan : index === 1 ? rrAtLeastOneToTwo : calmMindset;
                const onChange =
                  index === 0 ? setFollowedPlan : index === 1 ? setRrAtLeastOneToTwo : setCalmMindset;
                return (
                  <label key={item.id} className="flex items-start gap-3 text-sm text-xau-ink">
                    <input type="checkbox" className="mt-0.5" checked={checked} onChange={(e) => onChange(e.target.checked)} />
                    {item.label}
                  </label>
                );
              })}
            </div>
          )}
          <p className="rounded-2xl border border-xau-border bg-xau-calm px-4 py-3 text-sm text-xau-ink">
            Discipline score: <span className="font-semibold">{score}%</span>
          </p>
        </section>

        <section className="xau-panel-accent">
          <div>
            <h2 className="text-lg font-medium text-xau-ink">Reflection notes</h2>
            <p className="mt-1 text-xs leading-relaxed text-xau-muted">
              Optional but recommended — builds discipline. If you fill a field, use at least 3 characters (e.g.
              &quot;none&quot; for mistakes).
            </p>
          </div>
          <div className="space-y-4">
            <textarea
              rows={3}
              className="xau-textarea"
              placeholder="Context: What was the market telling you?"
              value={noteContext}
              onChange={(e) => setNoteContext(e.target.value)}
            />
            <textarea
              rows={3}
              className="xau-textarea"
              placeholder="Mistake: What went wrong (or 'none')?"
              value={noteMistake}
              onChange={(e) => setNoteMistake(e.target.value)}
            />
            <textarea
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
            <FormField label="Entry price" hint={`Spot XAUUSD, typically ${XAU_SPOT_PRICE_MIN}–${XAU_SPOT_PRICE_MAX.toLocaleString()}`}>
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
            <FormField label="Exit price" hint="Leave blank only if still open (use exit time)">
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
            <FormField
              label="MAE ($)"
              hint="Maximum Adverse Excursion — worst unrealized loss ($) while the trade was open. Optional; fill after close from your platform."
            >
              <input
                type="number"
                step="0.1"
                className="xau-field bg-xau-loss-bg"
                placeholder="Optional"
                value={mae}
                onChange={(e) => setMae(e.target.value)}
              />
            </FormField>
            <FormField
              label="MFE ($)"
              hint="Maximum Favorable Excursion — best unrealized profit ($) before exit. Optional."
            >
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
          <p className="text-xs text-xau-muted">
            Upload saves into your log (max 2.5 MB). Or paste a public https:// image link. Leave empty for a placeholder.
          </p>
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
              <span className="block text-sm font-medium text-xau-ink">Before trade</span>
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
              <span className="block text-sm font-medium text-xau-ink">After trade</span>
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
            disabled={!canAddMore || saving}
            className="xau-btn-gold px-8 py-3 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving
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
  );
}
