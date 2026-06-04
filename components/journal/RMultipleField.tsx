"use client";

import { sanitizeRMultipleDraft } from "@/lib/trade-metrics-input";

type Props = {
  value: string;
  onChange: (value: string) => void;
  id?: string;
};

export function RMultipleField({ value, onChange, id }: Props) {
  return (
    <div className="space-y-2">
      <input
        id={id}
        type="text"
        inputMode="decimal"
        autoComplete="off"
        className="xau-field"
        placeholder="e.g. +3 or -1"
        value={value}
        onChange={(e) => onChange(sanitizeRMultipleDraft(e.target.value))}
      />
      <p className="text-xs text-xau-muted">Type +/− and the number only — we add R on save (e.g. +3 → +3R).</p>
    </div>
  );
}
