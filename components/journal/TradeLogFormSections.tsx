"use client";

import { ChartImage } from "@/components/journal/ChartImage";
import { JournalFormPanel } from "@/components/journal/JournalFormPanel";
import { NetPnlField } from "@/components/journal/NetPnlField";
import { RMultipleField } from "@/components/journal/RMultipleField";
import { FormCheckRow, FormField, FormSectionHeading } from "@/components/journal/FormField";
import { HelpTooltip } from "@/components/ui/HelpTooltip";
import { emotionOptions, sessionOptions, tradeTypeOptions, XAU_SPOT_PRICE_MAX, XAU_SPOT_PRICE_MIN } from "@/lib/data";
import {
  JOURNAL_CHARTS,
  JOURNAL_PANEL_A,
  JOURNAL_PANEL_B,
  JOURNAL_PANEL_C,
} from "@/lib/journal-form-copy";
import { sessionSelectLabel } from "@/lib/sessions";
import type { TooltipTerm } from "@/lib/term-tooltips";
import type { SessionType, TradeType } from "@/lib/types";

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
};

function ChartUploadBlock({
  label,
  term,
  chartUrl,
  setChartUrl,
  onChartFile,
  variant,
}: {
  label: string;
  term: TooltipTerm;
  chartUrl: string;
  setChartUrl: (v: string) => void;
  onChartFile: (file: File | null, target: "before" | "after") => void;
  variant: "before" | "after";
}) {
  return (
    <label
      className={`space-y-3 rounded-2xl border border-dashed border-xau-border p-4 ${
        variant === "before" ? "bg-xau-calm" : "bg-xau-profit-bg"
      }`}
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        e.preventDefault();
        onChartFile(e.dataTransfer.files?.[0] || null, variant);
      }}
    >
      <span className="inline-flex items-center gap-1.5 text-sm font-medium text-xau-ink">
        {label}
        <HelpTooltip term={term} label={`About ${label.toLowerCase()}`} size="sm" placement="above" />
      </span>
      <input
        type="file"
        accept="image/*"
        className="block w-full text-xs text-xau-muted file:mr-3 file:rounded-lg file:border-0 file:bg-xau-card file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-xau-ink"
        onChange={(e) => onChartFile(e.target.files?.[0] || null, variant)}
      />
      <input
        className="xau-field text-xs"
        placeholder="Or paste https:// image URL"
        value={chartUrl.startsWith("data:") ? "" : chartUrl}
        onChange={(e) => setChartUrl(e.target.value)}
      />
      {chartUrl ? (
        <div className="relative flex min-h-[10rem] max-h-[26rem] items-center justify-center overflow-hidden rounded-xl bg-xau-app">
          <ChartImage src={chartUrl} alt={`${label} preview`} fit="contain" />
        </div>
      ) : null}
    </label>
  );
}

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
}: TradeLogFormSectionsProps) {
  return (
    <div className="space-y-6">
      <section className="space-y-4 rounded-2xl border border-xau-gold/40 bg-xau-gold-soft/30 p-5">
        <FormSectionHeading title={JOURNAL_CHARTS.title} description={JOURNAL_CHARTS.description} />
        {chartUploadError ? (
          <p className="text-sm text-xau-loss" role="alert">
            {chartUploadError}
          </p>
        ) : null}
        <div className="grid gap-5 md:grid-cols-2">
          <ChartUploadBlock
            label="Before entry"
            term="chartBefore"
            chartUrl={beforeChartUrl}
            setChartUrl={setBeforeChartUrl}
            onChartFile={onChartFile}
            variant="before"
          />
          <ChartUploadBlock
            label="After exit"
            term="chartAfter"
            chartUrl={afterChartUrl}
            setChartUrl={setAfterChartUrl}
            onChartFile={onChartFile}
            variant="after"
          />
        </div>
      </section>

      <JournalFormPanel
        badge={JOURNAL_PANEL_A.badge}
        title={JOURNAL_PANEL_A.title}
        description={JOURNAL_PANEL_A.description}
      >
        <p className="text-xs font-medium text-xau-muted">XAUUSD (Gold)</p>
        <div className="grid gap-5 sm:grid-cols-2">
          <FormField label="Trade date" tooltipTerm="tradeDate">
            <input type="date" className="xau-field" value={date} onChange={(e) => setDate(e.target.value)} />
          </FormField>
          <FormField label="Session" tooltipTerm="session">
            <select className="xau-select" value={session} onChange={(e) => setSession(e.target.value as SessionType)}>
              {sessionOptions.map((option) => (
                <option key={option} value={option}>
                  {sessionSelectLabel(option)}
                </option>
              ))}
            </select>
          </FormField>
          <FormField label="Entry time" tooltipTerm="entryTime">
            <input type="time" className="xau-field" value={entryTime} onChange={(e) => setEntryTime(e.target.value)} />
          </FormField>
          <FormField label="Exit time" hint="Leave blank if still open" tooltipTerm="exitTime">
            <input type="time" className="xau-field" value={exitTime} onChange={(e) => setExitTime(e.target.value)} />
          </FormField>
          <FormField label="Side" tooltipTerm="tradeType">
            <select className="xau-select" value={type} onChange={(e) => setType(e.target.value as TradeType)}>
              {tradeTypeOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </FormField>
          <FormField label="Net P&amp;L ($)" tooltipTerm="netPnlTrade">
            <NetPnlField value={netProfitLoss} onChange={setNetProfitLoss} />
          </FormField>
          <FormField label="R-multiple" hint="Leave blank for +0R" tooltipTerm="rMultiple" className="sm:col-span-2">
            <RMultipleField value={rMultiple} onChange={setRMultiple} />
          </FormField>
        </div>
      </JournalFormPanel>

      <JournalFormPanel
        badge={JOURNAL_PANEL_B.badge}
        title={JOURNAL_PANEL_B.title}
        description={JOURNAL_PANEL_B.description}
      >
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
        <div>
          <p className="mb-2 text-xs font-medium text-xau-muted">Setup (tap all that apply)</p>
          <div className="flex flex-wrap gap-2">
            {setupTagOptions.map((tag) => (
              <button
                type="button"
                key={tag}
                onClick={() => onSetupTagToggle(tag)}
                className={`xau-btn-pill ${setupTags.includes(tag) ? "xau-btn-pill-active" : ""}`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
        <div>
          <p className="mb-2 inline-flex items-center gap-1.5 text-xs font-medium text-xau-muted">
            Emotion
            <HelpTooltip term="emotion" label="About emotion" size="sm" placement="above" />
          </p>
          <div className="flex flex-wrap gap-2">
            {emotionOptions.map((option) => (
              <button
                type="button"
                key={option}
                onClick={() => setEmotion(option)}
                className={`xau-btn-pill px-3 py-1.5 ${emotion === option ? "xau-btn-pill-active" : ""}`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
        <div className="space-y-4 border-t border-xau-border pt-4">
          <p className="text-xs font-medium text-xau-muted">Short notes (min. 3 characters if you start a field)</p>
          <label className="block space-y-2">
            <span className="inline-flex items-center gap-1.5 text-sm font-medium text-xau-ink">
              Why you took the trade
              <HelpTooltip term="noteContext" label="About context" size="sm" placement="above" />
            </span>
            <textarea
              rows={2}
              className="xau-textarea"
              placeholder="e.g. London sweep + BOS, liquidity grab"
              value={noteContext}
              onChange={(e) => setNoteContext(e.target.value)}
            />
          </label>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block space-y-2">
              <span className="inline-flex items-center gap-1.5 text-sm font-medium text-xau-ink">
                Mistake
                <HelpTooltip term="noteMistake" label="About mistake" size="sm" placement="above" />
              </span>
              <textarea
                rows={2}
                className="xau-textarea"
                placeholder='e.g. "none" or early entry'
                value={noteMistake}
                onChange={(e) => setNoteMistake(e.target.value)}
              />
            </label>
            <label className="block space-y-2">
              <span className="inline-flex items-center gap-1.5 text-sm font-medium text-xau-ink">
                Next time
                <HelpTooltip term="noteNextAction" label="About next action" size="sm" placement="above" />
              </span>
              <textarea
                rows={2}
                className="xau-textarea"
                placeholder="One rule for the next trade"
                value={noteNextAction}
                onChange={(e) => setNoteNextAction(e.target.value)}
              />
            </label>
          </div>
        </div>
      </JournalFormPanel>

      <JournalFormPanel
        badge={JOURNAL_PANEL_C.badge}
        title={JOURNAL_PANEL_C.title}
        description={JOURNAL_PANEL_C.description}
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <FormField
            label="Entry price"
            tooltipTerm="entryPrice"
            hint={`Optional · XAU spot ${XAU_SPOT_PRICE_MIN}–${XAU_SPOT_PRICE_MAX.toLocaleString()}`}
          >
            <input
              type="number"
              step="0.01"
              min={XAU_SPOT_PRICE_MIN}
              max={XAU_SPOT_PRICE_MAX}
              className="xau-field"
              placeholder="e.g. 2650"
              value={entryPrice}
              onChange={(e) => setEntryPrice(e.target.value)}
            />
          </FormField>
          <FormField label="Exit price" tooltipTerm="exitPrice" hint="Optional · same range as entry">
            <input
              type="number"
              step="0.01"
              min={XAU_SPOT_PRICE_MIN}
              max={XAU_SPOT_PRICE_MAX}
              className="xau-field"
              placeholder="e.g. 2662"
              value={exitPrice}
              onChange={(e) => setExitPrice(e.target.value)}
            />
          </FormField>
          <FormField label="MAE ($)" tooltipTerm="mae" hint="Max adverse excursion while in trade">
            <input
              type="text"
              inputMode="decimal"
              className="xau-field bg-xau-loss-bg"
              placeholder="Optional"
              value={mae}
              onChange={(e) => setMae(e.target.value.replace(/[^\d.-]/g, ""))}
            />
          </FormField>
          <FormField label="MFE ($)" tooltipTerm="mfe" hint="Max favorable excursion before exit">
            <input
              type="text"
              inputMode="decimal"
              className="xau-field bg-xau-profit-bg"
              placeholder="Optional"
              value={mfe}
              onChange={(e) => setMfe(e.target.value.replace(/[^\d.-]/g, ""))}
            />
          </FormField>
        </div>
      </JournalFormPanel>
    </div>
  );
}
