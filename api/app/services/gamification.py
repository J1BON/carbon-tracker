"""
Gamification service for calculating points, eco scores, and levels
"""

from sqlalchemy.orm import Session
from app.models import User, CarbonLog
from datetime import datetime, timedelta


class GamificationService:
    """Service for gamification calculations"""

    @staticmethod
    def calculate_eco_score(user: User, db: Session) -> float:
        """
        Calculate eco score based on:
        - Lower carbon footprint = higher score
        - Consistent tracking behavior
        - Achievement milestones
        """
        # Base score starts at 50
        base_score = 50.0
        
        # Get user's carbon logs
        logs = db.query(CarbonLog).filter(CarbonLog.user_id == user.id).all()
        
        if not logs:
            return base_score
        
        # Calculate average daily carbon footprint
        total_carbon = sum(log.carbon_amount_kg for log in logs)
        days_active = len(set(log.created_at.date() for log in logs))
        daily_avg = total_carbon / max(days_active, 1)
        
        # Score calculation: Lower is better
        # Average person emits ~40kg CO2/day
        # Score decreases as carbon increases above baseline
        
        if daily_avg <= 10:
            base_score = 95.0  # Excellent
        elif daily_avg <= 20:
            base_score = 85.0  # Very good
        elif daily_avg <= 30:
            base_score = 75.0  # Good
        elif daily_avg <= 40:
            base_score = 65.0  # Average
        elif daily_avg <= 50:
            base_score = 50.0  # Below average
        else:
            base_score = 40.0  # Needs improvement
        
        # Bonus for consistent tracking
        recent_logs = [log for log in logs if log.created_at >= datetime.utcnow() - timedelta(days=7)]
        if len(recent_logs) >= 7:
            base_score += 5.0  # Bonus for tracking every day this week
        
        # Cap score at 100
        return min(base_score, 100.0)

    @staticmethod
    def award_points_for_log(carbon_amount_kg: float, category: str) -> int:
        """
        Award points based on carbon log entry
        More tracking = more points (encourages engagement)
        """
        # Base points for logging
        base_points = 10
        
        # Bonus points for larger logs (encourages completeness)
        if carbon_amount_kg > 5:
            base_points += 5
        elif carbon_amount_kg > 2:
            base_points += 2
        
        # Category bonuses (encourages tracking different types)
        category_bonuses = {
            "transport": 15,
            "diet": 12,
            "energy": 10,
            "shopping": 8,
            "lifestyle": 5,
            "other": 3,
        }
        bonus = category_bonuses.get(category, 5)
        
        return base_points + bonus

    @staticmethod
    def calculate_level(total_points: int) -> int:
        """Calculate user level based on total points"""
        # Level system: 100 points per level
        return max(1, (total_points // 100) + 1)

    @staticmethod
    def update_user_stats(user: User, points_to_add: int, db: Session) -> dict:
        """Update user's stats after adding a carbon log"""
        # Award points
        user.total_points += points_to_add
        
        # Calculate new level
        user.level = GamificationService.calculate_level(user.total_points)
        
        # Calculate new eco score
        user.eco_score = GamificationService.calculate_eco_score(user, db)
        
        db.commit()
        db.refresh(user)
        
        return {
            "total_points": user.total_points,
            "level": user.level,
            "eco_score": round(user.eco_score, 1),
        }





