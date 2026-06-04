"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  DisciplineRowConfig,
  TradeLogFormSections,
} from "@/components/journal/TradeLogFormSections";
import { SavingOverlay, type SavingOverlayPhase } from "@/components/ui/SavingOverlay";
import { useXauJournal } from "@/components/XauJournalContext";
import {
  afterPlaceholder,
  beforePlaceholder,
  readImageFileAsDataUrl,
} from "@/lib/chart-upload";
import { calculateDisciplineScore } from "@/lib/data";
import type { TooltipTerm } from "@/lib/term-tooltips";
import type { EmotionType, JournalTrade, SessionType, SetupTag, TradeType } from "@/lib/types";
import { DEFAULT_CHECKLIST } from "@/lib/user-settings";
import { rMultipleForEdit } from "@/lib/trade-metrics-input";
import { resolveEntryExitPrices, resolveRMultiple } from "@/lib/resolve-trade-fields";
import { validateTradeNotes } from "@/lib/validate-trade";

type Props = {
  trade: JournalTrade;
  onClose: () => void;
  onSaved: () => void;
};

function timeFromIso(iso: string) {
  const d = new Date(iso);
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

const DISCIPLINE_TERMS: TooltipTerm[] = ["followedPlan", "riskRewardRule", "calmMindsetRule"];

export function TradeEditForm({ trade, onClose, onSaved }: Props) {
  const { updateTrade, settings, setupTagOptions } = useXauJournal();
  const [saveOverlay, setSaveOverlay] = useState<SavingOverlayPhase | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [chartUploadError, setChartUploadError] = useState<string | null>(null);
  const [date, setDate] = useState(trade.date);
  const [entryTime, setEntryTime] = useState(timeFromIso(trade.entryAt));
  const [exitTime, setExitTime] = useState(trade.exitAt ? timeFromIso(trade.exitAt) : "");
  const [type, setType] = useState<TradeType>(trade.type);
  const [netProfitLoss, setNetProfitLoss] = useState(String(trade.netProfitLoss));
  const [rMultiple, setRMultiple] = useState(rMultipleForEdit(trade.rMultiple));
  const [entryPrice, setEntryPrice] = useState(String(trade.entryPrice));
  const [exitPrice, setExitPrice] = useState(String(trade.exitPrice));
  const [mae, setMae] = useState(trade.mae != null ? String(trade.mae) : "");
  const [mfe, setMfe] = useState(trade.mfe != null ? String(trade.mfe) : "");
  const [session, setSession] = useState<SessionType>(trade.session);
  const [setupTags, setSetupTags] = useState<string[]>(trade.setupTags);
  const [emotion, setEmotion] = useState<EmotionType>(trade.emotion);
  const [beforeChartUrl, setBeforeChartUrl] = useState(trade.beforeChartUrl);
  const [afterChartUrl, setAfterChartUrl] = useState(trade.afterChartUrl);
  const [followedPlan, setFollowedPlan] = useState(trade.disciplineChecklist.followedPlan);
  const [rrAtLeastOneToTwo, setRrAtLeastOneToTwo] = useState(trade.disciplineChecklist.rrAtLeastOneToTwo);
  const [calmMindset, setCalmMindset] = useState(trade.disciplineChecklist.calmMindset);
  const [noteContext, setNoteContext] = useState(trade.noteContext);
  const [noteMistake, setNoteMistake] = useState(trade.noteMistake);
  const [noteNextAction, setNoteNextAction] = useState(trade.noteNextAction);

  useEffect(() => {
    setDate(trade.date);
    setEntryTime(timeFromIso(trade.entryAt));
    setExitTime(trade.exitAt ? timeFromIso(trade.exitAt) : "");
    setType(trade.type);
    setNetProfitLoss(String(trade.netProfitLoss));
    setRMultiple(rMultipleForEdit(trade.rMultiple));
    setEntryPrice(String(trade.entryPrice));
    setExitPrice(String(trade.exitPrice));
    setMae(trade.mae != null ? String(trade.mae) : "");
    setMfe(trade.mfe != null ? String(trade.mfe) : "");
    setSession(trade.session);
    setSetupTags(trade.setupTags);
    setEmotion(trade.emotion);
    setBeforeChartUrl(trade.beforeChartUrl);
    setAfterChartUrl(trade.afterChartUrl);
    setFollowedPlan(trade.disciplineChecklist.followedPlan);
    setRrAtLeastOneToTwo(trade.disciplineChecklist.rrAtLeastOneToTwo);
    setCalmMindset(trade.disciplineChecklist.calmMindset);
    setNoteContext(trade.noteContext);
    setNoteMistake(trade.noteMistake);
    setNoteNextAction(trade.noteNextAction);
  }, [trade]);

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
    setError(null);

    const noteError = validateTradeNotes({ noteContext, noteMistake, noteNextAction });
    if (noteError) {
      setError(noteError);
      return;
    }

    const prices = resolveEntryExitPrices(entryPrice, exitPrice);
    if (prices.error) {
      setError(prices.error);
      return;
    }

    setSaveOverlay("saving");

    const entryAt = new Date(`${date}T${entryTime}:00`).toISOString();
    const exitAt = exitTime ? new Date(`${date}T${exitTime}:00`).toISOString() : null;
    let holdTimeMinutes: number | null = null;
    if (exitAt) {
      holdTimeMinutes = Math.max(0, Math.round((new Date(exitAt).getTime() - new Date(entryAt).getTime()) / 60000));
    }

    const result = await updateTrade(trade.id, {
      date,
      entryAt,
      exitAt,
      holdTimeMinutes,
      type,
      netProfitLoss: Number(netProfitLoss),
      rMultiple: resolveRMultiple(rMultiple),
      entryPrice: prices.entry,
      exitPrice: prices.exit,
      mae: mae !== "" ? Number(mae) : null,
      mfe: mfe !== "" ? Number(mfe) : null,
      session,
      setupTags: setupTags as SetupTag[],
      emotion,
      beforeChartUrl: beforeChartUrl.trim() || beforePlaceholder,
      afterChartUrl: afterChartUrl.trim() || afterPlaceholder,
      disciplineChecklist: { followedPlan, rrAtLeastOneToTwo, calmMindset },
      noteContext,
      noteMistake,
      noteNextAction,
    });

    if (!result.ok) {
      setSaveOverlay(null);
      setError(result.error ?? "Could not update trade.");
      return;
    }

    setSaveOverlay("success");
    await new Promise((resolve) => setTimeout(resolve, 700));
    onSaved();
    onClose();
  };

  return (
    <>
      <SavingOverlay
        open={saveOverlay !== null}
        phase={saveOverlay ?? "saving"}
        title={saveOverlay === "success" ? "Changes saved" : "Updating your trade log"}
        subtitle={
          saveOverlay === "success"
            ? "Refreshing your trade details…"
            : "Saving discipline score, charts, and notes…"
        }
      />
      <form onSubmit={handleSubmit} className="xau-page-form">
        <div className="xau-card-bordered flex flex-wrap items-start justify-between gap-4 p-6">
          <div>
            <h3 className="text-lg font-semibold text-xau-ink">Edit trade log</h3>
            <p className="mt-1 text-sm text-xau-muted">
              Same A / B / C panels as a new log — add exit, P&amp;L, and charts when the trade is done.
              the entry.
            </p>
          </div>
          <button type="button" onClick={onClose} className="text-sm text-xau-muted hover:text-xau-ink">
            Cancel
          </button>
        </div>

        {error && (
          <div className="rounded-2xl border border-xau-border bg-xau-rose px-4 py-3 text-sm text-xau-loss">{error}</div>
        )}

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
            disabled={saveOverlay !== null}
            className="xau-btn-gold px-8 py-3 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saveOverlay ? "Saving…" : "Save changes"}
          </button>
        </div>
      </form>
    </>
  );
}
