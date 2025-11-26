"""
Recycling points and suggestions endpoints
"""

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import RecyclingPoint

router = APIRouter()


@router.get("/points")
async def get_recycling_points(
    latitude: float = Query(...),
    longitude: float = Query(...),
    radius_km: float = Query(10),
    waste_type: str = Query(None),
    db: Session = Depends(get_db),
):
    """
    Get nearby recycling points
    TODO: Add proper geo-spatial query
    """
    # TODO: Implement proper PostGIS query
    points = db.query(RecyclingPoint).limit(20).all()
    
    return {
        "success": True,
        "data": points,
    }


@router.get("/tips/{waste_type}")
async def get_recycling_tips(waste_type: str):
    """Get recycling tips for a specific waste type"""
    tips = {
        "plastic": [
            "Clean plastic containers before recycling",
            "Remove labels if possible",
            "Check if your local facility accepts this type of plastic",
            "Consider reusing containers when possible",
        ],
        "paper": [
            "Keep paper dry and clean",
            "Remove any plastic or metal attachments",
            "Shred sensitive documents before recycling",
            "Compost small amounts at home if possible",
        ],
        "metal": [
            "Remove any food residue",
            "Separate different types of metals",
            "Aluminum cans are highly recyclable",
            "Many scrap metal facilities pay for metals",
        ],
        "glass": [
            "Remove lids and caps",
            "Rinse containers",
            "Do not include broken glass",
            "Glass can be recycled indefinitely",
        ],
        "organic": [
            "Compost at home if possible",
            "Keep organic waste dry in collection",
            "No plastic bags in compost bins",
            "Large amounts can go to local composting facilities",
        ],
        "electronic": [
            "Find local e-waste facilities",
            "Some retailers accept old electronics",
            "Remove batteries separately",
            "Wipe data before recycling devices",
        ],
        "textile": [
            "Donate wearable clothing",
            "Many brands have take-back programs",
            "Clean items before donating",
            "Consider upcycling or repairing",
        ],
    }
    
    return {
        "success": True,
        "data": {
            "waste_type": waste_type,
            "tips": tips.get(waste_type, ["Check local recycling guidelines"]),
        },
    }

