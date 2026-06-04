"use client";

import type { PnlSign } from "@/lib/trade-metrics-input";

type Option = { value: PnlSign; label: string };

type Props = {
  sign: PnlSign;
  onSignChange: (sign: PnlSign) => void;
  options: Option[];
  ariaLabel: string;
};

export function ProfitLossSignToggle({ sign, onSignChange, options, ariaLabel }: Props) {
  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label={ariaLabel}>
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onSignChange(opt.value)}
          aria-pressed={sign === opt.value}
          className={`xau-btn-pill px-3 py-1.5 ${sign === opt.value ? "xau-btn-pill-active" : ""}`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
