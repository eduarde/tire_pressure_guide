import { useMemo, useState } from "react";
import clsx from "clsx";
import { InputField, SelectField, SegmentedControl } from "./components";
import { BoltIcon } from "@heroicons/react/24/outline";

type Surface = "DRY" | "WET" | "MIXED" | "SNOW";
type PressureUnits = "PSI" | "BAR";
type MassUnit = "kg" | "lbs";
type RimType = "HOOKLESS" | "HOOKED" | "TUBULAR" | "TUBES";
type TireCasing = "STANDARD" | "REINFORCED" | "THIN" | "DOWNHILL_CASING";

type Discipline =
  | "ROAD"
  | "GRAVEL"
  | "CYCLOCROSS"
  | "MTB_TRAIL"
  | "MTB_ENDURO"
  | "MTB_DOWNHILL";

interface PressureResult {
  front: number;
  rear: number;
}

const disciplineOptions: { value: Discipline; label: string }[] = [
  { value: "ROAD", label: "Road" },
  { value: "GRAVEL", label: "Gravel" },
  { value: "CYCLOCROSS", label: "Cyclocross" },
  { value: "MTB_TRAIL", label: "Trail" },
  { value: "MTB_ENDURO", label: "Enduro" },
  { value: "MTB_DOWNHILL", label: "Downhill" }
];

const surfaceOptions: { value: Surface; label: string }[] = [
  { value: "DRY", label: "Dry" },
  { value: "WET", label: "Wet" },
  { value: "MIXED", label: "Mixed" },
  { value: "SNOW", label: "Snow" }
];

const rimTypeOptions: { value: RimType; label: string }[] = [
  { value: "HOOKLESS", label: "Hookless" },
  { value: "HOOKED", label: "Hooked" },
  { value: "TUBULAR", label: "Tubular" },
  { value: "TUBES", label: "Clincher" }
];

const casingOptions: { value: TireCasing; label: string }[] = [
  { value: "STANDARD", label: "Standard" },
  { value: "THIN", label: "Supple" },
  { value: "REINFORCED", label: "Reinforced" },
  { value: "DOWNHILL_CASING", label: "Downhill" }
];

function formatNumber(value: number) {
  return Number.isInteger(value) ? value.toString() : value.toFixed(1);
}

function convertPressure(value: number, unit: PressureUnits) {
  if (unit === "BAR") {
    return value / 14.5038;
  }
  return value;
}

function useCalculatedPressure(
  params: {
    riderWeight?: number;
    bikeWeight?: number;
    frontWidth?: number;
    rearWidth?: number;
    discipline?: Discipline;
    surface?: Surface;
    frontRimType?: RimType;
    rearRimType?: RimType;
    frontRimWidth?: number;
    rearRimWidth?: number;
    frontCasing?: TireCasing;
    rearCasing?: TireCasing;
  },
  massUnit: MassUnit
) {
  const {
    riderWeight,
    bikeWeight,
    frontWidth,
    rearWidth,
    discipline,
    surface,
    frontRimType,
    rearRimType,
    frontRimWidth,
    rearRimWidth,
    frontCasing,
    rearCasing
  } = params;

  return useMemo(() => {
    if (
      !riderWeight ||
      !frontWidth ||
      !rearWidth ||
      !discipline ||
      !surface ||
      !frontRimType ||
      !rearRimType ||
      !frontRimWidth ||
      !rearRimWidth ||
      !frontCasing ||
      !rearCasing
    ) {
      return null;
    }

    const totalWeight = riderWeight + (bikeWeight ?? 0);
    const weightKg = massUnit === "kg" ? totalWeight : totalWeight * 0.453592;

    const base = 32 + weightKg * 0.18;

    const styleAdjustments: Record<Discipline, number> = {
      ROAD: 6,
      GRAVEL: -2,
      CYCLOCROSS: -4,
      MTB_TRAIL: -10,
      MTB_ENDURO: -11,
      MTB_DOWNHILL: -14
    };

    const surfaceAdjustments: Record<Surface, number> = {
      DRY: 0,
      WET: -3,
      MIXED: -1.5,
      SNOW: -4
    };

    const rimAdjustments: Record<RimType, number> = {
      HOOKLESS: -1,
      HOOKED: 0,
      TUBULAR: -4,
      TUBES: 1
    };

    const casingAdjustments: Record<TireCasing, number> = {
      STANDARD: 0,
      THIN: -1,
      REINFORCED: 1.5,
      DOWNHILL_CASING: 3
    };

    const rimWidthReference = 25;
    const rimWidthAdjustFront = (rimWidthReference - frontRimWidth) * 0.12;
    const rimWidthAdjustRear = (rimWidthReference - rearRimWidth) * 0.12;

    const widthDeltaFront = 30 - frontWidth;
    const widthDeltaRear = 30 - rearWidth;

    const front =
      base +
      widthDeltaFront * 0.22 +
      (styleAdjustments[discipline] ?? 0) +
      (surfaceAdjustments[surface] ?? 0) +
      rimAdjustments[frontRimType] +
      rimWidthAdjustFront +
      casingAdjustments[frontCasing];

    const rear =
      base +
      widthDeltaRear * 0.19 +
      (styleAdjustments[discipline] ?? 0) +
      (surfaceAdjustments[surface] ?? 0) +
      rimAdjustments[rearRimType] +
      rimWidthAdjustRear +
      casingAdjustments[rearCasing] +
      1.5;

    return {
      front: Math.max(12, Math.min(75, front)),
      rear: Math.max(12, Math.min(78, rear))
    } satisfies PressureResult;
  }, [
    bikeWeight,
    discipline,
    frontCasing,
    frontRimType,
    frontRimWidth,
    frontWidth,
    massUnit,
    rearCasing,
    rearRimType,
    rearRimWidth,
    rearWidth,
    riderWeight,
    surface
  ]);
}

export default function App() {
  const [massUnit, setMassUnit] = useState<MassUnit>("kg");
  const [pressureUnit, setPressureUnit] = useState<PressureUnits>("PSI");
  const [discipline, setDiscipline] = useState<Discipline | "">("");
  const [surface, setSurface] = useState<Surface | "">("");
  const [frontRimType, setFrontRimType] = useState<RimType | "">("");
  const [rearRimType, setRearRimType] = useState<RimType | "">("");
  const [frontCasing, setFrontCasing] = useState<TireCasing | "">("");
  const [rearCasing, setRearCasing] = useState<TireCasing | "">("");

  const [riderWeight, setRiderWeight] = useState("");
  const [bikeWeight, setBikeWeight] = useState("");
  const [frontWidth, setFrontWidth] = useState("");
  const [rearWidth, setRearWidth] = useState("");
  const [frontRimWidth, setFrontRimWidth] = useState("");
  const [rearRimWidth, setRearRimWidth] = useState("");
  const [showResults, setShowResults] = useState(false);

  const calculated = useCalculatedPressure(
    {
      riderWeight: riderWeight ? parseFloat(riderWeight) : undefined,
      bikeWeight: bikeWeight ? parseFloat(bikeWeight) : undefined,
      frontWidth: frontWidth ? parseFloat(frontWidth) : undefined,
      rearWidth: rearWidth ? parseFloat(rearWidth) : undefined,
      discipline: discipline || undefined,
      surface: surface || undefined,
      frontRimType: frontRimType || undefined,
      rearRimType: rearRimType || undefined,
      frontRimWidth: frontRimWidth ? parseFloat(frontRimWidth) : undefined,
      rearRimWidth: rearRimWidth ? parseFloat(rearRimWidth) : undefined,
      frontCasing: frontCasing || undefined,
      rearCasing: rearCasing || undefined
    },
    massUnit
  );

  const pressures = useMemo(() => {
    if (!calculated) return null;

    return {
      front: convertPressure(calculated.front, pressureUnit),
      rear: convertPressure(calculated.rear, pressureUnit)
    };
  }, [calculated, pressureUnit]);

  const unitLabel = pressureUnit === "PSI" ? "psi" : "bar";

  const handleReset = () => {
    setDiscipline("");
    setSurface("");
    setFrontRimType("");
    setRearRimType("");
    setFrontCasing("");
    setRearCasing("");
    setRiderWeight("");
    setBikeWeight("");
    setFrontWidth("");
    setRearWidth("");
    setFrontRimWidth("");
    setRearRimWidth("");
    setMassUnit("kg");
    setPressureUnit("PSI");
    setShowResults(false);
  };

  const weightComplete = Boolean(parseFloat(riderWeight)) && Boolean(parseFloat(bikeWeight));
  const disciplineComplete = Boolean(discipline);
  const surfaceComplete = Boolean(surface);
  const rimsComplete =
    Boolean(frontRimType) &&
    Boolean(rearRimType) &&
    Boolean(parseFloat(frontRimWidth)) &&
    Boolean(parseFloat(rearRimWidth));
  const tireComplete =
    Boolean(parseFloat(frontWidth)) &&
    Boolean(parseFloat(rearWidth)) &&
    Boolean(frontCasing) &&
    Boolean(rearCasing);

  const progressSteps = [
    { label: "Weight", complete: weightComplete },
    { label: "Discipline", complete: disciplineComplete },
    { label: "Surface", complete: surfaceComplete },
    { label: "Rims", complete: rimsComplete },
    { label: "Tire", complete: tireComplete }
  ];

  const completedSteps = progressSteps.filter((step) => step.complete).length;
  const progressPercent = Math.round((completedSteps / progressSteps.length) * 100);
  const readyToCalculate = progressPercent === 100;

  return (
    <div className="min-h-screen bg-slate-50 text-neutral-900">
      <main className="mx-auto flex min-h-screen max-w-5xl flex-col gap-12 px-4 py-16 sm:px-6 lg:px-10">
        <section className="relative overflow-hidden rounded-[3rem] bg-gradient-to-br from-sky-600 via-sky-500 to-sky-600 px-6 py-16 text-white shadow-2xl sm:px-12">
          <div className="absolute -top-24 right-6 hidden h-64 w-64 rounded-full bg-sky-400/30 blur-3xl sm:block" aria-hidden />
          <div className="absolute -bottom-20 left-10 hidden h-56 w-56 rounded-full bg-sky-400/20 blur-3xl sm:block" aria-hidden />
          <div className="relative max-w-3xl space-y-6">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-white/70">Tire pressure guide</p>
            <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">Ride-ready pressure confidence</h1>
            <p className="text-base leading-relaxed text-white/80 sm:text-lg">
              Dial in the perfect setup with a clean, material-inspired interface that keeps every decision focused on a single accent colour.
            </p>
          </div>
        </section>

        <section className="rounded-[3rem] border border-neutral-900/30 bg-neutral-900 px-6 py-10 text-white shadow-2xl shadow-neutral-900/40 sm:px-12">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-4">
              <p className="text-sm font-medium text-white/60">Recommended setup</p>
              <h2 className="text-3xl font-semibold sm:text-4xl">Baseline tire pressures</h2>
              <p className="max-w-xl text-sm leading-relaxed text-white/60">
                Lock in a confident starting point, then fine-tune a touch to match trail feel, conditions, and personal preference.
              </p>
            </div>
            <BoltIcon className="hidden h-14 w-14 shrink-0 text-white/20 sm:block" aria-hidden />
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-white/10 px-6 py-6 text-center shadow-lg shadow-black/30">
              <p className="text-sm font-medium text-white/60">Front</p>
              <p className="mt-3 text-3xl font-semibold sm:text-4xl">{showResults && pressures ? formatNumber(pressures.front) : "--"}</p>
              <p className="text-sm font-medium text-white/50">{unitLabel}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/10 px-6 py-6 text-center shadow-lg shadow-black/30">
              <p className="text-sm font-medium text-white/60">Rear</p>
              <p className="mt-3 text-3xl font-semibold sm:text-4xl">{showResults && pressures ? formatNumber(pressures.rear) : "--"}</p>
              <p className="text-sm font-medium text-white/50">{unitLabel}</p>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="submit"
              form="setup-form"
              disabled={!readyToCalculate}
              className={clsx(
                "inline-flex w-full items-center justify-center rounded-2xl px-6 py-4 text-sm font-semibold uppercase tracking-[0.2em] transition",
                readyToCalculate
                  ? "bg-sky-500 text-neutral-900 shadow-lg shadow-sky-500/30 hover:bg-sky-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-200"
                  : "cursor-not-allowed bg-white/10 text-white/40"
              )}
            >
              CALCULATE
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center justify-center rounded-2xl border border-sky-400/40 px-6 py-4 text-sm font-semibold uppercase tracking-[0.2em] text-sky-200 transition hover:border-sky-200 hover:text-sky-100"
            >
              RESET
            </button>
          </div>
        </section>

        <section className="rounded-[3rem] border border-white/60 bg-white px-6 py-10 shadow-xl sm:px-12">
          <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-neutral-600">Setup progress</p>
                <p className="text-sm text-neutral-500">{progressPercent}% complete</p>
              </div>
              <div className="flex flex-wrap gap-3">
                <SegmentedControl
                  value={massUnit}
                  onChange={(value) => {
                    setMassUnit(value);
                    setShowResults(false);
                  }}
                  options={[
                    { label: "kg", value: "kg" },
                    { label: "lbs", value: "lbs" }
                  ]}
                />
                <SegmentedControl
                  value={pressureUnit}
                  onChange={(value) => {
                    setPressureUnit(value);
                    setShowResults(false);
                  }}
                  options={[
                    { label: "psi", value: "PSI" },
                    { label: "bar", value: "BAR" }
                  ]}
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
                <div
                  className="h-full rounded-full bg-sky-500 transition-[width] duration-300"
                  style={{ width: `${progressPercent}%` }}
                  aria-hidden
                />
              </div>
              <div className="grid gap-3 text-sm text-neutral-600 sm:grid-cols-5">
                {progressSteps.map((step, index) => (
                  <div key={step.label} className="flex items-center gap-2">
                    <span
                      className={clsx(
                        "flex h-8 w-8 items-center justify-center rounded-full border text-sm font-semibold",
                        step.complete
                          ? "border-sky-500 bg-sky-500 text-white"
                          : "border-slate-200 bg-white text-neutral-400"
                      )}
                    >
                      {index + 1}
                    </span>
                    <span className="font-medium">{step.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <form
            id="setup-form"
            className="mt-10 space-y-8"
            onSubmit={(event) => {
              event.preventDefault();
              if (!readyToCalculate) {
                setShowResults(false);
                return;
              }
              setShowResults(true);
            }}
          >
            <div className="space-y-4">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">Weight</p>
              <div className="grid gap-4 sm:grid-cols-2">
                <InputField
                  label="Rider weight"
                  type="number"
                  inputMode="decimal"
                  value={riderWeight}
                  min={0}
                  onChange={(event) => {
                    setRiderWeight(event.target.value);
                    setShowResults(false);
                  }}
                  unit={massUnit}
                />
                <InputField
                  label="Bike weight"
                  type="number"
                  inputMode="decimal"
                  value={bikeWeight}
                  min={0}
                  onChange={(event) => {
                    setBikeWeight(event.target.value);
                    setShowResults(false);
                  }}
                  unit={massUnit}
                />
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">Discipline</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {disciplineOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => {
                      setDiscipline(option.value);
                      setShowResults(false);
                    }}
                    className={clsx(
                      "rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium transition",
                      discipline === option.value
                        ? "border-sky-500 bg-sky-500 text-white shadow-sm"
                        : "text-neutral-600 hover:border-sky-200 hover:text-sky-700"
                    )}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">Surface</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {surfaceOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => {
                      setSurface(option.value);
                      setShowResults(false);
                    }}
                    className={clsx(
                      "rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium transition",
                      surface === option.value
                        ? "border-sky-500 bg-sky-500 text-white shadow-sm"
                        : "text-neutral-600 hover:border-sky-200 hover:text-sky-700"
                    )}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid gap-8 md:grid-cols-2">
              <div className="space-y-4">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">Front rims</p>
                <SelectField
                  label="Front rim type"
                  value={frontRimType}
                  placeholder="Select rim type"
                  onChange={(event) => {
                    setFrontRimType(event.target.value as RimType | "");
                    setShowResults(false);
                  }}
                  options={rimTypeOptions}
                />
                <InputField
                  label="Rim width"
                  type="number"
                  inputMode="decimal"
                  value={frontRimWidth}
                  min={0}
                  onChange={(event) => {
                    setFrontRimWidth(event.target.value);
                    setShowResults(false);
                  }}
                  unit="mm"
                />
              </div>
              <div className="space-y-4">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">Rear rims</p>
                <SelectField
                  label="Rear rim type"
                  value={rearRimType}
                  placeholder="Select rim type"
                  onChange={(event) => {
                    setRearRimType(event.target.value as RimType | "");
                    setShowResults(false);
                  }}
                  options={rimTypeOptions}
                />
                <InputField
                  label="Rim width"
                  type="number"
                  inputMode="decimal"
                  value={rearRimWidth}
                  min={0}
                  onChange={(event) => {
                    setRearRimWidth(event.target.value);
                    setShowResults(false);
                  }}
                  unit="mm"
                />
              </div>
            </div>

            <div className="grid gap-8 md:grid-cols-2">
              <div className="space-y-4">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">Front tire</p>
                <InputField
                  label="Width"
                  type="number"
                  inputMode="decimal"
                  value={frontWidth}
                  min={0}
                  onChange={(event) => {
                    setFrontWidth(event.target.value);
                    setShowResults(false);
                  }}
                  unit="mm"
                />
                <SelectField
                  label="Casing"
                  value={frontCasing}
                  placeholder="Select casing"
                  onChange={(event) => {
                    setFrontCasing(event.target.value as TireCasing | "");
                    setShowResults(false);
                  }}
                  options={casingOptions}
                />
              </div>
              <div className="space-y-4">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">Rear tire</p>
                <InputField
                  label="Width"
                  type="number"
                  inputMode="decimal"
                  value={rearWidth}
                  min={0}
                  onChange={(event) => {
                    setRearWidth(event.target.value);
                    setShowResults(false);
                  }}
                  unit="mm"
                />
                <SelectField
                  label="Casing"
                  value={rearCasing}
                  placeholder="Select casing"
                  onChange={(event) => {
                    setRearCasing(event.target.value as TireCasing | "");
                    setShowResults(false);
                  }}
                  options={casingOptions}
                />
              </div>
            </div>
          </form>
        </section>
      </main>
    </div>
  );
}
