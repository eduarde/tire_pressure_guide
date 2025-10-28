#  Tire Pressure Recommendation 

A comprehensive bicycle tire pressure recommendation system with a modern web interface. Provides optimal pressure calculations based on rider weight, bike specifications, tire dimensions, and riding conditions.

## 📋 Overview

Getting tire pressure right is crucial for performance, comfort, and safety. Too high and you sacrifice grip and comfort; too low and you risk pinch flats and sluggish handling. This tool takes the guesswork out of tire pressure by using a scientifically-validated algorithm that accounts for multiple factors affecting optimal pressure.

## ✨ Features

- **Interactive Web UI**: Modern React-based frontend with step-by-step wizard
- **Personalized Recommendations**: Calculates optimal tire pressure based on your specific setup
- **Multiple Disciplines**: Supports road cycling, gravel, cyclocross, and mountain biking (XC, trail, enduro, downhill)
- **Comprehensive Parameters**: Considers rider weight, bike weight, tire width, rim width, rim type, tire casing, and surface conditions
- **Realistic Results**: Produces accurate pressure recommendations that match real-world best practices
- **FastAPI Backend**: RESTful API for easy integration
- **Built with Pydantic**: Type-safe data validation and serialization
- **Docker Support**: Easy deployment with Docker and Docker Compose

## 🏗️ Architecture

```
┌─────────────────────────┐
│   Frontend (React)      │
│   - Vite + TypeScript   │  → http://localhost:3000
│   - Tailwind CSS        │
│   - Nginx (Production)  │
└────────┬────────────────┘
         │
         │ HTTP API calls
         │
┌────────▼────────────────┐
│   Backend (FastAPI)     │
│   - Python 3.11         │  → http://localhost:8088
│   - Pydantic validation │
│   - Uvicorn server      │
└─────────────────────────┘
```

## � Quick Start with Docker (Recommended)

### Prerequisites
- Docker installed on your system
- Docker Compose installed (usually included with Docker Desktop)

### Run the Full Application

1. **Clone the repository:**
   ```bash
   git clone https://github.com/eduarde/tire_pressure_guide.git
   cd tire_pressure_guide
   ```

2. **Start all services:**
   ```bash
   docker-compose up --build
   ```

3. **Access the application:**
   - **Frontend (Web UI)**: http://localhost:3000
   - **Backend API**: http://localhost:8088
   - **API Documentation**: http://localhost:8088/docs

4. **Stop the services:**
   ```bash
   docker-compose down
   ```

### Docker Commands

```bash
# Run in detached mode (background)
docker-compose up -d

# View logs
docker-compose logs -f

# View logs for specific service
docker-compose logs -f backend
docker-compose logs -f frontend

# Rebuild after code changes
docker-compose up --build

# Stop and remove all containers
docker-compose down

# Remove all containers and volumes
docker-compose down -v
```

## 💻 Local Development Setup

### Backend Setup (Python/FastAPI)

1. **Navigate to project root:**
   ```bash
   cd tire_pressure_guide
   ```

2. **Create a virtual environment:**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Set environment variables (optional):**
   ```bash
   cp .env.example .env
   # Edit .env with your settings
   ```

5. **Run the backend server:**
   ```bash
   uvicorn app.main:app --host 0.0.0.0 --port 8088 --reload
   ```

6. **Access backend:**
   - API: http://localhost:8088
   - Swagger UI: http://localhost:8088/docs
   - ReDoc: http://localhost:8088/redoc

### Frontend Setup (React/Vite)

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set environment variables:**
   ```bash
   cp .env.example .env
   # Edit .env to point to your backend
   # VITE_API_URL=http://localhost:8088
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. **Access frontend:**
   - Development server: http://localhost:5173

6. **Build for production:**
   ```bash
   npm run build
   ```

## 📦 Installation Options

### Option 1: Docker (Full Stack)
Best for: Production deployment, testing the full application

```bash
docker-compose up --build
```

### Option 2: Backend Only (Docker)
Best for: API development, using a different frontend

```bash
cd tire_pressure_guide
docker build -t tire-pressure-backend .
docker run -p 8088:8088 tire-pressure-backend
```

### Option 3: Frontend Only (Docker)
Best for: Frontend development with deployed backend

```bash
cd frontend
docker build -t tire-pressure-frontend .
docker run -p 3000:80 tire-pressure-frontend
```

### Option 4: Local Development
Best for: Active development with hot-reload

```bash
# Terminal 1: Backend
uvicorn app.main:app --host 0.0.0.0 --port 8088 --reload

# Terminal 2: Frontend
cd frontend && npm run dev
```

## 📡 API Usage

### Example Request

```bash
curl -X 'POST' \
  'http://localhost:8088/compute' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
  "bike": {
    "name": "My Road Bike",
    "discipline": "ROAD",
    "front_tire": {
      "width": 28,
      "position": "FRONT",
      "casing": "STANDARD",
      "unit": "MM"
    },
    "front_wheel": {
      "rim_width": 23,
      "rim_type": "HOOKLESS",
      "position": "FRONT",
      "diameter": "700C"
    },
    "rear_tire": {
      "width": 28,
      "position": "REAR",
      "casing": "STANDARD",
      "unit": "MM"
    },
    "rear_wheel": {
      "rim_width": 23,
      "rim_type": "HOOKLESS",
      "position": "REAR",
      "diameter": "700C"
    },
    "weight": {
      "value": 6.8,
      "unit": "kg"
    }
  },
  "rider_weight": {
    "value": 58,
    "unit": "kg"
  },
  "surface": "DRY"
}'
```

### Expected Response

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
   - Tire casing (standard, reinforced, thin, downhill)
   - Rim width adjustments
5. **Conditions**: Surface type (dry, wet, mixed, snow)

The algorithm produces pressures that optimize:
- Rolling resistance
- Comfort and vibration damping
- Cornering grip
- Puncture resistance

## 📊 Supported Parameters

### Disciplines
- `ROAD`: Road cycling
- `GRAVEL`: Gravel/adventure cycling
- `CYCLOCROSS`: Cyclocross racing
- `MTB_XC`: Cross-country mountain biking
- `MTB_TRAIL`: Trail mountain biking
- `MTB_ENDURO`: Enduro mountain biking
- `MTB_DOWNHILL`: Downhill mountain biking

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

### Wheel Diameters
**Road/Gravel/Cyclocross:**
- `650C`: 650C (571mm)
- `650B`: 650B (584mm)
- `700C`: 700C (622mm)

**Mountain Bike:**
- `26`: 26 inch (559mm)
- `27.5`: 27.5 inch / 650B (584mm)
- `29`: 29 inch (622mm)

## 🧪 Testing

### Backend Tests

```bash
# Activate virtual environment
source venv/bin/activate

# Run all tests
pytest tests/

# Run with coverage
pytest tests/ --cov=app --cov-report=html

# Run specific test file
pytest tests/test_services.py
```

### Frontend Tests

```bash
cd frontend

# Run tests (if configured)
npm test

# Type checking
npm run build
```

## 🎯 Example Recommendations

### Road Bike (58kg rider, 28mm tires, 700C wheels)
- **Dry**: Front 50.2 PSI, Rear 53.4 PSI
- **Wet**: Front 45.2 PSI, Rear 48.0 PSI

### Gravel Bike (58kg rider, 40mm tires, 700C wheels)
- **Dry**: Front 29.9 PSI, Rear 31.8 PSI
- **Wet**: Front 26.9 PSI, Rear 28.7 PSI

### MTB XC (58kg rider, 2.3" tires, 29" wheels)
- **Dry**: Front 18.5 PSI, Rear 19.7 PSI
- **Wet**: Front 16.7 PSI, Rear 17.7 PSI

## 🐳 Docker Configuration

### Environment Variables

**Backend (`docker-compose.yml`):**
```yaml
environment:
  - ENVIRONMENT=development
  - ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173
```

**Frontend (`.env.production`):**
```bash
VITE_API_URL=http://localhost:8088
```

### Port Configuration

Default ports can be changed in `docker-compose.yml`:
```yaml
ports:
  - "8088:8088"  # Backend: external:internal
  - "3000:80"    # Frontend: external:internal
```

### Production Deployment

For production, update the following:

1. **Backend environment variables:**
   - Set `ENVIRONMENT=production`
   - Configure `ALLOWED_ORIGINS` with your domain(s)

2. **Frontend environment:**
   - Update `VITE_API_URL` to your production API URL
   - Set up SSL/TLS with reverse proxy (nginx/traefik)

3. **Docker Compose:**
   ```bash
   docker-compose up -d
   ```

## 🔧 Troubleshooting

### Port Already in Use
If ports 3000 or 8088 are already in use:
```yaml
# In docker-compose.yml, change external port
ports:
  - "8089:8088"  # Use different external port
  - "3001:80"
```

### Frontend Can't Connect to Backend
1. Check backend is running: `docker-compose ps`
2. Verify `VITE_API_URL` in frontend `.env.production`
3. Check CORS settings: `ALLOWED_ORIGINS` in backend environment

### Clear Everything and Start Fresh
```bash
docker-compose down -v
docker system prune -a
docker-compose up --build
```

### Build Cache Issues
```bash
# Frontend
cd frontend
rm -rf node_modules package-lock.json
npm install

# Docker
docker-compose build --no-cache
```

## 🛠️ Technology Stack

### Backend
- **Framework**: FastAPI 0.120.1
- **Language**: Python 3.11
- **Validation**: Pydantic 2.12.3
- **Server**: Uvicorn 0.38.0
- **Testing**: pytest 8.4.2

### Frontend
- **Framework**: React 18.2.0
- **Build Tool**: Vite 5.0.0
- **Language**: TypeScript 5.3.3
- **Styling**: Tailwind CSS 3.4.1
- **UI Components**: Headless UI 2.1.8, Heroicons 2.1.4

### DevOps
- **Containerization**: Docker
- **Orchestration**: Docker Compose
- **Web Server**: Nginx (production)


---

**Note**: Tire pressure recommendations are guidelines. Always consider your specific riding style, terrain, and personal preferences. Start with the recommended pressure and adjust based on feel and performance.
