from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from .schemas import TirePressureRequest, TirePressure
from .services import build_and_compute
from .core.config import ALLOWED_ORIGINS, ALLOW_CREDENTIALS
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()

# Log CORS configuration on startup
@app.on_event("startup")
async def startup_event():
    logger.info(f"CORS Configuration - ALLOWED_ORIGINS: {ALLOWED_ORIGINS}")
    logger.info(f"CORS Configuration - ALLOW_CREDENTIALS: {ALLOW_CREDENTIALS}")

# Middleware to log all requests
@app.middleware("http")
async def log_requests(request: Request, call_next):
    origin = request.headers.get("origin", "No Origin Header")
    logger.info(f"Request: {request.method} {request.url.path} | Origin: {origin}")
    response = await call_next(request)
    logger.info(f"Response Status: {response.status_code}")
    return response

# Configure CORS to allow frontend requests
# Note: ALLOWED_ORIGINS can be either a list of strings or "*"
if isinstance(ALLOWED_ORIGINS, list):
    app.add_middleware(
        CORSMiddleware,
        allow_origins=ALLOWED_ORIGINS,
        allow_credentials=ALLOW_CREDENTIALS,
        allow_methods=["*"],
        allow_headers=["*"],
        expose_headers=["*"],
    )
else:
    # ALLOWED_ORIGINS is "*" (development mode)
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=False,
        allow_methods=["*"],
        allow_headers=["*"],
        expose_headers=["*"],
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
