"use client";

import { FormEvent, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  DisciplineRowConfig,
  TradeLogFormSections,
} from "@/components/journal/TradeLogFormSections";
import { useXauJournal } from "@/components/XauJournalContext";
import {
  afterPlaceholder,
  beforePlaceholder,
  readImageFileAsDataUrl,
} from "@/lib/chart-upload";
import { calculateDisciplineScore, sessionOptions, XAU_SPOT_PRICE_MAX, XAU_SPOT_PRICE_MIN } from "@/lib/data";
import { JOURNAL_FORM_INTRO } from "@/lib/journal-form-copy";
import { isOpenAccessActive, PAYMENTS_ENABLED } from "@/lib/monetization";
import { FREE_TRADE_LIMIT } from "@/lib/plans";
import { formatRMultipleStored } from "@/lib/trade-metrics-input";
import type { TooltipTerm } from "@/lib/term-tooltips";
import type { EmotionType, SessionType, SetupTag, TradeType } from "@/lib/types";
import { DEFAULT_CHECKLIST } from "@/lib/user-settings";

const DISCIPLINE_TERMS: TooltipTerm[] = ["followedPlan", "riskRewardRule", "calmMindsetRule"];

export default function JournalEntryPage() {
  const router = useRouter();
  const { addTrade, canAddMore, tradeCount, tradeLimit, plan, settings, setupTagOptions } = useXauJournal();
  const [saving, setSaving] = useState(false);
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [entryTime, setEntryTime] = useState("13:00");
  const [exitTime, setExitTime] = useState("");
  const [type, setType] = useState<TradeType>("Buy");
  const [netProfitLoss, setNetProfitLoss] = useState("0");
  const [rMultiple, setRMultiple] = useState("+2");
  const [entryPrice, setEntryPrice] = useState("");
  const [exitPrice, setExitPrice] = useState("");
  const [mae, setMae] = useState("");
  const [mfe, setMfe] = useState("");
  const [session, setSession] = useState<SessionType>(sessionOptions[0]);
  const [setupTags, setSetupTags] = useState<string[]>([]);
  const [emotion, setEmotion] = useState<EmotionType>("Calm");
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
  const disciplineScore = useMemo(
    () => calculateDisciplineScore({ followedPlan, rrAtLeastOneToTwo, calmMindset }),
    [followedPlan, rrAtLeastOneToTwo, calmMindset]
  );

  const disciplineRows: DisciplineRowConfig[] = useMemo(() => {
    const handlers = [setFollowedPlan, setRrAtLeastOneToTwo, setCalmMindset];
    const checked = [followedPlan, rrAtLeastOneToTwo, calmMindset];
    return checklistItems.slice(0, 3).map((item, index) => ({
      id: item.id,
      label: item.label,
      term: DISCIPLINE_TERMS[index] ?? "followedPlan",
      checked: checked[index] ?? false,
      onChange: handlers[index] ?? setFollowedPlan,
    }));
  }, [checklistItems, followedPlan, rrAtLeastOneToTwo, calmMindset]);

  const openAccess = isOpenAccessActive();
  const limitLabel = openAccess
    ? `${tradeCount} logs · Full access`
    : tradeLimit != null
      ? `${tradeCount}/${tradeLimit} logs`
      : `${tradeCount} logs (Premium)`;

  const handleSetupTagToggle = (tag: string) => {
    setSetupTags((prev) => (prev.includes(tag) ? prev.filter((v) => v !== tag) : [...prev, tag]));
  };

  const handleChartFile = async (file: File | null, target: "before" | "after") => {
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

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!canAddMore) return;
    setSubmitError(null);

    const entry = Number(entryPrice);
    const exit = Number(exitPrice);
    if (!Number.isFinite(entry) || entry < XAU_SPOT_PRICE_MIN || entry > XAU_SPOT_PRICE_MAX) {
      setSubmitError(`กรอกราคาเข้าให้ถูกต้อง (${XAU_SPOT_PRICE_MIN}–${XAU_SPOT_PRICE_MAX})`);
      return;
    }
    if (!Number.isFinite(exit) || exit < XAU_SPOT_PRICE_MIN || exit > XAU_SPOT_PRICE_MAX) {
      setSubmitError(`กรอกราคาออกให้ถูกต้อง (${XAU_SPOT_PRICE_MIN}–${XAU_SPOT_PRICE_MAX})`);
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
      rMultiple: formatRMultipleStored(rMultiple),
      entryPrice: entry,
      exitPrice: exit,
      mae: mae !== "" ? Number(mae) : null,
      mfe: mfe !== "" ? Number(mfe) : null,
      session,
      setupTags: setupTags as SetupTag[],
      emotion,
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

  return (
    <div className="xau-page-form">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-xau-ink md:text-3xl">บันทึกเทรด</h1>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-xau-muted">{JOURNAL_FORM_INTRO}</p>
        </div>
        <div className="shrink-0 rounded-2xl border border-xau-gold bg-xau-gold-soft px-4 py-2 text-sm text-xau-ink">
          {openAccess ? "Early access · " : plan === "PREMIUM_GOLD" ? "Premium · " : "Free · "}
          {limitLabel}
        </div>
      </header>

      {submitError && (
        <div className="rounded-2xl border border-xau-border bg-xau-rose px-4 py-3 text-sm text-xau-loss">{submitError}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <TradeLogFormSections
          disciplineRows={disciplineRows}
          disciplineScore={disciplineScore}
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
          onSetupTagToggle={handleSetupTagToggle}
          emotion={emotion}
          setEmotion={(v) => setEmotion(v as EmotionType)}
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
          onChartFile={handleChartFile}
        />

        <div className="flex flex-col gap-3 border-t border-xau-border pt-6 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="submit"
            disabled={!canAddMore || saving}
            className="xau-btn-gold px-8 py-3 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving
              ? "กำลังบันทึก…"
              : canAddMore
                ? "บันทึกเทรด"
                : PAYMENTS_ENABLED
                  ? `อัปเกรดเพื่อบันทึกเกิน ${FREE_TRADE_LIMIT} ไม้`
                  : "ถึงลิมิตบันทึกแล้ว"}
          </button>
          {!canAddMore && PAYMENTS_ENABLED && (
            <p className="text-sm text-xau-muted">
              <Link href="/pricing" className="font-medium text-xau-ink underline-offset-2 hover:underline">
                ดูแพ็กเกจ
              </Link>
            </p>
          )}
        </div>
      </form>
    </div>
  );
}
