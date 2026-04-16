# 🎯 Strength Tracker - Visual Architecture & Data Flow

## System Architecture Diagram

```
╔════════════════════════════════════════════════════════════════════╗
║                     STRENGTH TRACKER APPLICATION                   ║
╚════════════════════════════════════════════════════════════════════╝

┌──────────────────────────────────────────────────────────────────────┐
│                         USERS (MOBILE/WEB)                           │
│                                                                      │
│  📱 App Opens → AuthNavigator → Login Screen → OAuth Flow           │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘
                               ↓↑
                      HTTPS + JWT Token
                               ↓↑
┌──────────────────────────────────────────────────────────────────────┐
│                    REACT NATIVE FRONTEND (Expo)                      │
│                                                                      │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │  Bottom Tab Navigation (5 Screens)                         │   │
│  │  ┌──────────────────────────────────────────────────────┐  │   │
│  │  │  💪 Workouts  │ ➕ Log  │ 🏆 Leaderboard │ 👥 Friends │  │   │
│  │  │                └─────────────────────────────────────┘  │   │
│  │  │  👤 Profile                                             │   │
│  │  └─────────────────────────────────────────────────────────┘  │   │
│  │                                                               │   │
│  │  Each Screen Uses API Client (src/api/client.js)           │   │
│  │  - Logs workouts → Backend                                 │   │
│  │  - Fetches workouts → Backend                              │   │
│  │  - Gets leaderboard → Backend                              │   │
│  │  - Manages friends → Backend                               │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                      │
│  Axios HTTP Client with JWT Bearer Token in Headers                │
└──────────────────────────────────────────────────────────────────────┘
                               ↓↑
                      REST API (JSON)
                               ↓↑
┌──────────────────────────────────────────────────────────────────────┐
│                    NODE.JS EXPRESS BACKEND                           │
│                        (Port 5000)                                    │
│                                                                      │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │  Express Routes Layer                                      │   │
│  │                                                             │   │
│  │  ├─ GET  /auth/google        → handleOAuth               │   │
│  │  ├─ GET  /auth/github        → handleOAuth               │   │
│  │  ├─ GET  /auth/me            → getCurrentUser             │   │
│  │  ├─ POST /auth/logout        → logout                    │   │
│  │  │                                                         │   │
│  │  ├─ POST /workouts           → logWorkout                │   │
│  │  ├─ GET  /workouts/my-workouts → getUserWorkouts        │   │
│  │  ├─ GET  /workouts/recent    → getRecentWorkouts        │   │
│  │  ├─ POST /workouts/share     → shareWorkout             │   │
│  │  ├─ DELETE /workouts/:id     → deleteWorkout            │   │
│  │  │                                                         │   │
│  │  ├─ POST /friends/request    → sendRequest              │   │
│  │  ├─ POST /friends/accept     → acceptRequest            │   │
│  │  ├─ DELETE /friends/:id     → removeFriend              │   │
│  │  ├─ GET  /friends           → getFriends                │   │
│  │  ├─ GET  /friends/workouts  → getFriendWorkouts         │   │
│  │  └─ GET  /friends/leaderboard → getLeaderboard          │   │
│  │                                                             │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                               ↓                                      │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │  Middleware Layer                                          │   │
│  │  - authMiddleware (JWT validation)                         │   │
│  │  - Error handling middleware                               │   │
│  │  - CORS middleware                                         │   │
│  │  - Session middleware                                      │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                               ↓                                      │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │  Controllers Layer (Business Logic)                        │   │
│  │  - authController                                          │   │
│  │  - workoutController                                       │   │
│  │  - friendController                                        │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                               ↓                                      │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │  Models Layer (Database Queries)                           │   │
│  │  - User.js (find, create, updatePoints)                   │   │
│  │  - Workout.js (create, get, share, delete)                │   │
│  │  - Friend.js (request, accept, getList)                   │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                               ↓                                      │
└──────────────────────────────────────────────────────────────────────┘
                               ↓↑
                      SQL Queries
                               ↓↑
┌──────────────────────────────────────────────────────────────────────┐
│                    POSTGRESQL DATABASE                               │
│                    (Port 5432)                                        │
│                                                                      │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐                │
│  │    USERS     │ │   WORKOUTS   │ │   FRIENDS    │                │
│  ├──────────────┤ ├──────────────┤ ├──────────────┤                │
│  │ id (PK)      │ │ id (PK)      │ │ id (PK)      │                │
│  │ email        │ │ user_id (FK) │ │ user_id (FK) │                │
│  │ username     │ │ exercise_name│ │ friend_id(FK)│                │
│  │ display_name │ │ weight       │ │ status       │                │
│  │ google_id    │ │ sets         │ │ created_at   │                │
│  │ github_id    │ │ reps         │ └──────────────┘                │
│  │ points       │ │ points_earned│                                 │
│  │ level        │ │ created_at   │ ┌──────────────┐                │
│  │ avatar_url   │ └──────────────┘ │  EXERCISES   │                │
│  │ created_at   │                  ├──────────────┤                │
│  └──────────────┘ ┌──────────────┐ │ id (PK)      │                │
│                   │ LEADERBOARD  │ │ name         │                │
│                   ├──────────────┤ │ muscle_group │                │
│                   │ user_id (PK) │ │ equipment    │                │
│                   │ points       │ └──────────────┘                │
│                   │ level        │                                 │
│                   │ workout_count│ ┌──────────────┐                │
│                   │ rank         │ │WORKOUT_SHARE │                │
│                   └──────────────┘ ├──────────────┤                │
│                                    │ id (PK)      │                │
│                                    │ workout_id(FK)                │
│                                    │ message      │                │
│                                    └──────────────┘                │
│                                                                      │
│  Optimized with Indexes:                                           │
│  - idx_workouts_user_id                                            │
│  - idx_workouts_created_at                                         │
│  - idx_friends_user_id                                             │
│  - idx_leaderboard_points                                          │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘
```

---

## Data Flow Diagrams

### 1. User Login Flow
```
User Opens App
    ↓
AuthNavigator (Login Screen)
    ↓
User clicks "Login with Google"
    ↓
Redirects to Google OAuth Consent
    ↓
User approves
    ↓
Backend receives authorization code
    ↓
Backend calls Google OAuth endpoint
    ↓
Backend checks if user exists
    ├─→ YES: Update user record
    └─→ NO: Create new user
    ↓
Backend generates JWT token
    ↓
Backend redirects to app with token
    ↓
App stores token in SecureStore
    ↓
AppNavigator replaces AuthNavigator
    ↓
User sees main app with 5 tabs
```

### 2. Workout Logging Flow
```
User on LogWorkoutScreen
    ↓
Fills form:
├─ Exercise Name (required)
├─ Muscle Group (required)
├─ Weight (optional)
├─ Sets (required)
├─ Reps (required)
└─ Notes (optional)
    ↓
Clicks "Log Workout" button
    ↓
Frontend validates input
    ├─→ Invalid: Show alert
    └─→ Valid: Continue
    ↓
Frontend calls workoutAPI.logWorkout()
    ↓
Axios adds JWT token to header
    ↓
POST /workouts request sent to backend
    ↓
Middleware validates JWT
    ├─→ Invalid: Return 401
    └─→ Valid: Continue
    ↓
workoutController processes request
    ↓
workoutModel creates database record
    ↓
Calculate points earned: 10 + (weight/10) + reps
    ↓
Update user points: user.points += pointsEarned
    ↓
Calculate new level: floor(points/100) + 1
    ↓
Database returns created workout
    ↓
Frontend receives response
    ↓
Show success alert with points earned
    ↓
Clear form
    ↓
User can log another or navigate away
```

### 3. Leaderboard Fetching Flow
```
User navigates to Leaderboard tab
    ↓
LeaderboardScreen useEffect runs
    ↓
Calls friendAPI.getLeaderboard()
    ↓
GET /friends/leaderboard (public, no auth needed)
    ↓
Backend receives request
    ↓
friendController.getLeaderboard()
    ↓
User.getLeaderboard() query runs:
SELECT u.id, u.username, u.display_name, u.avatar_url, u.points, u.level,
       COUNT(w.id) as workout_count, MAX(w.created_at) as last_workout_date
FROM users u
LEFT JOIN workouts w ON u.id = w.user_id
GROUP BY u.id
ORDER BY u.points DESC
LIMIT 50
    ↓
Returns JSON array of top 50 users
    ↓
Frontend receives and displays in FlatList
    ↓
Shows rank with medal emoji (🥇🥈🥉)
    ↓
User can scroll and see rankings
```

### 4. Friends Management Flow
```
User navigates to Friends tab
    ↓
FriendsScreen loads friends list
    ↓
Uses two parallel API calls:
├─ GET /friends (list of friends)
└─ GET /friends/pending (pending requests)
    ↓
Both return JSON with user data
    ↓
Frontend displays two tabs:
├─ Friends: Shows friend cards with remove button
└─ Requests: Shows pending requests with accept/reject
    ↓
User can:
├─ Remove a friend (DELETE /friends/:id)
├─ Accept pending request (POST /friends/accept)
└─ Reject pending request (POST /friends/reject)
    ↓
Each action updates database
    ↓
Frontend refreshes lists
    ↓
User sees updated friends
```

### 5. Points Calculation Flow
```
Workout logged with:
├─ Weight = 185 lbs
├─ Reps = 10
└─ Sets = 3
    ↓
Backend calculates points:
Points = 10 (base) + (185/10 = 18.5) + 10 (reps) = 38.5
    ↓
Rounds to 38 points
    ↓
Stored in workout.points_earned
    ↓
Added to user.points
    ↓
Updated user stats:
├─ Total Points = previous + 38
└─ Level = floor(points / 100) + 1
    ↓
Example progression:
├─ 0-99 points → Level 1
├─ 100-199 points → Level 2
├─ 200-299 points → Level 3
├─ 300-399 points → Level 4
└─ 400+ points → Level 5+
    ↓
User sees +38 points popup
    ↓
User sees level increase (if applicable)
```

---

## Database Relationship Diagram

```
                    ┌─────────────────┐
                    │      USERS      │
                    ├─────────────────┤
                    │ id (UUID) ◄──┐  │
                    │ email         │  │
                    │ username      │  │
                    │ points        │  │
                    │ level         │  │
                    └─────────────────┘
                         ▲  ▲     ▲
                         │  │     │
                    ┌────┴──┤     └─────────┬──────────────┐
                    │       │              │              │
              1:Many    1:Many        1:Many         1:Many
                    │       │              │              │
         ┌──────────▼──┐ ┌──┴──────────┐ ┌┴──────────┐ ┌──┴──────────┐
         │  WORKOUTS   │ │   FRIENDS   │ │LEADERBOARD│ │WORKOUT_SHARE│
         ├─────────────┤ ├─────────────┤ ├───────────┤ ├─────────────┤
         │ id          │ │ id          │ │ id        │ │ id          │
         │ user_id (FK)│ │ user_id(FK) │ │ user_id(FK│ │ workout_id(FK)
         │ exercise_   │ │ friend_id(FK)  │status    │ │ message     │
         │   name      │ │ status      │ │ points    │ │             │
         │ weight      │ │ created_at  │ │ level     │ └─────────────┘
         │ sets        │ └─────────────┘ │ rank      │
         │ reps        │                 └───────────┘
         │ points_     │
         │ earned      │ ┌──────────────────┐
         │ created_at  │ │    EXERCISES     │
         └─────────────┤ ├──────────────────┤
              ▲        │ │ id (UUID)        │
              │        └─│ name             │
              │          │ muscle_group     │
              │          │ equipment        │
              └──────────┤ description      │
            (optional)   └──────────────────┘


Key Relationships:
- USER has Many WORKOUTS (1:N)
- USER has Many FRIENDS (N:N - bidirectional)
- USER has One LEADERBOARD_ENTRY (1:1)
- WORKOUT has One WORKOUT_SHARE (1:1)
- WORKOUT references EXERCISES (optional)
```

---

## Authentication Flow Diagram

```
┌─────────────────────────────────┐
│  App Starts / User Clicks Login │
└────────────┬────────────────────┘
             │
             ▼
    ┌─────────────────┐
    │ Check SecureStore
    │ for existing token
    └────────┬────────┘
             │
    ┌────────▼────────┐
    │ Token exists?   │
    └────────┬────────┘
             │
        ┌────┴────────────────────┐
        │                         │
       YES                       NO
        │                         │
        ▼                         ▼
   Use token          Show AuthNavigator
   Go to AppNav       (Login Screen)
        │                         │
        │        ┌────────────────┤
        │        │                │
        │        ▼                ▼
        │    Google OAuth    GitHub OAuth
        │        │                │
        │        ├────────────────┤
        │        │                │
        │        ▼                ▼
        │  User approves
        │        │
        │        ▼
        │  Redirect to callback
        │  (/auth/google/callback)
        │        │
        │        ▼
        │  Check/Create user
        │        │
        │        ▼
        │  Generate JWT token
        │        │
        │        ▼
        │  Return token to app
        │        │
        └────────┬─────────────────┤
                 │                 │
                 ▼                 ▼
           Store in SecureStore
                 │
                 ▼
           Add to all future requests:
           Header: "Authorization: Bearer <token>"
                 │
                 ▼
           JWT Middleware validates token
                 │
        ┌────────┴────────────┐
        │                     │
     Valid               Invalid
        │                     │
        ▼                     ▼
   Continue         Return 401 Unauthorized
   Processing            │
                         ▼
                   Remove token from storage
                   Show login screen
```

---

## File Dependency Graph

```
App.js (ROOT)
    ├─ src/navigation/AuthNavigator.js
    │   └─ src/screens/LoginScreen
    │
    └─ src/navigation/AppNavigator.js
        ├─ src/screens/LogWorkoutScreen.js
        │   └─ src/api/client.js → POST /workouts
        │
        ├─ src/screens/WorkoutsScreen.js
        │   └─ src/api/client.js → GET,DELETE /workouts
        │
        ├─ src/screens/LeaderboardScreen.js
        │   └─ src/api/client.js → GET /friends/leaderboard
        │
        ├─ src/screens/FriendsScreen.js
        │   └─ src/api/client.js → GET,POST,DELETE /friends
        │
        └─ src/screens/ProfileScreen.js
            └─ src/api/client.js → GET /auth/me, POST /auth/logout


Backend: src/server.js (ROOT)
    ├─ src/config/database.js ← DB connection pool
    ├─ src/config/passport.js ← OAuth strategies
    │
    ├─ src/middleware/auth.js ← JWT validation
    │
    ├─ src/routes/auth.js
    │   └─ src/controllers/authController.js
    │       └─ src/models/User.js
    │
    ├─ src/routes/workouts.js
    │   └─ src/controllers/workoutController.js
    │       ├─ src/models/Workout.js
    │       └─ src/models/User.js (updatePoints)
    │
    └─ src/routes/friends.js
        ├─ src/controllers/friendController.js
        │   ├─ src/models/Friend.js
        │   ├─ src/models/User.js (getLeaderboard)
        │   └─ src/models/Workout.js
        │
        └─ Database (PostgreSQL)
            ├─ users table
            ├─ workouts table
            ├─ friends table
            ├─ exercises table
            ├─ leaderboard table
            └─ workout_shares table
```

---

## Component Hierarchy (Frontend)

```
App
├─ AuthContext/Provider
│
├─ WHEN NOT AUTHENTICATED:
│  └─ AuthNavigator (Stack)
│      └─ LoginScreen
│          └─ OAuth Buttons
│
└─ WHEN AUTHENTICATED:
   └─ AppNavigator (BottomTab)
       ├─ WorkoutsStack (Stack)
       │  └─ WorkoutsScreen
       │      ├─ FlatList [Workout Cards]
       │      │  ├─ Exercise Name
       │      │  ├─ Points Badge
       │      │  ├─ Workout Details
       │      │  ├─ Share Button
       │      │  └─ Delete Button
       │      └─ Empty State
       │
       ├─ LogWorkoutStack (Stack)
       │  └─ LogWorkoutScreen
       │      ├─ TextInputs
       │      ├─ SelectButtons (Muscle Groups)
       │      ├─ SelectButtons (Equipment)
       │      └─ Submit Button
       │
       ├─ LeaderboardStack (Stack)
       │  └─ LeaderboardScreen
       │      └─ FlatList [User Cards]
       │          ├─ Medal Emoji (Rank)
       │          ├─ Username
       │          ├─ Level Badge
       │          ├─ Points Display
       │          └─ Workout Count
       │
       ├─ FriendsStack (Stack)
       │  └─ FriendsScreen
       │      ├─ Tabs (Friends / Requests)
       │      ├─ Tab 1: FlatList [Friend Cards]
       │      │  ├─ Friend Name
       │      │  ├─ Level Badge
       │      │  ├─ Points Display
       │      │  └─ Remove Button
       │      └─ Tab 2: FlatList [Request Cards]
       │          ├─ Requester Name
       │          ├─ Accept Button
       │          └─ Reject Button
       │
       └─ ProfileStack (Stack)
           └─ ProfileScreen
               ├─ Avatar
               ├─ Username/Email
               ├─ Stats Cards
               │  ├─ Points
               │  └─ Level
               ├─ Menu Items
               │  ├─ Update Profile
               │  ├─ Privacy Settings
               │  └─ Goals
               └─ Logout Button
```

---

This visual guide helps understand:
- How data flows through the system
- Component and file relationships
- Database structure
- Authentication process
- User interactions

Use this alongside the code to understand the complete architecture! 🎯
