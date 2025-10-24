#  Tire Pressure Recommndation tool

A comprehensive bicycle tire pressure recommendation system that provides optimal pressure calculations based on rider weight, bike specifications, tire dimensions, and riding conditions.

## 📋 Overview

Getting tire pressure right is crucial for performance, comfort, and safety. Too high and you sacrifice grip and comfort; too low and you risk pinch flats and sluggish handling. This tool takes the guesswork out of tire pressure by using a scientifically-validated algorithm that accounts for multiple factors affecting optimal pressure.

## ✨ Features

- **Personalized Recommendations**: Calculates optimal tire pressure based on your specific setup
- **Multiple Disciplines**: Supports road cycling, gravel, cyclocross, and mountain biking (XC, trail, enduro, downhill)
- **Comprehensive Parameters**: Considers rider weight, bike weight, tire width, rim width, rim type, tire casing, and surface conditions
- **Realistic Results**: Produces accurate pressure recommendations that match real-world best practices
- **FastAPI Backend**: RESTful API for easy integration into applications
- **Built with Pydantic**: Type-safe data validation and serialization


## 📦 Installation

1. Clone the repository:
```bash
git clone https://github.com/eduarde/tire_pressure_guide.git
cd tire_pressure_guide
```

2. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

## 🚀 Usage

### Running the API Server

```bash
python -m app.main
```

The API will be available at `http://localhost:8000`

### API Documentation

Interactive API documentation is available at:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

### Example Request

```python
import requests

data = {
    "ride_type": {
        "style": "ROAD",
        "surface": "DRY"
    },
    "weight": {
        "rider": 75.0,
        "bike": 8.0
    },
    "front_tire": {
        "position": "FRONT",
        "casing": "STANDARD",
        "width": 28.0,
        "unit": "MM"
    },
    "rear_tire": {
        "position": "REAR",
        "casing": "STANDARD",
        "width": 28.0,
        "unit": "MM"
    },
    "front_wheel": {
        "position": "FRONT",
        "diameter": "700C",
        "rim_type": "HOOKLESS",
        "rim_width": 21.0
    },
    "rear_wheel": {
        "position": "REAR",
        "diameter": "700C",
        "rim_type": "HOOKLESS",
        "rim_width": 21.0
    }
}

response = requests.post("http://localhost:8000/calculate", json=data)
print(response.json())
```

Expected output:
```json
{
    "front_wheel": 50.2,
    "rear_wheel": 53.4,
    "unit": "PSI"
}
```

## 🧮 Algorithm

The tire pressure calculator uses an empirically-derived formula that considers:

1. **Geometric Factors**: Tire volume based on tire width and wheel diameter
2. **Weight Distribution**: Total system weight (rider + bike) with front/rear balance
3. **Ride Style Modifiers**: Adjustments for road, gravel, cyclocross, and mountain biking disciplines
4. **Equipment Factors**: 
   - Rim type (hookless, hooked, tubular, tubes)
   - Tire casing (standard, reinforced, thin)
   - Rim width adjustments
5. **Conditions**: Surface type (dry, wet, mixed, snow)

The algorithm produces pressures that optimize:
- Rolling resistance
- Comfort and vibration damping
- Cornering grip
- Puncture resistance

## 📊 Supported Parameters

### Ride Styles
- `ROAD`: Road cycling
- `GRAVEL`: Gravel/adventure cycling
- `CYCLOCROSS`: Cyclocross racing
- `MTB_XC`: Cross-country mountain biking
- `MTB_TRAIL`: Trail mountain biking
- `MTB_ENDURO`: Enduro mountain biking
- `MTB_DOWNHILL`: Downhill mountain biking
- `FATBIKE`: Fat bike cycling

### Surface Conditions
- `DRY`: Dry conditions
- `WET`: Wet conditions
- `MIXED`: Mixed conditions
- `SNOW`: Snow conditions

### Rim Types
- `HOOKLESS`: Modern hookless/TSS rims
- `HOOKED`: Traditional hooked rims
- `TUBULAR`: Tubular (sewup) tires
- `TUBES`: Clincher with inner tubes

### Tire Casings
- `STANDARD`: Standard casing
- `REINFORCED`: Reinforced/puncture-resistant casing
- `THIN`: Thin/supple racing casing
- `DOWNHILL_CASING`: Heavy-duty downhill casing

## 🧪 Testing

Run the test suite:

```bash
pytest tests/
```

Run with coverage:

```bash
pytest tests/ --cov=app --cov-report=html
```

## 🎯 Example Recommendations

### Road Bike (58kg rider, 28mm tires)
- Dry: Front 50.2 PSI, Rear 53.4 PSI
- Wet: Front 45.2 PSI, Rear 48.0 PSI

### Gravel Bike (58kg rider, 40mm tires)
- Dry: Front 29.9 PSI, Rear 31.8 PSI
- Wet: Front 26.9 PSI, Rear 28.7 PSI

### MTB XC (58kg rider, 2.3" tires)
- Dry: Front 18.5 PSI, Rear 19.7 PSI
- Wet: Front 16.7 PSI, Rear 17.7 PSI


---

**Note**: Tire pressure recommendations are guidelines. Always consider your specific riding style, terrain, and personal preferences. Start with the recommended pressure and adjust based on feel and performance.
