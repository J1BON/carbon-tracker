"""
Configuration settings for the Carbon Tracker API
"""

from pydantic_settings import BaseSettings
from pydantic import field_validator, Field
from typing import List
import json


class Settings(BaseSettings):
    # App settings
    PROJECT_NAME: str = "Carbon Tracker API"
    VERSION: str = "0.1.0"
    DEBUG: bool = False
    
    # CORS - Parse from JSON string, comma-separated string, or use defaults
    CORS_ORIGINS: List[str] = Field(
        default=[
            "http://localhost:3000",
            "http://localhost:5173",
            "http://127.0.0.1:3000",
            "http://127.0.0.1:5173",
        ],
        description="CORS allowed origins"
    )
    
    # Database
    # Supports both PostgreSQL and SQLite
    # PostgreSQL: postgresql://user:password@host:5432/dbname
    # SQLite: sqlite:///./carbon_tracker.db (for local development)
    DATABASE_URL: str = "postgresql://postgres:postgres@localhost:5432/carbon_tracker"
    
    # Security
    SECRET_KEY: str = "your-secret-key-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days
    
    # ML Service
    ML_SERVICE_URL: str = "http://localhost:8001"
    
    # Redis
    REDIS_URL: str = "redis://localhost:6379"
    
    # AWS / S3
    AWS_ACCESS_KEY_ID: str = ""
    AWS_SECRET_ACCESS_KEY: str = ""
    AWS_BUCKET_NAME: str = "carbon-tracker-images"
    AWS_ENDPOINT_URL: str = ""
    AWS_REGION: str = "us-east-1"
    
    # Image settings
    MAX_IMAGE_SIZE_MB: int = 10
    ALLOWED_IMAGE_TYPES: List[str] = ["image/jpeg", "image/png", "image/webp"]
    
    # Carbon calculation settings
    DEFAULT_WEIGHT_AVERAGE: float = 70.0  # kg
    
    @field_validator('CORS_ORIGINS', mode='before')
    @classmethod
    def parse_cors_origins(cls, v) -> List[str]:
        """Parse CORS_ORIGINS from various formats"""
        if isinstance(v, list):
            return v
        if isinstance(v, str):
            # Try JSON first
            if v.strip().startswith('['):
                try:
                    parsed = json.loads(v)
                    if isinstance(parsed, list):
                        return parsed
                except json.JSONDecodeError:
                    pass
            # Try comma-separated
            origins = [origin.strip() for origin in v.split(',') if origin.strip()]
            if origins:
                return origins
        # Return default if parsing fails
        return [
            "http://localhost:3000",
            "http://localhost:5173",
            "http://127.0.0.1:3000",
            "http://127.0.0.1:5173",
        ]
    
    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()
