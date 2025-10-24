import math
from .fixtures import (
    build_road_default_setup,
    build_gravel_default_setup,
    build_mtbxc_default_setup,
    build_custom_setup,
)
from app.schemas import (
    RideStyleEnum,
    SurfaceEnum,
    CasingEnum,
    DiameterEnum,
    RimTypeEnum,
)


TOLERANCE = 1.5


def test_default_road_dry_pressure_calculator():
    """
    road + dry + default settings
    """
    pressure_calculator = build_road_default_setup(SurfaceEnum.DRY)
    tire_pressure = pressure_calculator.calculate()
    assert math.isclose(tire_pressure.front_wheel, 51.1, abs_tol=TOLERANCE)
    assert math.isclose(tire_pressure.rear_wheel, 54.3, abs_tol=TOLERANCE)


def test_default_road_wet_pressure_calculator():
    """
    road + wet + default settings
    """
    pressure_calculator = build_road_default_setup(SurfaceEnum.WET)
    tire_pressure = pressure_calculator.calculate()
    assert math.isclose(tire_pressure.front_wheel, 46, abs_tol=TOLERANCE)
    assert math.isclose(tire_pressure.rear_wheel, 48.9, abs_tol=TOLERANCE)


def test_default_gravel_dry_pressure_calculator():
    """
    gravel + dry + default settings
    """
    pressure_calculator = build_gravel_default_setup(SurfaceEnum.DRY)
    tire_pressure = pressure_calculator.calculate()
    assert math.isclose(tire_pressure.front_wheel, 29.9, abs_tol=TOLERANCE)
    assert math.isclose(tire_pressure.rear_wheel, 31.8, abs_tol=TOLERANCE)


def test_default_gravel_wet_pressure_calculator():
    """
    gravel + wet + default settings
    """
    pressure_calculator = build_gravel_default_setup(SurfaceEnum.WET)
    tire_pressure = pressure_calculator.calculate()

    assert math.isclose(tire_pressure.front_wheel, 26.9, abs_tol=TOLERANCE)
    assert math.isclose(tire_pressure.rear_wheel, 28.7, abs_tol=TOLERANCE)


def test_default_mtb_xc_dry_pressure_calculator():
    """
    mtb xc + dry + default settings
    """
    pressure_calculator = build_mtbxc_default_setup(SurfaceEnum.DRY)
    tire_pressure = pressure_calculator.calculate()
    assert math.isclose(tire_pressure.front_wheel, 18.5, abs_tol=TOLERANCE)
    assert math.isclose(tire_pressure.rear_wheel, 19.7, abs_tol=TOLERANCE)


def test_default_mtb_xc_wet_pressure_calculator():
    """
    mtb xc + wet + default settings
    """
    pressure_calculator = build_mtbxc_default_setup(SurfaceEnum.WET)
    tire_pressure = pressure_calculator.calculate()
    assert math.isclose(tire_pressure.front_wheel, 16.7, abs_tol=TOLERANCE)
    assert math.isclose(tire_pressure.rear_wheel, 17.7, abs_tol=TOLERANCE)


def test_custom_road_dry_70_pressure_calculator():
    """
    road dry rider 70 bike 8
    """

    pressure_calculator = build_custom_setup(
        ride_type=RideStyleEnum.ROAD,
        surface_type=SurfaceEnum.DRY,
        rider_w=70,
        bike_w=8,
        tire_w=28,
        casing=CasingEnum.STANDARD,
        w_diameter=DiameterEnum.D_700C,
        rim_type=RimTypeEnum.HOOKLESS,
        rim_width=23,
    )
    tire_pressure = pressure_calculator.calculate()
    assert math.isclose(tire_pressure.front_wheel, 55.1, abs_tol=TOLERANCE)
    assert math.isclose(tire_pressure.rear_wheel, 58.6, abs_tol=TOLERANCE)


def test_custom_road_wet_70_pressure_calculator():
    """
    road wet rider 70 bike 8
    """

    pressure_calculator = build_custom_setup(
        ride_type=RideStyleEnum.ROAD,
        surface_type=SurfaceEnum.WET,
        rider_w=70,
        bike_w=8,
        tire_w=28,
        casing=CasingEnum.STANDARD,
        w_diameter=DiameterEnum.D_700C,
        rim_type=RimTypeEnum.HOOKLESS,
        rim_width=23,
    )
    tire_pressure = pressure_calculator.calculate()
    assert math.isclose(tire_pressure.front_wheel, 49.6, abs_tol=TOLERANCE)
    assert math.isclose(tire_pressure.rear_wheel, 52.7, abs_tol=TOLERANCE)


def test_custom_gravel_dry_70_pressure_calculator():
    """
    gravel dry rider 70 bike 9
    """

    pressure_calculator = build_custom_setup(
        ride_type=RideStyleEnum.GRAVEL,
        surface_type=SurfaceEnum.DRY,
        rider_w=70,
        bike_w=9,
        tire_w=40,
        casing=CasingEnum.STANDARD,
        w_diameter=DiameterEnum.D_700C,
        rim_type=RimTypeEnum.HOOKLESS,
        rim_width=25,
    )
    tire_pressure = pressure_calculator.calculate()
    assert math.isclose(tire_pressure.front_wheel, 32.1, abs_tol=TOLERANCE)
    assert math.isclose(tire_pressure.rear_wheel, 34.1, abs_tol=TOLERANCE)


def test_custom_gravel_wet_70_pressure_calculator():
    """
    road wet rider 70 bike 9
    """

    pressure_calculator = build_custom_setup(
        ride_type=RideStyleEnum.GRAVEL,
        surface_type=SurfaceEnum.WET,
        rider_w=70,
        bike_w=9,
        tire_w=40,
        casing=CasingEnum.STANDARD,
        w_diameter=DiameterEnum.D_700C,
        rim_type=RimTypeEnum.HOOKLESS,
        rim_width=25,
    )
    tire_pressure = pressure_calculator.calculate()
    assert math.isclose(tire_pressure.front_wheel, 28.9, abs_tol=TOLERANCE)
    assert math.isclose(tire_pressure.rear_wheel, 30.7, abs_tol=TOLERANCE)



def test_custom_mtbxc_dry_70_pressure_calculator():
    """
    mtb dry rider 70 bike 11
    """

    pressure_calculator = build_custom_setup(
        ride_type=RideStyleEnum.MTB_XC,
        surface_type=SurfaceEnum.DRY,
        rider_w=70,
        bike_w=11,
        tire_w=2.3,
        casing=CasingEnum.STANDARD,
        w_diameter=DiameterEnum.D_29,
        rim_type=RimTypeEnum.HOOKLESS,
        rim_width=30,
    )
    tire_pressure = pressure_calculator.calculate()
    assert math.isclose(tire_pressure.front_wheel, 19.8, abs_tol=TOLERANCE)
    assert math.isclose(tire_pressure.rear_wheel, 21.1, abs_tol=TOLERANCE)


def test_custom_mtb_wet_70_pressure_calculator():
    """
    mtb wet rider 70 bike 11
    """

    pressure_calculator = build_custom_setup(
        ride_type=RideStyleEnum.MTB_XC,
        surface_type=SurfaceEnum.WET,
        rider_w=70,
        bike_w=11,
        tire_w=2.3,
        casing=CasingEnum.STANDARD,
        w_diameter=DiameterEnum.D_29,
        rim_type=RimTypeEnum.HOOKLESS,
        rim_width=30,
    )
    tire_pressure = pressure_calculator.calculate()
    assert math.isclose(tire_pressure.front_wheel, 17.8, abs_tol=TOLERANCE)
    assert math.isclose(tire_pressure.rear_wheel, 19, abs_tol=TOLERANCE)