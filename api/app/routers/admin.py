"""
Admin panel endpoints for managing the Carbon Tracker platform
"""

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import func, desc
from typing import List, Optional
from datetime import datetime, timedelta

from app.database import get_db
from app.models import User, CarbonLog, Badge, UserBadge, Challenge, RecyclingPoint, CFCReport
from app.auth import get_current_admin
from pydantic import BaseModel, EmailStr

router = APIRouter()


# Pydantic models
class UserUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    is_admin: Optional[bool] = None
    is_active: Optional[bool] = None
    eco_score: Optional[float] = None
    level: Optional[int] = None
    total_points: Optional[int] = None


class UserResponse(BaseModel):
    id: str
    email: str
    name: str
    is_admin: bool
    is_active: bool
    eco_score: float
    level: int
    total_points: int
    created_at: datetime
    
    class Config:
        from_attributes = True
    
    @classmethod
    def from_orm(cls, obj):
        """Convert ORM object to response model, ensuring id is a string"""
        data = {
            "id": str(obj.id),
            "email": obj.email,
            "name": obj.name,
            "is_admin": obj.is_admin,
            "is_active": obj.is_active,
            "eco_score": obj.eco_score,
            "level": obj.level,
            "total_points": obj.total_points,
            "created_at": obj.created_at,
        }
        return cls(**data)


class StatsResponse(BaseModel):
    total_users: int
    active_users: int
    admin_users: int
    total_carbon_logs: int
    total_carbon_saved_kg: float
    total_cfc_reports: int
    total_badges: int
    total_challenges: int
    total_recycling_points: int
    users_this_month: int
    carbon_logs_this_month: int


# User Management
@router.get("/users", response_model=List[UserResponse])
async def get_all_users(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    search: Optional[str] = None,
    is_admin: Optional[bool] = None,
    is_active: Optional[bool] = None,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin)
):
    """Get all users with filtering and pagination"""
    query = db.query(User)
    
    if search:
        query = query.filter(
            (User.name.ilike(f"%{search}%")) | 
            (User.email.ilike(f"%{search}%"))
        )
    
    if is_admin is not None:
        query = query.filter(User.is_admin == is_admin)
    
    if is_active is not None:
        query = query.filter(User.is_active == is_active)
    
    users = query.order_by(desc(User.created_at)).offset(skip).limit(limit).all()
    # Convert UUID to string for each user
    return [UserResponse(
        id=str(user.id),
        email=user.email,
        name=user.name,
        is_admin=user.is_admin,
        is_active=user.is_active,
        eco_score=user.eco_score,
        level=user.level,
        total_points=user.total_points,
        created_at=user.created_at,
    ) for user in users]


@router.get("/users/{user_id}", response_model=UserResponse)
async def get_user(
    user_id: str,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin)
):
    """Get user by ID"""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@router.put("/users/{user_id}", response_model=UserResponse)
async def update_user(
    user_id: str,
    user_update: UserUpdate,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin)
):
    """Update user"""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Prevent admin from removing their own admin status
    if user_id == str(admin.id) and user_update.is_admin is False:
        raise HTTPException(status_code=400, detail="Cannot remove your own admin status")
    
    update_data = user_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(user, field, value)
    
    user.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(user)
    return user


@router.delete("/users/{user_id}")
async def delete_user(
    user_id: str,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin)
):
    """Delete user (soft delete by setting is_active=False)"""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Prevent admin from deleting themselves
    if user_id == str(admin.id):
        raise HTTPException(status_code=400, detail="Cannot delete your own account")
    
    user.is_active = False
    db.commit()
    return {"message": "User deactivated successfully"}


# Statistics
@router.get("/stats", response_model=StatsResponse)
async def get_admin_stats(
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin)
):
    """Get platform statistics"""
    now = datetime.utcnow()
    start_of_month = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
    
    total_users = db.query(func.count(User.id)).scalar()
    active_users = db.query(func.count(User.id)).filter(User.is_active == True).scalar()
    admin_users = db.query(func.count(User.id)).filter(User.is_admin == True).scalar()
    
    total_carbon_logs = db.query(func.count(CarbonLog.id)).scalar()
    total_carbon_saved = db.query(func.sum(CarbonLog.carbon_amount_kg)).scalar() or 0.0
    
    total_cfc_reports = db.query(func.count(CFCReport.id)).scalar()
    total_badges = db.query(func.count(Badge.id)).scalar()
    total_challenges = db.query(func.count(Challenge.id)).scalar()
    total_recycling_points = db.query(func.count(RecyclingPoint.id)).scalar()
    
    users_this_month = db.query(func.count(User.id)).filter(
        User.created_at >= start_of_month
    ).scalar()
    
    carbon_logs_this_month = db.query(func.count(CarbonLog.id)).filter(
        CarbonLog.created_at >= start_of_month
    ).scalar()
    
    return StatsResponse(
        total_users=total_users,
        active_users=active_users,
        admin_users=admin_users,
        total_carbon_logs=total_carbon_logs,
        total_carbon_saved_kg=float(total_carbon_saved),
        total_cfc_reports=total_cfc_reports,
        total_badges=total_badges,
        total_challenges=total_challenges,
        total_recycling_points=total_recycling_points,
        users_this_month=users_this_month,
        carbon_logs_this_month=carbon_logs_this_month,
    )


# Carbon Logs Management
@router.get("/carbon-logs")
async def get_all_carbon_logs(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    user_id: Optional[str] = None,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin)
):
    """Get all carbon logs"""
    query = db.query(CarbonLog)
    
    if user_id:
        query = query.filter(CarbonLog.user_id == user_id)
    
    logs = query.order_by(desc(CarbonLog.created_at)).offset(skip).limit(limit).all()
    return logs


@router.delete("/carbon-logs/{log_id}")
async def delete_carbon_log(
    log_id: str,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin)
):
    """Delete carbon log"""
    log = db.query(CarbonLog).filter(CarbonLog.id == log_id).first()
    if not log:
        raise HTTPException(status_code=404, detail="Carbon log not found")
    
    db.delete(log)
    db.commit()
    return {"message": "Carbon log deleted successfully"}


# Badges Management
@router.get("/badges")
async def get_all_badges(
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin)
):
    """Get all badges"""
    badges = db.query(Badge).all()
    return badges


@router.post("/badges")
async def create_badge(
    name: str,
    description: Optional[str] = None,
    icon: Optional[str] = None,
    rarity: str = "common",
    points_required: int = 0,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin)
):
    """Create new badge"""
    badge = Badge(
        name=name,
        description=description,
        icon=icon,
        rarity=rarity,
        points_required=points_required
    )
    db.add(badge)
    db.commit()
    db.refresh(badge)
    return badge


@router.put("/badges/{badge_id}")
async def update_badge(
    badge_id: str,
    name: Optional[str] = None,
    description: Optional[str] = None,
    icon: Optional[str] = None,
    rarity: Optional[str] = None,
    points_required: Optional[int] = None,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin)
):
    """Update badge"""
    badge = db.query(Badge).filter(Badge.id == badge_id).first()
    if not badge:
        raise HTTPException(status_code=404, detail="Badge not found")
    
    if name is not None:
        badge.name = name
    if description is not None:
        badge.description = description
    if icon is not None:
        badge.icon = icon
    if rarity is not None:
        badge.rarity = rarity
    if points_required is not None:
        badge.points_required = points_required
    
    db.commit()
    db.refresh(badge)
    return badge


@router.delete("/badges/{badge_id}")
async def delete_badge(
    badge_id: str,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin)
):
    """Delete badge"""
    badge = db.query(Badge).filter(Badge.id == badge_id).first()
    if not badge:
        raise HTTPException(status_code=404, detail="Badge not found")
    
    db.delete(badge)
    db.commit()
    return {"message": "Badge deleted successfully"}


# Challenges Management
@router.get("/challenges")
async def get_all_challenges(
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin)
):
    """Get all challenges"""
    challenges = db.query(Challenge).all()
    return challenges


@router.post("/challenges")
async def create_challenge(
    name: str,
    description: Optional[str] = None,
    target_value: float = 0,
    current_unit: str = "kg",
    reward_points: int = 0,
    badge_reward: Optional[str] = None,
    expires_at: Optional[datetime] = None,
    is_active: bool = True,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin)
):
    """Create new challenge"""
    challenge = Challenge(
        name=name,
        description=description,
        target_value=target_value,
        current_unit=current_unit,
        reward_points=reward_points,
        badge_reward=badge_reward,
        expires_at=expires_at,
        is_active=is_active
    )
    db.add(challenge)
    db.commit()
    db.refresh(challenge)
    return challenge


@router.put("/challenges/{challenge_id}")
async def update_challenge(
    challenge_id: str,
    name: Optional[str] = None,
    description: Optional[str] = None,
    target_value: Optional[float] = None,
    current_unit: Optional[str] = None,
    reward_points: Optional[int] = None,
    badge_reward: Optional[str] = None,
    expires_at: Optional[datetime] = None,
    is_active: Optional[bool] = None,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin)
):
    """Update challenge"""
    challenge = db.query(Challenge).filter(Challenge.id == challenge_id).first()
    if not challenge:
        raise HTTPException(status_code=404, detail="Challenge not found")
    
    if name is not None:
        challenge.name = name
    if description is not None:
        challenge.description = description
    if target_value is not None:
        challenge.target_value = target_value
    if current_unit is not None:
        challenge.current_unit = current_unit
    if reward_points is not None:
        challenge.reward_points = reward_points
    if badge_reward is not None:
        challenge.badge_reward = badge_reward
    if expires_at is not None:
        challenge.expires_at = expires_at
    if is_active is not None:
        challenge.is_active = is_active
    
    db.commit()
    db.refresh(challenge)
    return challenge


@router.delete("/challenges/{challenge_id}")
async def delete_challenge(
    challenge_id: str,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin)
):
    """Delete challenge"""
    challenge = db.query(Challenge).filter(Challenge.id == challenge_id).first()
    if not challenge:
        raise HTTPException(status_code=404, detail="Challenge not found")
    
    db.delete(challenge)
    db.commit()
    return {"message": "Challenge deleted successfully"}


# Recycling Points Management
@router.get("/recycling-points")
async def get_all_recycling_points(
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin)
):
    """Get all recycling points"""
    points = db.query(RecyclingPoint).all()
    return points


@router.post("/recycling-points")
async def create_recycling_point(
    name: str,
    address: str,
    latitude: float,
    longitude: float,
    waste_types_accepted: List[str],
    opening_hours: Optional[str] = None,
    phone: Optional[str] = None,
    website: Optional[str] = None,
    verified: bool = False,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin)
):
    """Create new recycling point"""
    point = RecyclingPoint(
        name=name,
        address=address,
        latitude=latitude,
        longitude=longitude,
        waste_types_accepted=waste_types_accepted,
        opening_hours=opening_hours,
        phone=phone,
        website=website,
        verified=verified
    )
    db.add(point)
    db.commit()
    db.refresh(point)
    return point


@router.put("/recycling-points/{point_id}")
async def update_recycling_point(
    point_id: str,
    name: Optional[str] = None,
    address: Optional[str] = None,
    latitude: Optional[float] = None,
    longitude: Optional[float] = None,
    waste_types_accepted: Optional[List[str]] = None,
    opening_hours: Optional[str] = None,
    phone: Optional[str] = None,
    website: Optional[str] = None,
    verified: Optional[bool] = None,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin)
):
    """Update recycling point"""
    point = db.query(RecyclingPoint).filter(RecyclingPoint.id == point_id).first()
    if not point:
        raise HTTPException(status_code=404, detail="Recycling point not found")
    
    if name is not None:
        point.name = name
    if address is not None:
        point.address = address
    if latitude is not None:
        point.latitude = latitude
    if longitude is not None:
        point.longitude = longitude
    if waste_types_accepted is not None:
        point.waste_types_accepted = waste_types_accepted
    if opening_hours is not None:
        point.opening_hours = opening_hours
    if phone is not None:
        point.phone = phone
    if website is not None:
        point.website = website
    if verified is not None:
        point.verified = verified
    
    point.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(point)
    return point


@router.delete("/recycling-points/{point_id}")
async def delete_recycling_point(
    point_id: str,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin)
):
    """Delete recycling point"""
    point = db.query(RecyclingPoint).filter(RecyclingPoint.id == point_id).first()
    if not point:
        raise HTTPException(status_code=404, detail="Recycling point not found")
    
    db.delete(point)
    db.commit()
    return {"message": "Recycling point deleted successfully"}


# CFC Reports Management
@router.get("/cfc-reports")
async def get_all_cfc_reports(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    user_id: Optional[str] = None,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin)
):
    """Get all CFC reports"""
    query = db.query(CFCReport)
    
    if user_id:
        query = query.filter(CFCReport.user_id == user_id)
    
    reports = query.order_by(desc(CFCReport.created_at)).offset(skip).limit(limit).all()
    return reports


@router.delete("/cfc-reports/{report_id}")
async def delete_cfc_report(
    report_id: str,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin)
):
    """Delete CFC report"""
    report = db.query(CFCReport).filter(CFCReport.id == report_id).first()
    if not report:
        raise HTTPException(status_code=404, detail="CFC report not found")
    
    db.delete(report)
    db.commit()
    return {"message": "CFC report deleted successfully"}

