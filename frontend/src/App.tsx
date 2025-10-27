import { useMemo, useState } from "react";
import clsx from "clsx";
import { InputField, SelectField, SegmentedControl } from "./components";
import { BoltIcon } from "@heroicons/react/24/outline";

type Surface = "DRY" | "WET" | "MIXED" | "SNOW";
type PressureUnits = "PSI" | "BAR";
type MassUnit = "kg" | "lbs";
type RimType = "HOOKLESS" | "HOOKED" | "TUBULAR" | "TUBES";
type TireCasing = "STANDARD" | "REINFORCED" | "THIN" | "DOWNHILL_CASING";

type RideStyle =
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

const rideStyleOptions: { value: RideStyle; label: string }[] = [
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
    rideStyle: RideStyle;
    surface: Surface;
    rimType: RimType;
    frontCasing: TireCasing;
    rearCasing: TireCasing;
  },
  massUnit: MassUnit
) {
  const { riderWeight, bikeWeight, frontWidth, rearWidth, rideStyle, surface, rimType, frontCasing, rearCasing } = params;

  return useMemo(() => {
    if (!riderWeight || !frontWidth || !rearWidth) {
      return null;
    }

    const totalWeight = riderWeight + bikeWeight;
    const weightKg = massUnit === "kg" ? totalWeight : totalWeight * 0.453592;

    const base = 32 + weightKg * 0.18;

    const styleAdjustments: Record<RideStyle, number> = {
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

    const widthDeltaFront = 30 - frontWidth;
    const widthDeltaRear = 30 - rearWidth;

    const front =
      base +
      widthDeltaFront * 0.22 +
      (styleAdjustments[rideStyle] ?? 0) +
      (surfaceAdjustments[surface] ?? 0) +
      rimAdjustments[rimType] +
      casingAdjustments[frontCasing];

    const rear =
      base +
      widthDeltaRear * 0.19 +
      (styleAdjustments[rideStyle] ?? 0) +
      (surfaceAdjustments[surface] ?? 0) +
      rimAdjustments[rimType] +
      casingAdjustments[rearCasing] +
      1.5;

    return {
      front: Math.max(12, Math.min(75, front)),
      rear: Math.max(12, Math.min(78, rear))
    } satisfies PressureResult;
  }, [
    bikeWeight,
    frontCasing,
    frontWidth,
    massUnit,
    rearCasing,
    rearWidth,
    rideStyle,
    rimType,
    riderWeight,
    surface
  ]);
}

export default function App() {
  const [massUnit, setMassUnit] = useState<MassUnit>("kg");
  const [pressureUnit, setPressureUnit] = useState<PressureUnits>("PSI");
  const [rideStyle, setRideStyle] = useState<RideStyle>("ROAD");
  const [surface, setSurface] = useState<Surface>("DRY");
  const [rimType, setRimType] = useState<RimType>("HOOKLESS");
  const [frontCasing, setFrontCasing] = useState<TireCasing>("STANDARD");
  const [rearCasing, setRearCasing] = useState<TireCasing>("STANDARD");

  const [riderWeight, setRiderWeight] = useState("72");
  const [bikeWeight, setBikeWeight] = useState("8.5");
  const [frontWidth, setFrontWidth] = useState("28");
  const [rearWidth, setRearWidth] = useState("30");

  const calculated = useCalculatedPressure(
    {
      riderWeight: parseFloat(riderWeight) || 0,
      bikeWeight: parseFloat(bikeWeight) || 0,
      frontWidth: parseFloat(frontWidth) || 0,
      rearWidth: parseFloat(rearWidth) || 0,
      rideStyle,
      surface,
      rimType,
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

  return (
    <div className="min-h-screen bg-neutral-100 text-neutral-900">
      <main className="mx-auto flex min-h-screen max-w-5xl flex-col gap-8 px-4 py-10 sm:px-6 lg:px-8">
        <header className="space-y-4 text-center sm:text-left">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-emerald-600">Tire pressure guide</p>
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">Modern tire pressure calculator</h1>
          <p className="mx-auto max-w-3xl text-base leading-relaxed text-neutral-600 sm:text-lg">
            Dial in confident ride-ready pressures for any bike in just a few taps. Lightweight controls keep everything inline for quick adjustments wherever you roll.
          </p>
        </header>

        <section className="rounded-3xl bg-neutral-900 p-6 text-white shadow-xl shadow-neutral-900/30 sm:p-8">
          <div className="flex items-center justify-between gap-6">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-white/70">Recommended</p>
              <h2 className="mt-2 text-2xl font-semibold sm:text-3xl">Ride-ready pressures</h2>
              <p className="mt-3 max-w-xl text-xs leading-relaxed text-white/70 sm:text-sm">
                Tune by feel after the first kilometres. Ambient conditions and casing wear may nudge your final setting a touch higher or lower.
              </p>
            </div>
            <BoltIcon className="hidden h-10 w-10 shrink-0 text-emerald-300 sm:block" aria-hidden />
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl bg-white/10 px-4 py-5 text-center">
              <p className="text-[11px] uppercase tracking-[0.32em] text-white/70">Front</p>
              <p className="mt-3 text-3xl font-semibold sm:text-4xl">{pressures ? formatNumber(pressures.front) : "--"}</p>
              <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-emerald-200">{unitLabel}</p>
            </div>
            <div className="rounded-2xl bg-white/10 px-4 py-5 text-center">
              <p className="text-[11px] uppercase tracking-[0.32em] text-white/70">Rear</p>
              <p className="mt-3 text-3xl font-semibold sm:text-4xl">{pressures ? formatNumber(pressures.rear) : "--"}</p>
              <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-emerald-200">{unitLabel}</p>
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-neutral-200 bg-white/95 p-6 shadow-sm sm:p-8">
          <div className="flex flex-wrap items-center gap-3">
            <SegmentedControl
              value={massUnit}
              onChange={setMassUnit}
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

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <InputField
              label="Rider weight"
              type="number"
              inputMode="decimal"
              value={riderWeight}
              min={0}
              onChange={(event) => setRiderWeight(event.target.value)}
              unit={massUnit}
            />
            <InputField
              label="Bike weight"
              type="number"
              inputMode="decimal"
              value={bikeWeight}
              min={0}
              onChange={(event) => setBikeWeight(event.target.value)}
              unit={massUnit}
            />
          </div>

          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-neutral-500">Ride style</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {rideStyleOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setRideStyle(option.value)}
                    className={clsx(
                      "rounded-full border px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] transition",
                      rideStyle === option.value
                        ? "border-neutral-900 bg-neutral-900 text-white"
                        : "border-neutral-200 bg-white text-neutral-600 hover:border-neutral-300 hover:text-neutral-900"
                    )}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-neutral-500">Surface</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {surfaceOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setSurface(option.value)}
                    className={clsx(
                      "rounded-full border px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] transition",
                      surface === option.value
                        ? "border-neutral-900 bg-neutral-900 text-white"
                        : "border-neutral-200 bg-white text-neutral-600 hover:border-neutral-300 hover:text-neutral-900"
                    )}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6">
            <SelectField
              label="Rim type"
              value={rimType}
              onChange={(event) => setRimType(event.target.value as RimType)}
              options={rimTypeOptions}
            />
          </div>

          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-neutral-500">Front tire</p>
              <InputField
                label="Width"
                type="number"
                inputMode="decimal"
                value={frontWidth}
                min={0}
                onChange={(event) => setFrontWidth(event.target.value)}
                unit="mm"
              />
              <SelectField
                label="Casing"
                value={frontCasing}
                onChange={(event) => setFrontCasing(event.target.value as TireCasing)}
                options={casingOptions}
              />
            </div>
            <div className="space-y-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-neutral-500">Rear tire</p>
              <InputField
                label="Width"
                type="number"
                inputMode="decimal"
                value={rearWidth}
                min={0}
                onChange={(event) => setRearWidth(event.target.value)}
                unit="mm"
              />
              <SelectField
                label="Casing"
                value={rearCasing}
                onChange={(event) => setRearCasing(event.target.value as TireCasing)}
                options={casingOptions}
              />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
