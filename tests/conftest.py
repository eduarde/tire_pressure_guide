import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.schemas import (
    CasingEnum,
    PositionEnum,
    DiameterEnum,
    RimTypeEnum,
    WidthUnitEnum,
    Tire,
    Wheel,
)


TIRE_ROAD_STANDARD_FRONT = Tire(
    position=PositionEnum.FRONT,
    casing=CasingEnum.STANDARD,
    width=28,
    unit=WidthUnitEnum.MM,
)


TIRE_ROAD_STANDARD_REAR = Tire(
    position=PositionEnum.REAR,
    casing=CasingEnum.STANDARD,
    width=28,
    unit=WidthUnitEnum.MM,
)


TIRE_GRAVEL_STANDARD_FRONT = Tire(
    position=PositionEnum.FRONT,
    casing=CasingEnum.STANDARD,
    width=40,
    unit=WidthUnitEnum.MM,
)
TIRE_GRAVEL_STANDARD_REAR = Tire(
    position=PositionEnum.REAR,
    casing=CasingEnum.STANDARD,
    width=40,
    unit=WidthUnitEnum.MM,
)

TIRE_MTB_XC_STANDARD_FRONT = Tire(
    position=PositionEnum.FRONT,
    casing=CasingEnum.STANDARD,
    width=2.3,
    unit=WidthUnitEnum.IN,
)
TIRE_MTB_XC_STANDARD_REAR = Tire(
    position=PositionEnum.REAR,
    casing=CasingEnum.STANDARD,
    width=2.3,
    unit=WidthUnitEnum.IN,
)

WHEEL_ROAD_HOOKLESS_700C_FRONT = Wheel(
    position=PositionEnum.FRONT,
    diameter=DiameterEnum.D_700C,
    rim_type=RimTypeEnum.HOOKLESS,
    rim_width=23,
)

WHEEL_ROAD_HOOKLESS_700C_REAR = Wheel(
    position=PositionEnum.REAR,
    diameter=DiameterEnum.D_700C,
    rim_type=RimTypeEnum.HOOKLESS,
    rim_width=23,
)


WHEEL_GRAVEL_HOOKLESS_700C_FRONT = Wheel(
    position=PositionEnum.FRONT,
    diameter=DiameterEnum.D_700C,
    rim_type=RimTypeEnum.HOOKLESS,
    rim_width=25,
)
WHEEL_GRAVEL_HOOKLESS_700C_REAR = Wheel(
    position=PositionEnum.REAR,
    diameter=DiameterEnum.D_700C,
    rim_type=RimTypeEnum.HOOKLESS,
    rim_width=25,
)




WHEEL_MTB_XC_HOOKLESS_29_FRONT = Wheel(
    position=PositionEnum.FRONT,
    diameter=DiameterEnum.D_29,
    rim_type=RimTypeEnum.HOOKLESS,
    rim_width=30,
)
WHEEL_MTB_XC_HOOKLESS_29_REAR = Wheel(
    position=PositionEnum.REAR,
    diameter=DiameterEnum.D_29,
    rim_type=RimTypeEnum.HOOKLESS,
    rim_width=30,
)
