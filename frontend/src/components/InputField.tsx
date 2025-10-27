import clsx from "clsx";

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  helper?: string;
  unit?: string;
}

export function InputField({ label, helper, unit, className, ...props }: InputFieldProps) {
  return (
    <label className="block text-xs font-medium text-neutral-600">
      <span>{label}</span>
      <div className="mt-2 flex items-center gap-2 text-sm font-medium text-neutral-900">
        <input
          {...props}
          className={clsx(
            "flex-1 rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 shadow-sm",
            "placeholder:text-neutral-400 focus:border-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900/10",
            className
          )}
        />
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
