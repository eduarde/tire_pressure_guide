import os
from typing import List
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()


def get_cors_origins() -> List[str]:
    """Get allowed CORS origins from environment variable or use defaults."""
    origins_str = os.getenv("ALLOWED_ORIGINS", "")
    
    if origins_str:
        # Split by comma and strip whitespace
        return [origin.strip() for origin in origins_str.split(",") if origin.strip()]
    
    # Default origins for local development
    return [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5174",
        "http://localhost:5175",
        "http://127.0.0.1:5175",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        # If you need to allow other network IPs, set ALLOWED_ORIGINS in your environment.
        # The following are safe defaults for local development only.
    ]


# Configuration
ALLOWED_ORIGINS = get_cors_origins()
