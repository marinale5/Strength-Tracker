# API Documentation

## Base URL
```
http://localhost:5000
```

## Authentication
All authenticated endpoints require:
```
Authorization: Bearer <JWT_TOKEN>
```

---

## Authentication Endpoints

### Google OAuth Login
```
GET /auth/google
```
Redirects to Google OAuth consent screen.

### GitHub OAuth Login
```
GET /auth/github
```
Redirects to GitHub OAuth authorization.

### OAuth Callback Handler
```
GET /auth/google/callback
GET /auth/github/callback
```
Automatically handled after user authorizes. Returns JWT token.

### Get Current User
```
GET /auth/me
Headers: Authorization: Bearer <token>
```
**Response:**
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "username": "username",
  "display_name": "User Name",
  "avatar_url": "https://...",
  "points": 150,
  "level": 2,
  "created_at": "2024-04-16T10:00:00Z"
}
```

### Logout
```
POST /auth/logout
Headers: Authorization: Bearer <token>
```
**Response:**
```json
{
  "message": "Logged out successfully"
}
```

---

## Workout Endpoints

### Log a Workout
```
POST /workouts
Headers: 
  Authorization: Bearer <token>
  Content-Type: application/json

Body:
{
  "exerciseName": "Bench Press",
  "muscleGroup": "Chest",           // Required
  "equipment": "Barbell",           // Optional
  "weight": 185,                    // Optional (in lbs)
  "sets": 3,                        // Required
  "reps": 10,                       // Required
  "notes": "Felt strong"            // Optional
}
```

**Response (201):**
```json
{
  "workout": {
    "id": "uuid",
    "user_id": "uuid",
    "exercise_name": "Bench Press",
    "muscle_group": "Chest",
    "weight": 185,
    "weight_unit": "lbs",
    "sets": 3,
    "reps": 10,
    "points_earned": 38,
    "created_at": "2024-04-16T10:00:00Z"
  },
  "message": "Workout logged! You earned 38 points!"
}
```

### Get User's Workouts
```
GET /workouts/my-workouts?limit=50&offset=0
Headers: Authorization: Bearer <token>
```

**Query Parameters:**
- `limit` (default: 50) - Number of workouts to return
- `offset` (default: 0) - Pagination offset

**Response:**
```json
[
  {
    "id": "uuid",
    "user_id": "uuid",
    "exercise_name": "Bench Press",
    "muscle_group": "Chest",
    "weight": 185,
    "sets": 3,
    "reps": 10,
    "points_earned": 38,
    "created_at": "2024-04-16T10:00:00Z"
  }
]
```

### Get Recent Workouts Feed
```
GET /workouts/recent?limit=20
```

**Query Parameters:**
- `limit` (default: 20) - Number of workouts to return

**Response:**
```json
[
  {
    "id": "uuid",
    "exercise_name": "Deadlift",
    "muscle_group": "Back",
    "weight": 315,
    "sets": 3,
    "reps": 5,
    "points_earned": 63,
    "username": "user123",
    "display_name": "John Doe",
    "avatar_url": "https://...",
    "created_at": "2024-04-16T09:30:00Z"
  }
]
```

### Share a Workout
```
POST /workouts/share
Headers: 
  Authorization: Bearer <token>
  Content-Type: application/json

Body:
{
  "workoutId": "uuid",
  "message": "Just crushed this PR!"
}
```

**Response:**
```json
{
  "share": {
    "id": "uuid",
    "workout_id": "uuid",
    "message": "Just crushed this PR!",
    "created_at": "2024-04-16T10:00:00Z"
  },
  "message": "Workout shared!"
}
```

### Delete a Workout
```
DELETE /workouts/:workoutId
Headers: Authorization: Bearer <token>
```

**Response:**
```json
{
  "message": "Workout deleted"
}
```

---

## Friend Endpoints

### Send Friend Request
```
POST /friends/request
Headers: 
  Authorization: Bearer <token>
  Content-Type: application/json

Body:
{
  "friendId": "uuid"
}
```

**Response:**
```json
{
  "request": {
    "id": "uuid",
    "user_id": "uuid",
    "friend_id": "uuid",
    "status": "pending",
    "created_at": "2024-04-16T10:00:00Z"
  },
  "message": "Friend request sent!"
}
```

### Accept Friend Request
```
POST /friends/accept
Headers: 
  Authorization: Bearer <token>
  Content-Type: application/json

Body:
{
  "friendId": "uuid"
}
```

**Response:**
```json
{
  "friendship": {
    "id": "uuid",
    "user_id": "uuid",
    "friend_id": "uuid",
    "status": "accepted",
    "updated_at": "2024-04-16T10:00:00Z"
  },
  "message": "Friend request accepted!"
}
```

### Reject Friend Request
```
POST /friends/reject
Headers: 
  Authorization: Bearer <token>
  Content-Type: application/json

Body:
{
  "friendId": "uuid"
}
```

**Response:**
```json
{
  "message": "Friend request rejected"
}
```

### Remove Friend
```
DELETE /friends/:friendId
Headers: Authorization: Bearer <token>
```

**Response:**
```json
{
  "message": "Friend removed"
}
```

### Get Friends List
```
GET /friends
Headers: Authorization: Bearer <token>
```

**Response:**
```json
[
  {
    "id": "uuid",
    "username": "friend_user",
    "display_name": "Friend Name",
    "avatar_url": "https://...",
    "points": 250,
    "level": 3
  }
]
```

### Get Pending Friend Requests
```
GET /friends/pending
Headers: Authorization: Bearer <token>
```

**Response:**
```json
[
  {
    "id": "uuid",
    "username": "requester",
    "display_name": "Requester Name",
    "avatar_url": "https://..."
  }
]
```

### Get Friends' Workouts
```
GET /friends/workouts
Headers: Authorization: Bearer <token>
```

**Response:**
```json
[
  {
    "id": "uuid",
    "exercise_name": "Squat",
    "muscle_group": "Legs",
    "weight": 275,
    "sets": 3,
    "reps": 8,
    "points_earned": 45,
    "username": "friend_user",
    "display_name": "Friend Name",
    "created_at": "2024-04-16T09:00:00Z"
  }
]
```

### Get Leaderboard
```
GET /friends/leaderboard?limit=50
```

**Query Parameters:**
- `limit` (default: 50) - Number of users to return

**Response:**
```json
[
  {
    "id": "uuid",
    "username": "top_user",
    "display_name": "Top User",
    "avatar_url": "https://...",
    "points": 1500,
    "level": 15,
    "workout_count": 150,
    "last_workout_date": "2024-04-16T09:00:00Z"
  }
]
```

---

## Error Responses

### 400 Bad Request
```json
{
  "error": "Missing required fields"
}
```

### 401 Unauthorized
```json
{
  "error": "No token provided"
}
```

### 403 Forbidden
```json
{
  "error": "Unauthorized"
}
```

### 404 Not Found
```json
{
  "error": "Workout not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Failed to log workout"
}
```

---

## Points System

Points calculation:
- **Base**: 10 points per workout
- **Weight Bonus**: weight / 10 points
- **Reps Bonus**: 1 point per rep

Example: 185 lbs, 3 sets x 10 reps
- Points = 10 + (185/10) + 10 = 38.5 ≈ 38 points

Level = Floor(Total Points / 100) + 1

---

## Rate Limiting

Currently no rate limiting. Consider adding:
- 100 requests per minute for authenticated endpoints
- 30 requests per minute for public endpoints

---

## Pagination

For paginated endpoints, use:
- `limit`: Number of items per page (default: 50, max: 100)
- `offset`: Starting position (default: 0)

Example:
```
GET /workouts/my-workouts?limit=25&offset=0
```
