"use client";

import { FormEvent, useMemo, useState } from "react";
import { useXauJournal } from "@/components/XauJournalContext";
import {
  calculateDisciplineScore,
  emotionOptions,
  sessionOptions,
  setupTagOptions,
  tradeTypeOptions,
} from "@/lib/data";

export default function JournalEntryPage() {
  const { addTrade, trades } = useXauJournal();
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [type, setType] = useState<"Buy" | "Sell">("Buy");
  const [netProfitLoss, setNetProfitLoss] = useState("0");
  const [rMultiple, setRMultiple] = useState("+2R");
  const [entryPrice, setEntryPrice] = useState("2380");
  const [exitPrice, setExitPrice] = useState("2388");
  const [session, setSession] = useState(sessionOptions[0]);
  const [setupTags, setSetupTags] = useState<string[]>(["Liquidity Sweep"]);
  const [emotion, setEmotion] = useState("Calm");
  const [beforeChartUrl, setBeforeChartUrl] = useState("");
  const [afterChartUrl, setAfterChartUrl] = useState("");
  const [followedPlan, setFollowedPlan] = useState(true);
  const [rrAtLeastOneToTwo, setRrAtLeastOneToTwo] = useState(true);
  const [calmMindset, setCalmMindset] = useState(true);

  const score = useMemo(
    () => calculateDisciplineScore({ followedPlan, rrAtLeastOneToTwo, calmMindset }),
    [followedPlan, rrAtLeastOneToTwo, calmMindset]
  );

  const logLimit = 10;
  const canAdd = trades.length < logLimit;

  const handleSetupTagChange = (tag: string) => {
    setSetupTags((prev) => (prev.includes(tag) ? prev.filter((v) => v !== tag) : [...prev, tag]));
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!canAdd) return;

    addTrade({
      date,
      type,
      netProfitLoss: Number(netProfitLoss),
      rMultiple,
      entryPrice: Number(entryPrice),
      exitPrice: Number(exitPrice),
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
    });
  };

  const handleFileSelect = (file: File | null, target: "before" | "after") => {
    if (!file) return;
    const localUrl = URL.createObjectURL(file);
    if (target === "before") setBeforeChartUrl(localUrl);
    else setAfterChartUrl(localUrl);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-3xl font-semibold text-slate-900">Journal Entry</h2>
          <p className="mt-2 text-sm text-slate-500">Complete the discipline checklist before logging each XAUUSD trade.</p>
        </div>
        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-2 text-sm text-amber-700">
          Free tier limit: {trades.length}/{logLimit} logs
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <section className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
          <h3 className="text-lg font-medium text-slate-900">Pre-Trade Discipline Checklist</h3>
          <div className="mt-4 space-y-3">
            <label className="flex items-center gap-3 text-sm text-slate-700">
              <input type="checkbox" checked={followedPlan} onChange={(e) => setFollowedPlan(e.target.checked)} />
              Did I follow my strict trading plan/strategy?
            </label>
            <label className="flex items-center gap-3 text-sm text-slate-700">
              <input
                type="checkbox"
                checked={rrAtLeastOneToTwo}
                onChange={(e) => setRrAtLeastOneToTwo(e.target.checked)}
              />
              Is my Risk-to-Reward ratio at least 1:2?
            </label>
            <label className="flex items-center gap-3 text-sm text-slate-700">
              <input type="checkbox" checked={calmMindset} onChange={(e) => setCalmMindset(e.target.checked)} />
              Is my mindset completely calm and free of FOMO?
            </label>
          </div>
          <div className="mt-4 rounded-2xl border border-sky-200 bg-sky-50 px-4 py-3 text-sm text-sky-700">
            Discipline Score: <span className="font-semibold">{score}%</span>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2">
          <input className="rounded-2xl border border-slate-200 px-4 py-3" value="XAUUSD (Gold)" disabled />
          <input
            type="date"
            className="rounded-2xl border border-slate-200 px-4 py-3"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
          <select className="rounded-2xl border border-slate-200 px-4 py-3" value={type} onChange={(e) => setType(e.target.value as "Buy" | "Sell")}>
            {tradeTypeOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <input
            type="number"
            step="0.01"
            className="rounded-2xl border border-slate-200 px-4 py-3"
            placeholder="Net Profit/Loss ($)"
            value={netProfitLoss}
            onChange={(e) => setNetProfitLoss(e.target.value)}
          />
          <input
            className="rounded-2xl border border-slate-200 px-4 py-3"
            placeholder="R-Multiple (e.g. +3R)"
            value={rMultiple}
            onChange={(e) => setRMultiple(e.target.value)}
          />
          <select className="rounded-2xl border border-slate-200 px-4 py-3" value={session} onChange={(e) => setSession(e.target.value as typeof session)}>
            {sessionOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <input
            type="number"
            step="0.1"
            min="2000"
            max="2600"
            className="rounded-2xl border border-slate-200 px-4 py-3"
            placeholder="Entry Price (2000-2600)"
            value={entryPrice}
            onChange={(e) => setEntryPrice(e.target.value)}
          />
          <input
            type="number"
            step="0.1"
            min="2000"
            max="2600"
            className="rounded-2xl border border-slate-200 px-4 py-3"
            placeholder="Exit Price (2000-2600)"
            value={exitPrice}
            onChange={(e) => setExitPrice(e.target.value)}
          />
        </section>

        <section className="space-y-4 rounded-2xl border border-slate-200 p-5">
          <h3 className="text-lg font-medium text-slate-900">Setup Tags & Emotion</h3>
          <div className="flex flex-wrap gap-2">
            {setupTagOptions.map((tag) => (
              <button
                type="button"
                key={tag}
                onClick={() => handleSetupTagChange(tag)}
                className={`rounded-full px-4 py-2 text-sm transition ${
                  setupTags.includes(tag)
                    ? "bg-sky-100 text-sky-700"
                    : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
          <select className="w-full rounded-2xl border border-slate-200 px-4 py-3" value={emotion} onChange={(e) => setEmotion(e.target.value)}>
            {emotionOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </section>

        <section className="grid gap-4 md:grid-cols-2">
          <label
            className="rounded-2xl border border-dashed border-sky-200 bg-sky-50 p-4 text-sm text-sky-700"
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              handleFileSelect(e.dataTransfer.files?.[0] || null, "before");
            }}
          >
            <span className="mb-2 block font-medium">Before Trade Chart (Drag & Drop / Click)</span>
            <input type="file" accept="image/*" className="mb-2 block text-xs" onChange={(e) => handleFileSelect(e.target.files?.[0] || null, "before")} />
            <input
              className="w-full rounded-xl border border-sky-200 bg-white px-3 py-2 text-xs text-slate-600"
              placeholder="or paste image URL"
              value={beforeChartUrl}
              onChange={(e) => setBeforeChartUrl(e.target.value)}
            />
          </label>
          <label
            className="rounded-2xl border border-dashed border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700"
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              handleFileSelect(e.dataTransfer.files?.[0] || null, "after");
            }}
          >
            <span className="mb-2 block font-medium">After Trade Chart (Drag & Drop / Click)</span>
            <input type="file" accept="image/*" className="mb-2 block text-xs" onChange={(e) => handleFileSelect(e.target.files?.[0] || null, "after")} />
            <input
              className="w-full rounded-xl border border-emerald-200 bg-white px-3 py-2 text-xs text-slate-600"
              placeholder="or paste image URL"
              value={afterChartUrl}
              onChange={(e) => setAfterChartUrl(e.target.value)}
            />
          </label>
        </section>

        <button
          type="submit"
          disabled={!canAdd}
          className="rounded-2xl bg-sky-100 px-6 py-3 font-medium text-sky-700 transition hover:bg-sky-200 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {canAdd ? "Save Trade Log" : "Upgrade for more than 10 logs"}
        </button>
      </form>
    </div>
  );
}
