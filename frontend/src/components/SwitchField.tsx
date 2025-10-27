import { Switch } from "@headlessui/react";
import clsx from "clsx";

interface SwitchFieldProps {
  label: string;
  helper?: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}

export function SwitchField({ label, helper, checked, onChange }: SwitchFieldProps) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <p className="text-sm font-medium text-white">{label}</p>
        {helper ? <p className="text-xs text-slate-300/80">{helper}</p> : null}
      </div>
      <Switch
        checked={checked}
        onChange={onChange}
        className={clsx(
          "relative inline-flex h-8 w-16 shrink-0 cursor-pointer items-center rounded-full border border-white/10 bg-white/5 p-1 transition",
          checked ? "border-crimson-400/70 bg-crimson-500/40" : "hover:border-white/30 hover:bg-white/10"
        )}
      >
        <span
          className={clsx(
            "inline-block h-6 w-6 transform rounded-full bg-white shadow transition",
            checked ? "translate-x-8" : "translate-x-0"
          )}
        />
      </Switch>
    </div>
  );
}
