"""
Carbon footprint calculation service
Based on reliable sources: IPCC, EPA, Our World in Data, GHG Protocol
"""

from typing import Dict, Any


class CarbonCalculator:
    """Calculate carbon footprint for various activities"""

    # Emission factors (kg CO2 per unit)
    # Sources: IPCC, EPA, Our World in Data, GHG Protocol
    EMISSION_FACTORS = {
        "transport": {
            # Sources: IPCC 2024, EPA eGRID, DEFRA, Carbon Trust
            "car": 0.171,  # Average car: 0.171 kg CO2/km (EPA)
            "car_small": 0.120,  # Small car: 0.120 kg CO2/km (EPA)
            "car_large": 0.250,  # Large car/SUV: 0.250 kg CO2/km (EPA)
            "bus": 0.089,  # Local bus: 0.089 kg CO2/km (DEFRA)
            "train": 0.041,  # Electric train: 0.041 kg CO2/km (IPCC)
            "subway": 0.050,  # Subway/Metro: 0.050 kg CO2/km (DEFRA)
            "plane": 0.255,  # Domestic flight: 0.255 kg CO2/km (DEFRA)
            "plane_international": 0.195,  # International flight: 0.195 kg CO2/km (ICAO)
            "ferry": 0.150,  # Ferry: 0.150 kg CO2/km (DEFRA)
            "electric_vehicle": 0.051,  # EV (grid avg): 0.051 kg CO2/km (EPA)
            "hybrid_car": 0.105,  # Hybrid car: 0.105 kg CO2/km (EPA)
            "motorcycle": 0.113,  # Motorcycle: 0.113 kg CO2/km (EPA)
            "scooter": 0.060,  # Scooter: 0.060 kg CO2/km (EPA)
            "truck": 0.296,  # Delivery truck: 0.296 kg CO2/km (EPA)
            "van": 0.209,  # Van: 0.209 kg CO2/km (EPA)
            "bike": 0,  # Zero emissions
            "walking": 0,  # Zero emissions
        },
        "diet": {
            # Sources: Our World in Data (2024), EPD database, Poore & Nemecek
            "beef": 60.0,  # Beef: 60 kg CO2/kg (Our World in Data)
            "lamb": 24.0,  # Lamb: 24 kg CO2/kg (Our World in Data)
            "cheese": 21.0,  # Cheese: 21 kg CO2/kg (Our World in Data)
            "pork": 7.0,  # Pork: 7 kg CO2/kg (Our World in Data)
            "chicken": 6.0,  # Chicken: 6 kg CO2/kg (Our World in Data)
            "turkey": 6.5,  # Turkey: 6.5 kg CO2/kg (Our World in Data)
            "fish": 5.0,  # Fish: 5 kg CO2/kg (Average)
            "seafood": 5.5,  # Seafood: 5.5 kg CO2/kg (Average)
            "milk": 3.2,  # Milk: 3.2 kg CO2/kg (Our World in Data)
            "yogurt": 3.5,  # Yogurt: 3.5 kg CO2/kg (Our World in Data)
            "eggs": 4.2,  # Eggs: 4.2 kg CO2/kg (Our World in Data)
            "rice": 4.0,  # Rice: 4 kg CO2/kg (EDP)
            "wheat": 1.4,  # Wheat: 1.4 kg CO2/kg (Our World in Data)
            "beans": 2.0,  # Legumes: 2 kg CO2/kg (Our World in Data)
            "lentils": 0.9,  # Lentils: 0.9 kg CO2/kg (Our World in Data)
            "tofu": 3.0,  # Tofu: 3.0 kg CO2/kg (Our World in Data)
            "nuts": 0.3,  # Nuts: 0.3 kg CO2/kg (Our World in Data)
            "vegetables": 0.4,  # Vegetables: 0.4 kg CO2/kg (Average)
            "fruits": 0.4,  # Fruits: 0.4 kg CO2/kg (Average)
            "bread": 1.0,  # Bread: 1 kg CO2/kg (Average)
            "pasta": 1.4,  # Pasta: 1.4 kg CO2/kg (Average)
            "potatoes": 0.3,  # Potatoes: 0.3 kg CO2/kg (Our World in Data)
        },
        "energy": {
            # Sources: EPA, IEA, regional electricity grid data
            "electricity_grid": 0.493,  # US grid avg: 0.493 kg CO2/kWh (EPA 2023)
            "natural_gas": 2.07,  # Natural gas: 2.07 kg CO2/m3 (IEA)
            "heating_oil": 2.96,  # Heating oil: 2.96 kg CO2/liter (EPA)
            "coal": 3.12,  # Coal: 3.12 kg CO2/kWh (IPCC)
        },
        "shopping": {
            # Sources: Ecoinvent, Carbon Trust, averaged estimates
            "clothing": 12.0,  # T-shirt: 12 kg CO2/item (average)
            "jeans": 33.4,  # Jeans: 33.4 kg CO2/item (Carbon Trust)
            "shoes": 13.6,  # Shoes: 13.6 kg CO2/item (average)
            "electronics": 78.0,  # Smartphone: 78 kg CO2/item (Apple Carbon Footprint)
            "laptop": 300.0,  # Laptop: 300 kg CO2/item (average)
            "tablet": 150.0,  # Tablet: 150 kg CO2/item (average)
            "appliance": 200.0,  # Small appliance: 200 kg CO2/item (average)
            "furniture": 50.0,  # Chair: 50 kg CO2/item (Average)
            "books": 2.8,  # Book: 2.8 kg CO2/item (EEA)
            "toiletries": 1.2,  # Toiletries: 1.2 kg CO2/item (Average)
            "packaging": 2.0,  # Packaging materials: 2 kg CO2/kg (average)
            "plastic_bags": 0.05,  # Plastic bag: 0.05 kg CO2/item (EPA)
        },
        "lifestyle": {
            # Sources: IEA, Carbon Trust, scientific estimates
            "streaming_hour": 0.036,  # Video streaming: 0.036 kg CO2/hour (IEA 2023)
            "internet_gb": 0.014,  # Internet data: 0.014 kg CO2/GB (IEA)
            "email": 0.004,  # Email: 0.004 kg CO2/email (average)
            "hotel_night": 15.0,  # Hotel stay: 15 kg CO2/night (Carbon Trust)
            "laundry_load": 1.5,  # Washing machine: 1.5 kg CO2/load (average)
            "dryer_load": 2.0,  # Clothes dryer: 2.0 kg CO2/load (average)
            "shower_10min": 2.0,  # Hot shower: 2 kg CO2/10min (average)
            "bath": 5.0,  # Bath: 5 kg CO2/bath (average)
            "event_attendee": 5.0,  # Event attendance: 5 kg CO2/person (average)
            "waste_kg": 0.5,  # Waste disposal: 0.5 kg CO2/kg (average)
            "newspaper": 0.3,  # Newspaper: 0.3 kg CO2/issue (EEA)
            "magazine": 0.8,  # Magazine: 0.8 kg CO2/issue (EEA)
        },
    }

    @staticmethod
    def calculate_transport(
        mode: str, distance_km: float, passengers: int = 1
    ) -> float:
        """Calculate carbon for transport"""
        if mode not in CarbonCalculator.EMISSION_FACTORS["transport"]:
            return 0.0

        factor = CarbonCalculator.EMISSION_FACTORS["transport"][mode]
        carbon = factor * distance_km

        # Divide by passengers for shared transport
        if mode in ["car", "bus", "train"] and passengers > 1:
            carbon = carbon / passengers

        return round(carbon, 2)

    @staticmethod
    def calculate_diet(meal_type: str, quantity_kg: float) -> float:
        """Calculate carbon for diet/food"""
        if meal_type not in CarbonCalculator.EMISSION_FACTORS["diet"]:
            # Use average for unknown foods
            factor = 5.0
        else:
            factor = CarbonCalculator.EMISSION_FACTORS["diet"][meal_type]

        carbon = factor * quantity_kg
        return round(carbon, 2)

    @staticmethod
    def calculate_energy(
        energy_type: str, amount: float, unit: str = "kwh"
    ) -> float:
        """Calculate carbon for energy consumption"""
        if energy_type not in CarbonCalculator.EMISSION_FACTORS["energy"]:
            return 0.0

        factor = CarbonCalculator.EMISSION_FACTORS["energy"][energy_type]

        # Convert to standard unit if needed
        if unit == "m3" and energy_type == "natural_gas":
            carbon = factor * amount
        elif unit == "liter" and energy_type in ["heating_oil", "coal"]:
            carbon = factor * amount
        else:
            carbon = factor * amount

        return round(carbon, 2)

    @staticmethod
    def calculate_shopping(item_type: str, quantity: int = 1) -> float:
        """Calculate carbon for shopping"""
        if item_type not in CarbonCalculator.EMISSION_FACTORS["shopping"]:
            return 0.0

        factor = CarbonCalculator.EMISSION_FACTORS["shopping"][item_type]
        carbon = factor * quantity
        return round(carbon, 2)

    @staticmethod
    def calculate_lifestyle(activity_type: str, amount: float, unit: str = "item") -> float:
        """Calculate carbon for lifestyle activities"""
        if activity_type not in CarbonCalculator.EMISSION_FACTORS["lifestyle"]:
            return 0.0

        factor = CarbonCalculator.EMISSION_FACTORS["lifestyle"][activity_type]
        carbon = factor * amount
        return round(carbon, 2)

    @staticmethod
    def calculate(
        category: str, activity: str, amount: float, **kwargs
    ) -> Dict[str, Any]:
        """
        Main calculation method
        Returns dict with carbon amount and metadata
        """
        result = {"carbon_amount_kg": 0.0, "category": category}

        if category == "transport":
            mode = activity
            passengers = kwargs.get("passengers", 1)
            result["carbon_amount_kg"] = CarbonCalculator.calculate_transport(
                mode, amount, passengers
            )
            result["metadata"] = {
                "mode": mode,
                "distance_km": amount,
                "passengers": passengers,
            }

        elif category == "diet":
            meal_type = activity
            result["carbon_amount_kg"] = CarbonCalculator.calculate_diet(
                meal_type, amount
            )
            result["metadata"] = {"meal_type": meal_type, "quantity_kg": amount}

        elif category == "energy":
            energy_type = activity
            unit = kwargs.get("unit", "kwh")
            result["carbon_amount_kg"] = CarbonCalculator.calculate_energy(
                energy_type, amount, unit
            )
            result["metadata"] = {
                "energy_type": energy_type,
                "amount": amount,
                "unit": unit,
            }

        elif category == "shopping":
            item_type = activity
            quantity = kwargs.get("quantity", 1)
            result["carbon_amount_kg"] = CarbonCalculator.calculate_shopping(
                item_type, int(amount)
            )
            result["metadata"] = {
                "item_type": item_type,
                "quantity": int(amount),
            }

        elif category == "lifestyle":
            # Calculate lifestyle activities
            activity_type = activity
            unit = kwargs.get("unit", "item")
            result["carbon_amount_kg"] = CarbonCalculator.calculate_lifestyle(
                activity_type, amount, unit
            )
            result["metadata"] = {
                "activity_type": activity_type,
                "amount": amount,
                "unit": unit,
            }

        else:
            # Other/miscellaneous
            result["carbon_amount_kg"] = round(amount, 2)
            result["metadata"] = {"activity": activity, "amount": amount}

        return result

