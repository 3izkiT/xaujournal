import type { ReactNode } from "react";

type Props = {
  variant: "error" | "success";
  children: ReactNode;
};

export function FormAlert({ variant, children }: Props) {
  const styles =
    variant === "error"
      ? "border-xau-border bg-xau-rose text-tv-loss"
      : "border-xau-border bg-xau-profit-bg text-tv-profit";

  return (
    <p className={`rounded-2xl border px-4 py-3 text-sm font-medium ${styles}`} role="alert">
      {children}
    </p>
  );
}
