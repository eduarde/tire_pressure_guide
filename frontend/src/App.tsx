import { useMemo, useState } from "react";
import { InputField, SelectField, SegmentedControl } from "./components";
import { BoltIcon } from "@heroicons/react/24/outline";

type Surface = "DRY" | "WET" | "MIXED";
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
  { value: "MIXED", label: "Mixed" }
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
      MIXED: -1.5
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
    <div className="relative min-h-screen overflow-hidden bg-neutral-100 text-neutral-900">
      <div className="pointer-events-none absolute -left-32 top-24 hidden h-64 w-64 rounded-full bg-emerald-200/60 blur-3xl lg:block" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-72 w-72 translate-x-1/3 rounded-full bg-emerald-100/70 blur-3xl" />

      <div className="relative mx-auto flex max-w-6xl flex-col items-start gap-16 px-6 pb-24 pt-16 sm:px-8 lg:flex-row lg:items-center lg:gap-24 lg:pb-28 lg:pt-20">
        <section className="max-w-xl space-y-10">
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-1 text-sm font-semibold text-emerald-700">
            <span className="h-2 w-2 rounded-full bg-emerald-500" aria-hidden />
            Tire pressure, simplified
          </div>

          <div className="space-y-6">
            <h1 className="text-4xl font-semibold tracking-tight text-neutral-900 sm:text-5xl">
              Efficient, confident pressure guidance.
            </h1>
            <p className="text-lg leading-relaxed text-neutral-600">
              Stop guessing on ride day. Enter your setup and let our 2025-ready engine return calm, confident tire pressures tailor-made for your next route.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-neutral-500">Impact</p>
              <p className="mt-3 text-2xl font-semibold text-neutral-900">50% fewer pinch flats</p>
              <p className="mt-2 text-sm leading-relaxed text-neutral-600">
                Riders using guided pressures report fewer unplanned stops across mixed surfaces.
              </p>
            </div>
            <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-neutral-500">Confidence</p>
              <p className="mt-3 text-2xl font-semibold text-neutral-900">Thousands of dialled rides</p>
              <p className="mt-2 text-sm leading-relaxed text-neutral-600">
                Trusted by endurance teams seeking balance between grip, comfort, and speed.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <button
              type="button"
              className="rounded-full bg-emerald-500 px-6 py-3 text-sm font-semibold uppercase tracking-[0.28em] text-white shadow-lg shadow-emerald-300/40 transition hover:bg-emerald-400"
            >
              Start now
            </button>
            <button
              type="button"
              className="rounded-full border border-neutral-300 px-6 py-3 text-sm font-semibold uppercase tracking-[0.28em] text-neutral-700 transition hover:border-neutral-400 hover:text-neutral-900"
            >
              Share setup
            </button>
          </div>
        </section>

        <section className="w-full max-w-xl flex-1">
          <div className="rounded-[32px] border border-neutral-200 bg-white/95 p-8 shadow-[0_35px_80px_-45px_rgba(15,23,42,0.45)] backdrop-blur">
            <div className="flex flex-wrap items-center justify-between gap-4">
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

            <div className="mt-8 grid gap-6 sm:grid-cols-2">
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
              <InputField
                label="Front tire width"
                type="number"
                inputMode="decimal"
                value={frontWidth}
                min={0}
                onChange={(event) => setFrontWidth(event.target.value)}
                unit="mm"
              />
              <InputField
                label="Rear tire width"
                type="number"
                inputMode="decimal"
                value={rearWidth}
                min={0}
                onChange={(event) => setRearWidth(event.target.value)}
                unit="mm"
              />
            </div>

            <div className="mt-8 grid gap-6 sm:grid-cols-2">
              <SelectField
                label="Ride style"
                value={rideStyle}
                onChange={(event) => setRideStyle(event.target.value as RideStyle)}
                options={rideStyleOptions}
              />
              <SelectField
                label="Surface"
                value={surface}
                onChange={(event) => setSurface(event.target.value as Surface)}
                options={surfaceOptions}
              />
              <SelectField
                label="Rim type"
                value={rimType}
                onChange={(event) => setRimType(event.target.value as RimType)}
                options={rimTypeOptions}
              />
              <SelectField
                label="Front casing"
                value={frontCasing}
                onChange={(event) => setFrontCasing(event.target.value as TireCasing)}
                options={casingOptions}
              />
              <SelectField
                label="Rear casing"
                value={rearCasing}
                onChange={(event) => setRearCasing(event.target.value as TireCasing)}
                options={casingOptions}
              />
            </div>

            <div className="mt-10 rounded-3xl bg-neutral-900 px-6 py-6 text-white shadow-lg shadow-neutral-900/25">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/70">Recommended</p>
                  <p className="mt-2 text-2xl font-semibold">Ride-ready pressures</p>
                </div>
                <BoltIcon className="h-10 w-10 text-emerald-300" aria-hidden />
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl bg-white/10 px-4 py-5 text-center">
                  <p className="text-xs uppercase tracking-[0.28em] text-white/70">Front</p>
                  <p className="mt-3 text-3xl font-semibold">
                    {pressures ? formatNumber(pressures.front) : "--"}
                  </p>
                  <p className="text-xs font-semibold uppercase tracking-[0.32em] text-emerald-200">{unitLabel}</p>
                </div>
                <div className="rounded-2xl bg-white/10 px-4 py-5 text-center">
                  <p className="text-xs uppercase tracking-[0.28em] text-white/70">Rear</p>
                  <p className="mt-3 text-3xl font-semibold">
                    {pressures ? formatNumber(pressures.rear) : "--"}
                  </p>
                  <p className="text-xs font-semibold uppercase tracking-[0.32em] text-emerald-200">{unitLabel}</p>
                </div>
              </div>

              <p className="mt-6 text-xs leading-relaxed text-white/70">
                Tune by feel after the first kilometres. Ambient conditions and casing wear may nudge your final setting a touch higher or lower.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
