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
      <div className="flex gap-2" role="group" aria-label="Profit or loss">
        <button
          type="button"
          onClick={() => setSign("profit")}
          className={`flex-1 rounded-lg border px-3 py-2 text-sm font-medium transition ${
            sign === "profit"
              ? "border-tv-profit bg-xau-profit-bg text-tv-profit"
              : "border-xau-border bg-xau-app text-xau-muted hover:text-xau-ink"
          }`}
        >
          กำไร (+)
        </button>
        <button
          type="button"
          onClick={() => setSign("loss")}
          className={`flex-1 rounded-lg border px-3 py-2 text-sm font-medium transition ${
            sign === "loss"
              ? "border-tv-loss bg-xau-loss-bg text-tv-loss"
              : "border-xau-border bg-xau-app text-xau-muted hover:text-xau-ink"
          }`}
        >
          ขาดทุน (−)
        </button>
      </div>
      <input
        id={id}
        type="text"
        inputMode="decimal"
        autoComplete="off"
        className="xau-field"
        placeholder="จำนวนเงิน เช่น 420"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <p className="text-xs text-xau-muted">
        บนมือถือไม่ต้องพิมพ์ +/− — เลือกกำไรหรือขาดทุนแล้วใส่ตัวเลข
      </p>
    </div>
  );
}
