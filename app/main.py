from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .schemas import TirePressureRequest, TirePressure
from .services import build_and_compute
from .core.config import ALLOWED_ORIGINS, ALLOW_CREDENTIALS

app = FastAPI()

# Configure CORS to allow frontend requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS if isinstance(ALLOWED_ORIGINS, list) else ["*"],
    allow_credentials=ALLOW_CREDENTIALS,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {"status": "healthy"}


@app.post("/compute", response_model=TirePressure)
def compute_pressure(payload: TirePressureRequest):
    recommended_pressure = build_and_compute(
        payload.bike, payload.surface, payload.rider_weight
    )
    return recommended_pressure
