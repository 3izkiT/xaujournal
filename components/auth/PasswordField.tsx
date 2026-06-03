"use client";

import { InputHTMLAttributes, useId, useState } from "react";

const inputClass =
  "w-full rounded-2xl border border-xau-border bg-xau-card py-3 pl-4 pr-12 text-xau-ink outline-none transition focus:border-xau-gold focus:ring-2 focus:ring-xau-gold/30 disabled:cursor-not-allowed disabled:opacity-60";

type Props = {
  id?: string;
  label: string;
  hint?: string;
  error?: string;
  value: string;
  onChange: (value: string) => void;
} & Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "value" | "onChange" | "id">;

export function PasswordField({
  id: idProp,
  label,
  hint,
  error,
  value,
  onChange,
  autoComplete = "current-password",
  required,
  minLength,
  ...rest
}: Props) {
  const autoId = useId();
  const id = idProp ?? autoId;
  const [visible, setVisible] = useState(false);
  const describedBy = [hint ? `${id}-hint` : null, error ? `${id}-error` : null].filter(Boolean).join(" ");

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-xau-ink">
        {label}
        {required && <span className="text-tv-loss"> *</span>}
      </label>
      <div className="relative mt-1.5">
        <input
          id={id}
          type={visible ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          autoComplete={autoComplete}
          required={required}
          minLength={minLength}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy || undefined}
          className={`${inputClass} ${error ? "border-tv-loss focus:border-tv-loss focus:ring-tv-loss/20" : ""}`}
          {...rest}
        />
        <button
          type="button"
          tabIndex={0}
          className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-xl text-xau-muted transition hover:bg-xau-app hover:text-xau-ink"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? "Hide password" : "Show password"}
          aria-pressed={visible}
        >
          {visible ? <EyeOffIcon /> : <EyeIcon />}
        </button>
      </div>
      {hint && !error && (
        <p id={`${id}-hint`} className="mt-1.5 text-xs text-xau-muted">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className="mt-1.5 text-xs font-medium text-tv-loss">
          {error}
        </p>
      )}
    </div>
  );
}

function EyeIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M3 3l18 18M10.5 10.7A3 3 0 0 0 12 15a3 3 0 0 0 2.2-1M6.7 6.8C4.6 8.4 3 10.5 2 12c0 0 3.5 7 10 7 2 0 3.7-.6 5.2-1.6M17.3 17.2C19.4 15.6 21 13.5 22 12c0 0-3.5-7-10-7-1.1 0-2.1.2-3 .5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
