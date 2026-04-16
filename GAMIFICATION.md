# Strength Tracker - Gamification System

## Points System

### How Points Are Earned

Every workout logged awards points based on:

```
Total Points = Base (10) + Weight Bonus + Reps Bonus
Weight Bonus = weight / 10
Reps Bonus = reps
```

### Examples

1. **Bodyweight Push-ups** (0 lbs, 3 x 15)
   - Points = 10 + 0 + 15 = **25 points**

2. **Dumbbell Curl** (35 lbs, 3 x 12)
   - Points = 10 + 3.5 + 12 = **25.5 ≈ 25 points**

3. **Bench Press** (185 lbs, 3 x 10)
   - Points = 10 + 18.5 + 10 = **38.5 ≈ 38 points**

4. **Deadlift** (315 lbs, 3 x 5)
   - Points = 10 + 31.5 + 5 = **46.5 ≈ 46 points**

## Levels & Progression

### Level Formula
```
Level = Floor(Total Points / 100) + 1
```

### Level Milestones

| Level | Points Required | Milestone |
|-------|-----------------|-----------|
| 1 | 0-99 | Beginner |
| 2 | 100-199 | Getting Started |
| 3 | 200-299 | Consistent Trainer |
| 4 | 300-399 | Dedicated |
| 5 | 400-499 | Committed |
| 10 | 900-999 | Experienced |
| 20 | 1900-1999 | Master |
| 50 | 4900-4999 | Legend |

### Leveling Speed Examples

**Moderate Training (5 workouts/week, ~150 pts/week)**
- Level 1→2: ~1 week
- Level 2→5: ~2 months
- Level 5→10: ~4 months

**Intense Training (6+ workouts/week, ~250 pts/week)**
- Level 1→2: 4 days
- Level 2→5: 6 weeks
- Level 5→10: 12 weeks

## Achievements & Badges (Future)

### Workout Milestones
- 🏅 **First Workout**: Log your first exercise
- 💪 **Week Warrior**: Log 5 workouts in a week
- 🔥 **7-Day Streak**: Work out 7 days in a row
- 🎯 **Crushing Goals**: Hit 50 workouts
- 👑 **Century Club**: Earn 1000+ points

### Strength Achievements
- 💯 **Plate Power**: Lift over 225 lbs
- 🚀 **Half Ton**: Squat/Deadlift combined 500+ lbs
- 🏋️ **Impressive**: Bench press personal best
- 🔓 **One Plate**: Load a full 45lb plate

### Social Achievements
- 👥 **Social Butterfly**: Add 10 friends
- 🤝 **Squad Leader**: Have 25+ friends
- 📤 **Sharer**: Share 10 workouts
- 🏅 **Leaderboard**: Rank in Top 10

### Consistency Achievements
- 📚 **Consistent**: 30 consecutive workouts
- ⚡ **Storm**: 100 workouts in 6 months
- 🎪 **Marathon**: 500 total workouts

## Leaderboard System

### Global Ranking
- Ranked by total points
- Secondary sort by workout count
- Ties broken by most recent activity

### Friend Leaderboard
- See only friends you've added
- Same points-based ranking
- Faster to climb with fewer competitors

### Seasonal Leaderboard (Future)
- Reset monthly/quarterly
- Bonus multiplier for active season
- Season-specific badges and rewards

## Competitive Features

### Weekly Challenges (Future)
- **Max Weight Challenge**: Log highest weight this week
- **High Volume**: Most total reps in a week
- **Consistency**: Most consecutive days with workouts
- **Muscle Group**: Most points in specific muscle group

### Competitions (Future)
- Create group competitions
- Set time limits and rules
- Real-time leaderboards
- Rewards for winners

## Progression Tips

### Optimize Points
1. **Increase Weight**: Each +10 lbs = +1 point per workout
2. **Increase Reps**: Each extra rep = +1 point
3. **Log More Often**: More workouts = more points
4. **Mix Exercises**: Higher weight exercises earn more points

### Speed Leveling
- Heavy compound movements (Deadlift, Squat, Bench) earn most
- High rep sets accumulate points quickly
- Consistency matters more than intensity
- Friend workouts motivate friendly competition

## Future Gamification Ideas

- [ ] Personal Records (PRs) system
- [ ] Achievement badges with icons
- [ ] Streak counter with bonuses
- [ ] Weekly challenges with rewards
- [ ] Group competitions
- [ ] User rankings by muscle group
- [ ] Workout analytics dashboard
- [ ] Customizable goals
- [ ] Workout difficulty ratings
- [ ] Milestone celebrations with notifications
