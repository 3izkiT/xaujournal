import { InputHTMLAttributes } from "react";

const inputClass =
  "mt-1.5 w-full rounded-2xl border border-xau-border bg-xau-card px-4 py-3 text-xau-ink outline-none transition focus:border-xau-gold focus:ring-2 focus:ring-xau-gold/30 disabled:cursor-not-allowed disabled:opacity-60";

type Props = {
  id: string;
  label: string;
  hint?: string;
  error?: string;
} & InputHTMLAttributes<HTMLInputElement>;

export function AuthField({ id, label, hint, error, className = "", ...props }: Props) {
  const describedBy = [hint ? `${id}-hint` : null, error ? `${id}-error` : null].filter(Boolean).join(" ");

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-xau-ink">
        {label}
        {props.required && <span className="text-tv-loss"> *</span>}
      </label>
      <input
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy || undefined}
        className={`${inputClass} ${error ? "border-tv-loss focus:border-tv-loss focus:ring-tv-loss/20" : ""} ${className}`}
        {...props}
      />
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
