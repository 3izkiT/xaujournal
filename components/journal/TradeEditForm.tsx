"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
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
} from "@/lib/data";
import type { EmotionType, JournalTrade, SessionType, SetupTag, TradeType } from "@/lib/types";
import { DEFAULT_CHECKLIST } from "@/lib/user-settings";

type Props = {
  trade: JournalTrade;
  onClose: () => void;
  onSaved: () => void;
};

function timeFromIso(iso: string) {
  const d = new Date(iso);
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

export function TradeEditForm({ trade, onClose, onSaved }: Props) {
  const { updateTrade, settings, setupTagOptions } = useXauJournal();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [date, setDate] = useState(trade.date);
  const [entryTime, setEntryTime] = useState(timeFromIso(trade.entryAt));
  const [exitTime, setExitTime] = useState(trade.exitAt ? timeFromIso(trade.exitAt) : "");
  const [type, setType] = useState<TradeType>(trade.type);
  const [netProfitLoss, setNetProfitLoss] = useState(String(trade.netProfitLoss));
  const [rMultiple, setRMultiple] = useState(trade.rMultiple);
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
    setRMultiple(trade.rMultiple);
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
  const score = useMemo(
    () => calculateDisciplineScore({ followedPlan, rrAtLeastOneToTwo, calmMindset }),
    [followedPlan, rrAtLeastOneToTwo, calmMindset]
  );

  const handleSetupTagChange = (tag: string) => {
    setSetupTags((prev) => (prev.includes(tag) ? prev.filter((v) => v !== tag) : [...prev, tag]));
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    setSaving(true);

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
      rMultiple,
      entryPrice: Number(entryPrice),
      exitPrice: Number(exitPrice),
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

    setSaving(false);
    if (!result.ok) {
      setError(result.error ?? "Could not update trade.");
      return;
    }
    onSaved();
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="xau-card-bordered space-y-6 p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-xau-ink">Edit trade</h3>
          <p className="text-sm text-xau-muted">{trade.date} · Discipline {score}%</p>
        </div>
        <button type="button" onClick={onClose} className="text-sm text-xau-muted hover:text-xau-ink">
          Cancel
        </button>
      </div>

      {error && <p className="text-sm text-xau-loss">{error}</p>}

      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label="Date">
          <input type="date" className="xau-field" value={date} onChange={(e) => setDate(e.target.value)} />
        </FormField>
        <FormField label="Direction">
          <select className="xau-select" value={type} onChange={(e) => setType(e.target.value as TradeType)}>
            {tradeTypeOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </FormField>
        <FormField label="Net P&amp;L ($)">
          <input type="number" step="0.01" className="xau-field" value={netProfitLoss} onChange={(e) => setNetProfitLoss(e.target.value)} />
        </FormField>
        <FormField label="Session">
          <select className="xau-select" value={session} onChange={(e) => setSession(e.target.value as SessionType)}>
            {sessionOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </FormField>
        <FormField label="Entry price">
          <input type="number" step="0.01" className="xau-field" value={entryPrice} onChange={(e) => setEntryPrice(e.target.value)} />
        </FormField>
        <FormField label="Exit price">
          <input type="number" step="0.01" className="xau-field" value={exitPrice} onChange={(e) => setExitPrice(e.target.value)} />
        </FormField>
      </div>

      <div className="space-y-2">
        {checklistItems.slice(0, 3).map((item, index) => {
          const checked = index === 0 ? followedPlan : index === 1 ? rrAtLeastOneToTwo : calmMindset;
          const onChange = index === 0 ? setFollowedPlan : index === 1 ? setRrAtLeastOneToTwo : setCalmMindset;
          return (
            <label key={item.id} className="flex items-start gap-3 text-sm text-xau-ink">
              <input type="checkbox" className="mt-0.5" checked={checked} onChange={(e) => onChange(e.target.checked)} />
              {item.label}
            </label>
          );
        })}
      </div>

      <div className="flex flex-wrap gap-2">
        {setupTagOptions.map((tag) => (
          <button
            type="button"
            key={tag}
            onClick={() => handleSetupTagChange(tag)}
            className={`rounded-full px-3 py-1.5 text-xs ${
              setupTags.includes(tag) ? "bg-xau-calm text-xau-ink" : "border border-xau-border text-xau-muted"
            }`}
          >
            {tag}
          </button>
        ))}
      </div>

      <FormField label="Emotion">
        <select className="xau-select" value={emotion} onChange={(e) => setEmotion(e.target.value as EmotionType)}>
          {emotionOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </FormField>

      <textarea rows={2} className="xau-textarea" value={noteContext} onChange={(e) => setNoteContext(e.target.value)} placeholder="Context" />
      <textarea rows={2} className="xau-textarea" value={noteMistake} onChange={(e) => setNoteMistake(e.target.value)} placeholder="Mistake" />
      <textarea rows={2} className="xau-textarea" value={noteNextAction} onChange={(e) => setNoteNextAction(e.target.value)} placeholder="Next action" />

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <p className="mb-2 text-xs font-medium text-xau-ink">Before chart</p>
          <input
            type="file"
            accept="image/*"
            className="mb-2 block w-full text-xs"
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              setBeforeChartUrl(await readImageFileAsDataUrl(file));
            }}
          />
          {beforeChartUrl && (
            <div className="relative h-24 overflow-hidden rounded-xl">
              <ChartImage src={beforeChartUrl} alt="Before" />
            </div>
          )}
        </div>
        <div>
          <p className="mb-2 text-xs font-medium text-xau-ink">After chart</p>
          <input
            type="file"
            accept="image/*"
            className="mb-2 block w-full text-xs"
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              setAfterChartUrl(await readImageFileAsDataUrl(file));
            }}
          />
          {afterChartUrl && (
            <div className="relative h-24 overflow-hidden rounded-xl">
              <ChartImage src={afterChartUrl} alt="After" />
            </div>
          )}
        </div>
      </div>

      <button type="submit" disabled={saving} className="xau-btn-gold px-6 py-2.5 disabled:opacity-60">
        {saving ? "Saving…" : "Save changes"}
      </button>
    </form>
  );
}
