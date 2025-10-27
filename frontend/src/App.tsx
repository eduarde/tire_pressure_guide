import { useMemo, useState } from "react";
import {
  SectionCard,
  TogglePill,
  InputField,
  SelectField,
  SwitchField,
  SegmentedControl
} from "./components";
import { BoltIcon, CloudIcon, SwatchIcon } from "@heroicons/react/24/outline";

const rideStyles = [
  { value: "ROAD", label: "Road", description: "High-efficiency tarmac" },
  { value: "GRAVEL", label: "Gravel", description: "Mixed adventure routes" },
  { value: "CYCLOCROSS", label: "Cyclocross", description: "Aggressive circuits" },
  { value: "MTB_TRAIL", label: "MTB Trail", description: "Technical singletrack" },
  { value: "MTB_ENDURO", label: "Enduro", description: "Steep & rowdy" },
  { value: "MTB_DOWNHILL", label: "Downhill", description: "Bike park" }
] as const;

type RideStyle = (typeof rideStyles)[number]["value"];

type Surface = "DRY" | "WET" | "MIXED";

type PressureUnits = "PSI" | "BAR";

type MassUnit = "kg" | "lbs";

type RimType = "HOOKLESS" | "HOOKED" | "TUBULAR" | "TUBES";

type TireCasing = "STANDARD" | "REINFORCED" | "THIN" | "DOWNHILL_CASING";

interface PressureResult {
  front: number;
  rear: number;
}

function formatNumber(value: number) {
  return value % 1 === 0 ? value.toString() : value.toFixed(1);
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

    const weightKg = massUnit === "kg" ? riderWeight + bikeWeight : (riderWeight + bikeWeight) * 0.453592;

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

const rimTypeOptions: { label: string; value: RimType }[] = [
  { label: "Hookless", value: "HOOKLESS" },
  { label: "Hooked", value: "HOOKED" },
  { label: "Tubular", value: "TUBULAR" },
  { label: "Tubes", value: "TUBES" }
];

const casingOptions: { label: string; value: TireCasing }[] = [
  { label: "Standard", value: "STANDARD" },
  { label: "Supple (Thin)", value: "THIN" },
  { label: "Reinforced", value: "REINFORCED" },
  { label: "Downhill", value: "DOWNHILL_CASING" }
];

const wheelDiameterOptions = [
  { label: "Select", value: "" },
  { label: "700c / 29", value: "700C" },
  { label: "650b / 27.5", value: "650B" },
  { label: "26", value: "26" },
  { label: "24", value: "24" }
];

const rimWidthOptions = [
  { label: "19", value: "19" },
  { label: "21", value: "21" },
  { label: "23", value: "23" },
  { label: "25", value: "25" },
  { label: "27", value: "27" }
];

const surfaceOptions: { value: Surface; label: string }[] = [
  { value: "DRY", label: "Dry" },
  { value: "WET", label: "Wet" },
  { value: "MIXED", label: "Mixed" }
];

export default function App() {
  const [rideStyle, setRideStyle] = useState<RideStyle>("ROAD");
  const [surface, setSurface] = useState<Surface>("DRY");
  const [useRideDefaults, setUseRideDefaults] = useState(true);
  const [massUnit, setMassUnit] = useState<MassUnit>("kg");
  const [pressureUnit, setPressureUnit] = useState<PressureUnits>("PSI");
  const [inputs, setInputs] = useState({
    riderWeight: 68,
    bikeWeight: 7.3,
    frontWidth: 28,
    rearWidth: 30,
    innerRimWidthFront: 23,
    innerRimWidthRear: 23,
    wheelDiameter: "700C",
    rimType: "HOOKLESS" as RimType,
    frontCasing: "STANDARD" as TireCasing,
    rearCasing: "STANDARD" as TireCasing
  });

  const calculated = useCalculatedPressure(
    {
      riderWeight: inputs.riderWeight,
      bikeWeight: inputs.bikeWeight,
      frontWidth: inputs.frontWidth,
      rearWidth: inputs.rearWidth,
      rideStyle,
      surface,
      rimType: inputs.rimType,
      frontCasing: inputs.frontCasing,
      rearCasing: inputs.rearCasing
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

  const unitSymbol = pressureUnit === "PSI" ? "psi" : "bar";

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-carbon-950 via-carbon-900 to-carbon-950">
      <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 px-6 py-12 sm:px-10 lg:px-16">
        <header className="flex flex-col gap-4 text-center sm:text-left">
          <p className="text-xs uppercase tracking-[0.4em] text-crimson-300/80">Ride Ready 2025</p>
          <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl lg:text-5xl">
            Tire Pressure Intelligence
          </h1>
          <p className="max-w-2xl text-base text-slate-300/90">
            Dial-in performance with a calculator engineered for the future of cycling. Tweak your setup, explore conditions, and
            land on pressures tailored to your ride in seconds.
          </p>
        </header>

        <main className="grid w-full flex-1 gap-6 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
          <div className="space-y-6">
            <SectionCard
              title="Ride Type"
              description="Choose the riding style that most closely reflects your setup."
              action={<SegmentedControl value={surface} onChange={setSurface} options={surfaceOptions} />}
            >
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {rideStyles.map((style) => (
                  <TogglePill
                    key={style.value}
                    label={style.label}
                    description={style.description}
                    icon={<SwatchIcon className="h-5 w-5" />}
                    active={rideStyle === style.value}
                    onClick={() => setRideStyle(style.value)}
                  />
                ))}
              </div>
              <p className="flex items-center gap-2 text-xs text-slate-300/70">
                <CloudIcon className="h-4 w-4" />
                Surface presets help fine-tune grip vs. speed balance.
              </p>
            </SectionCard>

            <SectionCard
              title="Wheelset"
              description="Sync with your rims for maximum compliance and safety."
              action={
                <SwitchField
                  label="Use ride style defaults"
                  checked={useRideDefaults}
                  onChange={setUseRideDefaults}
                />
              }
            >
              <div className="grid gap-5 md:grid-cols-2">
                <SelectField
                  label="Wheel Diameter"
                  value={inputs.wheelDiameter}
                  onChange={(event) =>
                    setInputs((prev) => ({ ...prev, wheelDiameter: event.target.value }))
                  }
                  options={wheelDiameterOptions}
                />
                <SelectField
                  label="Rim Type"
                  value={inputs.rimType}
                  onChange={(event) =>
                    setInputs((prev) => ({ ...prev, rimType: event.target.value as RimType }))
                  }
                  options={rimTypeOptions}
                />
                <SelectField
                  label="Front Inner Rim Width"
                  value={String(inputs.innerRimWidthFront)}
                  onChange={(event) =>
                    setInputs((prev) => ({ ...prev, innerRimWidthFront: Number(event.target.value) }))
                  }
                  options={rimWidthOptions}
                  unit="mm"
                />
                <SelectField
                  label="Rear Inner Rim Width"
                  value={String(inputs.innerRimWidthRear)}
                  onChange={(event) =>
                    setInputs((prev) => ({ ...prev, innerRimWidthRear: Number(event.target.value) }))
                  }
                  options={rimWidthOptions}
                  unit="mm"
                />
              </div>
            </SectionCard>

            <SectionCard
              title="Weight"
              description="Account for system mass to balance traction and efficiency."
              action={
                <SegmentedControl
                  value={massUnit}
                  onChange={(value) => setMassUnit(value)}
                  options={[
                    { label: "kg", value: "kg" },
                    { label: "lbs", value: "lbs" }
                  ]}
                />
              }
            >
              <div className="grid gap-5 md:grid-cols-2">
                <InputField
                  label="Rider Weight"
                  type="number"
                  min={0}
                  value={inputs.riderWeight}
                  onChange={(event) =>
                    setInputs((prev) => ({ ...prev, riderWeight: Number(event.target.value) }))
                  }
                />
                <InputField
                  label="Bike Weight"
                  type="number"
                  min={0}
                  value={inputs.bikeWeight}
                  onChange={(event) =>
                    setInputs((prev) => ({ ...prev, bikeWeight: Number(event.target.value) }))
                  }
                />
              </div>
            </SectionCard>

            <SectionCard
              title="Tires"
              description="Dial-in casing support and footprint width for each wheel."
            >
              <div className="grid gap-5 md:grid-cols-2">
                <div className="space-y-5">
                  <p className="text-xs font-semibold uppercase tracking-widest text-slate-400/80">
                    Front Tire
                  </p>
                  <SelectField
                    label="Tire Casing"
                    value={inputs.frontCasing}
                    onChange={(event) =>
                      setInputs((prev) => ({ ...prev, frontCasing: event.target.value as TireCasing }))
                    }
                    options={casingOptions}
                  />
                  <InputField
                    label="Labeled Width"
                    type="number"
                    min={0}
                    value={inputs.frontWidth}
                    onChange={(event) =>
                      setInputs((prev) => ({ ...prev, frontWidth: Number(event.target.value) }))
                    }
                    unit="mm"
                  />
                </div>
                <div className="space-y-5">
                  <p className="text-xs font-semibold uppercase tracking-widest text-slate-400/80">
                    Rear Tire
                  </p>
                  <SelectField
                    label="Tire Casing"
                    value={inputs.rearCasing}
                    onChange={(event) =>
                      setInputs((prev) => ({ ...prev, rearCasing: event.target.value as TireCasing }))
                    }
                    options={casingOptions}
                  />
                  <InputField
                    label="Labeled Width"
                    type="number"
                    min={0}
                    value={inputs.rearWidth}
                    onChange={(event) =>
                      setInputs((prev) => ({ ...prev, rearWidth: Number(event.target.value) }))
                    }
                    unit="mm"
                  />
                </div>
              </div>
            </SectionCard>
          </div>

          <aside className="space-y-6">
            <SectionCard
              title="Pressure Suggestions"
              description="Preview your recommended setup in real time."
              action={
                <SegmentedControl
                  value={pressureUnit}
                  onChange={(value) => setPressureUnit(value)}
                  options={[
                    { label: "PSI", value: "PSI" },
                    { label: "BAR", value: "BAR" }
                  ]}
                />
              }
            >
              <div className="grid gap-4 sm:grid-cols-2">
                {["Front", "Rear"].map((position, index) => {
                  const pressureValue = pressures
                    ? index === 0
                      ? pressures.front
                      : pressures.rear
                    : null;
                  return (
                    <div
                      key={position}
                      className="rounded-3xl border border-white/10 bg-white/5 px-5 py-6 text-center shadow-inner"
                    >
                      <p className="text-xs uppercase tracking-[0.3em] text-slate-300/80">{position} Tire</p>
                      <p className="mt-4 text-3xl font-semibold text-white">
                        {pressureValue ? formatNumber(pressureValue) : "--"}
                      </p>
                      <p className="mt-2 text-xs font-medium uppercase tracking-[0.35em] text-crimson-200/80">
                        {unitSymbol}
                      </p>
                    </div>
                  );
                })}
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/5 px-5 py-4 text-xs text-slate-300/70">
                <p className="flex items-center gap-2">
                  <BoltIcon className="h-4 w-4 text-crimson-300" />
                  Pressure guide is a launch point—fine tune on the trail for perfection.
                </p>
              </div>
            </SectionCard>

            <button
              type="button"
              className="flex w-full items-center justify-center gap-2 rounded-full bg-crimson-500 py-4 text-sm font-semibold uppercase tracking-[0.4em] text-white shadow-lg shadow-crimson-500/20 transition hover:bg-crimson-400"
            >
              Calculate
            </button>

            <p className="text-xs text-slate-400/80">
              ⚠️ Disclaimer — Tire pressure tuning is deeply personal. Start here, then iterate using your feel for traction,
              comfort, and rolling speed.
            </p>
          </aside>
        </main>
      </div>
    </div>
  );
}
