from pydantic import BaseModel
from enum import StrEnum


class PressureUnitEnum(StrEnum):
    BAR = "BAR"
    PSI = "PSI"


class WidthUnitEnum(StrEnum):
    IN = "IN"
    MM = "MM"


class WeightUnitEnum(StrEnum):
    LBS = ("lbs",)
    KG = "kg"


class DisciplineEnum(StrEnum):
    ROAD = "ROAD"
    CYCLOCROSS = "CYCLOCROSS"
    GRAVEL = "GRAVEL"
    MTB_XC = "MTB_XC"
    MTB_TRAIL = "MTB_TRAIL"
    MTB_ENDURO = "MTB_ENDURO"
    MTB_DOWNHILL = "MTB_DOWNHILL"
    FATBIKE = "FATBIKE"


class PositionEnum(StrEnum):
    FRONT = "FRONT"
    REAR = "REAR"


class SurfaceEnum(StrEnum):
    DRY = "DRY"
    WET = "WET"
    MIXED = "MIXED"
    SNOW = "SNOW"


class CasingEnum(StrEnum):
    THIN = "THIN"
    STANDARD = "STANDARD"
    REINFORCED = "REINFORCED"
    DOWNHILL_CASING = "DOWNHILL_CASING"


class DiameterEnum(StrEnum):
    D_650C = "650C"
    D_650B = "650B"
    D_700C = "700C"
    D_26 = "26"
    D_27_5 = "27.5"
    D_29 = "29"


class RimTypeEnum(StrEnum):
    TUBES = "TUBES"
    TUBULAR = "TUBULAR"
    HOOKED = "HOOKED"
    HOOKS = "HOOKS"
    HOOKLESS = "HOOKLESS"


# --- Component Models ---


class Tire(BaseModel):
    width: float
    position: PositionEnum
    casing: CasingEnum
    unit: WidthUnitEnum

    def get_width_mm(self) -> float:
        """Convert tire width to millimeters"""
        if self.unit == WidthUnitEnum.IN:
            return self.width * 25.4  # Convert inches to mm
        else:  # Already in MM
            return self.width


class Wheel(BaseModel):
    rim_width: float
    rim_type: RimTypeEnum
    position: PositionEnum
    diameter: DiameterEnum


class Weight(BaseModel):
    value: float
    unit: WeightUnitEnum

    def in_kg(self) -> float:
        return self.value * 0.453592 if self.unit == WeightUnitEnum.LBS else self.value


# --- Bike Model (for database) ---


class Bike(BaseModel):
    name: str
    discipline: DisciplineEnum
    front_tire: Tire
    front_wheel: Wheel
    rear_tire: Tire
    rear_wheel: Wheel
    weight: Weight


# --- Response Models ---


class TirePressure(BaseModel):
    front_wheel: float
    rear_wheel: float
    unit: PressureUnitEnum


# --- Request Models ---


class TirePressureRequest(BaseModel):
    bike: Bike
    rider_weight: Weight
    surface: SurfaceEnum
