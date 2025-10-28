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
        "flex flex-wrap items-center gap-1 rounded-full border-2 border-neutral-900 bg-white px-1.5 py-1 text-xs font-black uppercase tracking-[0.2em] text-neutral-700 shadow-[4px_4px_0_rgba(17,24,39,0.12)]",
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
              "min-w-[48px] rounded-full px-3 py-1.5 transition-transform",
              active
                ? "bg-neutral-900 text-lime-100"
                : "text-neutral-600 hover:-translate-y-[1px]"
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
