"""
Health check endpoints
"""

from fastapi import APIRouter

router = APIRouter()


@router.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
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

