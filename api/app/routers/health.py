"""
Health check endpoints
"""

from fastapi import APIRouter

router = APIRouter()


@router.get("/health")
async def health_check():
    """Health check endpoint"""
    from app.database import engine
    from app.config import settings
    from sqlalchemy import text
    
    database_status = "unknown"
    try:
        with engine.connect() as conn:
            if settings.DATABASE_URL.startswith("sqlite"):
                result = conn.execute(text("SELECT 1"))
            else:
                result = conn.execute(text("SELECT 1"))
            result.fetchone()
            database_status = "connected"
    except Exception as e:
        database_status = f"error: {str(e)[:50]}"
    
    return {
        "status": "healthy",
        "database": database_status,
        "service": "carbon-tracker-api",
        "version": "0.1.0",
    }


@router.get("/ready")
async def readiness_check():
    """Readiness check endpoint"""
    # TODO: Add database connection check
    return {
        "status": "ready",
    }

