# ✅ Strength Tracker - Getting Started Checklist

Use this checklist to get your app up and running. Print it or check it off as you go!

---

## 📋 Pre-Setup (5 minutes)

- [ ] **Install Node.js 16+**
  - Download from https://nodejs.org/
  - Verify: `node --version`

- [ ] **Install PostgreSQL 12+**
  - macOS: `brew install postgresql`
  - Ubuntu: `sudo apt-get install postgresql`
  - Verify: `psql --version`

- [ ] **Install Expo CLI**
  ```bash
  npm install -g expo-cli
  ```

- [ ] **Clone/Navigate to project**
  ```bash
  # You should already be in: /workspaces/Strength-Tracker
  pwd  # Verify current directory
  ```

---

## 🔧 Backend Setup (10 minutes)

### Step 1: Install Backend Dependencies
- [ ] Navigate to backend folder
  ```bash
  cd backend
  ```

- [ ] Install npm packages
  ```bash
  npm install
  ```

### Step 2: Setup Database
- [ ] Start PostgreSQL service
  ```bash
  # macOS
  brew services start postgresql
  
  # Ubuntu
  sudo service postgresql start
  
  # Windows (if installed)
  # Typically starts automatically
  ```

- [ ] Create database
  ```bash
  createdb strength_tracker
  ```

- [ ] Initialize database schema
  ```bash
  psql strength_tracker < src/migrations/init.sql
  ```

- [ ] Seed exercises
  ```bash
  psql strength_tracker < src/migrations/seedExercises.sql
  ```

- [ ] Verify database created
  ```bash
  psql -l | grep strength_tracker
  # Should show: strength_tracker
  ```

### Step 3: Configure Environment
- [ ] Copy example environment file
  ```bash
  cp .env.example .env
  ```

- [ ] Edit `.env` file
  ```bash
  # Important: Update these values:
  # - DB_PASSWORD (your PostgreSQL password)
  # - JWT_SECRET (any random string)
  # - Check other values match your setup
  ```

- [ ] Verify .env file
  ```bash
  cat .env
  ```

---

## 📱 Frontend Setup (10 minutes)

### Step 1: Install Frontend Dependencies
- [ ] Navigate to frontend folder
  ```bash
  cd ../frontend
  ```

- [ ] Install npm packages
  ```bash
  npm install
  ```

### Step 2: Configure Environment
- [ ] Create .env file for Expo
  ```bash
  echo "EXPO_PUBLIC_API_URL=http://localhost:5000" > .env
  ```

- [ ] Verify .env created
  ```bash
  cat .env
  ```

---

## 🚀 Start Development Servers (5 minutes)

### Terminal 1: Start Backend
- [ ] Go back to backend directory
  ```bash
  cd ../backend
  ```

- [ ] Start backend development server
  ```bash
  npm run dev
  ```

- [ ] Verify server started (you should see):
  ```
  Server running on port 5000
  ```

- [ ] Test backend health
  ```bash
  # In a new terminal:
  curl http://localhost:5000/health
  # Should return: {"status":"API is running"}
  ```

### Terminal 2: Start Frontend
- [ ] Open new terminal window/tab

- [ ] Go to frontend directory
  ```bash
  cd frontend
  ```

- [ ] Start Expo development server
  ```bash
  npm start
  ```

- [ ] You should see:
  ```
  › Press i │ open iOS simulator
  › Press a │ open Android emulator
  › Press w │ open web
  › Press c │ clear console
  › Press q │ quit
  ```

### Terminal 3 (Optional): Test API's
- [ ] In a third terminal, test getting leaderboard
  ```bash
  curl http://localhost:5000/friends/leaderboard
  ```

---

## 📲 Launch App

### Option A: iOS Simulator
- [ ] Press `i` in frontend terminal
- [ ] Wait for iOS simulator to open (~30 seconds)
- [ ] App will load in simulator
- [ ] You should see login screen with "💪 Strength Tracker" title

### Option B: Android Emulator
- [ ] Press `a` in frontend terminal
- [ ] Wait for Android emulator to open (~60 seconds)
- [ ] App will load in emulator
- [ ] You should see login screen

### Option C: Web Browser
- [ ] Press `w` in frontend terminal
- [ ] Browser will open to http://localhost:19000
- [ ] Click "Run in web browser"

---

## 🧪 Test the App (10 minutes)

### Login
- [ ] Click "Login with Google" or "Login with GitHub"
- [ ] Note: OAuth won't work without production credentials yet
- [ ] For now, you can manually test API endpoints (see next section)

### Manual API Testing (Without OAuth)
- [ ] Get all exercises
  ```bash
  curl http://localhost:5000/friends/leaderboard
  ```

- [ ] Create test user (for now, create via SQL)
  ```bash
  psql strength_tracker
  
  INSERT INTO users (id, email, username, display_name)
  VALUES ('test-user-1', 'test@example.com', 'testuser', 'Test User');
  
  \q  # Exit psql
  ```

- [ ] Get user
  ```bash
  SELECT * FROM users LIMIT 1;
  ```

---

## 🎮 Test Key Features

### Feature 1: Log Workout
```bash
# Get a user ID first
psql strength_tracker -c "SELECT id FROM users LIMIT 1;" 

# Log workout via API
curl -X POST http://localhost:5000/workouts \
  -H "Content-Type: application/json" \
  -d '{
    "exerciseName": "Bench Press",
    "muscleGroup": "Chest",
    "weight": 185,
    "sets": 3,
    "reps": 10
  }'

# Note: This will fail without auth token for now
# See API_DOCS.md for proper authentication flow
```

### Feature 2: View Leaderboard
```bash
curl http://localhost:5000/friends/leaderboard

# Should return JSON array of top users
```

### Feature 3: Check Database
```bash
psql strength_tracker

# View exercises
SELECT * FROM exercises LIMIT 5;

# View users
SELECT username, points, level FROM users;

# View workouts
SELECT * FROM workouts;

# Exit
\q
```

---

## 🛠️ Troubleshooting

### Issue: Backend won't start

**Error: "Could not connect to database"**
- [ ] Check PostgreSQL running: `pg_isready`
- [ ] Verify database exists: `psql -l | grep strength_tracker`
- [ ] Check .env credentials: `cat backend/.env`
- [ ] Try resetting password in PostgreSQL

**Error: "Port 5000 already in use"**
```bash
# Find process using port 5000
lsof -i :5000

# Kill it
kill -9 <PID>

# Or change PORT in .env to 5001
```

### Issue: Frontend won't connect
- [ ] Check backend running: `curl http://localhost:5000/health`
- [ ] Check EXPO_PUBLIC_API_URL: `cat frontend/.env`
- [ ] Make sure it says: `EXPO_PUBLIC_API_URL=http://localhost:5000`
- [ ] Restart both servers if changed

### Issue: iOS Simulator won't open
- [ ] Make sure Xcode is installed: `xcode-select --install`
- [ ] Or try web version instead: Press `w`

### Issue: Database errors
```bash
# Reset database
dropdb strength_tracker
createdb strength_tracker
psql strength_tracker < backend/src/migrations/init.sql
psql strength_tracker < backend/src/migrations/seedExercises.sql
```

---

## 📖 Read Documentation

Once app is running, read these (in order):
- [ ] [QUICKSTART.md](../QUICKSTART.md) - Quick overview (5 min)
- [ ] [README.md](../README.md) - Full feature documentation (10 min)
- [ ] [API_DOCS.md](../API_DOCS.md) - API endpoint reference (10 min)
- [ ] [GAMIFICATION.md](../GAMIFICATION.md) - Points system (5 min)
- [ ] [DEVELOPMENT.md](../DEVELOPMENT.md) - Deep dive guide (20 min)

---

## 🔐 Setup OAuth (Optional, for Production)

### Google OAuth
- [ ] Go to https://console.cloud.google.com/
- [ ] Create new project
- [ ] Enable Google+ API
- [ ] Create OAuth 2.0 credentials
- [ ] Copy Client ID to `backend/.env` → `GOOGLE_CLIENT_ID`
- [ ] Copy Secret to `backend/.env` → `GOOGLE_CLIENT_SECRET`
- [ ] Restart backend

### GitHub OAuth
- [ ] Go to https://github.com/settings/developers
- [ ] Create new OAuth App
- [ ] Set callback URL: `http://localhost:5000/auth/github/callback`
- [ ] Copy Client ID to `backend/.env` → `GITHUB_CLIENT_ID`
- [ ] Copy Secret to `backend/.env` → `GITHUB_CLIENT_SECRET`
- [ ] Restart backend

---

## 🎊 Success Checklist

- [ ] ✅ Backend running on http://localhost:5000
- [ ] ✅ Frontend running on http://localhost:19000
- [ ] ✅ Database created with 5 tables
- [ ] ✅ 20+ exercise seed data loaded
- [ ] ✅ App loads with login screen
- [ ] ✅ API endpoints responding
- [ ] ✅ Can view leaderboard
- [ ] ✅ All documentation readable

---## 🚀 You're Ready!

Your Strength Tracker is running! Next steps:
- [ ] Read the documentation files
- [ ] Explore the code
- [ ] Test all features (once OAuth is set up)
- [ ] Customize as needed
- [ ] Deploy to production

---

## 📞 Need Help?

1. Check [DEVELOPMENT.md](../DEVELOPMENT.md) troubleshooting section
2. Review error messages in terminal
3. Check database: `psql strength_tracker -c "SELECT * FROM users;"`
4. Check API response: `curl http://localhost:5000/health`
5. Check .env files are correct

---

## 💡 Pro Tips

**To stop servers:**
```bash
# Backend: Press Ctrl+C in backend terminal
# Frontend: Press q in frontend terminal
# Or kill processes: kill -9 <PID>
```

**To view logs:**
```bash
# Postgres logs follow
tail -f /opt/homebrew/var/log/postgres.log

# Check npm install worked
npm list (in backend or frontend folder)
```

**To reset everything:**
```bash
# Drop and recreate database
dropdb strength_tracker
createdb strength_tracker

# Re-run migrations
psql strength_tracker < backend/src/migrations/init.sql
psql strength_tracker < backend/src/migrations/seedExercises.sql
```

---

**Last Updated**: April 16, 2026
**Status**: ✅ Ready to Use
**Total Files**: 35
**Total Setup Time**: ~45 minutes

Enjoy building your fitness app! 💪🎮
