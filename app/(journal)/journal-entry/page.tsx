"use client";

import { FormEvent, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { TradeLogFormSections } from "@/components/journal/TradeLogFormSections";
import type { DisciplineRowConfig } from "@/components/journal/TradeLogFormSections";

import { SavingOverlay, type SavingOverlayPhase } from "@/components/ui/SavingOverlay";
import { useXauJournal } from "@/components/XauJournalContext";
import {
  afterPlaceholder,
  beforePlaceholder,
  readImageFileAsDataUrl,
} from "@/lib/chart-upload";
import {
  calculateDisciplineScore,
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

  const disciplineRows: DisciplineRowConfig[] = useMemo(
    () => [
      {
        id: "followed-plan",
        label: "Did I follow my strict trading plan/strategy?",
        term: "followedPlan",
        checked: followedPlan,
        onChange: setFollowedPlan,
      },
      {
        id: "rr-1-2",
        label: "Is my Risk-to-Reward ratio at least 1:2?",
        term: "riskRewardRule",
        checked: rrAtLeastOneToTwo,
        onChange: setRrAtLeastOneToTwo,
      },
      {
        id: "calm-mindset",
        label: "Is my mindset completely calm and free of FOMO?",
        term: "calmMindsetRule",
        checked: calmMindset,
        onChange: setCalmMindset,
      },
    ],
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
        <TradeLogFormSections
          disciplineRows={disciplineRows}
          disciplineScore={score}
          date={date}
          setDate={setDate}
          entryTime={entryTime}
          setEntryTime={setEntryTime}
          exitTime={exitTime}
          setExitTime={setExitTime}
          type={type}
          setType={setType}
          session={session}
          setSession={setSession}
          netProfitLoss={netProfitLoss}
          setNetProfitLoss={setNetProfitLoss}
          rMultiple={rMultiple}
          setRMultiple={setRMultiple}
          entryPrice={entryPrice}
          setEntryPrice={setEntryPrice}
          exitPrice={exitPrice}
          setExitPrice={setExitPrice}
          mae={mae}
          setMae={setMae}
          mfe={mfe}
          setMfe={setMfe}
          setupTagOptions={setupTagOptions}
          setupTags={setupTags}
          onSetupTagToggle={handleSetupTagChange}
          emotion={emotion}
          setEmotion={setEmotion}
          noteContext={noteContext}
          setNoteContext={setNoteContext}
          noteMistake={noteMistake}
          setNoteMistake={setNoteMistake}
          noteNextAction={noteNextAction}
          setNoteNextAction={setNoteNextAction}
          beforeChartUrl={beforeChartUrl}
          setBeforeChartUrl={setBeforeChartUrl}
          afterChartUrl={afterChartUrl}
          setAfterChartUrl={setAfterChartUrl}
          chartUploadError={chartUploadError}
          onChartFile={handleFileSelect}
        />

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
