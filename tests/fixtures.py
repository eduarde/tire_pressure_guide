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
        width=2.3,
        unit=WidthUnitEnum.IN,
    )
    rear_tire = TireType(
        position=PositionEnum.REAR,
        casing=CasingEnum.STANDARD,
        width=2.3,
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


def build_custom_setup(
    ride_type: RideStyleEnum,
    surface_type: SurfaceEnum,
    rider_w: float,
    bike_w: float,
    tire_w: float,
    casing: CasingEnum,
    w_diameter: DiameterEnum,
    rim_type: RimTypeEnum,
    rim_width: float,
):
    tire_w_unit = (
        WidthUnitEnum.MM
        if ride_type
        in [RideStyleEnum.ROAD, RideStyleEnum.CYCLOCROSS, RideStyleEnum.GRAVEL]
        else WidthUnitEnum.IN
    )

    ride = RideType(style=ride_type, surface=surface_type)
    weight = Weight(rider=rider_w, bike=bike_w)
    front_tire = TireType(
        position=PositionEnum.FRONT, casing=casing, width=tire_w, unit=tire_w_unit
    )
    rear_tire = TireType(
        position=PositionEnum.REAR,
        casing=casing,
        width=tire_w,
        unit=tire_w_unit,
    )
    front_wheel = Wheel(
        position=PositionEnum.FRONT,
        diameter=w_diameter,
        rim_type=rim_type,
        rim_width=rim_width,
    )
    rear_wheel = Wheel(
        position=PositionEnum.REAR,
        diameter=w_diameter,
        rim_type=rim_type,
        rim_width=rim_width,
    )

    return __build_setup(
        ride, weight, (front_tire, rear_tire), (front_wheel, rear_wheel)
    )
