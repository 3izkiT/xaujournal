"use client";

import { ChartImage } from "@/components/journal/ChartImage";
import { FormCheckRow, FormField, FormSectionHeading } from "@/components/journal/FormField";
import { HelpTooltip } from "@/components/ui/HelpTooltip";
import { emotionOptions, sessionOptions, tradeTypeOptions, XAU_SPOT_PRICE_MAX, XAU_SPOT_PRICE_MIN } from "@/lib/data";
import type { TooltipTerm } from "@/lib/term-tooltips";
import type { EmotionType, SessionType, SetupTag, TradeType } from "@/lib/types";

export type DisciplineRowConfig = {
  id: string;
  label: string;
  term: TooltipTerm;
  checked: boolean;
  onChange: (checked: boolean) => void;
};

export type TradeLogFormSectionsProps = {
  disciplineRows: DisciplineRowConfig[];
  disciplineScore: number;
  date: string;
  setDate: (value: string) => void;
  entryTime: string;
  setEntryTime: (value: string) => void;
  exitTime: string;
  setExitTime: (value: string) => void;
  type: TradeType;
  setType: (value: TradeType) => void;
  session: SessionType;
  setSession: (value: SessionType) => void;
  netProfitLoss: string;
  setNetProfitLoss: (value: string) => void;
  rMultiple: string;
  setRMultiple: (value: string) => void;
  entryPrice: string;
  setEntryPrice: (value: string) => void;
  exitPrice: string;
  setExitPrice: (value: string) => void;
  mae: string;
  setMae: (value: string) => void;
  mfe: string;
  setMfe: (value: string) => void;
  setupTagOptions: string[];
  setupTags: string[];
  onSetupTagToggle: (tag: string) => void;
  emotion: string;
  setEmotion: (value: string) => void;
  noteContext: string;
  setNoteContext: (value: string) => void;
  noteMistake: string;
  setNoteMistake: (value: string) => void;
  noteNextAction: string;
  setNoteNextAction: (value: string) => void;
  beforeChartUrl: string;
  setBeforeChartUrl: (value: string) => void;
  afterChartUrl: string;
  setAfterChartUrl: (value: string) => void;
  chartUploadError: string | null;
  onChartFile: (file: File | null, target: "before" | "after") => void;
  /** When true, exit price is optional until exit time is set (edit open trades). */
  exitPriceOptional?: boolean;
};

export function TradeLogFormSections({
  disciplineRows,
  disciplineScore,
  date,
  setDate,
  entryTime,
  setEntryTime,
  exitTime,
  setExitTime,
  type,
  setType,
  session,
  setSession,
  netProfitLoss,
  setNetProfitLoss,
  rMultiple,
  setRMultiple,
  entryPrice,
  setEntryPrice,
  exitPrice,
  setExitPrice,
  mae,
  setMae,
  mfe,
  setMfe,
  setupTagOptions,
  setupTags,
  onSetupTagToggle,
  emotion,
  setEmotion,
  noteContext,
  setNoteContext,
  noteMistake,
  setNoteMistake,
  noteNextAction,
  setNoteNextAction,
  beforeChartUrl,
  setBeforeChartUrl,
  afterChartUrl,
  setAfterChartUrl,
  chartUploadError,
  onChartFile,
  exitPriceOptional = false,
}: TradeLogFormSectionsProps) {
  return (
    <>
      <section className="xau-form-section">
        <FormSectionHeading title="Pre-trade discipline" term="disciplineChecklist" />
        <div className="space-y-3">
          {disciplineRows.map((row) => (
            <FormCheckRow
              key={row.id}
              label={row.label}
              term={row.term}
              checked={row.checked}
              onChange={row.onChange}
            />
          ))}
        </div>
        <p className="inline-flex flex-wrap items-center gap-1.5 rounded-2xl border border-xau-border bg-xau-calm px-4 py-3 text-sm text-xau-ink">
          <span>
            Discipline score: <span className="font-semibold">{disciplineScore}%</span>
          </span>
          <HelpTooltip term="disciplineShort" label="About discipline score" size="sm" placement="above" />
        </p>
      </section>

      <section className="xau-panel-accent space-y-4">
        <FormSectionHeading
          title="Reflection notes"
          term="reflectionNotes"
          description='Optional but recommended — builds discipline. If you fill a field, use at least 3 characters (e.g. "none" for mistakes).'
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
            <input className="xau-field" value="XAUUSD (Gold)" disabled readOnly />
          </FormField>
          <FormField label="Date" tooltipTerm="tradeDate">
            <input type="date" className="xau-field" value={date} onChange={(e) => setDate(e.target.value)} />
          </FormField>
          <FormField label="Entry time" tooltipTerm="entryTime">
            <input type="time" className="xau-field" value={entryTime} onChange={(e) => setEntryTime(e.target.value)} />
          </FormField>
          <FormField label="Exit time" hint="Optional — add when the trade closes" tooltipTerm="exitTime">
            <input type="time" className="xau-field" value={exitTime} onChange={(e) => setExitTime(e.target.value)} />
          </FormField>
          <FormField label="Direction" tooltipTerm="tradeType">
            <select className="xau-select" value={type} onChange={(e) => setType(e.target.value as TradeType)}>
              {tradeTypeOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </FormField>
          <FormField label="Session" tooltipTerm="session">
            <select className="xau-select" value={session} onChange={(e) => setSession(e.target.value as SessionType)}>
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
          <FormField
            label="Entry price"
            tooltipTerm="entryPrice"
            hint={`Spot XAUUSD, typically ${XAU_SPOT_PRICE_MIN}–${XAU_SPOT_PRICE_MAX.toLocaleString()}`}
          >
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
          <FormField
            label="Exit price"
            tooltipTerm="exitPrice"
            hint={
              exitPriceOptional
                ? "Optional until trade closes — can match entry if still open"
                : "Required when trade is closed"
            }
          >
            <input
              type="number"
              step="0.01"
              min={XAU_SPOT_PRICE_MIN}
              max={XAU_SPOT_PRICE_MAX}
              required={!exitPriceOptional || Boolean(exitTime)}
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
              onClick={() => onSetupTagToggle(tag)}
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
        <FormSectionHeading
          title="Chart screenshots"
          term="chartBefore"
          description="Upload saves into your log (max 2.5 MB). Or paste a public https:// image link."
        />
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
              onChartFile(e.dataTransfer.files?.[0] || null, "before");
            }}
          >
            <span className="inline-flex items-center gap-1.5 text-sm font-medium text-xau-ink">
              Before trade
              <HelpTooltip term="chartBefore" label="About before chart" size="sm" placement="above" />
            </span>
            <input
              type="file"
              accept="image/*"
              className="block w-full text-xs text-xau-muted file:mr-3 file:rounded-lg file:border-0 file:bg-xau-card file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-xau-ink"
              onChange={(e) => onChartFile(e.target.files?.[0] || null, "before")}
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
              onChartFile(e.dataTransfer.files?.[0] || null, "after");
            }}
          >
            <span className="inline-flex items-center gap-1.5 text-sm font-medium text-xau-ink">
              After trade
              <HelpTooltip term="chartAfter" label="About after chart" size="sm" placement="above" />
            </span>
            <input
              type="file"
              accept="image/*"
              className="block w-full text-xs text-xau-muted file:mr-3 file:rounded-lg file:border-0 file:bg-xau-card file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-xau-ink"
              onChange={(e) => onChartFile(e.target.files?.[0] || null, "after")}
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
    </>
  );
}
