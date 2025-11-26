"""
Carbon Tracker ML Service - Waste Classification API
"""

from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

from app.predictor import WastePredictor
from app.config import settings

# Initialize FastAPI app
app = FastAPI(
    title="Carbon Tracker ML Service",
    description="Waste Classification ML Inference Service",
    version="0.1.0",
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize predictor
predictor = WastePredictor()


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    model_info = {
        "loaded": predictor.is_ready(),
        "type": "Unknown",
    }
    
    if hasattr(predictor, 'model') and predictor.model is not None:
        model_info["type"] = "Local Model"
    else:
        model_info["type"] = "Heuristics Fallback"
    
    return {
        "status": "healthy",
        "service": "carbon-tracker-ml",
        "version": "0.1.0",
        "model": model_info,
        "device": str(predictor.device) if hasattr(predictor, 'device') else "Unknown",
    }


@app.post("/predict")
async def predict_waste(file: UploadFile = File(...)):
    """
    Predict waste type from uploaded image
    
    Args:
        file: Image file to classify
        
    Returns:
        Prediction with waste type and confidence
    """
    try:
        # Read image
        contents = await file.read()
        
        # Predict
        prediction = await predictor.predict(contents)
        
        return prediction
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction error: {str(e)}")


if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8001,
        reload=True,
    )

