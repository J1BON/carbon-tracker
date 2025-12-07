# 🧮 CFC Calculator - Feature Added

## Overview

A comprehensive CFC Impact Calculator has been added to the CFC section, similar to the main Carbon Calculator. This allows users to calculate the environmental impact of CFC emissions from their devices.

---

## ✨ What Was Added

### Backend Components

1. **CFC Calculator Service** (`api/app/services/cfc_calculator.py`)
   - Calculates CFC emissions and CO2 equivalent
   - Supports 15 device types
   - Supports 9 issue types
   - Includes GWP (Global Warming Potential) calculations
   - Ozone Depletion Potential (ODP) calculations
   - Impact equivalents (car km, trees needed, person days)

2. **New API Endpoints** (`api/app/routers/cfc.py`)
   - `POST /api/v1/cfc/calculate` - Calculate CFC impact
   - `GET /api/v1/cfc/refrigerant-types` - Get available refrigerant types
   - `GET /api/v1/cfc/device-defaults/{device}` - Get default values for device

### Frontend Components

1. **CFC Calculator Component** (`web/src/features/cfc/CFCCalculator.tsx`)
   - Interactive calculator interface
   - Device selection with icons
   - Issue type selection with color coding
   - Advanced options (refrigerant type, amount, device age)
   - Detailed results display with impact equivalents
   - Impact level indicators

2. **Integration**
   - Added route: `/cfc/calculator`
   - Links added to:
     - Learn About CFC page
     - My CFC Reports page
     - CFC Report Form page

---

## 🧮 How It Works

### Calculation Formula

```
CFC Impact = Refrigerant Amount × Release Multiplier × GWP × Age Factor
```

**Components:**
- **Refrigerant Amount**: Default values per device type (e.g., AC = 1.5 kg)
- **Release Multiplier**: Based on issue type (Gas leak = 50%, Disposal = 80%, etc.)
- **GWP**: Global Warming Potential (CFC-12 = 10,900, HCFC-22 = 1,810, etc.)
- **Age Factor**: Older devices more likely to contain CFCs

### Example Calculation

**Scenario**: Old AC (20 years) with gas leak
- Device: AC
- Refrigerant: CFC-12 (GWP = 10,900)
- Amount: 1.5 kg
- Issue: Gas leak (50% release)
- Age: 20 years (1.2x factor)

**Calculation:**
- CFC Released: 1.5 kg × 0.5 = 0.75 kg
- CO2 Equivalent: 0.75 kg × 10,900 × 1.2 = **9,810 kg CO2**
- Impact: **Very High**

---

## 📊 Features

### Device Support
- All 15 CFC-containing devices
- Default refrigerant amounts per device
- Age-based adjustments

### Issue Type Support
- All 9 issue types
- Different release multipliers
- Color-coded impact levels

### Refrigerant Types
- CFC-12 (GWP: 10,900)
- CFC-11 (GWP: 4,660)
- HCFC-22 (GWP: 1,810)
- HCFC-141b (GWP: 725)
- HFC-134a (GWP: 1,300)
- R-410A (GWP: 2,088)
- R-404A (GWP: 3,922)
- Unknown (GWP: 5,000 - average)

### Results Display
- **CO2 Equivalent**: Total warming potential
- **CFC Released**: Actual CFC amount released
- **Ozone Depletion**: ODP value
- **Impact Level**: Extreme, Very High, High, Medium, Low, Minimal
- **Equivalents**:
  - Car driving distance
  - Trees needed to offset
  - Person days equivalent

---

## 🎯 Use Cases

### 1. Before Reporting
Users can calculate impact before submitting a report to understand the severity.

### 2. Educational Tool
Helps users understand the massive environmental impact of CFCs.

### 3. Decision Making
Assists in deciding whether to repair, replace, or properly dispose of devices.

### 4. Awareness
Shows real-world equivalents (e.g., "This equals driving 50,000 km!")

---

## 🔗 Navigation

### Access Points
1. **Direct URL**: `/cfc/calculator`
2. **From Learn About CFC**: "Calculate CFC Impact" button
3. **From My Reports**: "Calculator" button
4. **From Report Form**: "Calculate Impact" button

---

## 📈 Impact Levels

| Level | CO2 Equivalent | Description |
|-------|---------------|-------------|
| **Extreme** | ≥ 10,000 kg | Critical impact, immediate action needed |
| **Very High** | 5,000 - 9,999 kg | Very serious impact |
| **High** | 1,000 - 4,999 kg | Significant impact |
| **Medium** | 500 - 999 kg | Moderate impact |
| **Low** | 100 - 499 kg | Low impact |
| **Minimal** | < 100 kg | Minimal impact |

---

## 🎨 UI Features

- **Responsive Grid Layout**: Easy device/issue selection
- **Color Coding**: Visual impact indicators
- **Icons**: Intuitive device representation
- **Real-time Calculation**: Instant results
- **Detailed Breakdown**: Comprehensive impact analysis
- **Educational Info**: GWP explanations and warnings

---

## 🔬 Scientific Basis

### Data Sources
- **IPCC AR6 (2021)**: GWP values
- **EPA**: Refrigerant data and emission factors
- **UNEP**: Ozone depletion data
- **Montreal Protocol**: Phase-out schedules

### Accuracy
- Uses peer-reviewed GWP values
- Based on actual refrigerant properties
- Conservative estimates for safety
- Age factors based on production timelines

---

## 🚀 Future Enhancements

Potential additions:
1. **Save Calculations**: Store calculation history
2. **Compare Scenarios**: Compare different options
3. **Recommendations**: Suggest best actions based on impact
4. **Visual Charts**: Graphical representation of impact
5. **Export Results**: PDF/CSV export
6. **Share Results**: Social sharing capabilities
7. **Historical Data**: Track impact over time

---

## ✅ Testing Checklist

- [x] Backend calculator service created
- [x] API endpoints implemented
- [x] Frontend component created
- [x] Route added to App.tsx
- [x] Links added to CFC pages
- [x] Icons and styling implemented
- [x] Error handling added
- [x] Loading states implemented
- [x] Responsive design
- [x] No linting errors

---

## 📝 Example Results

**Scenario**: Old Refrigerator (15 years) with improper disposal
```
Device: Refrigerator
Issue: Improper disposal
Refrigerant: CFC-12
Amount: 0.2 kg

Results:
- CFC Released: 0.18 kg
- CO2 Equivalent: 1,962 kg
- Impact Level: High
- Equivalents:
  - Car Driving: 11,474 km
  - Trees Needed: 89 trees
  - Person Days: 436 days
```

---

## 🎉 Summary

The CFC Calculator adds a powerful tool to help users:
- ✅ Understand CFC impact before reporting
- ✅ Make informed decisions about device handling
- ✅ See real-world equivalents of CFC emissions
- ✅ Learn about GWP and environmental impact
- ✅ Calculate impact for any device/issue combination

**The calculator is now fully integrated and ready to use!** 🌱

---

*Last Updated: January 2025*

