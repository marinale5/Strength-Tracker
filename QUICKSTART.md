# 💪 Strength Tracker - Complete Setup Guide

## What's Been Built

You now have a **complete, production-ready full-stack application** with:

### Backend (Node.js/Express)
✅ REST API with authentication (OAuth + JWT)
✅ PostgreSQL database with optimized schema
✅ User management with social features
✅ Workout logging with points calculation
✅ Friend system with requests
✅ Leaderboard rankings
✅ Middleware for authentication and error handling

### Frontend (React Native/Expo)
✅ 5 main screens: Log Workout, My Workouts, Leaderboard, Friends, Profile
✅ OAuth login flow (Google, GitHub)
✅ Bottom tab navigation
✅ Real-time API integration
✅ Secure token storage
✅ Beautiful, user-friendly UI with emojis

### Documentation
✅ README with full setup instructions
✅ API documentation (API_DOCS.md)
✅ Development guide (DEVELOPMENT.md)
✅ Gamification system details (GAMIFICATION.md)

---

## Quick Start 🚀

### Prerequisites
```bash
# Install Node.js 16+ and PostgreSQL 12+
# macOS:
brew install node postgresql

# Ubuntu/Linux:
sudo apt-get install nodejs postgresql
```

### 1. Setup Backend
```bash
cd backend
npm install

# Configure database
createdb strength_tracker
psql strength_tracker < src/migrations/init.sql
psql strength_tracker < src/migrations/seedExercises.sql

# Create .env file
cp .env.example .env
# Edit .env with your database credentials and OAuth keys
```

### 2. Setup Frontend
```bash
cd frontend
npm install

# Create .env file
echo "EXPO_PUBLIC_API_URL=http://localhost:5000" > .env
```

### 3. Start Development

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
# Server runs on http://localhost:5000
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
# Press 'i' for iOS or 'a' for Android
```

---

## File Structure

```
Strength-Tracker/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── database.js
│   │   │   └── passport.js          # OAuth config
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── workoutController.js
│   │   │   └── friendController.js
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   ├── Workout.js
│   │   │   └── Friend.js
│   │   ├── routes/
│   │   │   ├── auth.js
│   │   │   ├── workouts.js
│   │   │   └── friends.js
│   │   ├── middleware/
│   │   │   └── auth.js              # JWT validation
│   │   ├── migrations/
│   │   │   ├── init.sql             # Database schema
│   │   │   └── seedExercises.sql    # Seed data
│   │   └── server.js                # Express app
│   ├── .env.example
│   ├── package.json
│   └── README.md
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   └── client.js            # Axios setup
│   │   ├── screens/
│   │   │   ├── LogWorkoutScreen.js
│   │   │   ├── WorkoutsScreen.js
│   │   │   ├── LeaderboardScreen.js
│   │   │   ├── FriendsScreen.js
│   │   │   └── ProfileScreen.js
│   │   ├── navigation/
│   │   │   ├── AuthNavigator.js     # Login screen
│   │   │   └── AppNavigator.js      # Main app navigation
│   │   └── App.js                   # Root component
│   ├── app.json                     # Expo config
│   ├── package.json
│   └── README.md
│
├── package.json                     # Root workspace config
├── README.md
├── DEVELOPMENT.md                   # Dev guide
├── API_DOCS.md                      # API reference
├── GAMIFICATION.md                  # Points system
└── .gitignore
```

---

## Key Features

### 🏋️ Workout Logging
- Track exercise name, muscle group, equipment, weight, sets, reps
- Automatically calculate points earned
- Add notes for each workout
- Share workouts with friends

### 🎮 Gamification
- **Points System**: Base 10 + weight bonus + reps bonus
- **Leveling**: Level = Floor(Points / 100) + 1
- **Leaderboard**: Global rankings by total points
- **Friend Competition**: See how you stack up against friends

### 👥 Social Features
- Add friends with send/accept/reject flow
- View friend workouts in a feed
- Share your best workouts
- Friend-based leaderboards

### 🔐 Security
- OAuth authentication (Google, GitHub)
- JWT token-based sessions
- Secure token storage on mobile
- Protected API endpoints

### 📊 Data-Driven
- Persistent PostgreSQL database
- Workout history tracking
- User statistics and analytics
- Optimized database queries with indexes

---

## API Endpoints

### Authentication
- `GET /auth/google` - Google OAuth
- `GET /auth/github` - GitHub OAuth
- `GET /auth/me` - Get current user
- `POST /auth/logout` - Logout

### Workouts
- `POST /workouts` - Log workout
- `GET /workouts/my-workouts` - Get user workouts
- `GET /workouts/recent` - Get recent feed
- `POST /workouts/share` - Share workout
- `DELETE /workouts/:id` - Delete workout

### Friends & Leaderboard
- `POST /friends/request` - Send friend request
- `POST /friends/accept` - Accept request
- `GET /friends` - Get friends list
- `GET /friends/workouts` - Get friends' workouts
- `GET /friends/leaderboard` - Get global leaderboard

See [API_DOCS.md](API_DOCS.md) for full documentation.

---

## OAuth Setup

### Google
1. Visit https://console.cloud.google.com/
2. Create project → Enable Google+ API
3. Create OAuth 2.0 credentials (Mobile app)
4. Add to backend/.env:
   ```
   GOOGLE_CLIENT_ID=...
   GOOGLE_CLIENT_SECRET=...
   ```

### GitHub
1. Visit https://github.com/settings/developers
2. Create new OAuth App
3. Set callback to `http://localhost:5000/auth/github/callback`
4. Add to backend/.env:
   ```
   GITHUB_CLIENT_ID=...
   GITHUB_CLIENT_SECRET=...
   ```

---

## Points System

Points earned per workout:
```
Points = 10 (base) + (weight / 10) + reps
```

Examples:
- **Bench Press** (185 lbs, 3x10): 10 + 18.5 + 10 = **38 pts**
- **Deadlift** (315 lbs, 3x5): 10 + 31.5 + 5 = **46 pts**
- **Dumbbell Curls** (35 lbs, 3x12): 10 + 3.5 + 12 = **25 pts**
- **Push-ups** (0 lbs, 3x15): 10 + 0 + 15 = **25 pts**

---

## Database Schema

### Users
Stores user profiles, auth credentials, and stats
- id, email, username, display_name, avatar_url
- google_id, github_id
- points, level

### Workouts
Tracks all logged exercises
- id, user_id, exercise_name, muscle_group, equipment
- weight, weight_unit, sets, reps
- points_earned, created_at

### Friends
Manages relationships (pending/accepted status)
- id, user_id, friend_id, status
- created_at, updated_at

### Leaderboard
Denormalized view for fast rankings
- user_id, points, level, workout_count
- last_workout_date, rank

### Exercises
Reference data for suggestions
- id, name, muscle_group, equipment, description

---

## Development Workflow

### Making Changes

**Add new API endpoint:**
1. Create method in `/models` (database layer)
2. Create handler in `/controllers` (business logic)
3. Add route in `/routes` (HTTP endpoints)

**Add new screen:**
1. Create component in `/screens`
2. Add API calls in `/api/client.js`
3. Add to navigation in `/navigation`

### Running Tests
```bash
# Backend
cd backend
npm test

# Frontend
cd frontend
npm test
```

### Building for Production
```bash
# Backend
cd backend
npm run build

# Frontend - iOS
cd frontend
eas build --platform ios

# Frontend - Android
cd frontend
eas build --platform android
```

---

## Troubleshooting

### Backend won't start
```bash
# Check PostgreSQL running
psql -l

# Verify database exists
createdb strength_tracker

# Check environment variables
cat backend/.env
```

### Frontend won't connect
```bash
# Verify API URL
echo $EXPO_PUBLIC_API_URL

# Check backend running on port 5000
lsof -i :5000
```

### Database errors
```bash
# Reset database
dropdb strength_tracker
createdb strength_tracker
psql strength_tracker < backend/src/migrations/init.sql
```

---

## Next Steps

### Immediate (MVP Complete)
- [ ] Deploy backend (Heroku, Railway, AWS)
- [ ] Build and publish mobile apps (App Store, Play Store)
- [ ] Set up production OAuth credentials

### Short Term
- [ ] Add achievements/badges system
- [ ] Implement push notifications
- [ ] Create workout analytics dashboard
- [ ] Add personal records (PRs) tracking
- [ ] User profile customization

### Long Term
- [ ] Weekly challenges and competitions
- [ ] Workout history exports
- [ ] AI-powered workout recommendations
- [ ] Wearable integration (Apple Watch, Fitbit)
- [ ] Live workout sharing
- [ ] Workout ratings and reviews

---

## Performance Optimization

Already included:
- ✅ Database indexes on foreign keys
- ✅ Pagination for large datasets
- ✅ Connection pooling with pg
- ✅ Efficient JWT validation

Consider adding:
- [ ] Redis caching for leaderboard
- [ ] Image compression for profiles
- [ ] API rate limiting
- [ ] CDN for static assets
- [ ] Database query optimization

---

## Contributing

```bash
# Clone the repository
git clone <repo-url>
cd Strength-Tracker

# Create a feature branch
git checkout -b feature/your-feature

# Make changes and test
npm run dev

# Commit and push
git add .
git commit -m "Add feature"
git push origin feature/your-feature

# Create pull request
```

---

## Support & Documentation

- 📖 [README.md](README.md) - Project overview
- 🛠️ [DEVELOPMENT.md](DEVELOPMENT.md) - Setup and troubleshooting
- 📚 [API_DOCS.md](API_DOCS.md) - API reference
- 🎮 [GAMIFICATION.md](GAMIFICATION.md) - Points system details

---

## License

MIT

---

## Questions?

1. Check the relevant documentation file
2. Review example code in the codebase
3. Check PostgreSQL logs: `tail -f /opt/homebrew/var/log/postgres.log`
4. Check app logs: `npm run dev` output

Good luck! 💪🎮
