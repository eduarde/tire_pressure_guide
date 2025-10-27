import { useMemo, useState } from "react";
import clsx from "clsx";
import { InputField, SelectField, SegmentedControl } from "./components";
import { BoltIcon } from "@heroicons/react/24/outline";

type Surface = "DRY" | "WET" | "MIXED" | "SNOW";
type PressureUnits = "PSI" | "BAR";
type MassUnit = "kg" | "lbs";
type RimType = "HOOKLESS" | "HOOKED" | "TUBULAR" | "TUBES";
type TireCasing = "STANDARD" | "REINFORCED" | "THIN" | "DOWNHILL_CASING";

const API_BASE_URL = import.meta.env.VITE_API_URL ?? "http://127.0.0.1:8088";
const API_ENDPOINT = `${API_BASE_URL}/compute`;


interface ApiPressureResponse {
  front_wheel: number;
  rear_wheel: number;
  unit: PressureUnits;
}

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

function convertPressure(value: number, from: PressureUnits, to: PressureUnits) {
  if (from === to) {
    return value;
  }

  if (from === "PSI" && to === "BAR") {
    return value / 14.5038;
  }

  if (from === "BAR" && to === "PSI") {
    return value * 14.5038;
  }

  return value;
}

export default function App() {
  const [massUnit, setMassUnit] = useState<MassUnit>("kg");
  const [pressureUnit, setPressureUnit] = useState<PressureUnits>("PSI");
  const [discipline, setDiscipline] = useState<Discipline | "">("");
  const [surface, setSurface] = useState<Surface | "">("");
  const [rimType, setRimType] = useState<RimType | "">("");
  const [tireCasing, setTireCasing] = useState<TireCasing | "">("");

  const [riderWeight, setRiderWeight] = useState("");
  const [bikeWeight, setBikeWeight] = useState("");
  const [tireWidth, setTireWidth] = useState("");
  const [rimWidth, setRimWidth] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [apiResult, setApiResult] = useState<ApiPressureResponse | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const pressures = useMemo(() => {
    if (!apiResult) return null;

    return {
      front: convertPressure(apiResult.front_wheel, apiResult.unit, pressureUnit),
      rear: convertPressure(apiResult.rear_wheel, apiResult.unit, pressureUnit)
    } satisfies PressureResult;
  }, [apiResult, pressureUnit]);

  const unitLabel = pressureUnit === "PSI" ? "psi" : "bar";

  const clearResults = () => {
    setShowResults(false);
    setApiResult(null);
    setErrorMessage(null);
  };

  const handleReset = () => {
    setDiscipline("");
    setSurface("");
    setRimType("");
    setTireCasing("");
    setRiderWeight("");
    setBikeWeight("");
    setTireWidth("");
    setRimWidth("");
    setMassUnit("kg");
    setPressureUnit("PSI");
    setIsCalculating(false);
    clearResults();
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!readyToCalculate || isCalculating) {
      setShowResults(false);
      return;
    }

    setIsCalculating(true);
    setErrorMessage(null);

    const riderWeightValue = parseFloat(riderWeight);
    const bikeWeightValue = parseFloat(bikeWeight);
    const tireWidthValue = parseFloat(tireWidth);
    const rimWidthValue = parseFloat(rimWidth);

    const riderWeightKg =
      massUnit === "kg" ? riderWeightValue : riderWeightValue * 0.453592;
    const bikeWeightKg =
      massUnit === "kg" ? bikeWeightValue : bikeWeightValue * 0.453592;

    try {
      const response = await fetch(API_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          accept: "application/json"
        },
        body: JSON.stringify({
          bike: {
            name: "Custom setup",
            discipline: discipline as Discipline,
            front_tire: {
              width: tireWidthValue,
              position: "FRONT",
              casing: tireCasing as TireCasing,
              unit: "MM"
            },
            front_wheel: {
              rim_width: rimWidthValue,
              rim_type: rimType as RimType,
              position: "FRONT",
              diameter: "700C"
            },
            rear_tire: {
              width: tireWidthValue,
              position: "REAR",
              casing: tireCasing as TireCasing,
              unit: "MM"
            },
            rear_wheel: {
              rim_width: rimWidthValue,
              rim_type: rimType as RimType,
              position: "REAR",
              diameter: "700C"
            },
            weight: {
              value: bikeWeightKg,
              unit: "kg"
            }
          },
          rider_weight: {
            value: riderWeightKg,
            unit: "kg"
          },
          surface: surface as Surface
        })
      });

      if (!response.ok) {
        throw new Error("Failed to fetch tire pressure recommendations");
      }

      const data: ApiPressureResponse = await response.json();
      setApiResult(data);
      setShowResults(true);
    } catch (error) {
      console.error(error);
      setApiResult(null);
      setShowResults(false);
      setErrorMessage("We couldn't fetch recommendations right now. Please try again.");
    } finally {
      setIsCalculating(false);
    }
  };

  const weightComplete = Boolean(parseFloat(riderWeight)) && Boolean(parseFloat(bikeWeight));
  const disciplineComplete = Boolean(discipline);
  const surfaceComplete = Boolean(surface);
  const rimsComplete = Boolean(rimType) && Boolean(parseFloat(rimWidth));
  const tireComplete = Boolean(parseFloat(tireWidth)) && Boolean(tireCasing);

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
  const canSubmit = readyToCalculate && !isCalculating;

  return (
    <div className="min-h-screen bg-violet-50 text-neutral-900">
      <header className="border-b border-purple-100/70 bg-white/80 backdrop-blur">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-10">
          <span className="inline-flex items-center rounded-full bg-purple-100 px-4 py-1 text-sm font-semibold text-purple-700">
            Tire Pressure Studio
          </span>
          <h1 className="mt-6 max-w-3xl text-4xl font-semibold leading-tight tracking-tight text-neutral-900 sm:text-5xl lg:text-6xl">
            No charts, no guesswork — just the right pressure, every time.
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
                      clearResults();
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

              <form id="setup-form" className="space-y-10" onSubmit={handleSubmit}>
                <section className="space-y-4">
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
                        clearResults();
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
                        clearResults();
                      }}
                      unit={massUnit}
                    />
                  </div>
                </section>

                <hr className="border-purple-100/70" />

                <section className="space-y-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.25em] text-neutral-500">Discipline</p>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {disciplineOptions.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => {
                          setDiscipline(option.value);
                          clearResults();
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
                </section>

                <hr className="border-purple-100/70" />

                <section className="space-y-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.25em] text-neutral-500">Surface</p>
                  <div className="flex flex-wrap gap-2">
                    {surfaceOptions.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => {
                          setSurface(option.value);
                          clearResults();
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
                </section>

                <hr className="border-purple-100/70" />

                <section className="space-y-6">
                  <p className="text-xs font-semibold uppercase tracking-[0.25em] text-neutral-500">Rims</p>
                  <div className="grid gap-8 lg:grid-cols-2">
                    <div className="space-y-4">
                      <h3 className="text-sm font-semibold text-neutral-700">Front</h3>
                      <SelectField
                        label="Rim type"
                        value={rimType}
                        placeholder="Select rim type"
                        onChange={(event) => {
                          setRimType(event.target.value as RimType | "");
                          clearResults();
                        }}
                        options={rimTypeOptions}
                      />
                      <InputField
                        label="Rim width"
                        type="number"
                        inputMode="decimal"
                        value={rimWidth}
                        min={0}
                        onChange={(event) => {
                          setRimWidth(event.target.value);
                          clearResults();
                        }}
                        unit="mm"
                      />
                    </div>
                    <div className="space-y-4">
                      <h3 className="text-sm font-semibold text-neutral-700">Rear</h3>
                      <SelectField
                        label="Rim type"
                        value={rimType}
                        placeholder="Select rim type"
                        helper="Mirrors front selection"
                        onChange={(event) => {
                          setRimType(event.target.value as RimType | "");
                          clearResults();
                        }}
                        options={rimTypeOptions}
                      />
                      <InputField
                        label="Rim width"
                        type="number"
                        inputMode="decimal"
                        value={rimWidth}
                        min={0}
                        helper="Synced with front"
                        onChange={(event) => {
                          setRimWidth(event.target.value);
                          clearResults();
                        }}
                        unit="mm"
                      />
                    </div>
                  </div>
                </section>

                <hr className="border-purple-100/70" />

                <section className="space-y-6">
                  <p className="text-xs font-semibold uppercase tracking-[0.25em] text-neutral-500">Tires</p>
                  <div className="grid gap-8 lg:grid-cols-2">
                    <div className="space-y-4">
                      <h3 className="text-sm font-semibold text-neutral-700">Front</h3>
                      <InputField
                        label="Width"
                        type="number"
                        inputMode="decimal"
                        value={tireWidth}
                        min={0}
                        onChange={(event) => {
                          setTireWidth(event.target.value);
                          clearResults();
                        }}
                        unit="mm"
                      />
                      <SelectField
                        label="Casing"
                        value={tireCasing}
                        placeholder="Select casing"
                        onChange={(event) => {
                          setTireCasing(event.target.value as TireCasing | "");
                          clearResults();
                        }}
                        options={casingOptions}
                      />
                    </div>
                    <div className="space-y-4">
                      <h3 className="text-sm font-semibold text-neutral-700">Rear</h3>
                      <InputField
                        label="Width"
                        type="number"
                        inputMode="decimal"
                        value={tireWidth}
                        min={0}
                        helper="Synced with front"
                        onChange={(event) => {
                          setTireWidth(event.target.value);
                          clearResults();
                        }}
                        unit="mm"
                      />
                      <SelectField
                        label="Casing"
                        value={tireCasing}
                        placeholder="Select casing"
                        helper="Mirrors front selection"
                        onChange={(event) => {
                          setTireCasing(event.target.value as TireCasing | "");
                          clearResults();
                        }}
                        options={casingOptions}
                      />
                    </div>
                  </div>
                </section>
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
                    ⚠ The suggested pressures serve as an initial reference. 
                    Further adjustment is advised to optimize performance for your specific configuration and conditions.
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
              <div className="mt-6 text-sm">
                {isCalculating ? (
                  <p className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-center text-purple-100/90">
                    Crunching the numbers…
                  </p>
                ) : errorMessage ? (
                  <p className="rounded-2xl border border-white/10 bg-rose-500/20 px-4 py-3 text-center font-medium text-rose-100">
                    {errorMessage}
                  </p>
                ) : !showResults ? (
                  <p className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-center text-white/70">
                    Complete the setup and calculate to unlock your pressures.
                  </p>
                ) : null}
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <button
                type="submit"
                form="setup-form"
                disabled={!canSubmit}
                className={clsx(
                  "w-full rounded-full px-6 py-4 text-sm font-semibold uppercase tracking-[0.25em] transition sm:flex-1",
                  canSubmit
                    ? "bg-purple-500 text-white shadow-lg shadow-purple-400/40 hover:bg-purple-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-200"
                    : "cursor-not-allowed bg-purple-100 text-purple-400"
                )}
              >
                {isCalculating ? "CALCULATING…" : "CALCULATE"}
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="w-full rounded-full border border-purple-200 bg-white/70 px-6 py-4 text-sm font-semibold uppercase tracking-[0.25em] text-purple-600 transition hover:border-purple-300 hover:text-purple-700 sm:w-auto sm:flex-none"
              >
                RESET
              </button>
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
          </aside>
        </div>
      </main>
    </div>
  );
}
