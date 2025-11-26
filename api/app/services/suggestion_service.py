"""
Suggestion service for carbon reduction recommendations
Rule-based system that analyzes user carbon data and provides personalized suggestions
"""

from typing import List, Dict, Any, Optional
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from app.models import CarbonLog, User


class SuggestionService:
    """Service for generating carbon reduction suggestions"""

    # Daily green tips pool
    DAILY_TIPS = [
        "🌱 Switch to LED bulbs - they use 75% less energy and last 25 times longer!",
        "🚲 Try cycling or walking for short trips under 5km - it's free and healthy!",
        "🥗 Have one plant-based meal a day - it can reduce your food carbon footprint by up to 50%!",
        "💡 Unplug electronics when not in use - they still consume energy in standby mode!",
        "🚗 Carpool or use public transport 2-3 times a week - share the ride, reduce emissions!",
        "🌡️ Lower your thermostat by 2°C in winter - save energy and money!",
        "♻️ Buy second-hand items when possible - extending product life reduces waste!",
        "🌳 Plant a tree or support tree planting initiatives - trees absorb CO2!",
        "💧 Take shorter showers - cutting 2 minutes can save water and energy!",
        "📦 Avoid single-use plastics - bring your own reusable bags and containers!",
        "⚡ Use appliances during off-peak hours - helps balance the energy grid!",
        "🌿 Grow your own herbs and vegetables - fresh, local, and zero transport emissions!",
        "🚆 Choose trains over planes for regional trips - much lower carbon footprint!",
        "🔌 Use power strips to easily turn off multiple devices at once!",
        "🍽️ Plan meals to reduce food waste - wasted food generates methane in landfills!",
    ]

    # Suggestion rules database
    SUGGESTION_RULES = {
        "transport": {
            "car": {
                "title": "Consider Alternative Transportation",
                "description": "You're using a car for travel. Here are ways to reduce your transport emissions:",
                "suggestions": [
                    {
                        "action": "Try carpooling",
                        "description": "Share rides with coworkers or friends - reduce emissions by 50% per person",
                        "impact": "high",
                        "icon": "🚗",
                        "points": 20
                    },
                    {
                        "action": "Use public transport",
                        "description": "Buses and trains emit much less CO2 per passenger than cars",
                        "impact": "high",
                        "icon": "🚌",
                        "points": 25
                    },
                    {
                        "action": "Cycle or walk for short trips",
                        "description": "For trips under 5km, cycling is zero-emission and healthy!",
                        "impact": "medium",
                        "icon": "🚲",
                        "points": 15
                    },
                    {
                        "action": "Consider an electric vehicle",
                        "description": "EVs produce 60-70% less emissions than gasoline cars",
                        "impact": "high",
                        "icon": "⚡",
                        "points": 30
                    },
                ]
            },
            "car_small": {
                "title": "Small Car Travel Tips",
                "description": "You're already using a smaller car - great! Here's how to optimize further:",
                "suggestions": [
                    {
                        "action": "Combine errands",
                        "description": "Plan trips to reduce total distance traveled",
                        "impact": "medium",
                        "icon": "📋",
                        "points": 10
                    },
                    {
                        "action": "Maintain proper tire pressure",
                        "description": "Under-inflated tires increase fuel consumption by 3-5%",
                        "impact": "low",
                        "icon": "🔧",
                        "points": 5
                    },
                    {
                        "action": "Use public transport when possible",
                        "description": "Even small cars can be replaced for some trips",
                        "impact": "medium",
                        "icon": "🚌",
                        "points": 15
                    },
                ]
            },
            "car_large": {
                "title": "Large Vehicle Optimization",
                "description": "Large vehicles have higher emissions. Consider these alternatives:",
                "suggestions": [
                    {
                        "action": "Switch to smaller car when possible",
                        "description": "Small cars emit 40-50% less CO2 than large SUVs",
                        "impact": "high",
                        "icon": "🚗",
                        "points": 25
                    },
                    {
                        "action": "Carpool regularly",
                        "description": "Fill your vehicle to maximize efficiency",
                        "impact": "high",
                        "icon": "👥",
                        "points": 20
                    },
                    {
                        "action": "Consider hybrid or electric",
                        "description": "Modern hybrids can reduce emissions by 30-50%",
                        "impact": "high",
                        "icon": "🔋",
                        "points": 30
                    },
                ]
            },
            "plane": {
                "title": "Reduce Flight Emissions",
                "description": "Flying has high carbon impact. Consider these alternatives:",
                "suggestions": [
                    {
                        "action": "Choose trains for regional trips",
                        "description": "Trains emit 80-90% less CO2 than planes for distances under 500km",
                        "impact": "high",
                        "icon": "🚆",
                        "points": 30
                    },
                    {
                        "action": "Use video conferencing",
                        "description": "Many business trips can be replaced with virtual meetings",
                        "impact": "medium",
                        "icon": "💻",
                        "points": 15
                    },
                    {
                        "action": "Offset flight emissions",
                        "description": "Support carbon offset programs when flying is necessary",
                        "impact": "low",
                        "icon": "🌳",
                        "points": 10
                    },
                ]
            },
        },
        "diet": {
            "beef": {
                "title": "Reduce Meat Consumption",
                "description": "Beef has one of the highest carbon footprints. Try these alternatives:",
                "suggestions": [
                    {
                        "action": "Try plant-based proteins",
                        "description": "Beans, lentils, and tofu have 90% lower emissions than beef",
                        "impact": "high",
                        "icon": "🥗",
                        "points": 25
                    },
                    {
                        "action": "Have meat-free days",
                        "description": "Try 2-3 plant-based meals per week - it makes a big difference!",
                        "impact": "high",
                        "icon": "🌱",
                        "points": 20
                    },
                    {
                        "action": "Choose chicken or fish instead",
                        "description": "Chicken produces 6x less CO2 than beef per kilogram",
                        "impact": "medium",
                        "icon": "🐟",
                        "points": 15
                    },
                ]
            },
            "lamb": {
                "title": "Lamb Consumption Tips",
                "description": "Lamb has high emissions. Consider these alternatives:",
                "suggestions": [
                    {
                        "action": "Switch to plant-based proteins",
                        "description": "Legumes and nuts have much lower carbon footprints",
                        "impact": "high",
                        "icon": "🥜",
                        "points": 25
                    },
                    {
                        "action": "Reduce portion sizes",
                        "description": "Smaller portions mean less emissions",
                        "impact": "medium",
                        "icon": "🍽️",
                        "points": 10
                    },
                ]
            },
            "chicken": {
                "title": "Optimize Your Diet",
                "description": "Chicken is better than red meat, but you can do more:",
                "suggestions": [
                    {
                        "action": "Add more plant-based meals",
                        "description": "Try Meatless Mondays - it's an easy way to reduce emissions",
                        "impact": "medium",
                        "icon": "🌱",
                        "points": 15
                    },
                    {
                        "action": "Buy local and seasonal",
                        "description": "Reduces transport emissions from food",
                        "impact": "low",
                        "icon": "🏪",
                        "points": 5
                    },
                ]
            },
            "fish": {
                "title": "Sustainable Seafood Choices",
                "description": "Fish is a good protein choice. Here's how to optimize:",
                "suggestions": [
                    {
                        "action": "Choose sustainably caught fish",
                        "description": "Look for MSC-certified seafood",
                        "impact": "low",
                        "icon": "🐟",
                        "points": 5
                    },
                    {
                        "action": "Add more plant proteins",
                        "description": "Mix fish with legumes and vegetables",
                        "impact": "medium",
                        "icon": "🥗",
                        "points": 10
                    },
                ]
            },
        },
        "energy": {
            "electricity_grid": {
                "title": "Reduce Electricity Usage",
                "description": "High electricity consumption increases your carbon footprint. Here's how to reduce it:",
                "suggestions": [
                    {
                        "action": "Switch to LED bulbs",
                        "description": "LEDs use 75% less energy and last 25x longer than incandescent bulbs",
                        "impact": "high",
                        "icon": "💡",
                        "points": 20
                    },
                    {
                        "action": "Turn off devices when not in use",
                        "description": "Unplug electronics or use power strips - standby mode still uses energy",
                        "impact": "medium",
                        "icon": "🔌",
                        "points": 15
                    },
                    {
                        "action": "Use energy-efficient appliances",
                        "description": "Look for Energy Star rated appliances - they use 10-50% less energy",
                        "impact": "high",
                        "icon": "⭐",
                        "points": 25
                    },
                    {
                        "action": "Install a smart thermostat",
                        "description": "Programmable thermostats can reduce heating/cooling by 10-15%",
                        "impact": "medium",
                        "icon": "🌡️",
                        "points": 20
                    },
                    {
                        "action": "Use natural light during day",
                        "description": "Open curtains and reduce artificial lighting when possible",
                        "impact": "low",
                        "icon": "☀️",
                        "points": 10
                    },
                ]
            },
            "natural_gas": {
                "title": "Reduce Natural Gas Usage",
                "description": "Natural gas contributes to your carbon footprint. Consider these tips:",
                "suggestions": [
                    {
                        "action": "Lower thermostat by 2°C",
                        "description": "You'll save 5-10% on heating costs and emissions",
                        "impact": "medium",
                        "icon": "🌡️",
                        "points": 15
                    },
                    {
                        "action": "Improve home insulation",
                        "description": "Better insulation reduces heating needs significantly",
                        "impact": "high",
                        "icon": "🏠",
                        "points": 25
                    },
                    {
                        "action": "Use a programmable thermostat",
                        "description": "Reduce heating when you're away or sleeping",
                        "impact": "medium",
                        "icon": "⏰",
                        "points": 15
                    },
                ]
            },
        },
        "shopping": {
            "clothing": {
                "title": "Sustainable Shopping Habits",
                "description": "Clothing production has high emissions. Make sustainable choices:",
                "suggestions": [
                    {
                        "action": "Buy second-hand",
                        "description": "Thrift shopping extends product life and reduces waste",
                        "impact": "high",
                        "icon": "♻️",
                        "points": 20
                    },
                    {
                        "action": "Choose quality over quantity",
                        "description": "Buy fewer, better-made items that last longer",
                        "impact": "medium",
                        "icon": "✨",
                        "points": 15
                    },
                    {
                        "action": "Support sustainable brands",
                        "description": "Look for brands using recycled materials and ethical practices",
                        "impact": "medium",
                        "icon": "🌿",
                        "points": 15
                    },
                ]
            },
            "electronics": {
                "title": "Reduce Electronic Waste",
                "description": "Electronics have high carbon footprints. Be mindful:",
                "suggestions": [
                    {
                        "action": "Extend device lifespan",
                        "description": "Keep your devices longer - repairs are often cheaper than replacement",
                        "impact": "high",
                        "icon": "🔧",
                        "points": 25
                    },
                    {
                        "action": "Buy refurbished",
                        "description": "Refurbished electronics are cheaper and reduce waste",
                        "impact": "high",
                        "icon": "♻️",
                        "points": 20
                    },
                    {
                        "action": "Recycle old devices properly",
                        "description": "E-waste recycling prevents toxic materials from landfills",
                        "impact": "medium",
                        "icon": "📱",
                        "points": 15
                    },
                ]
            },
        },
        "lifestyle": {
            "streaming_hour": {
                "title": "Reduce Digital Carbon Footprint",
                "description": "Streaming uses energy. Here are some tips:",
                "suggestions": [
                    {
                        "action": "Lower video quality when possible",
                        "description": "HD uses less data than 4K - you often won't notice the difference",
                        "impact": "low",
                        "icon": "📺",
                        "points": 5
                    },
                    {
                        "action": "Download instead of streaming",
                        "description": "Downloaded content uses less energy than repeated streaming",
                        "impact": "low",
                        "icon": "⬇️",
                        "points": 5
                    },
                ]
            },
            "shower_10min": {
                "title": "Reduce Water and Energy Usage",
                "description": "Hot showers use both water and energy. Try these tips:",
                "suggestions": [
                    {
                        "action": "Take shorter showers",
                        "description": "Cut 2 minutes off your shower - save water and energy",
                        "impact": "medium",
                        "icon": "⏱️",
                        "points": 15
                    },
                    {
                        "action": "Install a low-flow showerhead",
                        "description": "Reduces water usage by 40-60% without losing pressure",
                        "impact": "medium",
                        "icon": "🚿",
                        "points": 20
                    },
                    {
                        "action": "Use cooler water",
                        "description": "Slightly cooler showers use less energy to heat",
                        "impact": "low",
                        "icon": "🌡️",
                        "points": 10
                    },
                ]
            },
        },
    }

    @staticmethod
    def get_daily_tip() -> str:
        """Get a random daily green tip"""
        import random
        return random.choice(SuggestionService.DAILY_TIPS)

    @staticmethod
    def generate_suggestions(
        carbon_log: CarbonLog,
        user_logs: Optional[List[CarbonLog]] = None,
        days: int = 30
    ) -> Dict[str, Any]:
        """
        Generate personalized suggestions based on a carbon log entry
        
        Args:
            carbon_log: The carbon log entry to analyze
            user_logs: Optional list of user's recent logs for context
            days: Number of days to look back for context
            
        Returns:
            Dictionary with suggestions, category analysis, and encouragement
        """
        category = carbon_log.category
        activity = carbon_log.activity
        carbon_amount = carbon_log.carbon_amount_kg
        
        # Get category-specific suggestions
        category_rules = SuggestionService.SUGGESTION_RULES.get(category, {})
        activity_rules = category_rules.get(activity, None)
        
        # If no specific activity rules, generate generic category suggestions
        if not activity_rules:
            activity_rules = SuggestionService._generate_generic_suggestions(category, carbon_amount)
        
        # Calculate category emissions if user_logs provided
        category_analysis = None
        if user_logs:
            category_analysis = SuggestionService._analyze_category_emissions(user_logs, category)
        
        # Generate encouragement message
        encouragement = SuggestionService._generate_encouragement(carbon_amount, category)
        
        return {
            "title": activity_rules.get("title", "Reduce Your Carbon Footprint"),
            "description": activity_rules.get("description", "Here are some ways to reduce your emissions:"),
            "suggestions": activity_rules.get("suggestions", []),
            "category_analysis": category_analysis,
            "encouragement": encouragement,
            "daily_tip": SuggestionService.get_daily_tip(),
        }

    @staticmethod
    def _generate_generic_suggestions(category: str, carbon_amount: float) -> Dict[str, Any]:
        """Generate generic suggestions when no specific rules exist"""
        generic_suggestions = {
            "transport": {
                "title": "Reduce Transportation Emissions",
                "description": "Here are general tips to reduce your transport carbon footprint:",
                "suggestions": [
                    {
                        "action": "Use public transport",
                        "description": "Buses and trains are more efficient per passenger",
                        "impact": "high",
                        "icon": "🚌",
                        "points": 20
                    },
                    {
                        "action": "Carpool when possible",
                        "description": "Sharing rides reduces emissions per person",
                        "impact": "medium",
                        "icon": "👥",
                        "points": 15
                    },
                    {
                        "action": "Walk or cycle for short trips",
                        "description": "Zero emissions and great for your health",
                        "impact": "medium",
                        "icon": "🚲",
                        "points": 15
                    },
                ]
            },
            "diet": {
                "title": "Sustainable Food Choices",
                "description": "Food production has significant emissions. Here's how to reduce:",
                "suggestions": [
                    {
                        "action": "Eat more plant-based meals",
                        "description": "Try 2-3 plant-based days per week",
                        "impact": "high",
                        "icon": "🌱",
                        "points": 20
                    },
                    {
                        "action": "Buy local and seasonal",
                        "description": "Reduces transport emissions from food",
                        "impact": "medium",
                        "icon": "🏪",
                        "points": 15
                    },
                    {
                        "action": "Reduce food waste",
                        "description": "Plan meals and use leftovers creatively",
                        "impact": "medium",
                        "icon": "🍽️",
                        "points": 15
                    },
                ]
            },
            "energy": {
                "title": "Reduce Energy Consumption",
                "description": "Here are ways to lower your energy usage:",
                "suggestions": [
                    {
                        "action": "Switch to LED bulbs",
                        "description": "LEDs use 75% less energy",
                        "impact": "high",
                        "icon": "💡",
                        "points": 20
                    },
                    {
                        "action": "Unplug unused electronics",
                        "description": "Standby mode still consumes energy",
                        "impact": "medium",
                        "icon": "🔌",
                        "points": 15
                    },
                    {
                        "action": "Use energy-efficient appliances",
                        "description": "Look for Energy Star ratings",
                        "impact": "high",
                        "icon": "⭐",
                        "points": 25
                    },
                ]
            },
            "shopping": {
                "title": "Sustainable Shopping",
                "description": "Make eco-friendly shopping choices:",
                "suggestions": [
                    {
                        "action": "Buy second-hand",
                        "description": "Extend product life and reduce waste",
                        "impact": "high",
                        "icon": "♻️",
                        "points": 20
                    },
                    {
                        "action": "Choose quality over quantity",
                        "description": "Fewer, longer-lasting items",
                        "impact": "medium",
                        "icon": "✨",
                        "points": 15
                    },
                ]
            },
            "lifestyle": {
                "title": "Eco-Friendly Lifestyle",
                "description": "Small lifestyle changes can make a big difference:",
                "suggestions": [
                    {
                        "action": "Reduce water usage",
                        "description": "Shorter showers and fix leaks",
                        "impact": "medium",
                        "icon": "💧",
                        "points": 15
                    },
                    {
                        "action": "Recycle and compost",
                        "description": "Proper waste management reduces emissions",
                        "impact": "medium",
                        "icon": "♻️",
                        "points": 15
                    },
                ]
            },
        }
        
        return generic_suggestions.get(category, {
            "title": "Reduce Your Carbon Footprint",
            "description": "Here are some general tips:",
            "suggestions": [
                {
                    "action": "Track your emissions regularly",
                    "description": "Awareness is the first step to reduction",
                    "impact": "low",
                    "icon": "📊",
                    "points": 10
                },
            ]
        })

    @staticmethod
    def _analyze_category_emissions(user_logs: List[CarbonLog], category: str) -> Dict[str, Any]:
        """Analyze emissions by category from user's recent logs"""
        category_logs = [log for log in user_logs if log.category == category]
        
        if not category_logs:
            return None
        
        total_emissions = sum(log.carbon_amount_kg for log in category_logs)
        average_per_entry = total_emissions / len(category_logs)
        
        # Calculate percentage of total emissions
        total_emissions_all = sum(log.carbon_amount_kg for log in user_logs)
        percentage = (total_emissions / total_emissions_all * 100) if total_emissions_all > 0 else 0
        
        return {
            "category": category,
            "total_kg": round(total_emissions, 2),
            "average_per_entry": round(average_per_entry, 2),
            "entry_count": len(category_logs),
            "percentage_of_total": round(percentage, 1),
        }

    @staticmethod
    def _generate_encouragement(carbon_amount: float, category: str) -> str:
        """Generate encouraging message based on carbon amount"""
        if carbon_amount < 1:
            return "🌱 Great job! Your emissions are low. Keep up the eco-friendly habits!"
        elif carbon_amount < 5:
            return "👍 You're making progress! Small changes add up to big impact."
        elif carbon_amount < 10:
            return "💪 Every step counts! Consider trying some of the suggestions above."
        else:
            return "🌟 Tracking your emissions is the first step! Use these suggestions to reduce your footprint."

    @staticmethod
    def get_user_suggestions(
        user: User,
        db: Session,
        limit: int = 5,
        days: int = 30
    ) -> Dict[str, Any]:
        """
        Get comprehensive suggestions based on user's recent carbon logs
        
        Args:
            user: The user to generate suggestions for
            db: Database session
            limit: Maximum number of suggestions to return
            days: Number of days to look back
            
        Returns:
            Dictionary with suggestions organized by category
        """
        # Get user's recent logs
        cutoff_date = datetime.utcnow() - timedelta(days=days)
        recent_logs = db.query(CarbonLog).filter(
            CarbonLog.user_id == user.id,
            CarbonLog.created_at >= cutoff_date
        ).order_by(CarbonLog.created_at.desc()).all()
        
        if not recent_logs:
            return {
                "suggestions": [],
                "daily_tip": SuggestionService.get_daily_tip(),
                "message": "Start tracking your carbon footprint to get personalized suggestions!",
            }
        
        # Group by category and get top suggestions
        category_emissions = {}
        for log in recent_logs:
            category = log.category
            if category not in category_emissions:
                category_emissions[category] = []
            category_emissions[category].append(log)
        
        # Generate suggestions for each category
        all_suggestions = []
        for category, logs in category_emissions.items():
            # Use the most recent log from this category
            latest_log = max(logs, key=lambda x: x.created_at)
            suggestion_data = SuggestionService.generate_suggestions(
                latest_log,
                recent_logs,
                days
            )
            all_suggestions.append(suggestion_data)
        
        # Sort by total emissions (highest first)
        all_suggestions.sort(
            key=lambda x: x.get("category_analysis", {}).get("total_kg", 0) if x.get("category_analysis") else 0,
            reverse=True
        )
        
        return {
            "suggestions": all_suggestions[:limit],
            "daily_tip": SuggestionService.get_daily_tip(),
            "total_logs": len(recent_logs),
            "days_analyzed": days,
        }

