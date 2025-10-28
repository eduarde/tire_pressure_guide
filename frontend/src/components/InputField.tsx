import clsx from "clsx";

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  helper?: string;
  unit?: string;
  containerClassName?: string;
  compact?: boolean;
}

export function InputField({ label, helper, unit, className, containerClassName, compact, ...props }: InputFieldProps) {
  return (
    <label className="block text-xs font-black uppercase tracking-[0.2em] text-neutral-600">
      <span>{label}</span>
      <div className={clsx("mt-2 flex items-center gap-2 text-sm font-medium text-neutral-900", containerClassName)}>
        <input
          {...props}
          className={clsx(
            compact ? "w-[182px]" : className?.includes('w-') ? "" : "flex-1",
            "rounded-xl border-2 border-neutral-900 bg-white px-4 py-2.5 text-sm text-neutral-900 shadow-[4px_4px_0_rgba(17,24,39,0.1)]",
            "placeholder:text-neutral-400 focus:border-neutral-900 focus:outline-none focus:ring-0",
            className
          )}
        />
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
