"""
CFC (Chlorofluorocarbon) Impact Calculator
Calculates CFC emissions and their environmental impact
Based on EPA, UNEP, and Montreal Protocol data
"""

from typing import Dict, Any


class CFCCalculator:
    """Calculate CFC impact for various devices and activities"""

    # CFC emission factors (kg CO2 equivalent per unit)
    # Sources: EPA, UNEP, IPCC, Montreal Protocol data
    # Note: CFCs have very high Global Warming Potential (GWP)
    # CFC-12 has GWP of 10,900 (1 kg CFC-12 = 10,900 kg CO2 equivalent)
    
    # Device-specific CFC content (typical amounts in kg)
    DEVICE_CFC_CONTENT = {
        "AC": 1.5,  # Average AC: 1.5 kg refrigerant
        "Refrigerator": 0.2,  # Average refrigerator: 0.2 kg refrigerant
        "Freezer": 0.3,  # Standalone freezer: 0.3 kg refrigerant
        "Dehumidifier": 0.15,  # Dehumidifier: 0.15 kg refrigerant
        "Car AC": 0.6,  # Car AC: 0.6 kg refrigerant
        "Water Cooler": 0.25,  # Water cooler: 0.25 kg refrigerant
        "Ice Maker": 0.3,  # Ice maker: 0.3 kg refrigerant
        "Heat Pump": 2.0,  # Heat pump: 2.0 kg refrigerant
        "Chiller": 10.0,  # Commercial chiller: 10.0 kg refrigerant
        "Walk-in Cooler": 5.0,  # Walk-in cooler: 5.0 kg refrigerant
        "Commercial Refrigeration": 8.0,  # Commercial refrigeration: 8.0 kg refrigerant
        "Window AC": 1.0,  # Window AC: 1.0 kg refrigerant
        "Split AC": 1.5,  # Split AC: 1.5 kg refrigerant
        "Central AC": 3.0,  # Central AC: 3.0 kg refrigerant
        "Car Refrigerator": 0.1,  # Portable car refrigerator: 0.1 kg refrigerant
    }

    # Refrigerant type GWP (Global Warming Potential - CO2 equivalent)
    # GWP values from IPCC AR6 (2021)
    REFRIGERANT_GWP = {
        "CFC-12": 10900,  # CFC-12 (R-12): GWP = 10,900
        "CFC-11": 4660,   # CFC-11 (R-11): GWP = 4,660
        "HCFC-22": 1810,  # HCFC-22 (R-22): GWP = 1,810 (being phased out)
        "HCFC-141b": 725, # HCFC-141b: GWP = 725
        "HFC-134a": 1300, # HFC-134a (R-134a): GWP = 1,300 (CFC alternative)
        "R-410A": 2088,   # R-410A: GWP = 2,088
        "R-404A": 3922,   # R-404A: GWP = 3,922
        "Unknown": 5000,  # Unknown/older refrigerant: average estimate
    }

    # Issue type multipliers (how much CFC is released)
    ISSUE_MULTIPLIERS = {
        "Gas leak": 0.5,  # 50% of refrigerant leaks out
        "Disposal": 0.8,  # 80% released if improperly disposed
        "Servicing": 0.1,  # 10% released during servicing
        "Replacement": 0.7,  # 70% released if old device not properly recovered
        "Improper disposal": 0.9,  # 90% released with improper disposal
        "Recycling": 0.1,  # 10% released (proper recycling minimizes loss)
        "Maintenance check": 0.05,  # 5% released during check
        "Refrigerant recharge": 0.2,  # 20% released during recharge
        "System upgrade": 0.3,  # 30% released during upgrade
    }

    @staticmethod
    def calculate_cfc_impact(
        device: str,
        issue_type: str,
        refrigerant_type: str = "Unknown",
        refrigerant_amount_kg: float = None,
        device_age_years: int = None,
    ) -> Dict[str, Any]:
        """
        Calculate CFC impact based on device, issue type, and refrigerant
        
        Args:
            device: Device type (AC, Refrigerator, etc.)
            issue_type: Type of issue (Gas leak, Disposal, etc.)
            refrigerant_type: Type of refrigerant (CFC-12, HCFC-22, etc.)
            refrigerant_amount_kg: Amount of refrigerant in kg (optional)
            device_age_years: Age of device in years (optional)
        
        Returns:
            Dictionary with CFC impact calculations
        """
        # Get default refrigerant amount for device
        if refrigerant_amount_kg is None:
            refrigerant_amount_kg = CFCCalculator.DEVICE_CFC_CONTENT.get(device, 1.0)
        
        # Get GWP for refrigerant type
        gwp = CFCCalculator.REFRIGERANT_GWP.get(refrigerant_type, 5000)
        
        # Get release multiplier for issue type
        release_multiplier = CFCCalculator.ISSUE_MULTIPLIERS.get(issue_type, 0.5)
        
        # Calculate released CFC amount
        cfc_released_kg = refrigerant_amount_kg * release_multiplier
        
        # Calculate CO2 equivalent (CFC GWP is very high)
        co2_equivalent_kg = cfc_released_kg * gwp
        
        # Calculate ozone depletion potential (ODP)
        # CFC-12 has ODP of 1.0 (reference), others vary
        odp_values = {
            "CFC-12": 1.0,
            "CFC-11": 1.0,
            "HCFC-22": 0.055,
            "HCFC-141b": 0.11,
            "HFC-134a": 0.0,  # HFCs don't deplete ozone
            "R-410A": 0.0,
            "R-404A": 0.0,
            "Unknown": 0.5,  # Average estimate
        }
        odp = odp_values.get(refrigerant_type, 0.5)
        ozone_depletion = cfc_released_kg * odp
        
        # Age factor (older devices more likely to have CFCs)
        if device_age_years is None:
            # Estimate age based on device type
            age_factor = 1.0
        else:
            if device_age_years > 20:
                age_factor = 1.2  # Very old, likely CFC
            elif device_age_years > 15:
                age_factor = 1.1  # Old, possibly CFC
            elif device_age_years > 10:
                age_factor = 1.0  # Medium age
            else:
                age_factor = 0.8  # Newer, less likely CFC
        
        # Apply age factor to CO2 equivalent
        co2_equivalent_kg = co2_equivalent_kg * age_factor
        
        # Calculate impact equivalents
        # 1 kg CFC-12 = 10,900 kg CO2 equivalent
        # Average car emits ~0.171 kg CO2/km
        car_km_equivalent = co2_equivalent_kg / 0.171
        
        # Trees needed to offset (1 tree absorbs ~22 kg CO2/year)
        trees_needed = co2_equivalent_kg / 22.0
        
        # Years of average person's emissions (4.5 kg CO2/day)
        person_days_equivalent = co2_equivalent_kg / 4.5
        
        return {
            "device": device,
            "issue_type": issue_type,
            "refrigerant_type": refrigerant_type,
            "refrigerant_amount_kg": round(refrigerant_amount_kg, 2),
            "cfc_released_kg": round(cfc_released_kg, 3),
            "gwp": gwp,
            "co2_equivalent_kg": round(co2_equivalent_kg, 2),
            "ozone_depletion": round(ozone_depletion, 3),
            "device_age_years": device_age_years,
            "age_factor": round(age_factor, 2),
            "equivalents": {
                "car_km": round(car_km_equivalent, 2),
                "trees_needed": round(trees_needed, 1),
                "person_days": round(person_days_equivalent, 1),
            },
            "impact_level": CFCCalculator._get_impact_level(co2_equivalent_kg),
        }
    
    @staticmethod
    def _get_impact_level(co2_equivalent_kg: float) -> str:
        """Determine impact level based on CO2 equivalent"""
        if co2_equivalent_kg >= 10000:
            return "Extreme"
        elif co2_equivalent_kg >= 5000:
            return "Very High"
        elif co2_equivalent_kg >= 1000:
            return "High"
        elif co2_equivalent_kg >= 500:
            return "Medium"
        elif co2_equivalent_kg >= 100:
            return "Low"
        else:
            return "Minimal"
    
    @staticmethod
    def get_refrigerant_types() -> list:
        """Get list of available refrigerant types"""
        return list(CFCCalculator.REFRIGERANT_GWP.keys())
    
    @staticmethod
    def get_device_defaults(device: str) -> Dict[str, Any]:
        """Get default values for a device"""
        return {
            "refrigerant_amount_kg": CFCCalculator.DEVICE_CFC_CONTENT.get(device, 1.0),
            "typical_refrigerant": "CFC-12" if device in ["AC", "Refrigerator", "Freezer"] else "Unknown",
        }

