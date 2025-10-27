import os
from typing import List, Union
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()


def get_cors_origins() -> Union[List[str], str]:
    """Get allowed CORS origins from environment variable or use defaults.
    
    Returns either a list of specific origins or "*" for development.
    In production, always use specific origins for security.
    """
    # Check if we're in production mode
    environment = os.getenv("ENVIRONMENT", "development").lower()
    
    # Get origins from environment variable
    origins_str = os.getenv("ALLOWED_ORIGINS", "")
    
    if origins_str:
        # If specific origins are set, use them (comma-separated)
        return [origin.strip() for origin in origins_str.split(",") if origin.strip()]
    
    # In production, you MUST set ALLOWED_ORIGINS explicitly
    if environment == "production":
        raise ValueError(
            "ALLOWED_ORIGINS must be explicitly set in production. "
            "Example: ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com"
        )
    
    # Development mode: allow all origins (*)
    # This allows any localhost/127.0.0.1 port without hardcoding
    return "*"


def should_allow_credentials() -> bool:
    """Whether to allow credentials in CORS.
    
    Note: When allow_origins="*", credentials must be False.
    """
    origins = get_cors_origins()
    return origins != "*"


# Configuration
ALLOWED_ORIGINS = get_cors_origins()
ALLOW_CREDENTIALS = should_allow_credentials()
