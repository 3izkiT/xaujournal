"use client";

import { ChartImage } from "@/components/journal/ChartImage";
import { FormCollapsible } from "@/components/journal/FormCollapsible";
import { NetPnlField } from "@/components/journal/NetPnlField";
import { RMultipleField } from "@/components/journal/RMultipleField";
import { FormCheckRow, FormField, FormSectionHeading } from "@/components/journal/FormField";
import { HelpTooltip } from "@/components/ui/HelpTooltip";
import { emotionOptions, sessionOptions, tradeTypeOptions, XAU_SPOT_PRICE_MAX, XAU_SPOT_PRICE_MIN } from "@/lib/data";
import { JOURNAL_SECTIONS } from "@/lib/journal-form-copy";
import { SESSION_SELECT_HINT, sessionSelectLabel } from "@/lib/sessions";
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
    <div className="space-y-6">
      {/* 1 — When & what */}
      <section className="xau-form-section space-y-4">
        <FormSectionHeading
          title={JOURNAL_SECTIONS.trade.title}
          description={JOURNAL_SECTIONS.trade.description}
        />
        <p className="inline-flex rounded-full border border-xau-border bg-xau-calm px-3 py-1 text-xs font-medium text-xau-ink">
          XAUUSD (Gold)
        </p>
        <div className="grid gap-5 sm:grid-cols-2">
          <FormField label="วันที่เทรด" tooltipTerm="tradeDate">
            <input type="date" className="xau-field" value={date} onChange={(e) => setDate(e.target.value)} />
          </FormField>
          <FormField label="Session" hint={SESSION_SELECT_HINT} tooltipTerm="session">
            <select className="xau-select" value={session} onChange={(e) => setSession(e.target.value as SessionType)}>
              {sessionOptions.map((option) => (
                <option key={option} value={option}>
                  {sessionSelectLabel(option)}
                </option>
              ))}
            </select>
          </FormField>
          <FormField label="เวลาเข้า" tooltipTerm="entryTime">
            <input type="time" className="xau-field" value={entryTime} onChange={(e) => setEntryTime(e.target.value)} />
          </FormField>
          <FormField label="เวลาออก" hint="ว่างได้ถ้ายังไม่ปิด" tooltipTerm="exitTime">
            <input type="time" className="xau-field" value={exitTime} onChange={(e) => setExitTime(e.target.value)} />
          </FormField>
          <FormField label="ทิศทาง" tooltipTerm="tradeType">
            <select className="xau-select" value={type} onChange={(e) => setType(e.target.value as TradeType)}>
              {tradeTypeOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </FormField>
        </div>
      </section>

      {/* 2 — Outcome */}
      <section className="xau-form-section space-y-4">
        <FormSectionHeading
          title={JOURNAL_SECTIONS.outcome.title}
          description={JOURNAL_SECTIONS.outcome.description}
        />
        <div className="grid gap-5 sm:grid-cols-2">
          <FormField label="กำไร / ขาดทุน ($)" tooltipTerm="netPnlTrade">
            <NetPnlField value={netProfitLoss} onChange={setNetProfitLoss} />
          </FormField>
          <FormField label="R-multiple" tooltipTerm="rMultiple">
            <RMultipleField value={rMultiple} onChange={setRMultiple} />
          </FormField>
          <FormField
            label="ราคาเข้า"
            tooltipTerm="entryPrice"
            hint={`XAUUSD โดยทั่วไป ${XAU_SPOT_PRICE_MIN}–${XAU_SPOT_PRICE_MAX.toLocaleString()}`}
          >
            <input
              type="number"
              step="0.01"
              min={XAU_SPOT_PRICE_MIN}
              max={XAU_SPOT_PRICE_MAX}
              required
              className="xau-field"
              placeholder="เช่น 2650"
              value={entryPrice}
              onChange={(e) => setEntryPrice(e.target.value)}
            />
          </FormField>
          <FormField
            label="ราคาออก"
            tooltipTerm="exitPrice"
            hint={
              exitPriceOptional
                ? "ไม่บังคับจนกว่าจะปิดออเดอร์"
                : "กรอกเมื่อปิดออเดอร์แล้ว"
            }
          >
            <input
              type="number"
              step="0.01"
              min={XAU_SPOT_PRICE_MIN}
              max={XAU_SPOT_PRICE_MAX}
              required={!exitPriceOptional || Boolean(exitTime)}
              className="xau-field"
              placeholder="เช่น 2662"
              value={exitPrice}
              onChange={(e) => setExitPrice(e.target.value)}
            />
          </FormField>
        </div>
      </section>

      {/* 3 — Discipline */}
      <section className="xau-form-section space-y-4">
        <FormSectionHeading
          title={JOURNAL_SECTIONS.discipline.title}
          term="disciplineChecklist"
          description={JOURNAL_SECTIONS.discipline.description}
        />
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
            คะแนนวินัย: <span className="font-semibold">{disciplineScore}%</span>
          </span>
          <HelpTooltip term="disciplineShort" label="About discipline score" size="sm" placement="above" />
        </p>
      </section>

      {/* 4 — Setup & emotion */}
      <section className="xau-form-section space-y-4">
        <FormSectionHeading
          title={JOURNAL_SECTIONS.context.title}
          term="setupTags"
          description={JOURNAL_SECTIONS.context.description}
        />
        <div>
          <p className="mb-2 text-xs font-medium text-xau-muted">เซ็ตอัป (เลือกได้หลายอัน)</p>
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
        </div>
        <div>
          <p className="mb-2 inline-flex items-center gap-1.5 text-xs font-medium text-xau-muted">
            อารมณ์ตอนเทรด
            <HelpTooltip term="emotion" label="About emotion" size="sm" placement="above" />
          </p>
          <div className="flex flex-wrap gap-2">
            {emotionOptions.map((option) => (
              <button
                type="button"
                key={option}
                onClick={() => setEmotion(option)}
                className={`rounded-full px-3 py-1.5 text-sm transition ${
                  emotion === option
                    ? "bg-xau-calm font-medium text-xau-ink"
                    : "border border-xau-border bg-xau-app text-xau-muted hover:text-xau-ink"
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 5 — Reflection */}
      <section className="xau-panel-accent space-y-4">
        <FormSectionHeading
          title={JOURNAL_SECTIONS.notes.title}
          term="reflectionNotes"
          description={JOURNAL_SECTIONS.notes.description}
        />
        <label className="block space-y-2">
          <span className="inline-flex items-center gap-1.5 text-sm font-medium text-xau-ink">
            ทำไมถึงเข้า / เกิดอะไรขึ้น
            <HelpTooltip term="noteContext" label="About context" size="sm" placement="above" />
          </span>
          <textarea
            rows={2}
            className="xau-textarea"
            placeholder="เช่น London sweep + BOS, ตามแผน liquidity"
            value={noteContext}
            onChange={(e) => setNoteContext(e.target.value)}
          />
        </label>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block space-y-2">
            <span className="inline-flex items-center gap-1.5 text-sm font-medium text-xau-ink">
              ผิดพลาด
              <HelpTooltip term="noteMistake" label="About mistake" size="sm" placement="above" />
            </span>
            <textarea
              rows={2}
              className="xau-textarea"
              placeholder='none หรือ "เข้าเร็วเกิน"'
              value={noteMistake}
              onChange={(e) => setNoteMistake(e.target.value)}
            />
          </label>
          <label className="block space-y-2">
            <span className="inline-flex items-center gap-1.5 text-sm font-medium text-xau-ink">
              ครั้งหน้าทำอย่างไร
              <HelpTooltip term="noteNextAction" label="About next action" size="sm" placement="above" />
            </span>
            <textarea
              rows={2}
              className="xau-textarea"
              placeholder="กฎเดียวที่จะทำต่อไม้ถัดไป"
              value={noteNextAction}
              onChange={(e) => setNoteNextAction(e.target.value)}
            />
          </label>
        </div>
      </section>

      {/* Optional — MAE/MFE */}
      <FormCollapsible
        title={JOURNAL_SECTIONS.advanced.title}
        description={JOURNAL_SECTIONS.advanced.description}
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <FormField label="MAE ($)" tooltipTerm="mae" hint="ขาดทุนลอยสูงสุดระหว่างถือ">
            <input
              type="text"
              inputMode="decimal"
              className="xau-field bg-xau-loss-bg"
              placeholder="ไม่บังคับ"
              value={mae}
              onChange={(e) => setMae(e.target.value.replace(/[^\d.-]/g, ""))}
            />
          </FormField>
          <FormField label="MFE ($)" tooltipTerm="mfe" hint="กำไรลอยสูงสุดก่อนปิด">
            <input
              type="text"
              inputMode="decimal"
              className="xau-field bg-xau-profit-bg"
              placeholder="ไม่บังคับ"
              value={mfe}
              onChange={(e) => setMfe(e.target.value.replace(/[^\d.-]/g, ""))}
            />
          </FormField>
        </div>
      </FormCollapsible>

      {/* Optional — Charts */}
      <FormCollapsible title={JOURNAL_SECTIONS.charts.title} description={JOURNAL_SECTIONS.charts.description}>
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
              ก่อนเข้า
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
              placeholder="หรือวางลิงก์ https://"
              value={beforeChartUrl.startsWith("data:") ? "" : beforeChartUrl}
              onChange={(e) => setBeforeChartUrl(e.target.value)}
            />
            {beforeChartUrl && (
              <div className="relative flex min-h-[8rem] max-h-[22rem] items-center justify-center overflow-hidden rounded-xl bg-xau-app">
                <ChartImage src={beforeChartUrl} alt="Before preview" fit="contain" />
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
              หลังปิด
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
              placeholder="หรือวางลิงก์ https://"
              value={afterChartUrl.startsWith("data:") ? "" : afterChartUrl}
              onChange={(e) => setAfterChartUrl(e.target.value)}
            />
            {afterChartUrl && (
              <div className="relative flex min-h-[8rem] max-h-[22rem] items-center justify-center overflow-hidden rounded-xl bg-xau-app">
                <ChartImage src={afterChartUrl} alt="After preview" fit="contain" />
              </div>
            )}
          </label>
        </div>
      </FormCollapsible>
    </div>
  );
}
