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
    riderWeight: number;
    bikeWeight: number;
    frontWidth: number;
    rearWidth: number;
    discipline: Discipline;
    surface: Surface;
    frontRimType: RimType;
    rearRimType: RimType;
    frontRimWidth: number;
    rearRimWidth: number;
    frontCasing: TireCasing;
    rearCasing: TireCasing;
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
    if (!riderWeight || !frontWidth || !rearWidth) {
      return null;
    }

    const totalWeight = riderWeight + bikeWeight;
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
  const [discipline, setDiscipline] = useState<Discipline>("ROAD");
  const [surface, setSurface] = useState<Surface>("DRY");
  const [frontRimType, setFrontRimType] = useState<RimType>("HOOKLESS");
  const [rearRimType, setRearRimType] = useState<RimType>("HOOKLESS");
  const [frontCasing, setFrontCasing] = useState<TireCasing>("STANDARD");
  const [rearCasing, setRearCasing] = useState<TireCasing>("STANDARD");

  const [riderWeight, setRiderWeight] = useState("72");
  const [bikeWeight, setBikeWeight] = useState("8.5");
  const [frontWidth, setFrontWidth] = useState("28");
  const [rearWidth, setRearWidth] = useState("30");
  const [frontRimWidth, setFrontRimWidth] = useState("25");
  const [rearRimWidth, setRearRimWidth] = useState("25");
  const [showResults, setShowResults] = useState(false);

  const calculated = useCalculatedPressure(
    {
      riderWeight: parseFloat(riderWeight) || 0,
      bikeWeight: parseFloat(bikeWeight) || 0,
      frontWidth: parseFloat(frontWidth) || 0,
      rearWidth: parseFloat(rearWidth) || 0,
      discipline,
      surface,
      frontRimType,
      rearRimType,
      frontRimWidth: parseFloat(frontRimWidth) || 0,
      rearRimWidth: parseFloat(rearRimWidth) || 0,
      frontCasing,
      rearCasing
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

  const weightComplete = Boolean(parseFloat(riderWeight));
  const disciplineComplete = Boolean(discipline);
  const surfaceComplete = Boolean(surface);
  const rimsComplete =
    Boolean(frontRimType) &&
    Boolean(rearRimType) &&
    Boolean(parseFloat(frontRimWidth)) &&
    Boolean(parseFloat(rearRimWidth));
  const tireComplete = Boolean(parseFloat(frontWidth)) && Boolean(parseFloat(rearWidth));

  const progressSteps = [
    { label: "Weight", complete: weightComplete },
    { label: "Discipline", complete: disciplineComplete },
    { label: "Surface", complete: surfaceComplete },
    { label: "Rims", complete: rimsComplete },
    { label: "Tire", complete: tireComplete }
  ];

  const completedSteps = progressSteps.filter((step) => step.complete).length;
  const progressPercent = Math.round((completedSteps / progressSteps.length) * 100);

  return (
    <div className="min-h-screen bg-slate-100 text-neutral-900">
      <main className="mx-auto flex min-h-screen max-w-5xl flex-col gap-12 px-4 py-16 sm:px-6 lg:px-10">
        <header className="rounded-3xl border border-neutral-200 bg-white px-6 py-12 shadow-sm sm:px-10">
          <div className="space-y-5 text-center sm:text-left">
            <p className="text-sm font-medium text-neutral-500">Tire pressure guide</p>
            <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">Find your perfect tire pressure</h1>
            <p className="mx-auto max-w-2xl text-base leading-relaxed text-neutral-600 sm:text-lg">
              Set up your bike with confidence using a streamlined, material-inspired layout that keeps every decision clear and approachable on any device.
            </p>
          </div>
        </header>

        <section className="rounded-3xl border border-neutral-900/20 bg-neutral-900 px-6 py-10 text-white shadow-xl shadow-neutral-900/30 sm:px-10">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-4">
              <p className="text-sm font-medium text-white/70">Recommended setup</p>
              <h2 className="text-2xl font-semibold sm:text-3xl">Ride-ready pressures</h2>
              <p className="max-w-xl text-sm leading-relaxed text-white/70">
                Use these values as a confident baseline, then fine-tune a touch for terrain, weather, and personal feel.
              </p>
            </div>
            <BoltIcon className="hidden h-12 w-12 shrink-0 text-white/30 sm:block" aria-hidden />
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/15 bg-white/5 px-6 py-6 text-center shadow-lg shadow-black/20">
              <p className="text-sm font-medium text-white/70">Front</p>
              <p className="mt-3 text-3xl font-semibold sm:text-4xl">{showResults && pressures ? formatNumber(pressures.front) : "--"}</p>
              <p className="text-sm font-medium text-white/60">{unitLabel}</p>
            </div>
            <div className="rounded-2xl border border-white/15 bg-white/5 px-6 py-6 text-center shadow-lg shadow-black/20">
              <p className="text-sm font-medium text-white/70">Rear</p>
              <p className="mt-3 text-3xl font-semibold sm:text-4xl">{showResults && pressures ? formatNumber(pressures.rear) : "--"}</p>
              <p className="text-sm font-medium text-white/60">{unitLabel}</p>
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-neutral-200 bg-white px-6 py-8 shadow-xl sm:px-8">
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
                  onChange={setPressureUnit}
                  options={[
                    { label: "psi", value: "PSI" },
                    { label: "bar", value: "BAR" }
                  ]}
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="h-2 w-full overflow-hidden rounded-full bg-neutral-200">
                <div
                  className="h-full rounded-full bg-neutral-900 transition-[width] duration-300"
                  style={{ width: `${progressPercent}%` }}
                  aria-hidden
                />
              </div>
              <div className="grid gap-3 text-sm text-neutral-600 sm:grid-cols-5">
                {progressSteps.map((step, index) => (
                  <div key={step.label} className="flex items-center gap-2">
                    <span
                      className={clsx(
                        "flex h-8 w-8 items-center justify-center rounded-full border text-sm font-medium",
                        step.complete
                          ? "border-neutral-900 bg-neutral-900 text-white"
                          : "border-neutral-300 bg-white text-neutral-500"
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
            className="mt-10 space-y-8"
            onSubmit={(event) => {
              event.preventDefault();
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
                      "rounded-lg border border-neutral-300 bg-white px-4 py-2 text-sm font-medium text-neutral-600 shadow-sm transition",
                      discipline === option.value
                        ? "border-neutral-900 bg-neutral-900 text-white shadow"
                        : "hover:border-neutral-400 hover:text-neutral-900"
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
                      "rounded-lg border border-neutral-300 bg-white px-4 py-2 text-sm font-medium text-neutral-600 shadow-sm transition",
                      surface === option.value
                        ? "border-neutral-900 bg-neutral-900 text-white shadow"
                        : "hover:border-neutral-400 hover:text-neutral-900"
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
                  onChange={(event) => {
                    setFrontRimType(event.target.value as RimType);
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
                  onChange={(event) => {
                    setRearRimType(event.target.value as RimType);
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
                  onChange={(event) => {
                    setFrontCasing(event.target.value as TireCasing);
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
                  onChange={(event) => {
                    setRearCasing(event.target.value as TireCasing);
                    setShowResults(false);
                  }}
                  options={casingOptions}
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-lg bg-neutral-900 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-neutral-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900"
              >
                Calculate
              </button>
            </div>
          </form>
        </section>
      </main>
    </div>
  );
}
