import { PropsWithChildren } from "react";
import clsx from "clsx";

interface SectionCardProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export function SectionCard({
  title,
  description,
  action,
  className,
  children
}: PropsWithChildren<SectionCardProps>) {
  return (
    <section
      className={clsx(
        "rounded-3xl border border-white/10 bg-white/5 px-6 py-7 backdrop-blur",
        "shadow-panel transition hover:border-white/20 hover:bg-white/10",
        className
      )}
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold tracking-tight text-white/90">{title}</h2>
          {description ? (
            <p className="mt-1 text-sm text-slate-300/80">{description}</p>
          ) : null}
        </div>
        {action}
      </div>
      <div className="mt-6 space-y-5 text-sm text-slate-200/90">{children}</div>
    </section>
  );
}
