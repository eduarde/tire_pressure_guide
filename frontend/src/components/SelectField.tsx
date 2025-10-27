import clsx from "clsx";

interface SelectFieldProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: { label: string; value: string }[];
  helper?: string;
  unit?: string;
}

export function SelectField({ label, options, helper, unit, className, ...props }: SelectFieldProps) {
  return (
    <label className="block text-xs font-semibold uppercase tracking-[0.28em] text-neutral-500">
      <span>{label}</span>
      <div className="mt-2 flex items-center gap-3 text-base font-medium text-neutral-900">
        <select
          {...props}
          className={clsx(
            "flex-1 appearance-none rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-base text-neutral-900 shadow-sm",
            "focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-200",
            className
          )}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value} className="bg-white text-neutral-900">
              {option.label}
            </option>
          ))}
        </select>
        {unit ? (
          <span className="rounded-2xl bg-emerald-50 px-3 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-emerald-600">
            {unit}
          </span>
        ) : null}
      </div>
      {helper ? <p className="mt-1 text-xs text-neutral-500/80">{helper}</p> : null}
    </label>
  );
}
