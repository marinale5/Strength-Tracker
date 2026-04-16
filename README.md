# Strength Tracker - Full Stack Workout App

A gamified strength training workout tracker with social features, built with React Native and Node.js.

## Features

### Core Functionality
- 🏋️ **Workout Logging**: Track exercises, weight, sets, and reps
- 🎮 **Gamification**: Earn points for every workout, level up, unlock achievements
- 📊 **Leaderboard**: Compete with friends and the community
- 👥 **Social**: Add friends, share workouts, see friend activity

### Tech Stack

**Frontend:**
- React Native with Expo
- React Navigation (bottom tabs, stack navigation)
- Axios for API calls
- Secure storage for authentication

**Backend:**
- Node.js with Express
- PostgreSQL for data persistence
- Passport.js for OAuth (Google, GitHub)
- JWT for authentication

## Getting Started

### Prerequisites
- Node.js 16+
- PostgreSQL 12+
- Expo CLI (`npm install -g expo-cli`)

### Backend Setup

1. **Install dependencies:**
   ```bash
   cd backend
   npm install
   ```

2. **Create database:**
   ```bash
   createdb strength_tracker
   ```

3. **Initialize database:**
   ```bash
   psql strength_tracker < src/migrations/init.sql
   psql strength_tracker < src/migrations/seedExercises.sql
   ```

4. **Configure environment:**
   ```bash
   cp .env.example .env
   # Edit .env with your OAuth credentials and database config
   ```

5. **Start backend:**
   ```bash
   npm run dev
   ```

### Frontend Setup

1. **Install dependencies:**
   ```bash
   cd frontend
   npm install
   ```

2. **Create .env file:**
   ```bash
   echo "EXPO_PUBLIC_API_URL=http://localhost:5000" > .env
   ```

3. **Start development:**
   ```bash
   npm start
   # Press 'i' for iOS or 'a' for Android
   ```

## Project Structure

```
Strength-Tracker/
├── backend/
│   ├── src/
│   │   ├── config/        # Database & Passport config
│   │   ├── controllers/   # Request handlers
│   │   ├── models/        # Database models
│   │   ├── routes/        # API routes
│   │   ├── middleware/    # Auth & error handling
│   │   ├── migrations/    # Database schemas
│   │   └── server.js      # Express app
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── api/           # API client
│   │   ├── screens/       # React Native screens
│   │   ├── navigation/    # Navigation setup
│   │   └── App.js         # Root component
│   ├── app.json           # Expo config
│   └── package.json
└── README.md
```

## API Endpoints

### Authentication
- `GET /auth/google` - Google OAuth
- `GET /auth/github` - GitHub OAuth
- `GET /auth/me` - Get current user
- `POST /auth/logout` - Logout

### Workouts
- `POST /workouts` - Log a workout
- `GET /workouts/my-workouts` - Get user's workouts
- `GET /workouts/recent` - Get recent workouts feed
- `POST /workouts/share` - Share a workout
- `DELETE /workouts/:id` - Delete a workout

### Friends & Social
- `POST /friends/request` - Send friend request
- `POST /friends/accept` - Accept friend request
- `POST /friends/reject` - Reject friend request
- `DELETE /friends/:id` - Remove friend
- `GET /friends` - Get friends list
- `GET /friends/pending` - Get pending requests
- `GET /friends/workouts` - Get friends' workouts
- `GET /friends/leaderboard` - Get leaderboard

## Points System

Points are awarded based on:
- **Base points**: 10 per workout
- **Weight bonus**: weight / 10 points
- **Reps bonus**: 1 point per rep

**Level Progression:**
- Level = Floor(Total Points / 100) + 1

Example:
- Bench press: 185 lbs, 3 sets x 10 reps = 10 + (185/10) + 10 = 38.5 ≈ 38 points

## Database Schema

### Users
- Stores user profiles, OAuth credentials, points, and level

###  Workouts
- Logs each exercise with weight, sets, reps, and points earned

### Friends
- Manages friend requests and relationships (pending/accepted)

### Leaderboard
- Denormalized user stats for fast leaderboard queries

### Exercises
- Reference data for common exercises

## Environment Variables

### Backend (.env)
- `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`
- `JWT_SECRET`, `JWT_EXPIRE`
- `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`
- `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET`
- `PORT`, `NODE_ENV`, `FRONTEND_URL`

### Frontend (.env)
- `EXPO_PUBLIC_API_URL` - Backend API URL

## Development

### Adding a New Feature

1. **Backend:**
   - Add model method in `src/models/`
   - Create controller in `src/controllers/`
   - Add route in `src/routes/`

2. **Frontend:**
   - Create screen component in `src/screens/`
   - Add API method in `src/api/client.js`
   - Add navigation in `src/navigation/`

### Database Migrations

To add new tables or columns:
1. Create `.sql` file in `src/migrations/`
2. Run: `psql strength_tracker < src/migrations/yourfile.sql`

## Next Steps

- [ ] Set up OAuth applications (Google, GitHub)
- [ ] Deploy backend (Heroku, AWS, DigitalOcean)
- [ ] Build and publish mobile app
- [ ] Add achievements/badges system
- [ ] Implement push notifications
- [ ] Add workout history analytics
- [ ] Create personal records (PRs) tracking

## License

MIT