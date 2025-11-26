"""
Gamification endpoints (badges, leaderboard, challenges)
"""

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import User, Badge, UserBadge

router = APIRouter()


@router.get("/badges")
async def get_all_badges(db: Session = Depends(get_db)):
    """Get all available badges"""
    badges = db.query(Badge).all()
    return {
        "success": True,
        "data": badges,
    }


@router.get("/leaderboard")
async def get_leaderboard(
    limit: int = 50,
    db: Session = Depends(get_db),
):
    """Get leaderboard"""
    users = (
        db.query(User)
        .order_by(User.total_points.desc(), User.eco_score.desc())
        .limit(limit)
        .all()
    )
    
    leaderboard = [
        {
            "user_id": str(user.id),
            "name": user.name,
            "avatar_url": user.avatar_url,
            "eco_score": user.eco_score,
            "total_points": user.total_points,
            "level": user.level,
            "rank": idx + 1,
        }
        for idx, user in enumerate(users)
    ]
    
    return {
        "success": True,
        "data": leaderboard,
    }


@router.get("/challenges")
async def get_challenges(db: Session = Depends(get_db)):
    """Get active challenges"""
    # TODO: Add Challenge model to query
    return {
        "success": True,
        "data": [
            {
                "id": "challenge-1",
                "name": "Carbon Free Week",
                "description": "Go 7 days without adding carbon footprint",
                "target_value": 7,
                "current_unit": "days",
                "reward_points": 500,
                "expires_at": None,
            }
        ],
    }

