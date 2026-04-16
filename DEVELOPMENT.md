# Strength Tracker Development Guide

## Quick Start

### 1. Clone & Install
```bash
# Backend
cd backend
npm install

# Frontend (in another terminal)
cd frontend
npm install
```

### 2. Database Setup
```bash
# Create PostgreSQL database
createdb strength_tracker

# Initialize schema
psql strength_tracker < src/migrations/init.sql

# Seed exercises
psql strength_tracker < src/migrations/seedExercises.sql
```

### 3. Environment Configuration

**Backend (.env)**
```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=strength_tracker
DB_USER=postgres
DB_PASSWORD=your_password
JWT_SECRET=your_jwt_secret
GOOGLE_CLIENT_ID=get_from_console.cloud.google.com
GOOGLE_CLIENT_SECRET=get_from_console.cloud.google.com
GITHUB_CLIENT_ID=get_from_github.com/settings
GITHUB_CLIENT_SECRET=get_from_github.com/settings
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:19000
```

**Frontend (.env)**
```
EXPO_PUBLIC_API_URL=http://localhost:5000
```

### 4. Run Development Servers

```bash
# Terminal 1: Backend
cd backend && npm run dev

# Terminal 2: Frontend
cd frontend && npm start
# Press 'i' for iOS simulator or 'a' for Android emulator
```

## OAuth Setup

### Google
1. Go to https://console.cloud.google.com/
2. Create a new project
3. Enable Google+ API
4. Create OAuth 2.0 credentials (mobile app)
5. Copy Client ID and Secret to `.env`

### GitHub
1. Go to https://github.com/settings/developers
2. Create new OAuth App
3. Set Authorization callback URL to `http://localhost:5000/auth/github/callback`
4. Copy Client ID and Secret to `.env`

## Testing the API

### Login Flow
```bash
# 1. Redirect to OAuth provider
curl http://localhost:5000/auth/google

# 2. Exchange token for JWT
# Backend handles this internally

# 3. Use token for authenticated requests
curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:5000/auth/me
```

### Log a Workout
```bash
curl -X POST http://localhost:5000/workouts \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "exerciseName": "Bench Press",
    "muscleGroup": "Chest",
    "equipment": "Barbell",
    "weight": 185,
    "sets": 3,
    "reps": 10,
    "notes": "Felt strong today"
  }'
```

### Get Leaderboard
```bash
curl http://localhost:5000/friends/leaderboard?limit=10
```

## Database Tips

### View Users
```sql
SELECT id, username, email, points, level FROM users;
```

### View Workouts
```sql
SELECT u.username, w.exercise_name, w.weight, w.sets, w.reps, w.points_earned
FROM workouts w
JOIN users u ON w.user_id = u.id
ORDER BY w.created_at DESC;
```

### Reset Database
```bash
dropdb strength_tracker
createdb strength_tracker
psql strength_tracker < src/migrations/init.sql
psql strength_tracker < src/migrations/seedExercises.sql
```

## Troubleshooting

### Frontend won't connect to backend
- Check `EXPO_PUBLIC_API_URL` in frontend/.env
- Make sure backend is running on port 5000
- Check CORS settings in backend/src/server.js

### Database connection error
- Verify PostgreSQL is running: `brew services list` (Mac) or `sudo service postgresql status` (Linux)
- Check DB credentials in backend/.env
- Ensure database exists: `psql -l | grep strength_tracker`

### OAuth not working
- Verify callback URLs match exactly
- Check Client ID and Secret are correct
- Ensure credentials are in .env
- Backend must be accessible from OAuth provider

## Architecture

```
┌─────────────────────────────────────────────────────┐
│           React Native (Expo) Frontend              │
│  ┌────────┬──────────┬───────┬─────────┬──────────┐ │
│  │Workouts│Log Workout│Leader │Friends   │Profile │ │
│  └────────┴──────────┴───────┴─────────┴──────────┘ │
└──────────────────────┬──────────────────────────────┘
                       │ REST API (Axios)
                       │ JWT Authentication
                       ▼
┌─────────────────────────────────────────────────────┐
│         Node.js/Express Backend (Port 5000)         │
│  ┌──────────┬──────────┬──────────┬──────────────┐  │
│  │Auth Routes│Workout │Friends  │Leaderboard   │  │
│  │(OAuth)   │Routes  │Routes   │Routes        │  │
│  └──────────┴──────────┴──────────┴──────────────┘  │
└──────────────────────┬──────────────────────────────┘
                       │ SQL Queries
                       ▼
        ┌──────────────────────────┐
        │  PostgreSQL Database     │
        │  ├── users              │
        │  ├── workouts           │
        │  ├── friends            │
        │  ├── exercises          │
        │  └── leaderboard        │
        └──────────────────────────┘
```

## Deployment Checklist

- [ ] Set up production PostgreSQL database
- [ ] Configure OAuth for production domains
- [ ] Set production environment variables
- [ ] Build backend for production
- [ ] Build React Native app for iOS and Android
- [ ] Set up CI/CD pipeline
- [ ] Configure CORS for production domains
- [ ] Add monitoring and logging
- [ ] Set up backups for database
- [ ] Create production API documentation

## Performance Tips

1. **Database Indexes**: Already created on foreign keys and commonly queried fields
2. **Pagination**: Implement on workout lists (50 items default)
3. **Leaderboard Cache**: Consider Redis for frequently accessed leaderboard
4. **Image Optimization**: Compress user avatars before upload
5. **API Rate Limiting**: Add rate limiting middleware for abuse prevention

## Contributing

1. Create a feature branch
2. Make changes following code style
3. Test thoroughly
4. Create pull request
5. Code review and merge

## Support

For issues or questions:
1. Check existing GitHub issues
2. Review troubleshooting section
3. Check backend and frontend logs
4. Create a new issue with details
