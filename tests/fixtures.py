import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.schemas import (
    RideStyleEnum,
    SurfaceEnum,
    CasingEnum,
    PositionEnum,
    DiameterEnum,
    RimTypeEnum,
    WidthUnitEnum,
    RideType,
    Weight,
    TireType,
    Wheel,
)
from app.services import PressureCalculatorBuilder, PressureCalculator


def __build_setup(
    ride: RideType, weight: Weight, tires: tuple[TireType], wheels: tuple[Wheel]
) -> PressureCalculator:
    builder = PressureCalculatorBuilder()
    return (
        builder.set_ride_type(ride)
        .set_weight(weight)
        .set_tires(tires[0], tires[1])
        .set_wheels(wheels[0], wheels[1])
    ).build()


def build_road_default_setup(surface_type: SurfaceEnum):
    ride = RideType(style=RideStyleEnum.ROAD, surface=surface_type)
    weight = Weight(rider=58, bike=6.8)
    front_tire = TireType(
        position=PositionEnum.FRONT,
        casing=CasingEnum.STANDARD,
        width=28,
        unit=WidthUnitEnum.MM,
    )
    rear_tire = TireType(
        position=PositionEnum.REAR,
        casing=CasingEnum.STANDARD,
        width=28,
        unit=WidthUnitEnum.MM,
    )
    front_wheel = Wheel(
        position=PositionEnum.FRONT,
        diameter=DiameterEnum.D_700C,
        rim_type=RimTypeEnum.HOOKLESS,
        rim_width=23,
    )
    rear_wheel = Wheel(
        position=PositionEnum.REAR,
        diameter=DiameterEnum.D_700C,
        rim_type=RimTypeEnum.HOOKLESS,
        rim_width=23,
    )

    return __build_setup(
        ride, weight, (front_tire, rear_tire), (front_wheel, rear_wheel)
    )


def build_gravel_default_setup(surface_type: SurfaceEnum):
    ride = RideType(style=RideStyleEnum.GRAVEL, surface=surface_type)
    weight = Weight(rider=58, bike=9)
    front_tire = TireType(
        position=PositionEnum.FRONT,
        casing=CasingEnum.STANDARD,
        width=40,
        unit=WidthUnitEnum.MM,
    )
    rear_tire = TireType(
        position=PositionEnum.REAR,
        casing=CasingEnum.STANDARD,
        width=40,
        unit=WidthUnitEnum.MM,
    )
    front_wheel = Wheel(
        position=PositionEnum.FRONT,
        diameter=DiameterEnum.D_700C,
        rim_type=RimTypeEnum.HOOKLESS,
        rim_width=25,
    )
    rear_wheel = Wheel(
        position=PositionEnum.REAR,
        diameter=DiameterEnum.D_700C,
        rim_type=RimTypeEnum.HOOKLESS,
        rim_width=25,
    )

    return __build_setup(
        ride, weight, (front_tire, rear_tire), (front_wheel, rear_wheel)
    )


def build_mtbxc_default_setup(surface_type: SurfaceEnum):
    ride = RideType(style=RideStyleEnum.MTB_XC, surface=surface_type)
    weight = Weight(rider=58, bike=10.9)
    front_tire = TireType(
        position=PositionEnum.FRONT,
        casing=CasingEnum.STANDARD,
        width=40,
        unit=WidthUnitEnum.IN,
    )
    rear_tire = TireType(
        position=PositionEnum.REAR,
        casing=CasingEnum.STANDARD,
        width=40,
        unit=WidthUnitEnum.IN,
    )
    front_wheel = Wheel(
        position=PositionEnum.FRONT,
        diameter=DiameterEnum.D_29,
        rim_type=RimTypeEnum.HOOKLESS,
        rim_width=30,
    )
    rear_wheel = Wheel(
        position=PositionEnum.REAR,
        diameter=DiameterEnum.D_29,
        rim_type=RimTypeEnum.HOOKLESS,
        rim_width=30,
    )

    return __build_setup(
        ride, weight, (front_tire, rear_tire), (front_wheel, rear_wheel)
    )
