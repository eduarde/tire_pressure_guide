import clsx from "clsx";

interface SegmentedControlProps<T extends string> {
  options: { label: string; value: T }[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
}

export function SegmentedControl<T extends string>({ options, value, onChange, className }: SegmentedControlProps<T>) {
  return (
    <div
      className={clsx(
        "flex flex-wrap items-center gap-1 rounded-full border border-neutral-200 bg-neutral-50 p-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-neutral-600",
        className
      )}
    >
      {options.map((option) => {
        const active = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={clsx(
              "min-w-[56px] rounded-full px-3 py-1 transition",
              active
                ? "bg-emerald-500 text-white shadow-sm"
                : "text-neutral-600 hover:bg-white hover:text-neutral-900"
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
