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
        "flex flex-wrap items-center gap-1 rounded-lg border border-neutral-300 bg-white p-1 text-xs font-medium text-neutral-600",
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
              "min-w-[48px] rounded-md px-3 py-1.5 transition",
              active
                ? "bg-sky-600 text-white shadow-sm"
                : "text-neutral-600 hover:bg-sky-50 hover:text-sky-700"
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
