"""
Configuration settings for the Carbon Tracker API
"""

from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    # App settings
    PROJECT_NAME: str = "Carbon Tracker API"
    VERSION: str = "0.1.0"
    DEBUG: bool = False
    
    # CORS
    CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://localhost:5173",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:5173",
    ]
    
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
    
    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()

