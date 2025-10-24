from pydantic import BaseModel
from enum import StrEnum


class PressureUnitEnum(StrEnum):
    BAR = "BAR"
    PSI = "PSI"


class WidthUnitEnum(StrEnum):
    IN = ("IN",)
    MM = "MM"


class RideStyleEnum(StrEnum):
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


class TirePressure(BaseModel):
    front_wheel: float
    rear_wheel: float
    unit: PressureUnitEnum


class RideType(BaseModel):
    style: RideStyleEnum
    surface: SurfaceEnum


class Weight(BaseModel):
    rider: float  # in kg
    bike: float  # in kg


class TireType(BaseModel):
    position: PositionEnum
    casing: CasingEnum
    width: float
    unit: WidthUnitEnum

    def get_width_mm(self) -> float:
        """Convert tire width to millimeters"""
        if self.unit == WidthUnitEnum.IN:
            return self.width * 25.4  # Convert inches to mm
        else:  # Already in MM
            return self.width




class Wheel(BaseModel):
    position: PositionEnum
    diameter: DiameterEnum
    rim_type: RimTypeEnum
    rim_width: float
