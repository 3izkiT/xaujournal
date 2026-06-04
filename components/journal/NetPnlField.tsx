"use client";

import { ProfitLossSignToggle } from "@/components/journal/ProfitLossSignToggle";
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
    <div className="space-y-3">
      <ProfitLossSignToggle
        sign={sign}
        onSignChange={setSign}
        options={SIGN_OPTIONS}
        ariaLabel="Profit or loss"
      />
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
      <p className="text-xs text-xau-muted">
        Tap Profit or Loss first, then enter the amount — no +/− typing needed.
      </p>
    </div>
  );
}
