import clsx from "clsx";

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  helper?: string;
  unit?: string;
}

export function InputField({ label, helper, unit, className, ...props }: InputFieldProps) {
  return (
    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300/80">
      <span>{label}</span>
      <div className="mt-2 flex items-center gap-3 text-base font-medium text-white">
        <input
          {...props}
          className={clsx(
            "flex-1 rounded-2xl border border-white/10 bg-carbon-900/70 px-4 py-3",
            "placeholder:text-slate-400 focus:border-crimson-400/60 focus:outline-none focus:ring-2 focus:ring-crimson-400/40",
            className
          )}
        />
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
