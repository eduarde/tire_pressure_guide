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
    <label className="block text-xs font-medium text-neutral-600">
      <span>{label}</span>
      <div className="mt-2 flex items-center gap-2 text-sm font-medium text-neutral-900">
        <select
          {...props}
          className={clsx(
            "flex-1 appearance-none rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 shadow-sm",
            "focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20",
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
          <span className="rounded-md bg-neutral-100 px-2.5 py-1 text-xs font-medium text-neutral-700">
            {unit}
          </span>
        ) : null}
      </div>
      {helper ? <p className="mt-1 text-xs text-neutral-500/80">{helper}</p> : null}
    </label>
  );
}
