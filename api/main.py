"""
Carbon Tracker API - Main FastAPI application
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import uvicorn

from app.config import settings
from app.routers import health, auth, carbon, gamification, recycling, cfc, admin

# Initialize FastAPI app
app = FastAPI(
    title="Carbon Tracker API",
    description="Personal Carbon Footprint Tracker API",
    version="0.1.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# CORS middleware
# Ensure CORS_ORIGINS is always a list
cors_origins = settings.CORS_ORIGINS
if not isinstance(cors_origins, list):
    cors_origins = [
        "http://localhost:3000",
        "http://localhost:5173",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:5173",
    ]

# Add Netlify URL if not already present
netlify_url = "https://personalcarbontracker.netlify.app"
if netlify_url not in cors_origins:
    cors_origins.append(netlify_url)

app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "HEAD", "PATCH"],
    allow_headers=["*"],
    expose_headers=["*"],
)

# Register routers
app.include_router(health.router, tags=["health"])
app.include_router(auth.router, prefix="/api/v1", tags=["auth"])
app.include_router(carbon.router, prefix="/api/v1/carbon", tags=["carbon"])
app.include_router(gamification.router, prefix="/api/v1/gamification", tags=["gamification"])
app.include_router(recycling.router, prefix="/api/v1/recycling", tags=["recycling"])
app.include_router(cfc.router, prefix="/api/v1/cfc", tags=["cfc"])
app.include_router(admin.router, prefix="/api/v1/admin", tags=["admin"])


@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    """Global exception handler"""
    return JSONResponse(
        status_code=500,
        content={
            "success": False,
            "error": {
                "message": "Internal server error",
                "code": "INTERNAL_ERROR",
            },
        },
    )


@app.on_event("startup")
async def startup_event():
    """Startup tasks"""
    print("🌱 Carbon Tracker API starting up...")


@app.on_event("shutdown")
async def shutdown_event():
    """Shutdown tasks"""
    print("🌱 Carbon Tracker API shutting down...")


if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
    )

