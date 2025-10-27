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
    <div className="min-h-screen bg-violet-50 text-neutral-900">
      <header className="border-b border-purple-100/70 bg-white/80 backdrop-blur">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-10">
          <span className="inline-flex items-center rounded-full bg-purple-100 px-4 py-1 text-sm font-semibold text-purple-700">
            Tire Pressure Studio
          </span>
          <h1 className="mt-6 max-w-3xl text-4xl font-semibold leading-tight tracking-tight text-neutral-900 sm:text-5xl lg:text-6xl">
            Dial in confident tire pressure for every ride.
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-neutral-600 sm:text-lg">
            Guide your setup from weight to casing in a few quick steps, then review tailored recommendations aligned to your terrain, rims, and riding discipline.
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-10">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1.5fr)_minmax(320px,1fr)]">
          <section className="rounded-3xl border border-purple-100/80 bg-white/90 p-8 shadow-xl shadow-purple-200/50 backdrop-blur">
            <div className="space-y-8">
              <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-semibold text-purple-600">Setup progress</p>
                  <p className="text-sm text-purple-500">{progressPercent}% complete</p>
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
                <div className="h-2 w-full overflow-hidden rounded-full bg-purple-100">
                  <div
                    className="h-full rounded-full bg-purple-500 transition-[width] duration-300"
                    style={{ width: `${progressPercent}%` }}
                    aria-hidden
                  />
                </div>
                <div className="grid gap-3 text-sm text-neutral-600 sm:grid-cols-5">
                  {progressSteps.map((step, index) => (
                    <div key={step.label} className="flex items-center gap-2">
                      <span
                        className={clsx(
                          "flex h-9 w-9 items-center justify-center rounded-full border text-sm font-semibold",
                          step.complete
                            ? "border-purple-500 bg-purple-500 text-white"
                            : "border-purple-100 bg-white text-neutral-400"
                        )}
                      >
                        {index + 1}
                      </span>
                      <span className="font-medium">{step.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              <form
                id="setup-form"
                className="space-y-10"
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
                  <p className="text-xs font-semibold uppercase tracking-[0.25em] text-neutral-500">Weight</p>
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

                <div className="space-y-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.25em] text-neutral-500">Discipline</p>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {disciplineOptions.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => {
                          setDiscipline(option.value);
                          setShowResults(false);
                        }}
                        className={clsx(
                          "rounded-lg border border-purple-100 bg-white px-4 py-3 text-sm font-semibold text-left transition",
                          discipline === option.value
                            ? "border-purple-500 bg-purple-500/10 text-purple-700 shadow-sm"
                            : "text-neutral-600 hover:border-purple-200 hover:text-purple-700"
                        )}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.25em] text-neutral-500">Surface</p>
                  <div className="flex flex-wrap gap-2">
                    {surfaceOptions.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => {
                          setSurface(option.value);
                          setShowResults(false);
                        }}
                        className={clsx(
                          "rounded-full border border-purple-100 bg-white px-4 py-2 text-sm font-medium transition",
                          surface === option.value
                            ? "border-purple-500 bg-purple-500 text-white shadow-sm"
                            : "text-neutral-600 hover:border-purple-200 hover:text-purple-700"
                        )}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid gap-10 lg:grid-cols-2">
                  <div className="space-y-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.25em] text-neutral-500">Front rims</p>
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
                    <p className="text-xs font-semibold uppercase tracking-[0.25em] text-neutral-500">Rear rims</p>
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

                <div className="grid gap-10 lg:grid-cols-2">
                  <div className="space-y-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.25em] text-neutral-500">Front tire</p>
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
                    <p className="text-xs font-semibold uppercase tracking-[0.25em] text-neutral-500">Rear tire</p>
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
            </div>
          </section>

          <aside className="flex flex-col gap-6">
            <div className="rounded-3xl border border-purple-900/40 bg-gradient-to-br from-purple-700 via-purple-800 to-purple-950 p-8 text-white shadow-2xl shadow-purple-900/60">
              <div className="flex items-start justify-between gap-6">
                <div>
                  <p className="text-sm font-medium text-purple-200/90">Recommended setup</p>
                  <h2 className="mt-2 text-3xl font-semibold">Baseline pressures</h2>
                  <p className="mt-4 text-sm text-white/60">
                    Use these as a starting point, then make one-click tweaks once you feel the terrain and grip on the day.
                  </p>
                </div>
                <BoltIcon className="hidden h-12 w-12 shrink-0 text-purple-200/40 lg:block" aria-hidden />
              </div>
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-white/5 px-6 py-6 text-center shadow-lg shadow-black/40">
                  <p className="text-sm font-medium text-white/60">Front</p>
                  <p className="mt-3 text-3xl font-semibold sm:text-4xl">{showResults && pressures ? formatNumber(pressures.front) : "--"}</p>
                  <p className="text-sm font-medium text-white/50">{unitLabel}</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 px-6 py-6 text-center shadow-lg shadow-black/40">
                  <p className="text-sm font-medium text-white/60">Rear</p>
                  <p className="mt-3 text-3xl font-semibold sm:text-4xl">{showResults && pressures ? formatNumber(pressures.rear) : "--"}</p>
                  <p className="text-sm font-medium text-white/50">{unitLabel}</p>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-purple-100/70 bg-white/80 p-6 shadow-lg shadow-purple-100/70">
              <h3 className="text-lg font-semibold text-neutral-900">Recommendations</h3>
              <ul className="mt-4 space-y-3 text-sm text-neutral-600">
                <li className="flex items-start gap-3">
                  <span className="mt-1 h-2.5 w-2.5 rounded-full bg-purple-400" aria-hidden />
                  Balance grip and speed by letting the front run slightly lower than the rear.
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 h-2.5 w-2.5 rounded-full bg-purple-400" aria-hidden />
                  Recheck pressure before each ride—temperature swings can move readings by 1-2 {unitLabel}.
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 h-2.5 w-2.5 rounded-full bg-purple-400" aria-hidden />
                  Adjust ±1 {unitLabel} to tune comfort once you sample the day’s terrain.
                </li>
              </ul>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
              <button
                type="submit"
                form="setup-form"
                disabled={!readyToCalculate}
                className={clsx(
                  "flex-1 rounded-full px-6 py-4 text-sm font-semibold uppercase tracking-[0.25em] transition sm:min-w-[220px]",
                  readyToCalculate
                    ? "bg-purple-500 text-white shadow-lg shadow-purple-400/40 hover:bg-purple-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-200"
                    : "cursor-not-allowed bg-purple-100 text-purple-400"
                )}
              >
                CALCULATE
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center justify-center rounded-full border border-purple-200 bg-white/70 px-6 py-4 text-sm font-semibold uppercase tracking-[0.25em] text-purple-600 transition hover:border-purple-300 hover:text-purple-700 sm:w-auto"
              >
                RESET
              </button>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
