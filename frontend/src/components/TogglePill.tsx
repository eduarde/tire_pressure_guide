import clsx from "clsx";

interface TogglePillProps {
  label: string;
  description?: string;
  icon?: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
}

export function TogglePill({ label, description, icon, active, onClick }: TogglePillProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={clsx(
        "group flex h-20 flex-1 min-w-[120px] flex-col justify-center rounded-2xl border px-4 transition",
        "border-white/10 bg-white/5 text-left",
        active
          ? "border-crimson-400/70 bg-crimson-500/10 text-white shadow-panel"
          : "hover:border-white/30 hover:bg-white/10"
      )}
    >
      <span className="flex items-center gap-3 text-sm font-semibold tracking-wide">
        {icon ? <span className="text-lg opacity-80">{icon}</span> : null}
        {label}
      </span>
      {description ? (
        <span className="mt-1 text-xs text-slate-300/70 group-hover:text-slate-200/80">
          {description}
        </span>
      ) : null}
    </button>
  );
}
