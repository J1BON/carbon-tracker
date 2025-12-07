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

    # Daily green tips pool (includes Bangladesh-specific tips)
    DAILY_TIPS = [
        # General tips
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
        # Bangladesh-specific tips
        "🇧🇩 Use ceiling fan instead of AC when possible - saves 95% energy!",
        "🇧🇩 Buy local fish from your local market - lower carbon footprint than imported meat!",
        "🇧🇩 Use cycle rickshaw for short distances - almost zero emissions!",
        "🇧🇩 Use bucket bath instead of shower - saves water and energy!",
        "🇧🇩 Buy seasonal vegetables from local markets - fresher and lower emissions!",
        "🇧🇩 Use CNG instead of private car for city travel - cleaner fuel!",
        "🇧🇩 Cook with LPG efficiently - use pressure cooker to save gas!",
        "🇧🇩 Use hand fan during mild weather - zero electricity!",
        "🇧🇩 Buy local fruits like mango, jackfruit, guava - support local farmers!",
        "🇧🇩 Use jute bags instead of plastic - biodegradable and eco-friendly!",
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
            "plane_international": {
                "title": "Reduce International Flight Emissions",
                "description": "International flights have high carbon impact. Consider these alternatives:",
                "suggestions": [
                    {
                        "action": "Use video conferencing when possible",
                        "description": "Many business trips can be replaced with virtual meetings",
                        "impact": "high",
                        "icon": "💻",
                        "points": 20
                    },
                    {
                        "action": "Offset flight emissions",
                        "description": "Support carbon offset programs when flying is necessary",
                        "impact": "medium",
                        "icon": "🌳",
                        "points": 15
                    },
                    {
                        "action": "Choose direct flights",
                        "description": "Direct flights are more efficient than connecting flights",
                        "impact": "low",
                        "icon": "✈️",
                        "points": 5
                    },
                ]
            },
            "motorcycle": {
                "title": "Motorcycle Travel Tips",
                "description": "Motorcycles are relatively efficient. Here's how to optimize:",
                "suggestions": [
                    {
                        "action": "Consider electric scooter",
                        "description": "Electric scooters have zero direct emissions",
                        "impact": "high",
                        "icon": "⚡",
                        "points": 25
                    },
                    {
                        "action": "Maintain proper tire pressure",
                        "description": "Improves fuel efficiency by 3-5%",
                        "impact": "low",
                        "icon": "🔧",
                        "points": 5
                    },
                    {
                        "action": "Use for longer trips",
                        "description": "Motorcycles are efficient for city travel",
                        "impact": "low",
                        "icon": "📋",
                        "points": 5
                    },
                ]
            },
            "auto_rickshaw": {
                "title": "Auto-Rickshaw Travel Tips",
                "description": "Auto-rickshaws are relatively efficient. Consider these alternatives:",
                "suggestions": [
                    {
                        "action": "Use cycle rickshaw for short trips",
                        "description": "Cycle rickshaws have 80% lower emissions (0.015 vs 0.080 kg/km)",
                        "impact": "high",
                        "icon": "🚲",
                        "points": 20
                    },
                    {
                        "action": "Walk for trips under 1 km",
                        "description": "Zero emissions and healthy exercise",
                        "impact": "medium",
                        "icon": "🚶",
                        "points": 15
                    },
                ]
            },
            "cng": {
                "title": "CNG Vehicle Optimization",
                "description": "CNG is already a cleaner fuel choice! Here's how to optimize:",
                "suggestions": [
                    {
                        "action": "Maintain regular servicing",
                        "description": "Well-maintained vehicles are more efficient",
                        "impact": "low",
                        "icon": "🔧",
                        "points": 5
                    },
                    {
                        "action": "Use cycle rickshaw for very short trips",
                        "description": "For trips under 2km, cycle rickshaw is even cleaner",
                        "impact": "medium",
                        "icon": "🚲",
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
                        "action": "Choose local fish",
                        "description": "Local fish from Bangladesh markets has lower carbon footprint",
                        "impact": "medium",
                        "icon": "🐟",
                        "points": 10
                    },
                    {
                        "action": "Add more plant proteins",
                        "description": "Mix fish with dal and vegetables",
                        "impact": "medium",
                        "icon": "🥗",
                        "points": 10
                    },
                ]
            },
            "pork": {
                "title": "Pork Consumption Tips",
                "description": "Pork has moderate emissions. Consider these alternatives:",
                "suggestions": [
                    {
                        "action": "Try plant-based proteins",
                        "description": "Beans, lentils, and tofu have 90% lower emissions",
                        "impact": "high",
                        "icon": "🥗",
                        "points": 25
                    },
                    {
                        "action": "Choose chicken or fish instead",
                        "description": "Chicken and fish produce less CO2 than pork",
                        "impact": "medium",
                        "icon": "🐟",
                        "points": 15
                    },
                ]
            },
            "mutton": {
                "title": "Mutton Consumption Tips",
                "description": "Mutton has high emissions. Consider these alternatives:",
                "suggestions": [
                    {
                        "action": "Try plant-based proteins",
                        "description": "Beans, lentils, and tofu have 90% lower emissions",
                        "impact": "high",
                        "icon": "🥗",
                        "points": 25
                    },
                    {
                        "action": "Choose chicken or fish instead",
                        "description": "Chicken produces 4x less CO2 than mutton",
                        "impact": "high",
                        "icon": "🐟",
                        "points": 20
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
            "jeans": {
                "title": "Sustainable Jeans Shopping",
                "description": "Jeans have high production emissions. Make sustainable choices:",
                "suggestions": [
                    {
                        "action": "Buy second-hand jeans",
                        "description": "Thrift shopping extends product life and reduces waste",
                        "impact": "high",
                        "icon": "♻️",
                        "points": 25
                    },
                    {
                        "action": "Choose quality over quantity",
                        "description": "Buy fewer, better-made jeans that last longer",
                        "impact": "medium",
                        "icon": "✨",
                        "points": 15
                    },
                    {
                        "action": "Repair instead of replace",
                        "description": "Fix holes and tears to extend jeans' lifespan",
                        "impact": "medium",
                        "icon": "🔧",
                        "points": 15
                    },
                ]
            },
            "shoes": {
                "title": "Sustainable Footwear",
                "description": "Shoes have production emissions. Make sustainable choices:",
                "suggestions": [
                    {
                        "action": "Buy second-hand shoes",
                        "description": "Thrift shopping extends product life and reduces waste",
                        "impact": "high",
                        "icon": "♻️",
                        "points": 20
                    },
                    {
                        "action": "Choose quality over quantity",
                        "description": "Buy durable shoes that last longer",
                        "impact": "medium",
                        "icon": "✨",
                        "points": 15
                    },
                    {
                        "action": "Repair shoes when possible",
                        "description": "Resole and repair to extend lifespan",
                        "impact": "medium",
                        "icon": "🔧",
                        "points": 15
                    },
                ]
            },
            "soap": {
                "title": "Eco-Friendly Soap Choices",
                "description": "Soap is a daily necessity. Here's how to make it more sustainable:",
                "suggestions": [
                    {
                        "action": "Buy in bulk or larger sizes",
                        "description": "Reduces packaging waste and transport emissions per use",
                        "impact": "medium",
                        "icon": "📦",
                        "points": 10
                    },
                    {
                        "action": "Choose bar soap over liquid",
                        "description": "Bar soap typically has less packaging and lower emissions",
                        "impact": "medium",
                        "icon": "🧼",
                        "points": 15
                    },
                    {
                        "action": "Look for eco-friendly brands",
                        "description": "Choose brands with minimal packaging and natural ingredients",
                        "impact": "low",
                        "icon": "🌿",
                        "points": 5
                    },
                ]
            },
            "shampoo": {
                "title": "Sustainable Shampoo Choices",
                "description": "Shampoo is a daily necessity. Here's how to make it more sustainable:",
                "suggestions": [
                    {
                        "action": "Buy in bulk or larger sizes",
                        "description": "Reduces packaging waste and transport emissions per use",
                        "impact": "medium",
                        "icon": "📦",
                        "points": 10
                    },
                    {
                        "action": "Choose refillable options",
                        "description": "Refillable shampoo bottles reduce plastic waste",
                        "impact": "medium",
                        "icon": "♻️",
                        "points": 15
                    },
                    {
                        "action": "Look for eco-friendly brands",
                        "description": "Choose brands with minimal packaging and natural ingredients",
                        "impact": "low",
                        "icon": "🌿",
                        "points": 5
                    },
                ]
            },
            "toothpaste": {
                "title": "Sustainable Toothpaste Choices",
                "description": "Toothpaste is a daily necessity. Here's how to make it more sustainable:",
                "suggestions": [
                    {
                        "action": "Buy in bulk or larger sizes",
                        "description": "Reduces packaging waste and transport emissions per use",
                        "impact": "medium",
                        "icon": "📦",
                        "points": 10
                    },
                    {
                        "action": "Use the right amount",
                        "description": "A pea-sized amount is enough - reduces waste",
                        "impact": "low",
                        "icon": "💧",
                        "points": 5
                    },
                    {
                        "action": "Look for eco-friendly packaging",
                        "description": "Choose brands with recyclable or minimal packaging",
                        "impact": "low",
                        "icon": "🌿",
                        "points": 5
                    },
                ]
            },
            "detergent": {
                "title": "Sustainable Detergent Choices",
                "description": "Detergent is a household necessity. Here's how to make it more sustainable:",
                "suggestions": [
                    {
                        "action": "Buy in bulk or larger sizes",
                        "description": "Reduces packaging waste and transport emissions per use",
                        "impact": "medium",
                        "icon": "📦",
                        "points": 10
                    },
                    {
                        "action": "Use concentrated formulas",
                        "description": "Concentrated detergents use less packaging and transport",
                        "impact": "medium",
                        "icon": "🧴",
                        "points": 15
                    },
                    {
                        "action": "Choose eco-friendly brands",
                        "description": "Look for biodegradable and phosphate-free options",
                        "impact": "low",
                        "icon": "🌿",
                        "points": 5
                    },
                ]
            },
            "toiletries": {
                "title": "Sustainable Toiletries",
                "description": "Toiletries are daily necessities. Here's how to make them more sustainable:",
                "suggestions": [
                    {
                        "action": "Buy in bulk when possible",
                        "description": "Reduces packaging waste and transport emissions",
                        "impact": "medium",
                        "icon": "📦",
                        "points": 10
                    },
                    {
                        "action": "Choose products with minimal packaging",
                        "description": "Reduces waste and emissions from packaging production",
                        "impact": "medium",
                        "icon": "📦",
                        "points": 15
                    },
                    {
                        "action": "Look for eco-friendly brands",
                        "description": "Choose brands with sustainable practices",
                        "impact": "low",
                        "icon": "🌿",
                        "points": 5
                    },
                ]
            },
            "books": {
                "title": "Sustainable Book Choices",
                "description": "Books have production emissions. Make sustainable choices:",
                "suggestions": [
                    {
                        "action": "Buy second-hand books",
                        "description": "Thrift stores and used book shops extend product life",
                        "impact": "high",
                        "icon": "♻️",
                        "points": 20
                    },
                    {
                        "action": "Use libraries",
                        "description": "Borrowing books reduces individual consumption",
                        "impact": "high",
                        "icon": "📚",
                        "points": 25
                    },
                    {
                        "action": "Consider e-books",
                        "description": "Digital books have lower production emissions",
                        "impact": "medium",
                        "icon": "📱",
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
            "plastic_bags": {
                "title": "Reduce Plastic Bag Usage",
                "description": "Plastic bags have environmental impact. Make sustainable choices:",
                "suggestions": [
                    {
                        "action": "Use reusable bags",
                        "description": "Bring your own cloth or jute bags when shopping",
                        "impact": "high",
                        "icon": "🛍️",
                        "points": 20
                    },
                    {
                        "action": "Choose jute or paper bags",
                        "description": "Biodegradable alternatives to plastic",
                        "impact": "medium",
                        "icon": "📦",
                        "points": 15
                    },
                    {
                        "action": "Reuse plastic bags if you have them",
                        "description": "Extend the life of existing plastic bags",
                        "impact": "low",
                        "icon": "♻️",
                        "points": 5
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
                        "action": "Switch to bucket bath",
                        "description": "Bucket bath uses 60-70% less water and energy",
                        "impact": "high",
                        "icon": "🪣",
                        "points": 25
                    },
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
                ]
            },
            "ac_hour": {
                "title": "AC Usage Optimization",
                "description": "AC has high energy consumption. Here's how to reduce:",
                "suggestions": [
                    {
                        "action": "Use fan instead when possible",
                        "description": "Fans use 95% less energy than AC",
                        "impact": "high",
                        "icon": "🌀",
                        "points": 30
                    },
                    {
                        "action": "Set AC to 26°C or higher",
                        "description": "Each degree higher saves 5-7% energy",
                        "impact": "medium",
                        "icon": "🌡️",
                        "points": 15
                    },
                    {
                        "action": "Use AC only in occupied rooms",
                        "description": "Turn off AC when leaving the room",
                        "impact": "medium",
                        "icon": "🚪",
                        "points": 15
                    },
                ]
            },
            "fan_hour": {
                "title": "Fan Usage Optimization",
                "description": "Fans are energy-efficient. Here's how to optimize:",
                "suggestions": [
                    {
                        "action": "Use energy-efficient fan",
                        "description": "Energy-efficient fans use 40% less electricity",
                        "impact": "medium",
                        "icon": "🌀",
                        "points": 15
                    },
                    {
                        "action": "Use natural ventilation when possible",
                        "description": "Open windows for cross-ventilation",
                        "impact": "low",
                        "icon": "🌬️",
                        "points": 5
                    },
                ]
            },
            "cooking_gas": {
                "title": "Cooking Energy Optimization",
                "description": "Cooking with gas uses energy. Here's how to optimize:",
                "suggestions": [
                    {
                        "action": "Use pressure cooker",
                        "description": "Pressure cookers reduce cooking time by 50-70%",
                        "impact": "medium",
                        "icon": "🍲",
                        "points": 15
                    },
                    {
                        "action": "Cover pots while cooking",
                        "description": "Retains heat and reduces cooking time",
                        "impact": "low",
                        "icon": "🍳",
                        "points": 5
                    },
                    {
                        "action": "Use right-sized burner",
                        "description": "Match pot size to burner size",
                        "impact": "low",
                        "icon": "🔥",
                        "points": 5
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
        
        # Check if activity is already eco-friendly - skip recommendations if so
        eco_friendly_activities = {
            "transport": ["bike", "walking", "rickshaw"],  # Zero or very low emissions
            "lifestyle": ["bucket_bath", "shower_cold", "hand_wash_clothes"],  # Already eco-friendly
            "diet": ["vegetables", "fruits", "dal", "lentils", "chickpeas", "beans"],  # Low emissions
            "energy": [],  # Most energy activities can be optimized
            "shopping": [],  # Most shopping can be optimized
        }
        
        if activity in eco_friendly_activities.get(category, []):
            # For eco-friendly activities, provide encouragement instead of suggestions
            return {
                "title": "Great Eco-Friendly Choice! 🌱",
                "description": f"You're already making a sustainable choice with {activity}! Keep it up!",
                "suggestions": [],
                "category_analysis": None,
                "encouragement": "🌟 Excellent! This activity has minimal environmental impact. Continue making sustainable choices!",
                "daily_tip": SuggestionService.get_daily_tip(),
                "is_eco_friendly": True,
            }
        
        # Check if carbon amount is very low (already good)
        if carbon_amount < 0.1:  # Less than 0.1 kg CO2
            return {
                "title": "Low Impact Activity ✅",
                "description": "This activity has a very low carbon footprint. Great job!",
                "suggestions": [],
                "category_analysis": None,
                "encouragement": "👍 Your activity has minimal environmental impact. Keep making sustainable choices!",
                "daily_tip": SuggestionService.get_daily_tip(),
                "is_eco_friendly": True,
            }
        
        # Get category-specific suggestions
        category_rules = SuggestionService.SUGGESTION_RULES.get(category, {})
        activity_rules = category_rules.get(activity, None)
        
        # If no specific activity rules, generate activity-aware suggestions
        if not activity_rules:
            activity_rules = SuggestionService._generate_activity_specific_suggestions(
                category, activity, carbon_amount, carbon_log.meta_data or {}
            )
        
        # Filter suggestions to only show relevant ones
        if activity_rules.get("suggestions"):
            activity_rules["suggestions"] = SuggestionService._filter_relevant_suggestions(
                activity_rules["suggestions"], activity, category
            )
        
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
    def _generate_activity_specific_suggestions(
        category: str, 
        activity: str, 
        carbon_amount: float,
        metadata: Dict[str, Any]
    ) -> Dict[str, Any]:
        """
        Generate activity-specific suggestions based on the actual activity logged
        This is smarter than generic suggestions - it considers the specific activity
        """
        # Transport activities
        if category == "transport":
            if activity in ["motorcycle", "scooter"]:
                return {
                    "title": "Optimize Your Two-Wheeler Usage",
                    "description": "Motorcycles and scooters are efficient, but here's how to optimize further:",
                    "suggestions": [
                        {
                            "action": "Consider electric scooter",
                            "description": "Electric scooters have zero direct emissions",
                            "impact": "high",
                            "icon": "⚡",
                            "points": 25
                        },
                        {
                            "action": "Maintain proper tire pressure",
                            "description": "Improves fuel efficiency by 3-5%",
                            "impact": "low",
                            "icon": "🔧",
                            "points": 5
                        },
                        {
                            "action": "Combine errands",
                            "description": "Plan trips to reduce total distance",
                            "impact": "medium",
                            "icon": "📋",
                            "points": 10
                        },
                    ]
                }
            elif activity in ["auto_rickshaw", "tuk_tuk"]:
                return {
                    "title": "Auto-Rickshaw Travel Tips",
                    "description": "Auto-rickshaws are relatively efficient. Consider these alternatives:",
                    "suggestions": [
                        {
                            "action": "Use cycle rickshaw for short trips",
                            "description": "Cycle rickshaws have 80% lower emissions (0.015 vs 0.080 kg/km)",
                            "impact": "high",
                            "icon": "🚲",
                            "points": 20
                        },
                        {
                            "action": "Walk for trips under 1 km",
                            "description": "Zero emissions and healthy exercise",
                            "impact": "medium",
                            "icon": "🚶",
                            "points": 15
                        },
                    ]
                }
            elif activity in ["cng"]:
                return {
                    "title": "CNG Vehicle Optimization",
                    "description": "CNG is already a cleaner fuel choice! Here's how to optimize:",
                    "suggestions": [
                        {
                            "action": "Maintain regular servicing",
                            "description": "Well-maintained vehicles are more efficient",
                            "impact": "low",
                            "icon": "🔧",
                            "points": 5
                        },
                        {
                            "action": "Use cycle rickshaw for very short trips",
                            "description": "For trips under 2km, cycle rickshaw is even cleaner",
                            "impact": "medium",
                            "icon": "🚲",
                            "points": 10
                        },
                    ]
                }
            elif activity in ["electric_vehicle", "hybrid_car"]:
                return {
                    "title": "Eco-Friendly Vehicle Choice!",
                    "description": "You're already using a low-emission vehicle. Great choice!",
                    "suggestions": [
                        {
                            "action": "Charge during off-peak hours",
                            "description": "If using EV, charge when grid is cleaner",
                            "impact": "low",
                            "icon": "⚡",
                            "points": 5
                        },
                        {
                            "action": "Maintain proper tire pressure",
                            "description": "Improves efficiency",
                            "impact": "low",
                            "icon": "🔧",
                            "points": 5
                        },
                    ]
                }
            elif activity in ["boat"]:
                return {
                    "title": "Boat Travel Optimization",
                    "description": "Boat travel in Bangladesh. Consider these alternatives:",
                    "suggestions": [
                        {
                            "action": "Use for longer distances only",
                            "description": "Boats are efficient for long water routes",
                            "impact": "low",
                            "icon": "🚤",
                            "points": 5
                        },
                        {
                            "action": "Combine with other transport",
                            "description": "Plan multi-modal trips efficiently",
                            "impact": "low",
                            "icon": "🗺️",
                            "points": 5
                        },
                    ]
                }
        
        # Diet activities
        elif category == "diet":
            if activity in ["chicken", "duck"]:
                return {
                    "title": "Poultry Consumption Tips",
                    "description": "Chicken and duck are better than red meat. Here's how to optimize:",
                    "suggestions": [
                        {
                            "action": "Add more plant-based meals",
                            "description": "Try 2-3 vegetarian meals per week",
                            "impact": "medium",
                            "icon": "🌱",
                            "points": 15
                        },
                        {
                            "action": "Buy local and free-range",
                            "description": "Local poultry has lower transport emissions",
                            "impact": "low",
                            "icon": "🏪",
                            "points": 5
                        },
                    ]
                }
            elif activity in ["fish", "seafood", "prawn"]:
                return {
                    "title": "Sustainable Seafood Choices",
                    "description": "Fish is a good protein choice. Here's how to optimize:",
                    "suggestions": [
                        {
                            "action": "Choose local fish",
                            "description": "Local fish from Bangladesh markets has lower carbon footprint",
                            "impact": "medium",
                            "icon": "🐟",
                            "points": 10
                        },
                        {
                            "action": "Add more plant proteins",
                            "description": "Mix fish with dal and vegetables",
                            "impact": "medium",
                            "icon": "🥗",
                            "points": 10
                        },
                    ]
                }
            elif activity in ["rice", "wheat", "roti", "naan", "bread"]:
                return {
                    "title": "Grain Consumption Tips",
                    "description": "Grains are relatively low-emission. Here's how to optimize:",
                    "suggestions": [
                        {
                            "action": "Buy local grains",
                            "description": "Local rice and wheat have lower transport emissions",
                            "impact": "low",
                            "icon": "🌾",
                            "points": 5
                        },
                        {
                            "action": "Reduce food waste",
                            "description": "Plan portions to avoid wasting rice/bread",
                            "impact": "medium",
                            "icon": "🍽️",
                            "points": 10
                        },
                    ]
                }
            elif activity in ["milk", "yogurt", "eggs"]:
                return {
                    "title": "Dairy and Egg Consumption",
                    "description": "Dairy and eggs are moderate-emission foods. Here's how to optimize:",
                    "suggestions": [
                        {
                            "action": "Buy local dairy products",
                            "description": "Local milk and yogurt have lower transport emissions",
                            "impact": "low",
                            "icon": "🥛",
                            "points": 5
                        },
                        {
                            "action": "Consider plant-based alternatives",
                            "description": "Try plant milk occasionally (soy, almond)",
                            "impact": "medium",
                            "icon": "🌱",
                            "points": 10
                        },
                    ]
                }
        
        # Lifestyle activities
        elif category == "lifestyle":
            if activity in ["fan_hour", "fan_energy_efficient"]:
                return {
                    "title": "Fan Usage Optimization",
                    "description": "Fans are energy-efficient. Here's how to optimize:",
                    "suggestions": [
                        {
                            "action": "Use energy-efficient fan",
                            "description": "Energy-efficient fans use 40% less electricity",
                            "impact": "medium",
                            "icon": "🌀",
                            "points": 15
                        },
                        {
                            "action": "Use natural ventilation when possible",
                            "description": "Open windows for cross-ventilation",
                            "impact": "low",
                            "icon": "🌬️",
                            "points": 5
                        },
                    ]
                }
            elif activity in ["ac_hour", "ac_hour_1ton", "ac_hour_1.5ton", "ac_hour_2ton"]:
                return {
                    "title": "AC Usage Optimization",
                    "description": "AC has high energy consumption. Here's how to reduce:",
                    "suggestions": [
                        {
                            "action": "Use fan instead when possible",
                            "description": "Fans use 95% less energy than AC",
                            "impact": "high",
                            "icon": "🌀",
                            "points": 30
                        },
                        {
                            "action": "Set AC to 26°C or higher",
                            "description": "Each degree higher saves 5-7% energy",
                            "impact": "medium",
                            "icon": "🌡️",
                            "points": 15
                        },
                        {
                            "action": "Use AC only in occupied rooms",
                            "description": "Turn off AC when leaving the room",
                            "impact": "medium",
                            "icon": "🚪",
                            "points": 15
                        },
                    ]
                }
            elif activity in ["shower_10min", "bath"]:
                return {
                    "title": "Reduce Water and Energy Usage",
                    "description": "Hot showers and baths use energy. Here's how to reduce:",
                    "suggestions": [
                        {
                            "action": "Switch to bucket bath",
                            "description": "Bucket bath uses 60-70% less water and energy",
                            "impact": "high",
                            "icon": "🪣",
                            "points": 25
                        },
                        {
                            "action": "Take shorter showers",
                            "description": "Cut 2-3 minutes off your shower time",
                            "impact": "medium",
                            "icon": "⏱️",
                            "points": 15
                        },
                        {
                            "action": "Install low-flow showerhead",
                            "description": "Reduces water usage by 40-60%",
                            "impact": "medium",
                            "icon": "🚿",
                            "points": 20
                        },
                    ]
                }
            elif activity in ["cooking_gas", "cooking_electric"]:
                return {
                    "title": "Cooking Energy Optimization",
                    "description": "Cooking uses energy. Here's how to optimize:",
                    "suggestions": [
                        {
                            "action": "Use pressure cooker",
                            "description": "Pressure cookers reduce cooking time by 50-70%",
                            "impact": "medium",
                            "icon": "🍲",
                            "points": 15
                        },
                        {
                            "action": "Cover pots while cooking",
                            "description": "Retains heat and reduces cooking time",
                            "impact": "low",
                            "icon": "🍳",
                            "points": 5
                        },
                        {
                            "action": "Use right-sized burner",
                            "description": "Match pot size to burner size",
                            "impact": "low",
                            "icon": "🔥",
                            "points": 5
                        },
                    ]
                }
            elif activity in ["led_bulb_7w", "led_bulb_12w", "cfl_bulb_15w"]:
                return {
                    "title": "Lighting Optimization",
                    "description": "You're using efficient lighting! Here's how to optimize further:",
                    "suggestions": [
                        {
                            "action": "Use LED bulbs (most efficient)",
                            "description": "LED bulbs use 75% less energy than incandescent",
                            "impact": "high",
                            "icon": "💡",
                            "points": 20
                        },
                        {
                            "action": "Turn off lights when not needed",
                            "description": "Use natural light during day",
                            "impact": "low",
                            "icon": "☀️",
                            "points": 5
                        },
                    ]
                }
            elif activity in ["streaming_hour", "internet_gb", "social_media"]:
                return {
                    "title": "Digital Carbon Footprint",
                    "description": "Digital activities have small but real emissions. Here's how to reduce:",
                    "suggestions": [
                        {
                            "action": "Lower video quality when possible",
                            "description": "HD uses less data than 4K",
                            "impact": "low",
                            "icon": "📺",
                            "points": 5
                        },
                        {
                            "action": "Download instead of streaming repeatedly",
                            "description": "Downloaded content uses less energy",
                            "impact": "low",
                            "icon": "⬇️",
                            "points": 5
                        },
                    ]
                }
        
        # Energy activities
        elif category == "energy":
            if activity in ["electricity_grid", "natural_gas"]:
                return {
                    "title": "Reduce Energy Consumption",
                    "description": "High energy usage increases your carbon footprint. Here's how to reduce:",
                    "suggestions": [
                        {
                            "action": "Switch to LED bulbs",
                            "description": "LEDs use 75% less energy and last 25x longer",
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
                }
        
        # Shopping activities
        elif category == "shopping":
            # Consumable items (cannot be bought second-hand)
            consumable_items = ["soap", "shampoo", "toothpaste", "detergent", "toiletries"]
            if activity in consumable_items:
                return {
                    "title": "Eco-Friendly Consumable Choices",
                    "description": f"{activity.capitalize()} is a daily necessity. Here's how to make it more sustainable:",
                    "suggestions": [
                        {
                            "action": "Buy in bulk or larger sizes",
                            "description": "Reduces packaging waste and transport emissions per use",
                            "impact": "medium",
                            "icon": "📦",
                            "points": 10
                        },
                        {
                            "action": "Choose eco-friendly brands",
                            "description": "Look for brands with minimal packaging and sustainable practices",
                            "impact": "low",
                            "icon": "🌿",
                            "points": 5
                        },
                    ]
                }
            # Durable items (can be bought second-hand)
            elif activity in ["clothing", "jeans", "shoes", "sari", "kurta", "sandals", "electronics"]:
                return {
                    "title": "Sustainable Shopping",
                    "description": "Shopping has environmental impact. Make sustainable choices:",
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
                            "description": "Fewer, longer-lasting items",
                            "impact": "medium",
                            "icon": "✨",
                            "points": 15
                        },
                    ]
                }
            # Books
            elif activity == "books":
                return {
                    "title": "Sustainable Book Choices",
                    "description": "Books have production emissions. Make sustainable choices:",
                    "suggestions": [
                        {
                            "action": "Buy second-hand books",
                            "description": "Thrift stores and used book shops extend product life",
                            "impact": "high",
                            "icon": "♻️",
                            "points": 20
                        },
                        {
                            "action": "Use libraries",
                            "description": "Borrowing books reduces individual consumption",
                            "impact": "high",
                            "icon": "📚",
                            "points": 25
                        },
                    ]
                }
            # Packaging items
            elif activity in ["plastic_bags", "paper_bag", "jute_bag", "packaging"]:
                return {
                    "title": "Reduce Packaging Waste",
                    "description": "Packaging has environmental impact. Make sustainable choices:",
                    "suggestions": [
                        {
                            "action": "Use reusable bags",
                            "description": "Bring your own cloth or jute bags when shopping",
                            "impact": "high",
                            "icon": "🛍️",
                            "points": 20
                        },
                        {
                            "action": "Choose jute or paper bags",
                            "description": "Biodegradable alternatives to plastic",
                            "impact": "medium",
                            "icon": "📦",
                            "points": 15
                        },
                    ]
                }
        
        # Fallback to generic suggestions if no specific match
        return SuggestionService._generate_generic_suggestions(category, carbon_amount)
    
    @staticmethod
    def _filter_relevant_suggestions(
        suggestions: List[Dict[str, Any]], 
        activity: str, 
        category: str
    ) -> List[Dict[str, Any]]:
        """
        Filter suggestions to only show relevant ones for the specific activity
        Removes suggestions that don't make sense for the logged activity
        """
        filtered = []
        
        # Consumable items that cannot be bought second-hand
        consumable_items = ["soap", "shampoo", "toothpaste", "detergent", "toiletries", 
                           "water_bottle", "takeaway_container"]
        
        for suggestion in suggestions:
            action = suggestion.get("action", "").lower()
            
            # Skip "Buy second-hand" for consumable items
            if activity in consumable_items and ("second-hand" in action or "secondhand" in action or "thrift" in action):
                continue
            
            # Skip suggestions that are redundant or not applicable
            # For example, don't suggest "use bike" if they already logged "bike"
            if activity == "bike" and ("bike" in action or "cycle" in action or "cycling" in action):
                continue
            if activity == "walking" and ("walk" in action or "walking" in action):
                continue
            if activity == "bucket_bath" and ("bucket" in action or "bath" in action):
                continue
            if activity == "electric_vehicle" and ("electric" in action and "vehicle" in action):
                continue
            if activity == "hybrid_car" and ("hybrid" in action):
                continue
            if activity == "fan_energy_efficient" and "energy-efficient" in action.lower():
                continue
            if activity in ["led_bulb_7w", "led_bulb_12w"] and "led" in action.lower():
                continue
            if activity == "jute_bag" and ("jute" in action or "reusable" in action):
                continue
            
            filtered.append(suggestion)
        
        return filtered if filtered else suggestions  # Return original if all filtered out
    
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
                        "action": "Buy in bulk when possible",
                        "description": "Reduces packaging waste and transport emissions",
                        "impact": "medium",
                        "icon": "📦",
                        "points": 10
                    },
                    {
                        "action": "Choose products with minimal packaging",
                        "description": "Reduces waste and emissions from packaging production",
                        "impact": "medium",
                        "icon": "📦",
                        "points": 15
                    },
                    {
                        "action": "Look for eco-friendly brands",
                        "description": "Choose brands with sustainable practices",
                        "impact": "low",
                        "icon": "🌿",
                        "points": 5
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

    @staticmethod
    def get_personalized_recommendations(
        user: User,
        db: Session,
        days: int = 30
    ) -> Dict[str, Any]:
        """
        Get personalized, actionable recommendations based on user's highest emission category
        
        Args:
            user: The user to generate recommendations for
            db: Database session
            days: Number of days to look back
            
        Returns:
            Dictionary with personalized recommendations, quick wins, and savings calculator
        """
        # Get user's recent logs
        cutoff_date = datetime.utcnow() - timedelta(days=days)
        recent_logs = db.query(CarbonLog).filter(
            CarbonLog.user_id == user.id,
            CarbonLog.created_at >= cutoff_date
        ).all()
        
        if not recent_logs:
            return {
                "recommendations": [],
                "quick_wins": [],
                "total_potential_savings_kg": 0,
                "message": "Start tracking your carbon footprint to get personalized recommendations!",
            }
        
        # Calculate emissions by category
        category_emissions = {}
        for log in recent_logs:
            category = log.category
            category_emissions[category] = category_emissions.get(category, 0) + log.carbon_amount_kg
        
        # Find highest emission category
        if not category_emissions:
            return {
                "recommendations": [],
                "quick_wins": [],
                "total_potential_savings_kg": 0,
            }
        
        highest_category = max(category_emissions.items(), key=lambda x: x[1])
        highest_category_name = highest_category[0]
        highest_category_emissions = highest_category[1]
        
        # Generate category-specific recommendations
        recommendations = []
        quick_wins = []
        total_savings = 0.0
        
        # Transport category recommendations
        if highest_category_name == "transport":
            transport_logs = [log for log in recent_logs if log.category == "transport"]
            car_logs = [log for log in transport_logs if log.activity in ["car", "car_small", "car_large"]]
            
            total_km = sum(
                log.meta_data.get("distance_km", 0) if log.meta_data else 0
                for log in car_logs
            )
            
            if total_km > 50:  # If driving more than 50km/month
                # CNG recommendation
                savings_cng = total_km * 0.096  # Switching from car (0.171) to CNG (0.075) saves ~0.096 kg/km
                recommendations.append({
                    "title": "Switch to CNG for City Travel",
                    "description": f"Switch {int(total_km * 0.3)} km/month to CNG instead of car",
                    "savings_kg": round(savings_cng * 0.3, 2),
                    "difficulty": "Easy",
                    "impact": "High",
                    "icon": "🚗",
                    "category": "transport"
                })
                total_savings += savings_cng * 0.3
            
            # Cycling recommendation
            if total_km > 20:
                cycling_km = min(total_km * 0.2, 100)  # Suggest cycling 20% of distance, max 100km
                savings_cycling = cycling_km * 0.171  # Full car emission saved
                recommendations.append({
                    "title": "Try Cycling 2 Days/Week",
                    "description": f"Cycle {int(cycling_km)} km/month instead of driving",
                    "savings_kg": round(savings_cycling, 2),
                    "difficulty": "Easy",
                    "impact": "High",
                    "icon": "🚴",
                    "category": "transport"
                })
                total_savings += savings_cycling
            
            # Rickshaw recommendation (Bangladesh-specific)
            if total_km > 30:
                rickshaw_km = min(total_km * 0.15, 50)  # Suggest rickshaw for 15% of trips
                savings_rickshaw = rickshaw_km * (0.171 - 0.015)  # Car to rickshaw savings
                recommendations.append({
                    "title": "Use Cycle Rickshaw for Short Distances",
                    "description": f"Use cycle rickshaw for {int(rickshaw_km)} km/month (saves 0.15 kg/km)",
                    "savings_kg": round(savings_rickshaw, 2),
                    "difficulty": "Easy",
                    "impact": "Medium",
                    "icon": "🚲",
                    "category": "transport",
                    "bangladesh_specific": True
                })
                total_savings += savings_rickshaw
        
        # Diet category recommendations
        elif highest_category_name == "diet":
            diet_logs = [log for log in recent_logs if log.category == "diet"]
            meat_logs = [log for log in diet_logs if log.activity in ["beef", "mutton", "chicken", "pork"]]
            
            total_meat_kg = sum(
                log.meta_data.get("quantity_kg", 0) if log.meta_data else 0
                for log in meat_logs
            )
            
            if total_meat_kg > 2:  # If eating more than 2kg meat/month
                # Vegetarian meals recommendation
                veg_meals_kg = total_meat_kg * 0.3  # Switch 30% to vegetarian
                # Average meat emission: 20 kg CO2/kg, vegetarian: 2 kg CO2/kg
                savings_veg = veg_meals_kg * 18  # Save ~18 kg CO2 per kg switched
                recommendations.append({
                    "title": "Switch 3 Meals/Week to Vegetarian",
                    "description": f"Replace {round(veg_meals_kg, 1)} kg meat/month with vegetarian options",
                    "savings_kg": round(savings_veg, 2),
                    "difficulty": "Medium",
                    "impact": "High",
                    "icon": "🥗",
                    "category": "diet"
                })
                total_savings += savings_veg
            
            # Local seasonal fruits recommendation (Bangladesh-specific)
            recommendations.append({
                "title": "Eat Local Seasonal Fruits",
                "description": "Choose local fruits like mango, jackfruit, guava (lower carbon footprint)",
                "savings_kg": round(highest_category_emissions * 0.1, 2),  # ~10% reduction
                "difficulty": "Easy",
                "impact": "Medium",
                "icon": "🥭",
                "category": "diet",
                "bangladesh_specific": True
            })
            total_savings += highest_category_emissions * 0.1
        
        # Energy category recommendations
        elif highest_category_name == "energy":
            energy_logs = [log for log in recent_logs if log.category == "energy"]
            
            # LED bulbs recommendation
            recommendations.append({
                "title": "Switch to LED Bulbs",
                "description": "Replace incandescent bulbs with LED (saves 80% energy)",
                "savings_kg": round(highest_category_emissions * 0.2, 2),  # ~20% reduction
                "difficulty": "Easy",
                "impact": "High",
                "icon": "💡",
                "category": "energy"
            })
            total_savings += highest_category_emissions * 0.2
            
            # Bucket bath recommendation (Bangladesh-specific)
            lifestyle_logs = [log for log in recent_logs if log.category == "lifestyle"]
            shower_logs = [log for log in lifestyle_logs if log.activity == "shower_10min"]
            
            if shower_logs:
                # Switch to bucket bath saves ~1.5 kg per bath
                savings_bucket = len(shower_logs) * 1.5
                recommendations.append({
                    "title": "Use Bucket Bath Instead of Shower",
                    "description": f"Switch {len(shower_logs)} showers/month to bucket bath",
                    "savings_kg": round(savings_bucket, 2),
                    "difficulty": "Easy",
                    "impact": "Medium",
                    "icon": "🪣",
                    "category": "lifestyle",
                    "bangladesh_specific": True
                })
                total_savings += savings_bucket
        
        # Quick wins (easy changes with big impact)
        quick_wins = [
            {
                "title": "Switch to LED Bulbs",
                "description": "Replace all incandescent bulbs with LED",
                "savings_kg": 2.0,
                "difficulty": "Easy",
                "icon": "💡"
            },
            {
                "title": "Unplug Electronics When Not in Use",
                "description": "Eliminate standby power consumption",
                "savings_kg": 1.5,
                "difficulty": "Easy",
                "icon": "🔌"
            },
            {
                "title": "Use Bucket Bath Instead of Shower",
                "description": "Saves water and energy",
                "savings_kg": 1.5,
                "difficulty": "Easy",
                "icon": "🪣",
                "bangladesh_specific": True
            },
            {
                "title": "Walk for Trips Under 2 km",
                "description": "Zero emissions and healthy",
                "savings_kg": 0.34,  # ~2km * 0.171 kg/km
                "difficulty": "Easy",
                "icon": "🚶"
            },
        ]
        
        # Add more Bangladesh-specific recommendations based on activities
        lifestyle_logs = [log for log in recent_logs if log.category == "lifestyle"]
        energy_logs = [log for log in recent_logs if log.category == "energy"]
        
        # Fan usage recommendations (Bangladesh-specific)
        fan_logs = [log for log in lifestyle_logs if log.activity in ["fan_hour", "fan_energy_efficient"]]
        if fan_logs:
            total_fan_hours = sum(
                log.meta_data.get("amount", 0) if log.meta_data else 0
                for log in fan_logs
            )
            if total_fan_hours > 100:  # More than 100 hours/month
                # Suggest energy-efficient fan
                savings_fan = total_fan_hours * (0.033 - 0.020)  # Standard to efficient
                recommendations.append({
                    "title": "Switch to Energy-Efficient Fan",
                    "description": f"Replace standard fan with energy-efficient model (saves 0.013 kg/hour)",
                    "savings_kg": round(savings_fan, 2),
                    "difficulty": "Easy",
                    "impact": "Medium",
                    "icon": "🌀",
                    "category": "lifestyle",
                    "bangladesh_specific": True
                })
                total_savings += savings_fan
        
        # AC usage recommendations (Bangladesh-specific)
        ac_logs = [log for log in lifestyle_logs if "ac" in log.activity.lower()]
        if ac_logs:
            total_ac_hours = sum(
                log.meta_data.get("amount", 0) if log.meta_data else 0
                for log in ac_logs
            )
            if total_ac_hours > 50:  # More than 50 hours/month
                # Suggest using fan instead of AC
                fan_hours_saved = min(total_ac_hours * 0.3, 30)  # Replace 30% with fan, max 30 hours
                savings_ac_to_fan = fan_hours_saved * (0.78 - 0.033)  # AC to fan savings
                recommendations.append({
                    "title": "Use Fan Instead of AC When Possible",
                    "description": f"Use ceiling fan for {int(fan_hours_saved)} hours/month instead of AC (saves 0.75 kg/hour)",
                    "savings_kg": round(savings_ac_to_fan, 2),
                    "difficulty": "Easy",
                    "impact": "High",
                    "icon": "🌀",
                    "category": "lifestyle",
                    "bangladesh_specific": True
                })
                total_savings += savings_ac_to_fan
        
        # Diet: Local food recommendations (Bangladesh-specific)
        diet_logs = [log for log in recent_logs if log.category == "diet"]
        beef_logs = [log for log in diet_logs if log.activity in ["beef", "beef_biryani", "beef_curry"]]
        if beef_logs:
            total_beef_kg = sum(
                log.meta_data.get("quantity_kg", 0) if log.meta_data else 0
                for log in beef_logs
            )
            if total_beef_kg > 0.5:  # More than 0.5kg beef/month
                # Suggest local fish instead
                savings_fish = total_beef_kg * (60.0 - 5.0)  # Beef (60) to Fish (5) = 55 kg CO2/kg saved
                recommendations.append({
                    "title": "Eat Local Fish Instead of Beef",
                    "description": f"Replace {round(total_beef_kg * 0.5, 1)} kg beef/month with local fish (saves 55 kg CO2/kg)",
                    "savings_kg": round(savings_fish * 0.5, 2),
                    "difficulty": "Easy",
                    "impact": "High",
                    "icon": "🐟",
                    "category": "diet",
                    "bangladesh_specific": True
                })
                total_savings += savings_fish * 0.5
        
        # Sort recommendations by savings (impact) and get top 3 priority actions
        recommendations.sort(key=lambda x: x.get("savings_kg", 0), reverse=True)
        priority_actions = recommendations[:3]  # Top 3 by impact
        
        # Add AI-powered insights based on patterns
        ai_insights = SuggestionService._generate_ai_insights(recent_logs, category_emissions)
        
        return {
            "recommendations": recommendations,
            "priority_actions": priority_actions,  # Top 3 actions ranked by impact
            "quick_wins": quick_wins,
            "total_potential_savings_kg": round(total_savings, 2),
            "highest_category": highest_category_name,
            "highest_category_emissions": round(highest_category_emissions, 2),
            "category_breakdown": {k: round(v, 2) for k, v in category_emissions.items()},
            "ai_insights": ai_insights,  # AI-powered insights
        }
    
    @staticmethod
    def _generate_ai_insights(recent_logs: List[CarbonLog], category_emissions: Dict[str, float]) -> Dict[str, Any]:
        """
        Generate AI-powered insights based on user's carbon patterns
        
        Args:
            recent_logs: User's recent carbon logs
            category_emissions: Emissions by category
            
        Returns:
            Dictionary with AI insights
        """
        insights = []
        
        if not recent_logs or not category_emissions:
            return {"insights": insights, "summary": "Start tracking to get personalized insights!"}
        
        # Find top 3 activities by emissions
        activity_emissions = {}
        for log in recent_logs:
            activity = log.activity
            activity_emissions[activity] = activity_emissions.get(activity, 0) + log.carbon_amount_kg
        
        top_activities = sorted(activity_emissions.items(), key=lambda x: x[1], reverse=True)[:3]
        
        # Generate insights
        if top_activities:
            top_activity = top_activities[0]
            if top_activity[0] in ["beef", "beef_biryani", "beef_curry"]:
                insights.append({
                    "type": "high_impact",
                    "message": f"Your highest emission activity is {top_activity[0]} ({round(top_activity[1], 1)} kg). Switching to local fish could save {round(top_activity[1] * 0.9, 1)} kg/month!",
                    "priority": "high"
                })
            elif "ac" in top_activity[0].lower():
                insights.append({
                    "type": "energy",
                    "message": f"AC usage is your top activity ({round(top_activity[1], 1)} kg). Using fan instead for 30% of the time could save {round(top_activity[1] * 0.3, 1)} kg/month!",
                    "priority": "high"
                })
            elif top_activity[0] in ["car", "car_small", "car_large"]:
                insights.append({
                    "type": "transport",
                    "message": f"Car travel is your top activity ({round(top_activity[1], 1)} kg). Using CNG or rickshaw for short trips could significantly reduce emissions!",
                    "priority": "high"
                })
        
        # Category distribution insights
        total_emissions = sum(category_emissions.values())
        if total_emissions > 0:
            transport_pct = (category_emissions.get("transport", 0) / total_emissions) * 100
            diet_pct = (category_emissions.get("diet", 0) / total_emissions) * 100
            energy_pct = (category_emissions.get("energy", 0) / total_emissions) * 100
            
            if transport_pct > 40:
                insights.append({
                    "type": "category_focus",
                    "message": f"Transport accounts for {round(transport_pct, 1)}% of your footprint. Focus on reducing car usage for maximum impact!",
                    "priority": "medium"
                })
            elif diet_pct > 40:
                insights.append({
                    "type": "category_focus",
                    "message": f"Diet accounts for {round(diet_pct, 1)}% of your footprint. Eating more local and plant-based foods can help!",
                    "priority": "medium"
                })
            elif energy_pct > 40:
                insights.append({
                    "type": "category_focus",
                    "message": f"Energy accounts for {round(energy_pct, 1)}% of your footprint. Using fans instead of AC and LED bulbs can make a big difference!",
                    "priority": "medium"
                })
        
        summary = "Based on your activity patterns, focus on reducing your highest emission activities first for maximum impact!"
        if insights:
            summary = insights[0].get("message", summary)
        
        return {
            "insights": insights,
            "summary": summary,
            "top_activities": [{"activity": a[0], "emissions_kg": round(a[1], 2)} for a in top_activities],
        }

