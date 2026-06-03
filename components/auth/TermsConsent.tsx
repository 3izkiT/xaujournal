import Link from "next/link";

type Props = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  error?: string;
};

export function TermsConsent({ checked, onChange, error }: Props) {
  return (
    <div>
      <label className="flex cursor-pointer items-start gap-3 text-sm text-xau-muted">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="mt-1 h-4 w-4 shrink-0 rounded border-xau-border accent-xau-gold"
          aria-invalid={error ? true : undefined}
        />
        <span>
          I agree to the{" "}
          <Link href="/terms" className="font-medium text-xau-ink underline hover:text-xau-gold-accent" target="_blank">
            Terms of Use
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="font-medium text-xau-ink underline hover:text-xau-gold-accent" target="_blank">
            Privacy Policy
          </Link>
          .
        </span>
      </label>
      {error && (
        <p className="mt-1.5 text-xs font-medium text-tv-loss" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
