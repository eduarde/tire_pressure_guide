import math
from .fixtures import (
    build_road_default_setup,
    build_gravel_default_setup,
    build_mtbxc_default_setup,
)
from app.schemas import SurfaceEnum


TOLERANCE = 1.5


def test_default_road_dry_pressure_calculator():
    """
    road + dry + default settings
    """
    road_pressure_calculator = build_road_default_setup(SurfaceEnum.DRY)
    tire_pressure = road_pressure_calculator.calculate()
    assert math.isclose(tire_pressure.front_wheel, 51.1, abs_tol=TOLERANCE)
    assert math.isclose(tire_pressure.rear_wheel, 54.3, abs_tol=TOLERANCE)


def test_default_road_wet_pressure_calculator():
    """
    road + wet + default settings
    """
    road_pressure_calculator = build_road_default_setup(SurfaceEnum.WET)
    tire_pressure = road_pressure_calculator.calculate()
    assert math.isclose(tire_pressure.front_wheel, 46, abs_tol=TOLERANCE)
    assert math.isclose(tire_pressure.rear_wheel, 48.9, abs_tol=TOLERANCE)


def test_default_gravel_dry_pressure_calculator():
    """
    gravel + dry + default settings
    """
    road_pressure_calculator = build_gravel_default_setup(SurfaceEnum.DRY)
    tire_pressure = road_pressure_calculator.calculate()
    assert math.isclose(tire_pressure.front_wheel, 29.9, abs_tol=TOLERANCE)
    assert math.isclose(tire_pressure.rear_wheel, 31.8, abs_tol=TOLERANCE)


def test_default_gravel_wet_pressure_calculator():
    """
    gravel + wet + default settings
    """
    road_pressure_calculator = build_gravel_default_setup(SurfaceEnum.WET)
    tire_pressure = road_pressure_calculator.calculate()

    assert math.isclose(tire_pressure.front_wheel, 26.9, abs_tol=TOLERANCE)
    assert math.isclose(tire_pressure.rear_wheel, 28.7, abs_tol=TOLERANCE)


def test_default_mtb_xc_dry_pressure_calculator():
    """
    mtb xc + dry + default settings
    """
    road_pressure_calculator = build_mtbxc_default_setup(SurfaceEnum.DRY)
    tire_pressure = road_pressure_calculator.calculate()
    assert math.isclose(tire_pressure.front_wheel, 18.5, abs_tol=TOLERANCE)
    assert math.isclose(tire_pressure.rear_wheel, 19.7, abs_tol=TOLERANCE)


def test_default_mtb_xc_wet_pressure_calculator():
    """
    mtb xc + wet + default settings
    """
    road_pressure_calculator = build_mtbxc_default_setup(SurfaceEnum.WET)
    tire_pressure = road_pressure_calculator.calculate()
    assert math.isclose(tire_pressure.front_wheel, 16.7, abs_tol=TOLERANCE)
    assert math.isclose(tire_pressure.rear_wheel, 17.7, abs_tol=TOLERANCE)
