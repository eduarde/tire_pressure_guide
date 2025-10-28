import clsx from "clsx";

interface SelectFieldProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: { label: string; value: string }[];
  helper?: string;
  unit?: string;
  placeholder?: string;
}

export function SelectField({
  label,
  options,
  helper,
  unit,
  placeholder,
  className,
  ...props
}: SelectFieldProps) {
  return (
    <label className="block text-xs font-black uppercase tracking-[0.2em] text-neutral-600">
      <span>{label}</span>
      <div className="mt-2 flex items-center gap-2 text-sm font-medium text-neutral-900">
        <select
          {...props}
          className={clsx(
            "flex-1 appearance-none rounded-xl border-2 border-neutral-900 bg-white px-4 py-2.5 text-sm text-neutral-900 shadow-[4px_4px_0_rgba(17,24,39,0.1)]",
            "focus:border-neutral-900 focus:outline-none focus:ring-0",
            className
          )}
        >
          {placeholder ? (
            <option value="" disabled>
              {placeholder}
            </option>
          ) : null}
          {options.map((option) => (
            <option key={option.value} value={option.value} className="bg-white text-neutral-900">
              {option.label}
            </option>
          ))}
        </select>
        {unit ? (
          <span className="rounded-full border-2 border-neutral-900 bg-white px-3 py-1 text-xs font-black uppercase tracking-[0.2em] text-neutral-800">
            {unit}
          </span>
        ) : null}
      </div>
      {helper ? <p className="mt-1 text-xs font-medium normal-case tracking-normal text-neutral-500/80">{helper}</p> : null}
    </label>
  );
}
