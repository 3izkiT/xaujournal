import { ReactNode } from "react";

type Props = {
  title: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
};

export function DashboardSection({ title, description, action, children }: Props) {
  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3 border-b border-xau-border pb-3">
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-xau-muted">{title}</h3>
          {description ? <p className="mt-1 text-sm text-xau-muted">{description}</p> : null}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}
