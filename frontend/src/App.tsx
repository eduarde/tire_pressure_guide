import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import clsx from "clsx";
import { InputField, SelectField, SegmentedControl } from "./components";
import { BoltIcon, CloudIcon } from "@heroicons/react/24/outline";
import { SunIcon, CheckIcon } from "@heroicons/react/24/solid";

// Custom SVG icons for weather
const UmbrellaIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 12h18M3 12a9 9 0 0118 0M12 12v7m0 0a2 2 0 104 0" />
  </svg>
);

const SnowflakeIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v18M3 12h18M6.34 6.34l11.32 11.32M6.34 17.66L17.66 6.34M9 3l3 3m0 0l3-3M9 21l3-3m0 0l3 3M3 9l3 3m0 0l-3 3M21 9l-3 3m0 0l3 3" />
  </svg>
);

type Surface = "DRY" | "WET" | "MIXED" | "SNOW";
type PressureUnits = "PSI" | "BAR";
type MassUnit = "kg" | "lbs";
type RimType = "HOOKLESS" | "HOOKED" | "TUBULAR" | "TUBES";
type TireCasing = "STANDARD" | "REINFORCED" | "THIN" | "DOWNHILL_CASING";
type WidthUnit = "MM" | "IN";

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
  | "MTB_XC"
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
  { value: "MTB_XC", label: "XC" },
  { value: "MTB_TRAIL", label: "Trail" },
  { value: "MTB_ENDURO", label: "Enduro" },
  { value: "MTB_DOWNHILL", label: "Downhill" }
];

const surfaceOptions: { value: Surface; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { value: "DRY", label: "Dry", icon: SunIcon },
  { value: "WET", label: "Wet", icon: UmbrellaIcon },
  { value: "MIXED", label: "Mixed", icon: CloudIcon },
  { value: "SNOW", label: "Snow", icon: SnowflakeIcon }
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
  const [rearRimType, setRearRimType] = useState<RimType | "">("");
  const [tireCasing, setTireCasing] = useState<TireCasing | "">("");
  const [rearTireCasing, setRearTireCasing] = useState<TireCasing | "">("");

  const [riderWeight, setRiderWeight] = useState("");
  const [bikeWeight, setBikeWeight] = useState("");
  const [tireWidth, setTireWidth] = useState("");
  const [rearTireWidth, setRearTireWidth] = useState("");
  const [rimWidth, setRimWidth] = useState("");
  const [rearRimWidth, setRearRimWidth] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [apiResult, setApiResult] = useState<ApiPressureResponse | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(0);

  const pressures = useMemo(() => {
    if (!apiResult) return null;

    return {
      front: convertPressure(apiResult.front_wheel, apiResult.unit, pressureUnit),
      rear: convertPressure(apiResult.rear_wheel, apiResult.unit, pressureUnit)
    } satisfies PressureResult;
  }, [apiResult, pressureUnit]);

  const widthUnit: WidthUnit = useMemo(() => {
    if (!discipline) return "MM";
    return ["MTB_XC", "MTB_TRAIL", "MTB_ENDURO", "MTB_DOWNHILL"].includes(discipline)
      ? "IN"
      : "MM";
  }, [discipline]);

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
    setRearRimType("");
    setTireCasing("");
    setRearTireCasing("");
    setRiderWeight("");
    setBikeWeight("");
    setTireWidth("");
    setRearTireWidth("");
    setRimWidth("");
    setRearRimWidth("");
    setMassUnit("kg");
    setPressureUnit("PSI");
    setIsCalculating(false);
    setCurrentStep(0);
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
    const rearTireWidthValue = parseFloat(rearTireWidth);
    const rimWidthValue = parseFloat(rimWidth);
    const rearRimWidthValue = parseFloat(rearRimWidth);

    const riderWeightKg =
      massUnit === "kg" ? riderWeightValue : riderWeightValue * 0.453592;
    const bikeWeightKg =
      massUnit === "kg" ? bikeWeightValue : bikeWeightValue * 0.453592;

    // Convert tire widths to mm if in inches
    const frontTireWidthMm = widthUnit === "IN" ? tireWidthValue * 25.4 : tireWidthValue;
    const rearTireWidthMm = widthUnit === "IN" ? rearTireWidthValue * 25.4 : rearTireWidthValue;

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
              width: frontTireWidthMm,
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
              width: rearTireWidthMm,
              position: "REAR",
              casing: rearTireCasing as TireCasing,
              unit: "MM"
            },
            rear_wheel: {
              rim_width: rearRimWidthValue,
              rim_type: rearRimType as RimType,
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

  const disciplineComplete = Boolean(discipline);
  const surfaceComplete = Boolean(surface);
  const weightComplete = Boolean(parseFloat(riderWeight)) && Boolean(parseFloat(bikeWeight));
  const rimsComplete = Boolean(rimType) && Boolean(parseFloat(rimWidth)) && Boolean(rearRimType) && Boolean(parseFloat(rearRimWidth));
  const tireComplete = Boolean(parseFloat(tireWidth)) && Boolean(tireCasing) && Boolean(parseFloat(rearTireWidth)) && Boolean(rearTireCasing);

  type StepConfig = {
    key: string;
    label: string;
    complete: boolean;
    content: ReactNode;
  };

  const stepConfigs: StepConfig[] = [
    {
      key: "discipline",
      label: "Discipline",
      complete: disciplineComplete,
      content: (
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
                "rounded-lg border border-purple-100 bg-white px-4 py-3 text-left text-sm font-semibold transition",
                discipline === option.value
                  ? "border-purple-500 bg-purple-500/10 text-purple-700 shadow-sm"
                  : "text-neutral-600 hover:border-purple-200 hover:text-purple-700"
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      )
    },
    {
      key: "surface",
      label: "Surface",
      complete: surfaceComplete,
      content: (
        <div className="flex flex-wrap gap-2">
          {surfaceOptions.map((option) => {
            const Icon = option.icon;
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  setSurface(option.value);
                  clearResults();
                }}
                className={clsx(
                  "flex items-center gap-2 rounded-full border border-purple-100 bg-white px-4 py-2 text-sm font-medium transition",
                  surface === option.value
                    ? "border-purple-500 bg-purple-100 text-purple-700 shadow-sm"
                    : "text-neutral-600 hover:border-purple-200 hover:text-purple-700"
                )}
              >
                <Icon className="h-4 w-4" />
                {option.label}
              </button>
            );
          })}
        </div>
      )
    },
    {
      key: "weight",
      label: "Weight",
      complete: weightComplete,
      content: (
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
      )
    },
    {
      key: "rims",
      label: "Rims",
      complete: rimsComplete,
      content: (
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-neutral-700">Front</h3>
            <SelectField
              label="Rim type"
              value={rimType}
              placeholder="Select rim type"
              onChange={(event) => {
                const value = event.target.value as RimType | "";
                setRimType(value);
                setRearRimType(value); // Sync rear with front
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
                setRearRimWidth(event.target.value); // Sync rear with front
                clearResults();
              }}
              unit="mm"
            />
          </div>
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-neutral-700">Rear</h3>
            <SelectField
              label="Rim type"
              value={rearRimType}
              placeholder="Select rim type"
              onChange={(event) => {
                setRearRimType(event.target.value as RimType | "");
                clearResults();
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
                clearResults();
              }}
              unit="mm"
            />
          </div>
        </div>
      )
    },
    {
      key: "tires",
      label: "Tires",
      complete: tireComplete,
      content: (
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-neutral-700">Front</h3>
            <InputField
              label="Width"
              type="number"
              inputMode="decimal"
              value={tireWidth}
              min={0}
              step="any"
              onChange={(event) => {
                setTireWidth(event.target.value);
                setRearTireWidth(event.target.value); // Sync rear with front
                clearResults();
              }}
              unit={widthUnit === "IN" ? "in" : "mm"}
            />
            <SelectField
              label="Casing"
              value={tireCasing}
              placeholder="Select casing"
              onChange={(event) => {
                const value = event.target.value as TireCasing | "";
                setTireCasing(value);
                setRearTireCasing(value); // Sync rear with front
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
              value={rearTireWidth}
              min={0}
              step="any"
              onChange={(event) => {
                setRearTireWidth(event.target.value);
                clearResults();
              }}
              unit={widthUnit === "IN" ? "in" : "mm"}
            />
            <SelectField
              label="Casing"
              value={rearTireCasing}
              placeholder="Select casing"
              onChange={(event) => {
                setRearTireCasing(event.target.value as TireCasing | "");
                clearResults();
              }}
              options={casingOptions}
            />
          </div>
        </div>
      )
    }
  ];

  const progressSteps = stepConfigs.map(({ label, complete }) => ({
    label,
    complete
  }));

  const activeStep = stepConfigs[currentStep];
  const completedSteps = progressSteps.filter((step) => step.complete).length;
  const progressPercent = Math.round((completedSteps / progressSteps.length) * 100);
  const readyToCalculate = progressPercent === 100;
  const canSubmit = readyToCalculate && !isCalculating;
  const maxStepIndex = stepConfigs.length - 1;
  const canGoBack = currentStep > 0;
  const canGoNext = currentStep < maxStepIndex && stepConfigs[currentStep].complete;
  const nextStepLabel = stepConfigs[currentStep + 1]?.label;
  const canCalculate = canSubmit && currentStep === maxStepIndex;

  const handleNext = () => {
    if (currentStep < maxStepIndex && stepConfigs[currentStep].complete) {
      setCurrentStep((previous) => Math.min(previous + 1, maxStepIndex));
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((previous) => Math.max(previous - 1, 0));
    }
  };

  return (
    <div className="min-h-screen bg-[#fdfcf3] text-neutral-900">
      <header className="cartoon-wave relative overflow-hidden border-b-4 border-neutral-900 bg-lime-200/80 shadow-[0_18px_0_rgba(17,24,39,0.1)]">
        <div
          className="pointer-events-none absolute inset-0 opacity-70"
          aria-hidden
        >
          <div className="absolute -left-24 top-4 h-56 w-56 rounded-full bg-[radial-gradient(circle_at_center,#fef08a,transparent_65%)]" />
          <div className="absolute right-0 top-0 h-64 w-64 rounded-full bg-[radial-gradient(circle_at_center,#bbf7d0,transparent_60%)]" />
          <div className="absolute -bottom-16 left-1/2 h-48 w-48 -translate-x-1/2 rounded-[40%] bg-[radial-gradient(circle_at_center,#a7f3d0,transparent_60%)]" />
        </div>
        <div className="relative mx-auto max-w-4xl px-6 py-24 text-center sm:px-8 lg:px-10">
          {/* <span className="inline-flex items-center gap-2 rounded-full border-2 border-neutral-900 bg-white px-6 py-2 text-xs font-black uppercase tracking-[0.3em] text-neutral-900 shadow-[6px_6px_0_rgba(17,24,39,0.12)]">
            Tire Pressure Studio
          </span> */}
          <h1 className="mt-8 text-4xl font-black leading-tight text-neutral-900 sm:text-5xl lg:text-6xl">
            No charts, no guesswork — just the right pressure, every time.
          </h1>
          <p className="mt-6 text-base leading-relaxed text-neutral-700 sm:text-lg">
            Guide your setup from weight to casing in a few quick steps, then review tailored recommendations aligned to your terrain, rims, and riding discipline.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4 text-sm font-semibold text-neutral-800">
            <span className="cartoon-chip">Precise setup wizard</span>
            <span className="cartoon-chip">Discipline-aware guidance</span>
            <span className="cartoon-chip">Instant tire targets</span>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 pb-16 pt-24 sm:px-6 lg:px-10">
        <div className="grid gap-14 lg:grid-cols-[3fr_2fr]">
          <div className="space-y-6">
            <section className="cartoon-card flex h-[480px] flex-col bg-white/95 p-8">
              <div className="flex-1 space-y-8 overflow-y-auto">
                <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.3em] text-neutral-800">Setup progress</p>
                    <p className="text-sm text-neutral-500">{progressPercent}% ready</p>
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

                <div className="space-y-6">
                  <div className="flex items-center gap-2">
                    {progressSteps.map((step, index) => {
                      const isCompleted = step.complete;
                      const isCurrent = currentStep === index;
                      const connectorActive = index < completedSteps;

                      return (
                        <div
                          key={step.label}
                          className={clsx(
                            "flex items-center",
                            index < progressSteps.length - 1 ? "flex-1" : "flex-none"
                          )}
                        >
                          <span
                            className={clsx(
                              "flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border-[3px] text-base font-bold transition-all",
                              isCompleted
                                ? "border-neutral-900 bg-neutral-900 text-white"
                                : isCurrent
                                  ? "border-neutral-900 bg-white text-neutral-900 shadow-[4px_4px_0_rgba(17,24,39,0.12)]"
                                  : "border-neutral-300 bg-white text-neutral-300"
                            )}
                          >
                            {isCompleted ? <CheckIcon className="h-5 w-5" aria-hidden /> : index + 1}
                          </span>
                          {index < progressSteps.length - 1 ? (
                            <span
                              aria-hidden
                              className={clsx(
                                "mx-2 hidden h-1 flex-1 rounded-full transition-all sm:block",
                                connectorActive ? "bg-neutral-900" : "bg-neutral-300/80"
                              )}
                            />
                          ) : null}
                        </div>
                      );
                    })}
                  </div>
                  <div className="grid gap-3 text-[0.7rem] font-black uppercase tracking-[0.28em] text-neutral-500 sm:grid-cols-5">
                    {progressSteps.map((step) => (
                      <span key={`${step.label}-label`} className="text-center sm:text-left">
                        {step.label}
                      </span>
                    ))}
                  </div>
                </div>

                <form id="setup-form" className="space-y-10" onSubmit={handleSubmit}>
                  {activeStep ? (
                    <section key={activeStep.key} className="space-y-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.25em] text-neutral-500">
                        {activeStep.label}
                      </p>
                      {activeStep.content}
                    </section>
                  ) : null}
                </form>
              </div>
            </section>

            {/* Navigation Buttons */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={handleBack}
                disabled={!canGoBack}
                className={clsx(
                  "w-full rounded-full border-2 border-neutral-900 bg-white px-6 py-3 text-sm font-black uppercase tracking-[0.3em] text-neutral-900 shadow-[4px_4px_0_rgba(17,24,39,0.12)] transition-transform sm:w-auto",
                  canGoBack
                    ? "hover:-translate-y-[2px]"
                    : "cursor-not-allowed opacity-40 hover:translate-y-0"
                )}
              >
                Previous
              </button>
              {currentStep === maxStepIndex ? (
                <button
                  type="button"
                  onClick={handleReset}
                  className="w-full rounded-full border-2 border-neutral-900 bg-white px-6 py-3 text-sm font-black uppercase tracking-[0.3em] text-neutral-900 shadow-[4px_4px_0_rgba(17,24,39,0.12)] transition-transform hover:-translate-y-[2px] sm:w-auto"
                >
                  Reset
                </button>
              ) : null}
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              {currentStep < maxStepIndex ? (
                <button
                  type="button"
                  onClick={handleNext}
                  disabled={!canGoNext}
                  className={clsx(
                    "w-full rounded-full border-2 border-neutral-900 px-6 py-3 text-sm font-black uppercase tracking-[0.3em] transition-transform sm:w-auto",
                    canGoNext
                      ? "bg-neutral-900 text-lime-100 shadow-[6px_6px_0_rgba(17,24,39,0.18)] hover:-translate-y-[2px]"
                      : "cursor-not-allowed border-neutral-300 bg-neutral-200 text-neutral-500"
                  )}
                >
                  {nextStepLabel ? `Next: ${nextStepLabel}` : "Next"}
                </button>
              ) : (
                <button
                  type="submit"
                  form="setup-form"
                  disabled={!canCalculate}
                  className={clsx(
                    "w-full rounded-full border-2 border-neutral-900 px-6 py-3 text-sm font-black uppercase tracking-[0.3em] transition-transform sm:w-auto",
                    canCalculate
                      ? "bg-neutral-900 text-lime-100 shadow-[6px_6px_0_rgba(17,24,39,0.18)] hover:-translate-y-[2px]"
                      : "cursor-not-allowed border-neutral-300 bg-neutral-200 text-neutral-500"
                  )}
                >
                  {isCalculating ? "Calculating…" : "Calculate"}
                </button>
              )}
            </div>
          </div>
          </div>

          <aside className="flex flex-col gap-6">
            <div className="cartoon-card cartoon-card--contrast flex h-[480px] flex-col bg-gradient-to-br from-purple-700 via-purple-800 to-purple-950 p-8 text-white">
              <div className="flex items-start justify-between gap-6">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.3em] text-purple-200/80">Tire pressure</p>
                  <h2 className="mt-3 text-3xl font-black">Recommended</h2>
                  <p className="mt-4 text-sm text-white/70">
                    ⚠ The suggested pressures serve as an initial reference.
                  </p>
                </div>
                <BoltIcon className="hidden h-12 w-12 shrink-0 text-purple-200/50 lg:block" aria-hidden />
              </div>
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border-2 border-white/30 bg-white/10 px-6 py-6 text-center shadow-[6px_6px_0_rgba(15,23,42,0.2)]">
                  <p className="text-sm font-semibold text-white/70">Front</p>
                  <p className="mt-3 text-3xl font-black sm:text-4xl">{showResults && pressures ? formatNumber(pressures.front) : "--"}</p>
                  <p className="text-sm font-medium text-white/60">{unitLabel}</p>
                </div>
                <div className="rounded-2xl border-2 border-white/30 bg-white/10 px-6 py-6 text-center shadow-[6px_6px_0_rgba(15,23,42,0.2)]">
                  <p className="text-sm font-semibold text-white/70">Rear</p>
                  <p className="mt-3 text-3xl font-black sm:text-4xl">{showResults && pressures ? formatNumber(pressures.rear) : "--"}</p>
                  <p className="text-sm font-medium text-white/60">{unitLabel}</p>
                </div>
              </div>
              <div className="mt-6 text-sm">
                {isCalculating ? (
                  <p className="rounded-2xl border-2 border-white/30 bg-white/10 px-4 py-3 text-center text-purple-100/90">
                    Crunching the numbers…
                  </p>
                ) : errorMessage ? (
                  <p className="rounded-2xl border-2 border-rose-200/60 bg-rose-500/30 px-4 py-3 text-center font-semibold text-rose-100">
                    {errorMessage}
                  </p>
                ) : showResults ? (
                  <p className="rounded-2xl border-2 border-white/30 bg-white/10 px-4 py-3 text-center text-white/80">
                    Further adjustments are recommended to fine-tune performance for your specific setup and riding conditions.
                  </p>
                ) : (
                  <p className="rounded-2xl border-2 border-white/30 bg-white/10 px-4 py-3 text-center text-white/80">
                    Complete the setup and calculate to unlock your tires pressure.
                  </p>
                )}
              </div>
            </div>

            {/* Recommendations Section */}
            <div className="cartoon-card bg-white/95 p-6">
              <h3 className="text-lg font-black text-neutral-900">Recommendations</h3>
              <ul className="mt-4 space-y-3 text-sm text-neutral-700">
                <li className="flex items-start gap-3">
                  <span className="mt-1 h-2.5 w-2.5 rounded-full bg-neutral-900" aria-hidden />
                  Balance grip and speed by letting the front run slightly lower than the rear.
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 h-2.5 w-2.5 rounded-full bg-neutral-900" aria-hidden />
                  Recheck pressure before each ride—temperature swings can move readings by 1-2 {unitLabel}.
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 h-2.5 w-2.5 rounded-full bg-neutral-900" aria-hidden />
                  Adjust ±1 {unitLabel} to tune comfort once you sample the day's terrain.
                </li>
              </ul>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
       

            