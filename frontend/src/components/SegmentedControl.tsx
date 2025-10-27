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
        "inline-flex items-center rounded-full border border-neutral-200 bg-neutral-100 p-1 text-xs font-semibold uppercase tracking-[0.28em] text-neutral-600",
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
              "min-w-[72px] rounded-full px-4 py-1.5 transition",
              active
                ? "bg-emerald-500 text-white shadow"
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
