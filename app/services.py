import math
from .schemas import (
    PressureUnitEnum,
    DisciplineEnum,
    SurfaceEnum,
    CasingEnum,
    RimTypeEnum,
    DiameterEnum,
    Tire,
    Weight,
    Wheel,
    TirePressure,
)


class PressureCalculator:
    # Ride style fudge factors
    DISCIPLINE_FACTORS = {
        DisciplineEnum.CYCLOCROSS: 0.6,
        DisciplineEnum.MTB_DOWNHILL: 1.1,
        DisciplineEnum.MTB_ENDURO: 1.05,
        DisciplineEnum.FATBIKE: 1.0,
        DisciplineEnum.GRAVEL: 0.9,
        DisciplineEnum.ROAD: 1.0,
        DisciplineEnum.MTB_TRAIL: 1.05,
        DisciplineEnum.MTB_XC: 0.9,
    }

    # Wheel position factors
    WHEEL_POSITION_FACTORS = {
        "FRONT": 0.94,
        "REAR": 1.0,
    }

    # Rim type fudge factors (standard)
    RIM_TYPE_FACTORS = {
        RimTypeEnum.HOOKED: 1.03,
        RimTypeEnum.HOOKLESS: 0.955,
        RimTypeEnum.TUBES: 1.05,
        RimTypeEnum.TUBULAR: 1.1,
    }

    # Rim type fudge factors for cyclocross
    RIM_TYPE_CX_FACTORS = {
        RimTypeEnum.HOOKED: 1.03,
        RimTypeEnum.HOOKLESS: 0.955,
        RimTypeEnum.TUBES: 1.05,
        RimTypeEnum.TUBULAR: 0.9,
    }

    # Casing fudge factors
    CASING_FACTORS = {
        CasingEnum.DOWNHILL_CASING: 0.9,
        CasingEnum.REINFORCED: 0.95,
        CasingEnum.STANDARD: 1.0,
        CasingEnum.THIN: 1.025,
    }

    # Surface/wet fudge factors
    SURFACE_FACTORS = {
        SurfaceEnum.DRY: 1.0,
        SurfaceEnum.SNOW: 0.5,
        SurfaceEnum.WET: 0.9,
        SurfaceEnum.MIXED: 0.95,
    }

    # Inner rim width to compatible tire width mapping
    RIM_WIDTH_TABLE = [
        {"min": 18, "max": 22, "compatible": 15},
        {"min": 22, "max": 25, "compatible": 17},
        {"min": 25, "max": 29, "compatible": 19},
        {"min": 29, "max": 35, "compatible": 21},
        {"min": 35, "max": 47, "compatible": 23},
        {"min": 47, "max": 58, "compatible": 25},
        {"min": 58, "max": 66, "compatible": 30},
        {"min": 66, "max": 72, "compatible": 35},
        {"min": 72, "max": 84, "compatible": 45},
        {"min": 84, "max": 96, "compatible": 55},
        {"min": 96, "max": 113, "compatible": 76},
        {"min": 114, "max": 133, "compatible": 94},
    ]

    # Wheel diameter mapping (in mm)
    WHEEL_DIAMETER_MAP = {
        DiameterEnum.D_700C: 622,
        DiameterEnum.D_650B: 571,
        DiameterEnum.D_650C: 571,
        DiameterEnum.D_26: 559,
        DiameterEnum.D_27_5: 584,
        DiameterEnum.D_29: 622,
    }

    def __init__(self):
        self.front_tire = None
        self.rear_tire = None
        self.front_wheel = None
        self.rear_wheel = None
        self.bike_weight = None
        self.rider_weight = None
        self.ride_type = None
        self.discipline = None
        self.surface = None

    def _rim_width_lookup(self, tire_width: float) -> float:
        """Get the compatible rim width based on tire width."""
        for entry in self.RIM_WIDTH_TABLE:
            if entry["min"] <= tire_width < entry["max"]:
                return float(entry["compatible"])
        return 21.0  # Default fallback

    def _calculate_recommended_pressure(
        self,
        rider_weight_kg: float,
        bike_weight_kg: float,
        discipline: DisciplineEnum,
        rim_type: RimTypeEnum,
        surface: SurfaceEnum,
        tire_width_mm: float,
        inner_rim_width_mm: float,
        tire_casing: CasingEnum,
        wheel_position: str,
        wheel_diameter: float,
    ) -> float:
        """
        Calculate recommended tire pressure.

        Formula: PSI = base * weight_factor * wheel_factor * fudge_factors
        """

        # 1. Get fudge factors
        ride_factor = self.DISCIPLINE_FACTORS.get(discipline, 1.0)
        wheel_factor = self.WHEEL_POSITION_FACTORS.get(wheel_position, 1.0)
        casing_factor = self.CASING_FACTORS.get(tire_casing, 1.0)
        surface_factor = self.SURFACE_FACTORS.get(surface, 1.0)

        if discipline == DisciplineEnum.CYCLOCROSS:
            rim_factor = self.RIM_TYPE_CX_FACTORS.get(rim_type, 1.0)
        else:
            rim_factor = self.RIM_TYPE_FACTORS.get(rim_type, 1.0)

        # 2. Calculate effective tire width
        compatible_rim_width = self._rim_width_lookup(tire_width_mm)
        effective_width = tire_width_mm + 0.4 * (
            inner_rim_width_mm - compatible_rim_width
        )

        # 3. Calculate geometric constant (proportional to tire volume)
        outer_radius = wheel_diameter / 2.0 + effective_width / 2.0
        inner_radius = effective_width / 2.0
        c = 4.0 * math.pi**2 * outer_radius * inner_radius

        # 4. Base pressure from regression model
        base = (10**8.684670773) * (c**-1.304556655)

        # 5. Calculate weight factor
        weight_sum = bike_weight_kg + rider_weight_kg
        weight_factor = 1.0 + (2.2 * weight_sum - 180.0) * 0.0025

        # 6. Combine everything
        pressure = base * weight_factor * wheel_factor
        pressure *= rim_factor * ride_factor * surface_factor * casing_factor

        # 7. The result is already in PSI scale
        pressure_psi = pressure

        return pressure_psi

    def calculate(self) -> TirePressure:
        """Calculate front and rear tire pressures."""

        front_casing = self.front_tire.casing
        rear_casing = self.rear_tire.casing

        front_rim_type = self.front_wheel.rim_type
        rear_rim_type = self.rear_wheel.rim_type

        front_width_mm = self.front_tire.get_width_mm()
        rear_width_mm = self.rear_tire.get_width_mm()

        front_rim_width = self.front_wheel.rim_width
        rear_rim_width = self.rear_wheel.rim_width

        # Get wheel diameter
        front_diameter_mm = self.WHEEL_DIAMETER_MAP.get(self.front_wheel.diameter, 622)
        rear_diameter_mm = self.WHEEL_DIAMETER_MAP.get(self.rear_wheel.diameter, 622)

        # Calculate front pressure
        front_pressure = self._calculate_recommended_pressure(
            rider_weight_kg=self.rider_weight,
            bike_weight_kg=self.bike_weight,
            discipline=self.discipline,
            rim_type=front_rim_type,
            surface=self.surface,
            tire_width_mm=front_width_mm,
            inner_rim_width_mm=front_rim_width,
            tire_casing=front_casing,
            wheel_position="FRONT",
            wheel_diameter=front_diameter_mm,
        )

        # Calculate rear pressure
        rear_pressure = self._calculate_recommended_pressure(
            rider_weight_kg=self.rider_weight,
            bike_weight_kg=self.bike_weight,
            discipline=self.discipline,
            rim_type=rear_rim_type,
            surface=self.surface,
            tire_width_mm=rear_width_mm,
            inner_rim_width_mm=rear_rim_width,
            tire_casing=rear_casing,
            wheel_position="REAR",
            wheel_diameter=rear_diameter_mm,
        )

        return TirePressure(
            front_wheel=round(front_pressure, 1),
            rear_wheel=round(rear_pressure, 1),
            unit=PressureUnitEnum.PSI,
        )


class PressureCalculatorBuilder:
    def __init__(self):
        self.calculator = PressureCalculator()

    def set_tires(self, front_tire: Tire, rear_tire: Tire):
        self.calculator.front_tire = front_tire
        self.calculator.rear_tire = rear_tire
        return self

    def set_wheels(self, front_wheel: Wheel, rear_wheel: Wheel):
        self.calculator.front_wheel = front_wheel
        self.calculator.rear_wheel = rear_wheel
        return self

    def set_bike_weight(self, weight: Weight):
        self.calculator.bike_weight = weight
        return self

    def set_rider_weight(self, weight: Weight):
        self.calculator.rider_weight = weight
        return self

    def set_discipline(self, discipline: DisciplineEnum):
        self.calculator.discipline = discipline
        return self

    def set_surface(self, surface: SurfaceEnum):
        self.calculator.surface = surface
        return self

    def build(self) -> PressureCalculator:
        return self.calculator
