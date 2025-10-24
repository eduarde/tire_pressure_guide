import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.schemas import (
    DisciplineEnum,
    SurfaceEnum,
    CasingEnum,
    PositionEnum,
    DiameterEnum,
    RimTypeEnum,
    WidthUnitEnum,
    Weight,
    Tire,
    Wheel,
)
from app.services import PressureCalculatorBuilder, PressureCalculator


def build_custom_setup(
    discipline: DisciplineEnum,
    surface_type: SurfaceEnum,
    rider_w: float,
    bike_w: float,
    tire_w: float,
    casing: CasingEnum,
    w_diameter: DiameterEnum,
    rim_type: RimTypeEnum,
    rim_width: float,
) -> PressureCalculator:
    tire_w_unit = (
        WidthUnitEnum.MM
        if discipline
        in [DisciplineEnum.ROAD, DisciplineEnum.CYCLOCROSS, DisciplineEnum.GRAVEL]
        else WidthUnitEnum.IN
    )

    front_tire = Tire(
        position=PositionEnum.FRONT, casing=casing, width=tire_w, unit=tire_w_unit
    )
    rear_tire = Tire(
        position=PositionEnum.REAR, casing=casing, width=tire_w, unit=tire_w_unit
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

    builder = PressureCalculatorBuilder()
    return (
        builder.set_discipline(discipline)
        .set_surface(surface_type)
        .set_bike_weight(bike_w)
        .set_rider_weight(rider_w)
        .set_tires(front_tire, rear_tire)
        .set_wheels(front_wheel, rear_wheel)
    ).build()
