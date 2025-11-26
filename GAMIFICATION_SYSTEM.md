# Gamification System Documentation

## Overview

This document explains how the points system, ranking system, and eco score work in the Carbon Tracker application.

---

## 1. Points System

### How Points Are Awarded

Points are awarded **automatically** when users log carbon activities. Points encourage engagement and consistent tracking.

### Points Calculation Formula

```
Total Points = Base Points + Size Bonus + Category Bonus
```

#### Base Points
- **10 points** for logging any activity (regardless of carbon amount)
- This encourages users to track their activities

#### Size Bonus
- **+2 points** if carbon amount > 2 kg
- **+5 points** if carbon amount > 5 kg
- This rewards users who log larger activities (encourages completeness)

#### Category Bonus
Different categories have different bonus values to encourage tracking diverse activities:

| Category | Bonus Points |
|----------|--------------|
| **Transport** | +15 points |
| **Diet** | +12 points |
| **Energy** | +10 points |
| **Shopping** | +8 points |
| **Lifestyle** | +5 points |
| **Other** | +3 points |

### Example Points Calculation

**Example 1: Car Travel (50 km)**
- Category: Transport
- Carbon: ~8.55 kg
- Calculation:
  - Base: 10 points
  - Size bonus: +5 points (carbon > 5 kg)
  - Category bonus: +15 points (transport)
  - **Total: 30 points**

**Example 2: Beef Consumption (0.5 kg)**
- Category: Diet
- Carbon: ~30 kg
- Calculation:
  - Base: 10 points
  - Size bonus: +5 points (carbon > 5 kg)
  - Category bonus: +12 points (diet)
  - **Total: 27 points**

**Example 3: Small Activity (0.1 kg)**
- Category: Lifestyle
- Carbon: 0.1 kg
- Calculation:
  - Base: 10 points
  - Size bonus: 0 points (carbon ≤ 2 kg)
  - Category bonus: +5 points (lifestyle)
  - **Total: 15 points**

### Code Location
- **File**: `api/app/services/gamification.py`
- **Method**: `award_points_for_log(carbon_amount_kg, category)`

---

## 2. Level System

### How Levels Work

Levels are calculated based on total points accumulated. Each level requires 100 points.

### Level Calculation Formula

```
Level = (Total Points ÷ 100) + 1
```

### Level Examples

| Total Points | Level |
|--------------|-------|
| 0-99 | Level 1 |
| 100-199 | Level 2 |
| 200-299 | Level 3 |
| 300-399 | Level 4 |
| 500-599 | Level 6 |
| 1000+ | Level 11 |

### Level Progression

- **Level 1**: New user (0-99 points)
- **Level 5**: Active user (400-499 points)
- **Level 10**: Dedicated tracker (900-999 points)
- **Level 20**: Carbon tracking expert (1900-1999 points)

### Code Location
- **File**: `api/app/services/gamification.py`
- **Method**: `calculate_level(total_points)`

---

## 3. Eco Score System

### What is Eco Score?

Eco Score is a **0-100 rating** that measures how environmentally friendly a user's carbon footprint is. **Higher is better.**

### How Eco Score is Calculated

The eco score is based on **average daily carbon footprint** (lower carbon = higher score).

#### Step 1: Calculate Daily Average
```
Daily Average = Total Carbon Emissions ÷ Number of Active Days
```

#### Step 2: Base Score Assignment
Based on daily average carbon footprint:

| Daily Average (kg CO₂/day) | Base Score | Rating |
|----------------------------|------------|--------|
| ≤ 10 kg | 95 points | Excellent |
| ≤ 20 kg | 85 points | Very Good |
| ≤ 30 kg | 75 points | Good |
| ≤ 40 kg | 65 points | Average |
| ≤ 50 kg | 50 points | Below Average |
| > 50 kg | 40 points | Needs Improvement |

**Reference**: Average person emits ~40 kg CO₂/day

#### Step 3: Consistency Bonus
- **+5 points** if user tracked activities every day for the last 7 days
- Encourages consistent tracking behavior

#### Step 4: Final Score
```
Final Score = min(Base Score + Consistency Bonus, 100)
```
- Score is capped at 100

### Eco Score Examples

**Example 1: Low Carbon User**
- Total carbon: 50 kg
- Active days: 10 days
- Daily average: 5 kg/day
- Base score: 95 points
- Consistency bonus: +5 points (tracked 7+ days)
- **Final Eco Score: 100**

**Example 2: Average User**
- Total carbon: 800 kg
- Active days: 20 days
- Daily average: 40 kg/day
- Base score: 65 points
- Consistency bonus: 0 points (didn't track 7 consecutive days)
- **Final Eco Score: 65**

**Example 3: High Carbon User**
- Total carbon: 1500 kg
- Active days: 25 days
- Daily average: 60 kg/day
- Base score: 40 points
- Consistency bonus: 0 points
- **Final Eco Score: 40**

### Code Location
- **File**: `api/app/services/gamification.py`
- **Method**: `calculate_eco_score(user, db)`

---

## 4. Leaderboard Ranking System

### How Rankings Work

The leaderboard ranks users based on two criteria (in order of priority):

1. **Primary Sort**: `total_points` (descending - highest first)
2. **Secondary Sort**: `eco_score` (descending - highest first)

### Ranking Algorithm

```python
Users sorted by:
1. total_points DESC
2. eco_score DESC (if total_points are equal)
```

### Ranking Examples

**Example Leaderboard:**

| Rank | User | Total Points | Eco Score | Why They Rank Here |
|------|------|--------------|-----------|-------------------|
| 1 | Alice | 500 | 85 | Highest points |
| 2 | Bob | 450 | 90 | Second highest points |
| 3 | Charlie | 450 | 75 | Same points as Bob, but lower eco score |
| 4 | David | 400 | 95 | Lower points but very high eco score |
| 5 | Eve | 400 | 70 | Lower points, lower eco score than David |

### Key Points

- **Points are primary**: Users with more points rank higher
- **Eco score is tiebreaker**: If two users have the same points, higher eco score wins
- **Balance matters**: Users need both points AND good eco scores to rank well

### Code Location
- **File**: `api/app/routers/gamification.py`
- **Endpoint**: `GET /api/v1/gamification/leaderboard`

---

## 5. System Flow

### When User Logs Carbon Activity

1. **User submits carbon data** → Backend calculates carbon amount
2. **Points calculated** → Using `award_points_for_log()`
3. **Points added** → Added to `user.total_points`
4. **Level updated** → Calculated from new total points
5. **Eco score updated** → Recalculated based on all carbon logs
6. **Stats returned** → Frontend displays updated stats

### Real-Time Updates

- Points update immediately after logging
- Level updates automatically
- Eco score recalculates based on all user's carbon logs
- Leaderboard updates when stats change

---

## 6. Database Schema

### User Table Fields

```sql
users
  - id (UUID)
  - email
  - name
  - eco_score (Float, 0-100)
  - level (Integer, starts at 1)
  - total_points (Integer, starts at 0)
```

### Updates

- `total_points`: Incremented every time user logs activity
- `level`: Recalculated every time points change
- `eco_score`: Recalculated every time user logs activity (based on all logs)

---

## 7. Summary Table

| Metric | Range | Higher is Better? | How to Improve |
|--------|-------|-------------------|----------------|
| **Points** | 0+ | ✅ Yes | Log more activities, log larger activities, track diverse categories |
| **Level** | 1+ | ✅ Yes | Earn more points (100 points = 1 level) |
| **Eco Score** | 0-100 | ✅ Yes | Reduce daily carbon footprint, track consistently |
| **Rank** | 1+ | ✅ Yes | Increase points AND eco score |

---

## 8. Strategy Tips

### To Maximize Points:
- ✅ Log activities frequently
- ✅ Log larger activities (>5 kg)
- ✅ Track diverse categories (transport, diet, energy, etc.)
- ✅ Focus on transport category (highest bonus: +15 points)

### To Maximize Eco Score:
- ✅ Reduce daily carbon footprint
- ✅ Track activities consistently (7+ days)
- ✅ Log smaller activities (but still log them!)
- ✅ Use eco-friendly alternatives (public transport, plant-based meals, etc.)

### To Rank Higher on Leaderboard:
- ✅ Balance both points and eco score
- ✅ Log frequently for points
- ✅ Make eco-friendly choices for better eco score
- ✅ Track consistently for consistency bonus

---

## 9. Future Enhancements

Potential improvements:
- **Badge System**: Award badges for milestones (1000 points, eco score 90+, etc.)
- **Challenges**: Time-limited challenges with bonus points
- **Achievement Unlocks**: Unlock features at certain levels
- **Streak Bonuses**: Extra points for consecutive days of tracking
- **Category Mastery**: Bonus points for tracking all categories
- **Eco Score Rewards**: Bonus points for improving eco score

---

## 10. Code References

### Backend Files
- `api/app/services/gamification.py` - Core gamification logic
- `api/app/routers/gamification.py` - Leaderboard endpoint
- `api/app/routers/carbon.py` - Points awarded when logging carbon

### Frontend Files
- `web/src/features/leaderboard/Leaderboard.tsx` - Leaderboard display
- `web/src/components/CarbonCalculator.tsx` - Points display after logging

---

## Questions?

If you need to modify the system:
- **Points formula**: Edit `award_points_for_log()` in `gamification.py`
- **Eco score tiers**: Edit `calculate_eco_score()` in `gamification.py`
- **Level calculation**: Edit `calculate_level()` in `gamification.py`
- **Ranking logic**: Edit `get_leaderboard()` in `gamification.py`

