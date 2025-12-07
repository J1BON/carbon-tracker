"""
Configuration settings for the Carbon Tracker API
"""

from pydantic_settings import BaseSettings
from pydantic import field_validator, Field, model_validator
from typing import List, Optional, Union
import json
import os


class Settings(BaseSettings):
    # App settings
    PROJECT_NAME: str = "MyCarbonFootprint API"
    VERSION: str = "0.1.0"
    DEBUG: bool = False
    
    # CORS - Accept as string or list, will be parsed to List[str] by model_validator
    CORS_ORIGINS: Union[List[str], str, None] = Field(
        default=None,
        description="CORS allowed origins"
    )
    
    # Database
    # Supports both PostgreSQL and SQLite
    # PostgreSQL: postgresql://user:password@host:5432/dbname
    # SQLite: sqlite:///./carbon_tracker.db (for local development)
    DATABASE_URL: str = "sqlite:///./carbon_tracker.db"
    
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
    
    # Email Settings
    SMTP_HOST: str = ""
    SMTP_PORT: int = 587
    SMTP_USER: str = ""
    SMTP_PASSWORD: str = ""
    SMTP_FROM_EMAIL: str = "noreply@carbontracker.com"
    SMTP_FROM_NAME: str = "MyCarbonFootprint"
    
    # Alternative: Resend API (https://resend.com)
    RESEND_API_KEY: str = Field(default="", description="Resend API key for email sending")
    
    # Frontend URL for email links
    FRONTEND_URL: str = "http://localhost:3000"
    
    # Email verification token expiry (hours)
    VERIFICATION_TOKEN_EXPIRE_HOURS: int = 24
    
    @model_validator(mode='after')
    def parse_cors_origins(self):
        """Parse CORS_ORIGINS after initialization"""
        cors_value = self.CORS_ORIGINS
        
        # If already a list, use it
        if isinstance(cors_value, list):
            self.CORS_ORIGINS = cors_value
            return self
        
        # If None or empty, use defaults
        if not cors_value:
            self.CORS_ORIGINS = [
                "http://localhost:3000",
                "http://localhost:5173",
                "http://127.0.0.1:3000",
                "http://127.0.0.1:5173",
            ]
            return self
        
        # If string, try to parse
        if isinstance(cors_value, str):
            # Try JSON first
            if cors_value.strip().startswith('['):
                try:
                    parsed = json.loads(cors_value)
                    if isinstance(parsed, list):
                        self.CORS_ORIGINS = parsed
                        return self
                except (json.JSONDecodeError, ValueError):
                    pass
            
            # Try comma-separated
            origins = [origin.strip() for origin in cors_value.split(',') if origin.strip()]
            if origins:
                self.CORS_ORIGINS = origins
                return self
        
        # Fallback to defaults
        self.CORS_ORIGINS = [
            "http://localhost:3000",
            "http://localhost:5173",
            "http://127.0.0.1:3000",
            "http://127.0.0.1:5173",
        ]
        return self
    
    @property
    def cors_origins_list(self) -> List[str]:
        """Always return CORS_ORIGINS as a list"""
        if isinstance(self.CORS_ORIGINS, list):
            return self.CORS_ORIGINS
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
