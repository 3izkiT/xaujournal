import { ReactNode } from "react";

type Props = {
  label: string;
  hint?: string;
  children: ReactNode;
  className?: string;
};

export function FormField({ label, hint, children, className = "" }: Props) {
  return (
    <label className={`block space-y-2 ${className}`}>
      <span className="text-sm font-medium text-xau-ink">{label}</span>
      {hint ? <span className="block text-xs leading-snug text-xau-muted">{hint}</span> : null}
      {children}
    </label>
  );
}
