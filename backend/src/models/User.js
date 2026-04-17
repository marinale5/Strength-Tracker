const pool = require('../config/database');
const { v4: uuidv4 } = require('uuid');

class User {
  static async findById(id) {
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    return result.rows[0];
  }

  static async findByEmail(email) {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    return result.rows[0];
  }

  static async findByGoogleId(googleId) {
    const result = await pool.query('SELECT * FROM users WHERE google_id = $1', [googleId]);
    return result.rows[0];
  }

  static async findByGithubId(githubId) {
    const result = await pool.query('SELECT * FROM users WHERE github_id = $1', [githubId]);
    return result.rows[0];
  }

  static async create(userData) {
    const id = uuidv4();
    const { email, username, displayName, googleId, githubId, avatarUrl } = userData;
    const result = await pool.query(
      `INSERT INTO users (id, email, username, display_name, google_id, github_id, avatar_url)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [id, email, username, displayName, googleId, githubId, avatarUrl]
    );
    return result.rows[0];
  }

  static async updatePoints(userId, pointsEarned) {
    const result = await pool.query(
      `UPDATE users 
       SET points = points + $1, 
           level = FLOOR((points + $1) / 100) + 1,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $2
       RETURNING *`,
      [pointsEarned, userId]
    );
    return result.rows[0];
  }

  static async updateStreak(userId, clientDate) {
    const user = await this.findById(userId);
    const today = clientDate || new Date().toISOString().split('T')[0];
    const lastWorkout = user.last_workout_date ? new Date(user.last_workout_date).toISOString().split('T')[0] : null;

    if (lastWorkout === today) {
      return user; // Already worked out today
    }

    let newStreak = 1;
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    if (lastWorkout === yesterdayStr) {
      newStreak = (user.current_streak || 0) + 1;
    }

    const newLongestStreak = Math.max(newStreak, user.longest_streak || 0);

    const result = await pool.query(
      `UPDATE users
       SET current_streak = $1,
           longest_streak = $2,
           last_workout_date = $3,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $4
       RETURNING *`,
      [newStreak, newLongestStreak, today, userId]
    );
    return result.rows[0];
  }

  static async getStats(userId) {
    const result = await pool.query(
      `SELECT points, level, current_streak, longest_streak, last_workout_date
       FROM users WHERE id = $1`,
      [userId]
    );
    return result.rows[0];
  }

  static async getLeaderboard(limit = 50) {
    const result = await pool.query(
      `SELECT u.id, u.username, u.display_name, u.avatar_url, u.points, u.level,
              COUNT(w.id) as workout_count, MAX(w.created_at) as last_workout_date
       FROM users u
       LEFT JOIN workouts w ON u.id = w.user_id
       GROUP BY u.id
       ORDER BY u.points DESC
       LIMIT $1`,
      [limit]
    );
    return result.rows;
  }

  static async getWorkoutCount(userId) {
    const result = await pool.query(
      'SELECT COUNT(*) as count FROM workouts WHERE user_id = $1',
      [userId]
    );
    return parseInt(result.rows[0].count);
  }
}

module.exports = User;
