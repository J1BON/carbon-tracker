"""
Report service for generating weekly and monthly carbon emission reports
"""

from typing import Dict, Any, List, Optional
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.models import CarbonLog, User


class ReportService:
    """Service for generating carbon emission reports"""
    
    @staticmethod
    def get_weekly_report(
        user: User,
        db: Session,
        week_start: Optional[datetime] = None
    ) -> Dict[str, Any]:
        """
        Generate weekly carbon emission report
        
        Args:
            user: The user to generate report for
            db: Database session
            week_start: Start of the week (defaults to current week)
            
        Returns:
            Dictionary with weekly report data
        """
        # Calculate week start (Monday)
        if week_start is None:
            today = datetime.utcnow()
            days_since_monday = today.weekday()
            week_start = (today - timedelta(days=days_since_monday)).replace(hour=0, minute=0, second=0, microsecond=0)
        
        week_end = week_start + timedelta(days=7)
        
        # Get logs for this week
        week_logs = db.query(CarbonLog).filter(
            CarbonLog.user_id == user.id,
            CarbonLog.created_at >= week_start,
            CarbonLog.created_at < week_end
        ).all()
        
        # Get logs for previous week for comparison
        prev_week_start = week_start - timedelta(days=7)
        prev_week_logs = db.query(CarbonLog).filter(
            CarbonLog.user_id == user.id,
            CarbonLog.created_at >= prev_week_start,
            CarbonLog.created_at < week_start
        ).all()
        
        # Calculate current week totals
        week_total = sum(log.carbon_amount_kg for log in week_logs)
        
        # Calculate previous week totals
        prev_week_total = sum(log.carbon_amount_kg for log in prev_week_logs)
        
        # Calculate percentage change
        if prev_week_total > 0:
            percent_change = ((week_total - prev_week_total) / prev_week_total) * 100
            is_better = week_total < prev_week_total
        else:
            percent_change = 0
            is_better = True
        
        # Calculate by category
        by_category = {}
        for log in week_logs:
            category = log.category
            by_category[category] = by_category.get(category, 0) + log.carbon_amount_kg
        
        # Find biggest source
        biggest_source = max(by_category.items(), key=lambda x: x[1]) if by_category else ("", 0)
        
        # Calculate biggest source percentage
        biggest_source_percentage = (biggest_source[1] / week_total * 100) if week_total > 0 else 0
        
        # Generate top tip based on biggest source
        top_tip = ReportService._generate_top_tip(biggest_source[0], biggest_source[1])
        
        # Calculate daily breakdown
        daily_breakdown = {}
        for log in week_logs:
            day = log.created_at.date()
            daily_breakdown[day.isoformat()] = daily_breakdown.get(day.isoformat(), 0) + log.carbon_amount_kg
        
        return {
            "week_start": week_start.isoformat(),
            "week_end": week_end.isoformat(),
            "total_kg": round(week_total, 2),
            "previous_week_kg": round(prev_week_total, 2),
            "percent_change": round(percent_change, 1),
            "is_better": is_better,
            "by_category": {k: round(v, 2) for k, v in by_category.items()},
            "biggest_source": {
                "category": biggest_source[0],
                "kg": round(biggest_source[1], 2),
                "percentage": round(biggest_source_percentage, 1)
            },
            "top_tip": top_tip,
            "daily_breakdown": {k: round(v, 2) for k, v in daily_breakdown.items()},
            "total_entries": len(week_logs),
        }
    
    @staticmethod
    def get_monthly_report(
        user: User,
        db: Session,
        month: Optional[int] = None,
        year: Optional[int] = None
    ) -> Dict[str, Any]:
        """
        Generate monthly carbon emission report
        
        Args:
            user: The user to generate report for
            db: Database session
            month: Month number (1-12), defaults to current month
            year: Year, defaults to current year
            
        Returns:
            Dictionary with monthly report data
        """
        # Calculate month start
        if month is None or year is None:
            today = datetime.utcnow()
            month = month or today.month
            year = year or today.year
        
        month_start = datetime(year, month, 1)
        if month == 12:
            month_end = datetime(year + 1, 1, 1)
        else:
            month_end = datetime(year, month + 1, 1)
        
        # Get logs for this month
        month_logs = db.query(CarbonLog).filter(
            CarbonLog.user_id == user.id,
            CarbonLog.created_at >= month_start,
            CarbonLog.created_at < month_end
        ).all()
        
        # Get logs for previous month for comparison
        if month == 1:
            prev_month_start = datetime(year - 1, 12, 1)
            prev_month_end = datetime(year, 1, 1)
        else:
            prev_month_start = datetime(year, month - 1, 1)
            prev_month_end = datetime(year, month, 1)
        
        prev_month_logs = db.query(CarbonLog).filter(
            CarbonLog.user_id == user.id,
            CarbonLog.created_at >= prev_month_start,
            CarbonLog.created_at < prev_month_end
        ).all()
        
        # Calculate current month totals
        month_total = sum(log.carbon_amount_kg for log in month_logs)
        
        # Calculate previous month totals
        prev_month_total = sum(log.carbon_amount_kg for log in prev_month_logs)
        
        # Calculate percentage change
        if prev_month_total > 0:
            percent_change = ((month_total - prev_month_total) / prev_month_total) * 100
            is_better = month_total < prev_month_total
        else:
            percent_change = 0
            is_better = True
        
        # Calculate by category
        by_category = {}
        for log in month_logs:
            category = log.category
            by_category[category] = by_category.get(category, 0) + log.carbon_amount_kg
        
        # Calculate trend (weekly breakdown)
        weekly_breakdown = {}
        for log in month_logs:
            week_num = (log.created_at.day - 1) // 7 + 1
            week_key = f"Week {week_num}"
            weekly_breakdown[week_key] = weekly_breakdown.get(week_key, 0) + log.carbon_amount_kg
        
        # Determine trend direction
        if len(weekly_breakdown) >= 2:
            weeks = sorted(weekly_breakdown.items())
            first_week = weeks[0][1]
            last_week = weeks[-1][1]
            trend_direction = "down" if last_week < first_week else "up" if last_week > first_week else "stable"
        else:
            trend_direction = "stable"
        
        # Calculate average per day
        days_in_month = (month_end - month_start).days
        average_per_day = month_total / days_in_month if days_in_month > 0 else 0
        
        return {
            "month": month,
            "year": year,
            "month_start": month_start.isoformat(),
            "month_end": month_end.isoformat(),
            "total_kg": round(month_total, 2),
            "previous_month_kg": round(prev_month_total, 2),
            "percent_change": round(percent_change, 1),
            "is_better": is_better,
            "by_category": {k: round(v, 2) for k, v in by_category.items()},
            "average_per_day": round(average_per_day, 2),
            "weekly_breakdown": {k: round(v, 2) for k, v in weekly_breakdown.items()},
            "trend_direction": trend_direction,
            "total_entries": len(month_logs),
        }
    
    @staticmethod
    def _generate_top_tip(category: str, amount: float) -> str:
        """Generate top tip based on category"""
        tips = {
            "transport": "Try walking for trips under 2 km - it's free and healthy!",
            "diet": "Switch 3 meals/week to vegetarian to reduce food emissions by up to 50%!",
            "energy": "Switch to LED bulbs - they use 75% less energy!",
            "shopping": "Buy second-hand items when possible - extend product life!",
            "lifestyle": "Take shorter showers - cutting 2 minutes saves water and energy!",
        }
        return tips.get(category, "Track your emissions regularly to identify reduction opportunities!")
    
    @staticmethod
    def get_trend_analysis(
        user: User,
        db: Session,
        days: int = 30
    ) -> Dict[str, Any]:
        """
        Get trend analysis for emissions over time
        
        Args:
            user: The user to analyze
            db: Database session
            days: Number of days to analyze
            
        Returns:
            Dictionary with trend analysis
        """
        cutoff_date = datetime.utcnow() - timedelta(days=days)
        logs = db.query(CarbonLog).filter(
            CarbonLog.user_id == user.id,
            CarbonLog.created_at >= cutoff_date
        ).order_by(CarbonLog.created_at).all()
        
        if not logs:
            return {
                "trend": "stable",
                "message": "Not enough data for trend analysis",
                "daily_average": 0,
            }
        
        # Group by date
        daily_emissions = {}
        for log in logs:
            date = log.created_at.date()
            daily_emissions[date] = daily_emissions.get(date, 0) + log.carbon_amount_kg
        
        # Calculate trend
        dates = sorted(daily_emissions.keys())
        if len(dates) >= 7:
            first_week_avg = sum(daily_emissions.get(d, 0) for d in dates[:7]) / 7
            last_week_avg = sum(daily_emissions.get(d, 0) for d in dates[-7:]) / 7
            
            if last_week_avg < first_week_avg * 0.9:  # 10% reduction
                trend = "down"
            elif last_week_avg > first_week_avg * 1.1:  # 10% increase
                trend = "up"
            else:
                trend = "stable"
        else:
            trend = "stable"
        
        # Calculate daily average
        total = sum(daily_emissions.values())
        daily_average = total / len(dates) if dates else 0
        
        return {
            "trend": trend,
            "daily_average": round(daily_average, 2),
            "total_days": len(dates),
            "total_kg": round(total, 2),
            "daily_breakdown": {d.isoformat(): round(v, 2) for d, v in sorted(daily_emissions.items())},
        }

