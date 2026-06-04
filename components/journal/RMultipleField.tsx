"use client";

import { ProfitLossSignToggle } from "@/components/journal/ProfitLossSignToggle";
import {
  rFromSignAndAmount,
  splitRForInput,
  type PnlSign,
} from "@/lib/trade-metrics-input";

type Props = {
  value: string;
  onChange: (value: string) => void;
  id?: string;
};

const SIGN_OPTIONS: { value: PnlSign; label: string }[] = [
  { value: "profit", label: "Win (+)" },
  { value: "loss", label: "Loss (−)" },
];

export function RMultipleField({ value, onChange, id }: Props) {
  const { sign, amount } = splitRForInput(value);

  const setSign = (next: PnlSign) => {
    onChange(rFromSignAndAmount(next, amount));
  };

  const setAmount = (raw: string) => {
    const cleaned = raw.replace(/,/g, "").replace(/[^\d.]/g, "");
    const parts = cleaned.split(".");
    const normalized =
      parts.length > 2 ? `${parts[0]}.${parts.slice(1).join("")}` : cleaned;
    onChange(rFromSignAndAmount(sign, normalized));
  };

  return (
    <div className="space-y-3">
      <ProfitLossSignToggle
        sign={sign}
        onSignChange={setSign}
        options={SIGN_OPTIONS}
        ariaLabel="Win or loss in R"
      />
      <input
        id={id}
        type="text"
        inputMode="decimal"
        autoComplete="off"
        className="xau-field"
        placeholder="R value, e.g. 2"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <p className="text-xs text-xau-muted">
        Tap Win or Loss first, then enter the number — we add R on save (e.g. Win + 2 → +2R).
      </p>
    </div>
  );
}
