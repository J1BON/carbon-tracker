"""
Configuration settings for the ML Service
"""

from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    # Model settings
    MODEL_PATH: str = "models/waste_classifier.pth"
    CONFIDENCE_THRESHOLD: float = 0.7
    
    # Image settings
    IMAGE_SIZE: int = 224
    MAX_FILE_SIZE_MB: int = 10
    
    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()

