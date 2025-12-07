"""
Impact visualization service for showing real-world equivalents of carbon emissions
"""

from typing import Dict, Any, List
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.models import CarbonLog, User


class ImpactService:
    """Service for calculating real-world impact equivalents"""
    
    # Conversion factors
    CAR_EMISSION_FACTOR = 0.171  # kg CO2 per km for average car (EPA)
    TREE_ABSORPTION_PER_YEAR = 22.0  # kg CO2 per tree per year (mango tree average)
    BANGLADESHI_AVERAGE_DAILY = 4.5  # kg CO2 per day for average Bangladeshi person
    BANGLADESHI_AVERAGE_MONTHLY = 135.0  # kg CO2 per month (4.5 * 30)
    GLOBAL_AVERAGE_DAILY = 12.3  # kg CO2 per day for global average person
    
    # Bangladesh-specific conversion factors
    RICKSHAW_EMISSION_FACTOR = 0.015  # kg CO2 per km for cycle rickshaw (BRTA, Local Study)
    AUTO_RICKSHAW_EMISSION_FACTOR = 0.080  # kg CO2 per km for auto-rickshaw (BRTA 2022)
    RICE_EMISSION_FACTOR = 4.0  # kg CO2 per kg of rice (IRRI, EDP)
    FAN_HOUR_EMISSION = 0.033  # kg CO2 per hour for ceiling fan (BPDB 2023, Bangladesh grid)
    AC_HOUR_EMISSION = 0.78  # kg CO2 per hour for 1 ton AC (BPDB 2023, Bangladesh grid)
    
    @staticmethod
    def get_equivalents(carbon_kg: float) -> Dict[str, Any]:
        """
        Calculate real-world equivalents for carbon emissions
        Includes Bangladesh-specific equivalents
        
        Args:
            carbon_kg: Carbon emissions in kg
            
        Returns:
            Dictionary with various equivalents including Bangladesh-specific
        """
        # Standard equivalents
        car_km = carbon_kg / ImpactService.CAR_EMISSION_FACTOR
        trees_needed = carbon_kg / ImpactService.TREE_ABSORPTION_PER_YEAR
        bangladeshi_days = carbon_kg / ImpactService.BANGLADESHI_AVERAGE_DAILY
        household_days = carbon_kg / (20.0 / 30.0)  # ~0.67 kg per day
        
        # Bangladesh-specific equivalents
        rickshaw_rides_km = carbon_kg / ImpactService.RICKSHAW_EMISSION_FACTOR
        auto_rickshaw_km = carbon_kg / ImpactService.AUTO_RICKSHAW_EMISSION_FACTOR
        rice_kg = carbon_kg / ImpactService.RICE_EMISSION_FACTOR
        fan_hours = carbon_kg / ImpactService.FAN_HOUR_EMISSION
        ac_hours = carbon_kg / ImpactService.AC_HOUR_EMISSION
        
        # Global comparison
        global_days = carbon_kg / ImpactService.GLOBAL_AVERAGE_DAILY
        
        return {
            # Standard equivalents
            "car_km": round(car_km, 2),
            "trees_needed": round(trees_needed, 2),
            "bangladeshi_days": round(bangladeshi_days, 2),
            "household_days": round(household_days, 2),
            # Bangladesh-specific equivalents
            "rickshaw_rides_km": round(rickshaw_rides_km, 2),
            "auto_rickshaw_km": round(auto_rickshaw_km, 2),
            "rice_kg": round(rice_kg, 2),
            "fan_hours": round(fan_hours, 2),
            "ac_hours": round(ac_hours, 2),
            # Comparison data
            "global_days": round(global_days, 2),
            "bangladeshi_average_monthly": ImpactService.BANGLADESHI_AVERAGE_MONTHLY,
        }
    
    @staticmethod
    def get_impact_story(carbon_kg: float, reduction_kg: float = 0) -> Dict[str, Any]:
        """
        Generate impact story based on carbon emissions and reductions
        
        Args:
            carbon_kg: Total carbon emissions
            reduction_kg: Amount reduced (if any)
            
        Returns:
            Dictionary with impact story
        """
        if reduction_kg > 0:
            # Reduction story
            reduction_equivalents = ImpactService.get_equivalents(reduction_kg)
            
            stories = [
                f"By reducing {round(reduction_kg, 1)} kg this month, you saved the equivalent of planting {round(reduction_equivalents['trees_needed'], 1)} mango trees!",
                f"Your total reduction of {round(reduction_kg, 1)} kg CO₂ equals not driving for {round(reduction_equivalents['car_km'], 0)} km!",
                f"Great work! You've reduced {round(reduction_kg, 1)} kg CO₂ - that's like {round(reduction_equivalents['bangladeshi_days'], 1)} days of an average Bangladeshi person's emissions!",
            ]
            
            return {
                "type": "reduction",
                "carbon_kg": round(carbon_kg, 2),
                "reduction_kg": round(reduction_kg, 2),
                "story": stories[0],  # Use first story, can randomize
                "equivalents": reduction_equivalents,
            }
        else:
            # Current emissions story
            equivalents = ImpactService.get_equivalents(carbon_kg)
            
            stories = [
                f"Your {round(carbon_kg, 1)} kg CO₂ equals driving a car for {round(equivalents['car_km'], 0)} km",
                f"This equals {round(equivalents['trees_needed'], 1)} mango trees needed to offset your emissions",
                f"This is equivalent to {round(equivalents['bangladeshi_days'], 1)} days of an average Bangladeshi person's emissions",
            ]
            
            return {
                "type": "current",
                "carbon_kg": round(carbon_kg, 2),
                "story": stories[0],
                "equivalents": equivalents,
            }
    
    @staticmethod
    def get_user_impact(
        user: User,
        db: Session,
        days: int = 30
    ) -> Dict[str, Any]:
        """
        Get user's carbon impact with equivalents and comparisons
        
        Args:
            user: The user
            db: Database session
            days: Number of days to analyze
            
        Returns:
            Dictionary with user's impact, equivalents, and comparisons
        """
        from datetime import datetime, timedelta
        
        cutoff_date = datetime.utcnow() - timedelta(days=days)
        logs = db.query(CarbonLog).filter(
            CarbonLog.user_id == user.id,
            CarbonLog.created_at >= cutoff_date
        ).all()
        
        total_kg = sum(log.carbon_amount_kg for log in logs)
        
        equivalents = ImpactService.get_equivalents(total_kg)
        impact_story = ImpactService.get_impact_story(total_kg)
        
        # Calculate comparisons
        monthly_kg = total_kg * (30.0 / days) if days > 0 else 0
        bangladeshi_avg_monthly = ImpactService.BANGLADESHI_AVERAGE_MONTHLY
        global_avg_monthly = ImpactService.GLOBAL_AVERAGE_DAILY * 30
        
        comparison = {
            "your_monthly_kg": round(monthly_kg, 2),
            "bangladeshi_avg_monthly": bangladeshi_avg_monthly,
            "global_avg_monthly": round(global_avg_monthly, 2),
            "vs_bangladeshi_percent": round((monthly_kg / bangladeshi_avg_monthly * 100) if bangladeshi_avg_monthly > 0 else 0, 1),
            "vs_global_percent": round((monthly_kg / global_avg_monthly * 100) if global_avg_monthly > 0 else 0, 1),
            "is_below_bangladeshi_avg": monthly_kg < bangladeshi_avg_monthly,
            "is_below_global_avg": monthly_kg < global_avg_monthly,
        }
        
        return {
            "total_kg": round(total_kg, 2),
            "period_days": days,
            "equivalents": equivalents,
            "impact_story": impact_story,
            "comparison": comparison,
        }
    
    @staticmethod
    def get_community_impact(db: Session, days: int = 30) -> Dict[str, Any]:
        """
        Get community-wide impact statistics
        
        Args:
            db: Database session
            days: Number of days to analyze
            
        Returns:
            Dictionary with community impact
        """
        from datetime import datetime, timedelta
        
        cutoff_date = datetime.utcnow() - timedelta(days=days)
        
        # Get total emissions from all users
        total_emissions = db.query(func.sum(CarbonLog.carbon_amount_kg)).filter(
            CarbonLog.created_at >= cutoff_date
        ).scalar() or 0.0
        
        # Get total users
        total_users = db.query(func.count(func.distinct(CarbonLog.user_id))).filter(
            CarbonLog.created_at >= cutoff_date
        ).scalar() or 0
        
        # Calculate equivalents
        equivalents = ImpactService.get_equivalents(total_emissions)
        
        # Calculate average per user
        avg_per_user = total_emissions / total_users if total_users > 0 else 0
        
        return {
            "total_kg": round(total_emissions, 2),
            "total_users": total_users,
            "average_per_user": round(avg_per_user, 2),
            "period_days": days,
            "equivalents": equivalents,
            "message": f"Together, all users have emitted {round(total_emissions, 0)} kg CO₂ this month. That's equivalent to planting {round(equivalents['trees_needed'], 0)} trees!",
        }

