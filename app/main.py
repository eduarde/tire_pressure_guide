from fastapi import FastAPI
from .schemas import TirePressureRequest, TirePressure
from .services import build_and_compute

app = FastAPI()


@app.get("/")
def root():
    return {"status": "healthy"}

@app.post("/compute", response_model=TirePressure)
def compute_pressure(payload: TirePressureRequest):
    recommended_pressure = build_and_compute(payload.bike, payload.surface, payload.rider_weight)
    return recommended_pressure