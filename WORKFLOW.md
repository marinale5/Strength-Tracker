# ⚡ Strength Tracker - Workflow Guide

## Development Workflow

This guide helps you understand how code flows through the application.

---

## 🔄 Complete User Journey

### 1. User Launches App
```
App.js (Check SecureStore for token)
  ├─ Token exists? → Go to AppNavigator (main app)
  └─ No token? → Go to AuthNavigator (login screen)
```

### 2. User Logs In
```
AuthNavigator (Login Screen)
  ├─ User clicks "Login with Google/GitHub"
  ├─ Opens browser to backend OAuth endpoint
  ├─ /auth/google → Passport Google Strategy
  ├─ User approves
  ├─ Redirect to /auth/google/callback
  ├─ Backend generates JWT token
  ├─ Redirects to app with token in URL
  ├─ Token stored in SecureStore
  └─ Switch to AppNavigator
```

### 3. User Logs Workout
```
AppNavigator (Bottom tabs)
  └─ "Log" tab → LogWorkoutScreen
      ├─ User fills form (exercise, weight, reps, etc.)
      ├─ Click "Log Workout"
      ├─ Frontend validation
      ├─ workoutAPI.logWorkout() → POST /workouts
      ├─ Axios adds JWT header
      ├─ Backend receives request:
      │   ├─ authMiddleware validates JWT
      │   ├─ workoutController.logWorkout()
      │   ├─ Workout.create() saves to database
      │   ├─ Calculate points: 10 + weight/10 + reps
      │   ├─ User.updatePoints() adds to user total
      │   ├─ Update user level: floor(points/100)+1
      │   └─ Return created workout with points
      ├─ Frontend receives success response
      ├─ Show "+X points!" alert
      └─ Clear form for next workout
```

### 4. User Views Leaderboard
```
AppNavigator (Bottom tabs)
  └─ "Leaderboard" tab → LeaderboardScreen
      ├─ useEffect runs on mount
      ├─ friendAPI.getLeaderboard() → GET /friends/leaderboard
      ├─ No auth needed (public endpoint)
      ├─ Backend executes SQL:
      │   SELECT users ranked by points DESC
      │   JOIN with workouts for stats
      ├─ Returns array of users with rank
      ├─ Frontend displays in FlatList
      ├─ Shows medals (🥇🥈🥉) for top 3
      └─ Shows points, level, workout count
```

### 5. User Manages Friends
```
AppNavigator (Bottom tabs)
  └─ "Friends" tab → FriendsScreen
      ├─ Tabs: "Friends" / "Requests"
      ├─ Friends Tab:
      │   ├─ friendAPI.getFriends() → GET /friends
      │   ├─ FlatList of friend cards
      │   └─ Can remove friend or view stats
      └─ Requests Tab:
          ├─ friendAPI.getPendingRequests() → GET /friends/pending
          ├─ FlatList of pending requests
          ├─ Accept/Reject buttons
          └─ POST /friends/accept or /friends/reject
```

---

## 🛠️ Code Flow Examples

### Example 1: Logging a Workout

**Frontend:**
```javascript
// frontend/src/screens/LogWorkoutScreen.js
const handleLogWorkout = async () => {
  const response = await workoutAPI.logWorkout({
    exerciseName: "Bench Press",
    muscleGroup: "Chest",
    weight: 185,
    sets: 3,
    reps: 10,
  });
  // response.data.workout (new workout)
  // response.data.message ("+38 points!")
}
```

**API Call:**
```javascript
// frontend/src/api/client.js
const workoutAPI = {
  logWorkout: (data) => api.post('/workouts', data),
  // ↓
  // axios adds header: Authorization: Bearer <JWT_TOKEN>
  // ↓
  // POST to http://localhost:5000/workouts
}
```

**Backend:**
```javascript
// backend/src/routes/workouts.js
router.post('/', authMiddleware, workoutController.logWorkout);

// backend/src/middleware/auth.js
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  req.user = decoded; // Contains: { id, email, username }
  next();
}

// backend/src/controllers/workoutController.js
logWorkout: async (req, res) => {
  const userId = req.user.id; // From JWT
  const workout = await Workout.create(userId, data);
  const pointsEarned = workout.points_earned;
  await User.updatePoints(userId, pointsEarned);
  res.status(201).json({ workout, message: `+${pointsEarned} points!` });
}

// backend/src/models/Workout.js
static async create(userId, workoutData) {
  const pointsEarned = Math.floor(
    10 + (weight || 0)/10 + reps
  );
  // INSERT INTO workouts ...
  // RETURNING *
}

// backend/src/models/User.js
static async updatePoints(userId, pointsEarned) {
  // UPDATE users SET points = points + ${pointsEarned}
  // UPDATE users SET level = floor(points/100)+1
}
```

### Example 2: Getting Leaderboard

**Frontend:**
```javascript
// frontend/src/screens/LeaderboardScreen.js
useEffect(() => {
  const response = await friendAPI.getLeaderboard(100);
  setLeaderboard(response.data); // Array of users
  // Each user has: id, username, points, level, workout_count
}, []);
```

**Backend:**
```javascript
// backend/src/controllers/friendController.js
getLeaderboard: async (req, res) => {
  const leaderboard = await User.getLeaderboard(50);
  res.json(leaderboard);
}

// backend/src/models/User.js
static async getLeaderboard(limit = 50) {
  const result = await pool.query(`
    SELECT u.id, u.username, u.points, u.level,
           COUNT(w.id) as workout_count
    FROM users u
    LEFT JOIN workouts w ON u.id = w.user_id
    GROUP BY u.id
    ORDER BY u.points DESC
    LIMIT $1
  `, [limit]);
  return result.rows;
}
```

---

## 📦 Data Flow Diagram

```
┌─────────────┐
│  Frontend   │
│  (React     │
│  Native)    │
└──────┬──────┘
       │ HTTP + JWT
       ├─ axios.create()
       ├─ Authorization: Bearer <token>
       └─ Content-Type: application/json
       │
       ▼
┌──────────────────────┐
│  Backend             │
│  (Express.js)        │
├──────────────────────┤
│ Routes               │ ─┐
│ /auth                │  │
│ /workouts            │  ├─ incoming request
│ /friends             │  │
└──────────────────────┘  │
       │◄────────────────┘
       │
       ▼ authenticate JWT
┌──────────────────────┐
│  Middleware          │
│  - authMiddleware    │ ─ validate token
│  - error handler     │
└──────────────────────┘
       │
       ▼ route to handler
┌──────────────────────┐
│  Controller          │
│  - authController    │
│  - workoutController │ ─ business logic
│  - friendController  │
└──────────────────────┘
       │
       ▼ query database
┌──────────────────────┐
│  Models              │
│  - User.js           │
│  - Workout.js        │ ─ database operations
│  - Friend.js         │
└──────────────────────┘
       │
       ▼ SQL execute
┌──────────────────────┐
│  PostgreSQL          │
│  - users             │
│  - workouts          │ ─ persistent data
│  - friends           │
│  - exercises         │
│  - leaderboard       │
└──────────────────────┘
       │
       ▼ return rows
       ▲ model processes
       │
    controller formats
       │
    ▼ JSON response
    frontend displays
```

---

## 🔐 Authentication Flow

```
1. App starts
   ├─ Check SecureStore for token
   ├─ Token exists? → Use it
   └─ No token? → Show login screen

2. User clicks "Login with Google"
   ├─ Open browser to http://localhost:5000/auth/google
   ├─ Passport Google Strategy
   ├─ User approves in browser
   ├─ Redirect to /auth/google/callback
   ├─ Passport finds/creates user
   ├─ Generate JWT: jwt.sign({id, email, username})
   ├─ Redirect to app: /auth/callback?token=xxx&userId=yyy
   └─ App receives token

3. Store token
   ├─ Save in SecureStore
   ├─ Add to all future requests in Authorization header
   └─ Request format: "Bearer <token>"

4. Make authenticated request
   ├─ axios intercepts request
   ├─ Gets token from SecureStore
   ├─ Adds header: Authorization: Bearer <token>
   └─ Sends request

5. Backend validates
   ├─ authMiddleware extracts token
   ├─ jwt.verify(token, secret)
   ├─ Extract: {id, email, username}
   ├─ Attach to req.user
   └─ Next middleware/controller
```

---

## 🚀 Common Operations

### How to add a new endpoint

1. **Create model method** (e.g., `src/models/Workout.js`)
   ```javascript
   static async myNewMethod() {
     const result = await pool.query('SELECT ...');
     return result.rows;
   }
   ```

2. **Create controller method** (e.g., `src/controllers/workoutController.js`)
   ```javascript
   myNewEndpoint: async (req, res) => {
     try {
       const data = await Workout.myNewMethod();
       res.json(data);
     } catch (err) {
       res.status(500).json({ error: 'Failed' });
     }
   }
   ```

3. **Add route** (e.g., `src/routes/workouts.js`)
   ```javascript
   router.get('/my-endpoint', authMiddleware, workoutController.myNewEndpoint);
   ```

4. **Add API method** (frontend, `src/api/client.js`)
   ```javascript
   const workoutAPI = {
     myNewMethod: () => api.get('/workouts/my-endpoint'),
   }
   ```

5. **Use in screen component**
   ```javascript
   const data = await workoutAPI.myNewMethod();
   ```

---

## 📋 Debugging Checklist

- [ ] Backend running: `curl http://localhost:5000/health`
- [ ] Frontend running: App visible in emulator/browser
- [ ] Database connected: `psql strength_tracker`
- [ ] Token in SecureStore: Log in and check
- [ ] JWT valid: Check expiration in token
- [ ] API endpoint exists: Check routes file
- [ ] Database query works: Test in pgAdmin/psql
- [ ] Middleware chain correct: Check route order
- [ ] Error messages helpful: Check console logs

---

## 🎯 Key Integration Points

1. **Frontend → Backend**: HTTP requests with JWT auth
2. **Backend → Database**: SQL queries with pg pool
3. **Middleware**: Validates JWT before controller
4. **Model**: Executes SQL and processes results
5. **Controller**: Handles business logic
6. **Route**: Maps HTTP method/path to controller
7. **Frontend**: Displays response data to user

---

This workflow ensures all parts work together seamlessly! 🎉
