"""
Carbon footprint calculation service
Based on reliable sources: IPCC, EPA, Our World in Data, GHG Protocol

References:
- International: IEA, EPA, Our World in Data, DEFRA, FAO, IRRI
- Bangladesh-Specific: BPDB, BRTA, Petrobangla, BIWTA, Local Market Surveys

For detailed references, see: EMISSION_FACTORS_REFERENCES.md
"""

from typing import Dict, Any


class CarbonCalculator:
    """Calculate carbon footprint for various activities"""

    # Emission factors (kg CO2 per unit)
    # Sources: IPCC, EPA, Our World in Data, GHG Protocol
    EMISSION_FACTORS = {
        "transport": {
            # Sources: IPCC 2024, EPA eGRID, DEFRA, Carbon Trust, Bangladesh-specific data
            "car": 0.171,  # Average car: 0.171 kg CO2/km (EPA)
            "car_small": 0.120,  # Small car: 0.120 kg CO2/km (EPA)
            "car_large": 0.250,  # Large car/SUV: 0.250 kg CO2/km (EPA)
            "plane": 0.255,  # Domestic flight: 0.255 kg CO2/km (DEFRA)
            "plane_international": 0.195,  # International flight: 0.195 kg CO2/km (ICAO)
            "electric_vehicle": 0.051,  # EV (grid avg): 0.051 kg CO2/km (EPA)
            "hybrid_car": 0.105,  # Hybrid car: 0.105 kg CO2/km (EPA)
            "motorcycle": 0.113,  # Motorcycle: 0.113 kg CO2/km (EPA)
            "scooter": 0.060,  # Scooter: 0.060 kg CO2/km (EPA)
            "bike": 0,  # Zero emissions
            "walking": 0,  # Zero emissions
            # Bangladesh-specific transport (BRTA, Petrobangla, BIWTA)
            "rickshaw": 0.015,  # Cycle rickshaw: 0.015 kg CO2/km (human-powered, minimal - Local Study)
            "auto_rickshaw": 0.080,  # Auto-rickshaw: 0.080 kg CO2/km (BRTA 2022, CNG-powered)
            "cng": 0.075,  # CNG vehicle: 0.075 kg CO2/km (Petrobangla 2023, BRTA 2022)
            "boat": 0.120,  # Local boat/launch: 0.120 kg CO2/km (BIWTA 2022, diesel-powered)
            "tuk_tuk": 0.085,  # Tuk-tuk: 0.085 kg CO2/km (BRTA 2022, similar to auto-rickshaw)
        },
        "diet": {
            # Sources: Our World in Data (2024), EPD database, Poore & Nemecek, Asian/Bangladesh food data
            # Meat and protein
            "beef": 60.0,  # Beef: 60 kg CO2/kg (Our World in Data)
            "mutton": 24.0,  # Mutton/Goat: 24 kg CO2/kg (Our World in Data)
            "pork": 7.0,  # Pork: 7 kg CO2/kg (Our World in Data)
            "chicken": 6.0,  # Chicken: 6 kg CO2/kg (Our World in Data)
            "duck": 5.5,  # Duck: 5.5 kg CO2/kg (Average)
            "fish": 5.0,  # Fish: 5 kg CO2/kg (Average)
            "seafood": 5.5,  # Seafood: 5.5 kg CO2/kg (Average)
            "prawn": 6.0,  # Prawn/Shrimp: 6 kg CO2/kg (Average)
            "eggs": 4.2,  # Eggs: 4.2 kg CO2/kg (Our World in Data)
            # Dairy
            "milk": 3.2,  # Milk: 3.2 kg CO2/kg (Our World in Data)
            "yogurt": 3.5,  # Yogurt/Dahi: 3.5 kg CO2/kg (Our World in Data)
            "cheese": 21.0,  # Cheese: 21 kg CO2/kg (Our World in Data)
            "butter": 12.0,  # Butter: 12 kg CO2/kg (Average)
            "ghee": 11.0,  # Ghee: 11 kg CO2/kg (Average)
            # Grains and staples (Asian/Bangladesh focus)
            "rice": 4.0,  # Rice: 4 kg CO2/kg (EDP) - Staple in Bangladesh
            "wheat": 1.4,  # Wheat: 1.4 kg CO2/kg (Our World in Data)
            "roti": 1.2,  # Roti/Chapati: 1.2 kg CO2/kg (processed wheat)
            "naan": 1.3,  # Naan: 1.3 kg CO2/kg (processed wheat)
            "bread": 1.0,  # Bread: 1 kg CO2/kg (Average)
            "pasta": 1.4,  # Pasta: 1.4 kg CO2/kg (Average)
            "noodles": 1.5,  # Noodles: 1.5 kg CO2/kg (Average)
            # Legumes and pulses (common in Bangladesh)
            "dal": 0.9,  # Dal/Lentils: 0.9 kg CO2/kg (Our World in Data)
            "lentils": 0.9,  # Lentils: 0.9 kg CO2/kg (Our World in Data)
            "chickpeas": 1.0,  # Chickpeas/Chana: 1.0 kg CO2/kg (Average)
            "beans": 2.0,  # Beans: 2 kg CO2/kg (Our World in Data)
            "black_gram": 0.9,  # Black gram/Mash dal: 0.9 kg CO2/kg (Average)
            "mung_bean": 0.8,  # Mung bean: 0.8 kg CO2/kg (Average)
            # Vegetables (common in Bangladesh)
            "vegetables": 0.4,  # Mixed vegetables: 0.4 kg CO2/kg (Average)
            "potatoes": 0.3,  # Potatoes: 0.3 kg CO2/kg (Our World in Data)
            "onion": 0.3,  # Onion: 0.3 kg CO2/kg (Average)
            "tomato": 0.4,  # Tomato: 0.4 kg CO2/kg (Average)
            "brinjal": 0.4,  # Brinjal/Eggplant: 0.4 kg CO2/kg (Average)
            "okra": 0.4,  # Okra/Ladyfinger: 0.4 kg CO2/kg (Average)
            "cauliflower": 0.4,  # Cauliflower: 0.4 kg CO2/kg (Average)
            "cabbage": 0.3,  # Cabbage: 0.3 kg CO2/kg (Average)
            "spinach": 0.3,  # Spinach/Palak: 0.3 kg CO2/kg (Average)
            "pumpkin": 0.3,  # Pumpkin: 0.3 kg CO2/kg (Average)
            # Fruits (common in Bangladesh)
            "fruits": 0.4,  # Mixed fruits: 0.4 kg CO2/kg (Average)
            "mango": 0.4,  # Mango: 0.4 kg CO2/kg (Average)
            "banana": 0.3,  # Banana: 0.3 kg CO2/kg (Average)
            "jackfruit": 0.4,  # Jackfruit: 0.4 kg CO2/kg (Average)
            "coconut": 0.4,  # Coconut: 0.4 kg CO2/kg (Average)
            "papaya": 0.3,  # Papaya: 0.3 kg CO2/kg (Average)
            "guava": 0.3,  # Guava: 0.3 kg CO2/kg (Average)
            # Bangladeshi dishes (calculated from ingredients + Our World in Data 2024)
            "biryani": 3.5,  # Biryani: 3.5 kg CO2/kg (rice + meat, calculated)
            "chicken_biryani": 3.5,  # Chicken Biryani: 3.5 kg CO2/kg (calculated - rice + chicken)
            "beef_biryani": 4.5,  # Beef Biryani: 4.5 kg CO2/kg (calculated - rice + beef)
            "mutton_biryani": 4.0,  # Mutton Biryani: 4.0 kg CO2/kg (calculated - rice + mutton)
            "kachchi_biryani": 4.0,  # Kachchi Biryani: 4.0 kg CO2/kg (calculated - traditional preparation)
            "polao": 2.5,  # Polao: 2.5 kg CO2/kg (calculated - rice-based, lower meat)
            "khichuri": 1.8,  # Khichuri: 1.8 kg CO2/kg (calculated - rice + dal, Local Recipe)
            "tehari": 3.0,  # Tehari: 3.0 kg CO2/kg (calculated - rice-based with meat)
            "haleem": 3.5,  # Haleem: 3.5 kg CO2/kg (calculated - meat + grains)
            # Curry dishes (calculated from ingredients)
            "curry": 2.5,  # Curry dish: 2.5 kg CO2/kg (calculated - average mixed)
            "chicken_curry": 2.5,  # Chicken Curry: 2.5 kg CO2/kg (calculated - chicken + spices)
            "beef_curry": 4.0,  # Beef Curry: 4.0 kg CO2/kg (calculated - beef + spices)
            "fish_curry": 1.8,  # Fish Curry: 1.8 kg CO2/kg (calculated - fish + spices)
            "dal_curry": 0.9,  # Dal Curry: 0.9 kg CO2/kg (calculated - dal + spices)
            "vegetable_curry": 0.6,  # Vegetable Curry: 0.6 kg CO2/kg (calculated - vegetables + spices)
            # Street food (Bangladesh - Local Vendor Data 2023, calculated)
            "fuchka": 0.3,  # Fuchka/Panipuri: 0.3 kg CO2/serving (calculated - flour + vegetables)
            "chotpoti": 0.4,  # Chotpoti: 0.4 kg CO2/serving (calculated - chickpeas + vegetables)
            "jhalmuri": 0.2,  # Jhalmuri: 0.2 kg CO2/serving (calculated - puffed rice, minimal processing)
            "shingara": 0.3,  # Shingara/Samosa: 0.3 kg CO2/piece (calculated - flour + vegetables + frying)
            "paratha": 0.8,  # Paratha: 0.8 kg CO2/piece (calculated - flour + oil + cooking)
            "halim": 1.5,  # Halim: 1.5 kg CO2/serving (calculated - meat + grains + long cooking)
            # Sweets/Mithai (calculated from milk + sugar + processing)
            "sweets": 2.0,  # Sweets/Mithai: 2.0 kg CO2/kg (calculated - processed)
            "rasgulla": 1.2,  # Rasgulla: 1.2 kg CO2/kg (calculated - milk + sugar)
            "gulab_jamun": 1.5,  # Gulab Jamun: 1.5 kg CO2/kg (calculated - milk powder + sugar + frying)
            "sandesh": 1.0,  # Sandesh: 1.0 kg CO2/kg (calculated - milk + sugar, minimal processing)
            "roshogolla": 1.2,  # Roshogolla: 1.2 kg CO2/kg (calculated - milk + sugar)
            "mishti_doi": 1.8,  # Mishti Doi: 1.8 kg CO2/kg (calculated - milk + sugar + fermentation)
            "snacks": 1.5,  # Snacks: 1.5 kg CO2/kg (processed)
            "tofu": 3.0,  # Tofu: 3.0 kg CO2/kg (Our World in Data)
            "nuts": 0.3,  # Nuts: 0.3 kg CO2/kg (Our World in Data)
        },
        "energy": {
            # Sources: EPA, IEA, BPDB (Bangladesh Power Development Board)
            "electricity_grid": 0.493,  # Global grid avg: 0.493 kg CO2/kWh (EPA 2023, IEA 2023)
            "electricity_bangladesh": 0.65,  # Bangladesh grid: 0.65 kg CO2/kWh (IEA 2023, BPDB 2023 - 70% fossil fuel dependency)
            "natural_gas": 2.07,  # Natural gas: 2.07 kg CO2/m3 (IEA)
            "heating_oil": 2.96,  # Heating oil: 2.96 kg CO2/liter (EPA)
            "coal": 3.12,  # Coal: 3.12 kg CO2/kWh (IPCC)
        },
        "shopping": {
            # Sources: Ecoinvent, Carbon Trust, averaged estimates
            # Only daily-life consumption items, no industrial production items
            # Clothing and accessories
            "clothing": 12.0,  # T-shirt: 12 kg CO2/item (average)
            "jeans": 33.4,  # Jeans: 33.4 kg CO2/item (Carbon Trust)
            "shoes": 13.6,  # Shoes: 13.6 kg CO2/item (average)
            "sari": 15.0,  # Sari: 15 kg CO2/item (average)
            "kurta": 8.0,  # Kurta: 8 kg CO2/item (average)
            "sandals": 5.0,  # Sandals: 5 kg CO2/item (average)
            # Daily consumables
            "books": 2.8,  # Book: 2.8 kg CO2/item (EEA)
            "toiletries": 1.2,  # Toiletries: 1.2 kg CO2/item (Average)
            "soap": 0.5,  # Soap: 0.5 kg CO2/item (Average)
            "shampoo": 0.8,  # Shampoo: 0.8 kg CO2/item (Average)
            "toothpaste": 0.3,  # Toothpaste: 0.3 kg CO2/item (Average)
            "detergent": 1.5,  # Detergent: 1.5 kg CO2/item (Average)
            # Packaging and bags
            "packaging": 2.0,  # Packaging materials: 2 kg CO2/kg (average)
            "plastic_bags": 0.05,  # Plastic bag: 0.05 kg CO2/item (EPA)
            "paper_bag": 0.02,  # Paper bag: 0.02 kg CO2/item (Average)
            "jute_bag": 0.03,  # Jute bag: 0.03 kg CO2/item (Average)
            # Food containers
            "takeaway_container": 0.1,  # Takeaway container: 0.1 kg CO2/item (Average)
            "water_bottle": 0.2,  # Plastic water bottle: 0.2 kg CO2/item (Average)
        },
        "lifestyle": {
            # Sources: IEA, Carbon Trust, scientific estimates, Bangladesh context
            # Digital activities
            "streaming_hour": 0.036,  # Video streaming: 0.036 kg CO2/hour (IEA 2023)
            "internet_gb": 0.014,  # Internet data: 0.014 kg CO2/GB (IEA)
            "email": 0.004,  # Email: 0.004 kg CO2/email (average)
            "phone_call": 0.001,  # Phone call: 0.001 kg CO2/min (average)
            "social_media": 0.002,  # Social media usage: 0.002 kg CO2/hour (average)
            # Home activities
            "laundry_load": 1.5,  # Washing machine: 1.5 kg CO2/load (average)
            "hand_wash_clothes": 0.1,  # Hand washing clothes: 0.1 kg CO2/load (minimal)
            "shower_10min": 2.0,  # Hot shower: 2 kg CO2/10min (average)
            "shower_cold": 0.1,  # Cold shower: 0.1 kg CO2/10min (minimal)
            "bath": 5.0,  # Bath: 5 kg CO2/bath (average)
            "bucket_bath": 0.5,  # Bucket bath: 0.5 kg CO2/bath (less water)
            "cooking_gas": 0.5,  # Cooking with gas: 0.5 kg CO2/hour (average)
            "cooking_electric": 0.3,  # Cooking with electricity: 0.3 kg CO2/hour (average)
            # Appliances (Bangladesh-specific: BPDB 2023, Local Market Survey 2023)
            # All use Bangladesh grid factor: 0.65 kg CO2/kWh (IEA 2023, BPDB 2023)
            "fan_hour": 0.033,  # Ceiling fan: 0.033 kg CO2/hour (0.05 kWh * 0.65, BPDB 2023, Local Market)
            "fan_energy_efficient": 0.020,  # Energy-efficient fan: 0.020 kg CO2/hour (0.03 kWh * 0.65, BPDB 2023)
            "ac_hour_1ton": 0.78,  # 1 ton AC: 0.78 kg CO2/hour (1.2 kWh * 0.65, BPDB 2023, Local HVAC)
            "ac_hour_1.5ton": 1.17,  # 1.5 ton AC: 1.17 kg CO2/hour (1.8 kWh * 0.65, BPDB 2023)
            "ac_hour_2ton": 1.56,  # 2 ton AC: 1.56 kg CO2/hour (2.4 kWh * 0.65, BPDB 2023)
            "ac_hour": 0.78,  # AC usage (average): 0.78 kg CO2/hour (1.2 kWh * 0.65, BPDB 2023)
            "refrigerator_small": 0.33,  # Small fridge (150L): 0.33 kg CO2/day (0.5 kWh * 0.65, BPDB 2023, Local Market)
            "refrigerator_medium": 0.52,  # Medium fridge (250L): 0.52 kg CO2/day (0.8 kWh * 0.65, BPDB 2023)
            "refrigerator_large": 0.78,  # Large fridge (350L+): 0.78 kg CO2/day (1.2 kWh * 0.65, BPDB 2023)
            "led_bulb_7w": 0.005,  # 7W LED bulb: 0.005 kg CO2/hour (0.007 kWh * 0.65, BPDB 2023, Local Market)
            "led_bulb_12w": 0.008,  # 12W LED bulb: 0.008 kg CO2/hour (0.012 kWh * 0.65, BPDB 2023)
            "cfl_bulb_15w": 0.010,  # 15W CFL bulb: 0.010 kg CO2/hour (0.015 kWh * 0.65, BPDB 2023)
            "light_bulb_hour": 0.008,  # Light bulb (average): 0.008 kg CO2/hour (BPDB 2023)
            "tv_led_32": 0.033,  # LED TV 32": 0.033 kg CO2/hour (0.05 kWh * 0.65, BPDB 2023, Local Market)
            "tv_led_42plus": 0.052,  # LED TV 42"+: 0.052 kg CO2/hour (0.08 kWh * 0.65, BPDB 2023)
            "tv_hour": 0.033,  # TV watching (average): 0.033 kg CO2/hour (BPDB 2023)
            "washing_machine_semi": 0.20,  # Semi-automatic: 0.20 kg CO2/load (0.3 kWh * 0.65, BPDB 2023, Local Market)
            "washing_machine_auto": 0.33,  # Fully automatic: 0.33 kg CO2/load (0.5 kWh * 0.65, BPDB 2023)
            "water_pump_submersible": 0.52,  # Submersible pump: 0.52 kg CO2/hour (0.8 kWh * 0.65, BPDB 2023, Local Building)
            "water_pump_surface": 0.39,  # Surface pump: 0.39 kg CO2/hour (0.6 kWh * 0.65, BPDB 2023)
            "electric_iron": 0.65,  # Electric iron: 0.65 kg CO2/hour (1.0 kWh * 0.65, BPDB 2023)
            "rice_cooker": 0.26,  # Rice cooker: 0.26 kg CO2/use (0.4 kWh * 0.65, BPDB 2023, very common in BD)
            "electric_kettle": 0.098,  # Electric kettle: 0.098 kg CO2/use (0.15 kWh * 0.65, BPDB 2023)
            "light_bulb_hour": 0.02,  # Light bulb: 0.02 kg CO2/hour (average)
            "tv_hour": 0.1,  # TV watching: 0.1 kg CO2/hour (average)
            # Daily activities
            "waste_kg": 0.5,  # Waste disposal: 0.5 kg CO2/kg (average)
            "newspaper": 0.3,  # Newspaper: 0.3 kg CO2/issue (EEA)
            "magazine": 0.8,  # Magazine: 0.8 kg CO2/issue (EEA)
            "event_attendee": 5.0,  # Event attendance: 5 kg CO2/person (average)
            "wedding_attendee": 10.0,  # Wedding attendance: 10 kg CO2/person (average)
            "restaurant_meal": 3.0,  # Restaurant meal: 3 kg CO2/meal (average)
            "takeaway_meal": 2.5,  # Takeaway meal: 2.5 kg CO2/meal (average)
            # Personal care
            "haircut": 0.5,  # Haircut: 0.5 kg CO2/service (average)
            "ironing": 0.2,  # Ironing clothes: 0.2 kg CO2/session (average)
            "cleaning": 0.3,  # House cleaning: 0.3 kg CO2/session (average)
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
        if mode in ["car", "auto_rickshaw", "cng", "tuk_tuk"] and passengers > 1:
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

