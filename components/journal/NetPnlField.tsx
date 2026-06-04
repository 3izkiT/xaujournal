"use client";

import {
  pnlFromSignAndAmount,
  splitPnlForInput,
  type PnlSign,
} from "@/lib/trade-metrics-input";

type Props = {
  value: string;
  onChange: (value: string) => void;
  id?: string;
};

const SIGN_OPTIONS: { value: PnlSign; label: string }[] = [
  { value: "profit", label: "Profit (+)" },
  { value: "loss", label: "Loss (−)" },
];

export function NetPnlField({ value, onChange, id }: Props) {
  const { sign, amount } = splitPnlForInput(value);

  const setSign = (next: PnlSign) => {
    onChange(pnlFromSignAndAmount(next, amount));
  };

  const setAmount = (raw: string) => {
    const cleaned = raw.replace(/,/g, "").replace(/[^\d.]/g, "");
    const parts = cleaned.split(".");
    const normalized =
      parts.length > 2 ? `${parts[0]}.${parts.slice(1).join("")}` : cleaned;
    onChange(pnlFromSignAndAmount(sign, normalized));
  };

  return (
    <div className="space-y-2">
      <div className="grid gap-2 sm:grid-cols-[minmax(9rem,11rem)_1fr]">
        <label className="sr-only" htmlFor={id ? `${id}-sign` : undefined}>
          Profit or loss
        </label>
        <select
          id={id ? `${id}-sign` : undefined}
          className="xau-select w-full"
          value={sign}
          onChange={(e) => setSign(e.target.value as PnlSign)}
          aria-label="Profit or loss"
        >
          {SIGN_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <input
          id={id}
          type="text"
          inputMode="decimal"
          autoComplete="off"
          className="xau-field"
          placeholder="Amount in USD, e.g. 420"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
      </div>
      <p className="text-xs text-xau-muted">
        Choose Profit or Loss, then enter the amount — no need to type +/−.
      </p>
    </div>
  );
}
