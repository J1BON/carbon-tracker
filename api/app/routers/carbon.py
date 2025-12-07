"""
Carbon tracking endpoints
"""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Dict, Any, Optional
from datetime import datetime, timedelta
from pydantic import BaseModel

from app.database import get_db
from app.models import CarbonLog, User
from app.auth import get_current_active_user
from app.services.carbon_calculator import CarbonCalculator
from app.services.gamification import GamificationService
from app.services.suggestion_service import SuggestionService
from app.services.report_service import ReportService
from app.services.impact_service import ImpactService

router = APIRouter()
calculator = CarbonCalculator()
gamification = GamificationService()
suggestion_service = SuggestionService()
report_service = ReportService()
impact_service = ImpactService()


class CarbonLogCreate(BaseModel):
    category: str
    activity: str
    carbon_amount_kg: float = 0
    metadata: Optional[Dict[str, Any]] = None


@router.get("/logs")
async def get_carbon_logs(
    limit: int = 50,
    offset: int = 0,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    """
    Get carbon logs for the authenticated user
    """
    logs = db.query(CarbonLog).filter(
        CarbonLog.user_id == current_user.id
    ).order_by(
        CarbonLog.created_at.desc()
    ).offset(offset).limit(limit).all()
    
    total = db.query(CarbonLog).filter(
        CarbonLog.user_id == current_user.id
    ).count()
    
    return {
        "success": True,
        "data": logs,
        "pagination": {
            "limit": limit,
            "offset": offset,
            "total": total,
        },
    }


@router.post("/logs")
async def create_carbon_log(
    log_data: CarbonLogCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    """
    Create a new carbon log entry with automatic calculation
    """
    # If no carbon amount provided, calculate it
    carbon_amount_kg = log_data.carbon_amount_kg
    
    if log_data.carbon_amount_kg == 0 and log_data.metadata:
        if log_data.category == "transport":
            amount = log_data.metadata.get("distance_km", 0)
            passengers = log_data.metadata.get("passengers", 1)
            carbon_amount_kg = calculator.calculate_transport(log_data.activity, amount, passengers)
        elif log_data.category == "diet":
            amount = log_data.metadata.get("quantity_kg", 0)
            carbon_amount_kg = calculator.calculate_diet(log_data.activity, amount)
        elif log_data.category == "energy":
            amount = log_data.metadata.get("amount", 0)
            unit = log_data.metadata.get("unit", "kwh")
            carbon_amount_kg = calculator.calculate_energy(log_data.activity, amount, unit)
        elif log_data.category == "shopping":
            amount = log_data.metadata.get("quantity", 1)
            carbon_amount_kg = calculator.calculate_shopping(log_data.activity, amount)
        elif log_data.category == "lifestyle":
            amount = log_data.metadata.get("amount", 0)
            unit = log_data.metadata.get("unit", "item")
            carbon_amount_kg = calculator.calculate_lifestyle(log_data.activity, amount, unit)
    
    log = CarbonLog(
        user_id=current_user.id,
        category=log_data.category,
        activity=log_data.activity,
        carbon_amount_kg=carbon_amount_kg,
        meta_data=log_data.metadata,
    )
    db.add(log)
    db.commit()
    db.refresh(log)
    
    # Award points and update stats
    points = gamification.award_points_for_log(carbon_amount_kg, log_data.category)
    stats = gamification.update_user_stats(current_user, points, db)
    
    # Generate suggestions for this log entry
    # Get user's recent logs for context
    cutoff_date = datetime.utcnow() - timedelta(days=30)
    recent_logs = db.query(CarbonLog).filter(
        CarbonLog.user_id == current_user.id,
        CarbonLog.created_at >= cutoff_date
    ).all()
    
    suggestions = suggestion_service.generate_suggestions(log, recent_logs, days=30)
    
    # Serialize the log object to dict for proper JSON response
    log_dict = {
        "id": str(log.id),
        "user_id": str(log.user_id),
        "category": log.category,
        "activity": log.activity,
        "carbon_amount_kg": float(log.carbon_amount_kg),
        "meta_data": log.meta_data,
        "created_at": log.created_at.isoformat() if log.created_at else None,
    }
    
    return {
        "success": True,
        "data": log_dict,
        "points_awarded": points,
        "user_stats": stats,
        "suggestions": suggestions,
    }


@router.get("/stats")
async def get_carbon_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    """
    Get carbon statistics
    """
    # Get all logs for user
    logs = db.query(CarbonLog).filter(
        CarbonLog.user_id == current_user.id
    ).all()
    
    if not logs:
        return {
            "success": True,
            "data": {
                "total_kg": 0,
                "daily_average_kg": 0,
                "monthly_kg": 0,
                "by_category": {},
            },
        }
    
    # Calculate totals
    total_kg = sum(log.carbon_amount_kg for log in logs)
    
    # Calculate by category
    by_category = {}
    for log in logs:
        by_category[log.category] = by_category.get(log.category, 0) + log.carbon_amount_kg
    
    # Calculate monthly total
    now = datetime.utcnow()
    month_start = datetime(now.year, now.month, 1)
    monthly_logs = [log for log in logs if log.created_at >= month_start]
    monthly_kg = sum(log.carbon_amount_kg for log in monthly_logs)
    
    # Calculate daily average (from last 30 days)
    thirty_days_ago = now - timedelta(days=30)
    recent_logs = [log for log in logs if log.created_at >= thirty_days_ago]
    daily_average_kg = sum(log.carbon_amount_kg for log in recent_logs) / 30 if recent_logs else 0
    
    # Get impact equivalents for monthly emissions
    monthly_equivalents = impact_service.get_equivalents(monthly_kg)
    
    return {
        "success": True,
        "data": {
            "total_kg": round(total_kg, 2),
            "daily_average_kg": round(daily_average_kg, 2),
            "monthly_kg": round(monthly_kg, 2),
            "by_category": {k: round(v, 2) for k, v in by_category.items()},
            "equivalents": monthly_equivalents,
        },
    }


@router.get("/suggestions")
async def get_suggestions(
    limit: int = 5,
    days: int = 30,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    """
    Get personalized carbon reduction suggestions based on user's recent carbon logs
    """
    suggestions_data = suggestion_service.get_user_suggestions(
        current_user, db, limit=limit, days=days
    )
    
    return {
        "success": True,
        "data": suggestions_data,
    }


@router.get("/suggestions/daily-tip")
async def get_daily_tip():
    """
    Get a daily green tip
    """
    tip = suggestion_service.get_daily_tip()
    
    return {
        "success": True,
        "data": {
            "tip": tip,
        },
    }


@router.get("/recommendations")
async def get_personalized_recommendations(
    days: int = 30,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    """
    Get personalized, actionable recommendations based on user's highest emission category
    Includes category-specific tips, quick wins, and savings calculator
    """
    recommendations = suggestion_service.get_personalized_recommendations(
        current_user, db, days=days
    )
    
    return {
        "success": True,
        "data": recommendations,
    }


@router.get("/reports/weekly")
async def get_weekly_report(
    week_start: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    """
    Get weekly carbon emission report
    """
    week_start_date = None
    if week_start:
        try:
            week_start_date = datetime.fromisoformat(week_start.replace('Z', '+00:00'))
        except:
            pass
    
    report = report_service.get_weekly_report(
        current_user, db, week_start=week_start_date
    )
    
    return {
        "success": True,
        "data": report,
    }


@router.get("/reports/monthly")
async def get_monthly_report(
    month: Optional[int] = None,
    year: Optional[int] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    """
    Get monthly carbon emission report
    """
    report = report_service.get_monthly_report(
        current_user, db, month=month, year=year
    )
    
    return {
        "success": True,
        "data": report,
    }


@router.get("/impact")
async def get_carbon_impact(
    days: int = 30,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    """
    Get real-world impact equivalents for user's carbon emissions
    Shows equivalents like driving distance, trees needed, etc.
    """
    impact = impact_service.get_user_impact(current_user, db, days=days)
    
    return {
        "success": True,
        "data": impact,
    }


@router.get("/impact/equivalents")
async def get_equivalents(
    carbon_kg: float,
):
    """
    Calculate real-world equivalents for a given carbon amount
    """
    equivalents = impact_service.get_equivalents(carbon_kg)
    
    return {
        "success": True,
        "data": {
            "carbon_kg": carbon_kg,
            "equivalents": equivalents,
        },
    }


@router.get("/impact/community")
async def get_community_impact(
    days: int = 30,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    """
    Get community-wide impact statistics
    """
    impact = impact_service.get_community_impact(db, days=days)
    
    return {
        "success": True,
        "data": impact,
    }

