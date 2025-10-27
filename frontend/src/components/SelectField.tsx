import clsx from "clsx";

interface SelectFieldProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: { label: string; value: string }[];
  helper?: string;
  unit?: string;
}

export function SelectField({
  label,
  options,
  helper,
  unit,
  className,
  ...props
}: SelectFieldProps) {
  return (
    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300/80">
      <span>{label}</span>
      <div className="mt-2 flex items-center gap-3 text-base font-medium text-white">
        <select
          {...props}
          className={clsx(
            "flex-1 appearance-none rounded-2xl border border-white/10 bg-carbon-900/70 px-4 py-3",
            "focus:border-crimson-400/60 focus:outline-none focus:ring-2 focus:ring-crimson-400/40",
            className
          )}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value} className="bg-carbon-900">
              {option.label}
            </option>
          ))}
        </select>
        {unit ? (
          <span className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold uppercase tracking-widest text-slate-200/80">
            {unit}
          </span>
        ) : null}
      </div>
      {helper ? <p className="mt-1 text-xs text-slate-400/80">{helper}</p> : null}
    </label>
  );
}
