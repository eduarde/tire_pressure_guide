import math
from .conftest import (
    TIRE_ROAD_STANDARD_FRONT,
    TIRE_ROAD_STANDARD_REAR,
    TIRE_GRAVEL_STANDARD_FRONT,
    TIRE_GRAVEL_STANDARD_REAR,
    TIRE_MTB_XC_STANDARD_FRONT,
    TIRE_MTB_XC_STANDARD_REAR,
    WHEEL_ROAD_HOOKLESS_700C_REAR,
    WHEEL_ROAD_HOOKLESS_700C_FRONT,
    WHEEL_GRAVEL_HOOKLESS_700C_FRONT,
    WHEEL_GRAVEL_HOOKLESS_700C_REAR,
    WHEEL_MTB_XC_HOOKLESS_29_FRONT,
    WHEEL_MTB_XC_HOOKLESS_29_REAR,
)
from app.schemas import (
    DisciplineEnum,
    SurfaceEnum,
    WeightUnitEnum,
    Weight,
    Bike,
)
from app.services import build_and_compute


TOLERANCE = 1.5


def test_default_road_dry_pressure_calculator():
    """
    road + dry + default settings
    """

    bike = Bike(
        name="custom_road_bike",
        discipline=DisciplineEnum.ROAD,
        front_tire=TIRE_ROAD_STANDARD_FRONT,
        rear_tire=TIRE_ROAD_STANDARD_REAR,
        front_wheel=WHEEL_ROAD_HOOKLESS_700C_FRONT,
        rear_wheel=WHEEL_ROAD_HOOKLESS_700C_REAR,
        weight=Weight(value=6.8, unit=WeightUnitEnum.KG),
    )
    rider_weight = Weight(value=58, unit=WeightUnitEnum.KG)
    surface = SurfaceEnum.DRY

    tire_pressure = build_and_compute(bike, surface, rider_weight)
    assert math.isclose(tire_pressure.front_wheel, 51.1, abs_tol=TOLERANCE)
    assert math.isclose(tire_pressure.rear_wheel, 54.3, abs_tol=TOLERANCE)


def test_default_road_wet_pressure_calculator():
    """
    road + wet + default settings
    """
    bike = Bike(
        name="custom_road_bike",
        discipline=DisciplineEnum.ROAD,
        front_tire=TIRE_ROAD_STANDARD_FRONT,
        rear_tire=TIRE_ROAD_STANDARD_REAR,
        front_wheel=WHEEL_ROAD_HOOKLESS_700C_FRONT,
        rear_wheel=WHEEL_ROAD_HOOKLESS_700C_REAR,
        weight=Weight(value=6.8, unit=WeightUnitEnum.KG),
    )
    rider_weight = Weight(value=58, unit=WeightUnitEnum.KG)
    surface = SurfaceEnum.WET

    tire_pressure = build_and_compute(bike, surface, rider_weight)
    assert math.isclose(tire_pressure.front_wheel, 46, abs_tol=TOLERANCE)
    assert math.isclose(tire_pressure.rear_wheel, 48.9, abs_tol=TOLERANCE)


def test_default_gravel_dry_pressure_calculator():
    """
    gravel + dry + default settings
    """

    bike = Bike(
        name="custom_gravel_bike",
        discipline=DisciplineEnum.GRAVEL,
        front_tire=TIRE_GRAVEL_STANDARD_FRONT,
        rear_tire=TIRE_GRAVEL_STANDARD_REAR,
        front_wheel=WHEEL_GRAVEL_HOOKLESS_700C_FRONT,
        rear_wheel=WHEEL_GRAVEL_HOOKLESS_700C_REAR,
        weight=Weight(value=9, unit=WeightUnitEnum.KG),
    )
    rider_weight = Weight(value=58, unit=WeightUnitEnum.KG)
    surface = SurfaceEnum.DRY

    tire_pressure = build_and_compute(bike, surface, rider_weight)
    assert math.isclose(tire_pressure.front_wheel, 29.9, abs_tol=TOLERANCE)
    assert math.isclose(tire_pressure.rear_wheel, 31.8, abs_tol=TOLERANCE)


def test_default_gravel_wet_pressure_calculator():
    """
    gravel + wet + default settings
    """
    bike = Bike(
        name="custom_gravel_bike",
        discipline=DisciplineEnum.GRAVEL,
        front_tire=TIRE_GRAVEL_STANDARD_FRONT,
        rear_tire=TIRE_GRAVEL_STANDARD_REAR,
        front_wheel=WHEEL_GRAVEL_HOOKLESS_700C_FRONT,
        rear_wheel=WHEEL_GRAVEL_HOOKLESS_700C_REAR,
        weight=Weight(value=9, unit=WeightUnitEnum.KG),
    )
    rider_weight = Weight(value=58, unit=WeightUnitEnum.KG)
    surface = SurfaceEnum.WET

    tire_pressure = build_and_compute(bike, surface, rider_weight)
    assert math.isclose(tire_pressure.front_wheel, 26.9, abs_tol=TOLERANCE)
    assert math.isclose(tire_pressure.rear_wheel, 28.7, abs_tol=TOLERANCE)


def test_default_mtb_xc_dry_pressure_calculator():
    """
    mtb xc + dry + default settings
    """

    bike = Bike(
        name="custom_mtb_xc_bike",
        discipline=DisciplineEnum.MTB_XC,
        front_tire=TIRE_MTB_XC_STANDARD_FRONT,
        rear_tire=TIRE_MTB_XC_STANDARD_REAR,
        front_wheel=WHEEL_MTB_XC_HOOKLESS_29_FRONT,
        rear_wheel=WHEEL_MTB_XC_HOOKLESS_29_REAR,
        weight=Weight(value=10.9, unit=WeightUnitEnum.KG),
    )
    rider_weight = Weight(value=58, unit=WeightUnitEnum.KG)
    surface = SurfaceEnum.DRY

    tire_pressure = build_and_compute(bike, surface, rider_weight)
    assert math.isclose(tire_pressure.front_wheel, 18.5, abs_tol=TOLERANCE)
    assert math.isclose(tire_pressure.rear_wheel, 19.7, abs_tol=TOLERANCE)


def test_default_mtb_xc_wet_pressure_calculator():
    """
    mtb xc + wet + default settings
    """
    bike = Bike(
        name="custom_mtb_xc_bike",
        discipline=DisciplineEnum.MTB_XC,
        front_tire=TIRE_MTB_XC_STANDARD_FRONT,
        rear_tire=TIRE_MTB_XC_STANDARD_REAR,
        front_wheel=WHEEL_MTB_XC_HOOKLESS_29_FRONT,
        rear_wheel=WHEEL_MTB_XC_HOOKLESS_29_REAR,
        weight=Weight(value=10.9, unit=WeightUnitEnum.KG),
    )
    rider_weight = Weight(value=58, unit=WeightUnitEnum.KG)
    surface = SurfaceEnum.WET

    tire_pressure = build_and_compute(bike, surface, rider_weight)
    assert math.isclose(tire_pressure.front_wheel, 16.7, abs_tol=TOLERANCE)
    assert math.isclose(tire_pressure.rear_wheel, 17.7, abs_tol=TOLERANCE)


def test_custom_road_dry_70_pressure_calculator():
    """
    road dry rider 70 bike 8
    """

    bike = Bike(
        name="custom_road_bike",
        discipline=DisciplineEnum.ROAD,
        front_tire=TIRE_ROAD_STANDARD_FRONT,
        rear_tire=TIRE_ROAD_STANDARD_REAR,
        front_wheel=WHEEL_ROAD_HOOKLESS_700C_FRONT,
        rear_wheel=WHEEL_ROAD_HOOKLESS_700C_REAR,
        weight=Weight(value=8, unit=WeightUnitEnum.KG),
    )
    rider_weight = Weight(value=70, unit=WeightUnitEnum.KG)
    surface = SurfaceEnum.DRY

    tire_pressure = build_and_compute(bike, surface, rider_weight)
    assert math.isclose(tire_pressure.front_wheel, 55.1, abs_tol=TOLERANCE)
    assert math.isclose(tire_pressure.rear_wheel, 58.6, abs_tol=TOLERANCE)


def test_custom_road_wet_70_pressure_calculator():
    """
    road wet rider 70 bike 8
    """

    bike = Bike(
        name="custom_road_bike",
        discipline=DisciplineEnum.ROAD,
        front_tire=TIRE_ROAD_STANDARD_FRONT,
        rear_tire=TIRE_ROAD_STANDARD_REAR,
        front_wheel=WHEEL_ROAD_HOOKLESS_700C_FRONT,
        rear_wheel=WHEEL_ROAD_HOOKLESS_700C_REAR,
        weight=Weight(value=8, unit=WeightUnitEnum.KG),
    )
    rider_weight = Weight(value=70, unit=WeightUnitEnum.KG)
    surface = SurfaceEnum.WET

    tire_pressure = build_and_compute(bike, surface, rider_weight)
    assert math.isclose(tire_pressure.front_wheel, 49.6, abs_tol=TOLERANCE)
    assert math.isclose(tire_pressure.rear_wheel, 52.7, abs_tol=TOLERANCE)


def test_custom_gravel_dry_70_pressure_calculator():
    """
    gravel dry rider 70 bike 9
    """

    bike = Bike(
        name="custom_gravel_bike",
        discipline=DisciplineEnum.GRAVEL,
        front_tire=TIRE_GRAVEL_STANDARD_FRONT,
        rear_tire=TIRE_GRAVEL_STANDARD_REAR,
        front_wheel=WHEEL_GRAVEL_HOOKLESS_700C_FRONT,
        rear_wheel=WHEEL_GRAVEL_HOOKLESS_700C_REAR,
        weight=Weight(value=9, unit=WeightUnitEnum.KG),
    )

    rider_weight = Weight(value=70, unit=WeightUnitEnum.KG)
    surface = SurfaceEnum.DRY

    tire_pressure = build_and_compute(bike, surface, rider_weight)
    assert math.isclose(tire_pressure.front_wheel, 32.1, abs_tol=TOLERANCE)
    assert math.isclose(tire_pressure.rear_wheel, 34.1, abs_tol=TOLERANCE)


def test_custom_gravel_wet_70_pressure_calculator():
    """
    road wet rider 70 bike 9
    """

    bike = Bike(
        name="custom_gravel_bike",
        discipline=DisciplineEnum.GRAVEL,
        front_tire=TIRE_GRAVEL_STANDARD_FRONT,
        rear_tire=TIRE_GRAVEL_STANDARD_REAR,
        front_wheel=WHEEL_GRAVEL_HOOKLESS_700C_FRONT,
        rear_wheel=WHEEL_GRAVEL_HOOKLESS_700C_REAR,
        weight=Weight(value=9, unit=WeightUnitEnum.KG),
    )

    rider_weight = Weight(value=70, unit=WeightUnitEnum.KG)
    surface = SurfaceEnum.WET

    tire_pressure = build_and_compute(bike, surface, rider_weight)
    assert math.isclose(tire_pressure.front_wheel, 28.9, abs_tol=TOLERANCE)
    assert math.isclose(tire_pressure.rear_wheel, 30.7, abs_tol=TOLERANCE)


def test_custom_mtbxc_dry_70_pressure_calculator():
    """
    mtb dry rider 70 bike 11
    """

    bike = Bike(
        name="custom_mtb_xc_bike",
        discipline=DisciplineEnum.MTB_XC,
        front_tire=TIRE_MTB_XC_STANDARD_FRONT,
        rear_tire=TIRE_MTB_XC_STANDARD_REAR,
        front_wheel=WHEEL_MTB_XC_HOOKLESS_29_FRONT,
        rear_wheel=WHEEL_MTB_XC_HOOKLESS_29_REAR,
        weight=Weight(value=11, unit=WeightUnitEnum.KG),
    )
    rider_weight = Weight(value=70, unit=WeightUnitEnum.KG)
    surface = SurfaceEnum.DRY

    tire_pressure = build_and_compute(bike, surface, rider_weight)
    assert math.isclose(tire_pressure.front_wheel, 19.8, abs_tol=TOLERANCE)
    assert math.isclose(tire_pressure.rear_wheel, 21.1, abs_tol=TOLERANCE)


def test_custom_mtb_wet_70_pressure_calculator():
    """
    mtb wet rider 70 bike 11
    """

    bike = Bike(
        name="custom_mtb_xc_bike",
        discipline=DisciplineEnum.MTB_XC,
        front_tire=TIRE_MTB_XC_STANDARD_FRONT,
        rear_tire=TIRE_MTB_XC_STANDARD_REAR,
        front_wheel=WHEEL_MTB_XC_HOOKLESS_29_FRONT,
        rear_wheel=WHEEL_MTB_XC_HOOKLESS_29_REAR,
        weight=Weight(value=11, unit=WeightUnitEnum.KG),
    )
    rider_weight = Weight(value=70, unit=WeightUnitEnum.KG)
    surface = SurfaceEnum.WET

    tire_pressure = build_and_compute(bike, surface, rider_weight)
    assert math.isclose(tire_pressure.front_wheel, 17.8, abs_tol=TOLERANCE)
    assert math.isclose(tire_pressure.rear_wheel, 19, abs_tol=TOLERANCE)
