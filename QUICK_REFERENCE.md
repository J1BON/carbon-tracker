# Quick Reference: Carbon Suggestions Feature

## Files Created/Modified

### ✅ Backend Files

1. **NEW: `api/app/services/suggestion_service.py`**
   - Contains all suggestion rules and logic
   - 15 daily green tips
   - Rule-based suggestion database
   - Category analysis functionality

2. **MODIFIED: `api/app/routers/carbon.py`**
   - Added `SuggestionService` import
   - Modified `POST /api/v1/carbon/logs` to include suggestions
   - Added `GET /api/v1/carbon/suggestions` endpoint
   - Added `GET /api/v1/carbon/suggestions/daily-tip` endpoint

### ✅ Frontend Files

1. **NEW: `web/src/components/CarbonSuggestions.tsx`**
   - Eco-friendly UI component for displaying suggestions
   - Shows category analysis
   - Displays daily tips
   - Impact level indicators
   - Points display

2. **MODIFIED: `web/src/components/CarbonCalculator.tsx`**
   - Added `CarbonSuggestions` import
   - Added state for suggestions and daily tips
   - Extracts suggestions from API response
   - Displays suggestions below calculation result
   - Extended timeout to 8 seconds

## How to Test

1. **Start your backend**:
   ```bash
   cd api
   python -m uvicorn main:app --reload
   ```

2. **Start your frontend**:
   ```bash
   cd web
   npm run dev
   ```

3. **Test the feature**:
   - Go to Carbon Calculator
   - Submit a carbon calculation (e.g., Car, 50 km)
   - Verify suggestions appear below the result
   - Check that daily tip appears

## API Endpoints

### GET `/api/v1/carbon/suggestions`
Get personalized suggestions based on user's recent logs.

**Query Parameters**:
- `limit` (optional, default: 5): Number of suggestions
- `days` (optional, default: 30): Days to look back

**Response**:
```json
{
  "success": true,
  "data": {
    "suggestions": [...],
    "daily_tip": "...",
    "total_logs": 15,
    "days_analyzed": 30
  }
}
```

### GET `/api/v1/carbon/suggestions/daily-tip`
Get a random daily green tip.

**Response**:
```json
{
  "success": true,
  "data": {
    "tip": "🌱 Switch to LED bulbs..."
  }
}
```

### POST `/api/v1/carbon/logs` (Modified)
Now includes suggestions in the response.

**Response**:
```json
{
  "success": true,
  "data": {...},
  "points_awarded": 25,
  "user_stats": {...},
  "suggestions": {
    "title": "...",
    "description": "...",
    "suggestions": [...],
    "category_analysis": {...},
    "encouragement": "...",
    "daily_tip": "..."
  }
}
```

## Example Suggestions

### Transport (Car)
- Try carpooling (+20 pts)
- Use public transport (+25 pts)
- Cycle or walk for short trips (+15 pts)
- Consider electric vehicle (+30 pts)

### Diet (Beef)
- Try plant-based proteins (+25 pts)
- Have meat-free days (+20 pts)
- Choose chicken or fish instead (+15 pts)

### Energy (Electricity)
- Switch to LED bulbs (+20 pts)
- Turn off devices when not in use (+15 pts)
- Use energy-efficient appliances (+25 pts)
- Install smart thermostat (+20 pts)
- Use natural light during day (+10 pts)

## Customization

### Adding New Suggestions

Edit `api/app/services/suggestion_service.py`:

```python
SUGGESTION_RULES["transport"]["new_activity"] = {
    "title": "Your Title",
    "description": "Your description",
    "suggestions": [
        {
            "action": "Action name",
            "description": "Detailed description",
            "impact": "high",  # or "medium", "low"
            "icon": "🚗",
            "points": 20
        }
    ]
}
```

### Adding Daily Tips

Edit `api/app/services/suggestion_service.py`:

```python
DAILY_TIPS.append("Your new tip 🌱")
```

## UI Colors

The suggestions use an eco-friendly color scheme:
- **Green**: Primary color for eco-friendly themes
- **Teal/Cyan**: Daily tips
- **Red**: High impact suggestions
- **Yellow**: Medium impact suggestions
- **Green**: Low impact suggestions

## Points System

The suggestions show potential points users can earn for following each suggestion. These are informational values displayed to encourage users. Actual points are awarded when users log carbon activities, not when they follow suggestions.

To implement actual improvement points tracking:
1. Create a database model for completed suggestions
2. Add endpoint to mark suggestions as completed
3. Award bonus points when completed
4. Track user progress

## Troubleshooting

### Suggestions Not Appearing
- Check browser console for errors
- Verify API response includes suggestions
- Check backend logs for errors

### Generic Suggestions Only
- Verify activity type exists in `SUGGESTION_RULES`
- Check category and activity matching

### Daily Tips Not Loading
- Verify API endpoint is accessible
- Check `DAILY_TIPS` array has items

## Next Steps

1. Test the feature with different activities
2. Customize suggestions for your needs
3. Add more daily tips
4. Consider implementing suggestion completion tracking
5. Add suggestions to dashboard if desired

## Support

For detailed documentation, see `CARBON_SUGGESTIONS_IMPLEMENTATION.md`.

