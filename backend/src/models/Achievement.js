const pool = require('../config/database');
const { v4: uuidv4 } = require('uuid');

class Achievement {
  static async getAll() {
    const result = await pool.query('SELECT * FROM achievements ORDER BY category, name');
    return result.rows;
  }

  static async getUserAchievements(userId) {
    const result = await pool.query(
      `SELECT a.*, ua.earned_at
       FROM achievements a
       JOIN user_achievements ua ON a.id = ua.achievement_id
       WHERE ua.user_id = $1
       ORDER BY ua.earned_at DESC`,
      [userId]
    );
    return result.rows;
  }

  static async earn(userId, achievementName) {
    try {
      const achievementResult = await pool.query(
        'SELECT * FROM achievements WHERE name = $1',
        [achievementName]
      );
      const achievement = achievementResult.rows[0];
      if (!achievement) return null;

      const id = uuidv4();
      const insertResult = await pool.query(
        `INSERT INTO user_achievements (id, user_id, achievement_id)
         VALUES ($1, $2, $3)
         ON CONFLICT (user_id, achievement_id) DO NOTHING
         RETURNING *`,
        [id, userId, achievement.id]
      );

      // If a new row was inserted, award points
      if (insertResult.rows.length > 0 && achievement.points_awarded > 0) {
        await pool.query(
          'UPDATE users SET points = points + $1, level = FLOOR((points + $1) / 100) + 1 WHERE id = $2',
          [achievement.points_awarded, userId]
        );
      } else if (insertResult.rows.length === 0) {
        return null; // Already earned
      }

      return achievement;
    } catch (err) {
      console.error('Earn achievement error:', err);
      return null;
    }
  }

  static async checkAndAward(userId, workout, stats, userTime) {
    const newAchievements = [];

    // First Workout
    if (stats.workout_count === 1) {
      const a = await this.earn(userId, 'First Workout');
      if (a) newAchievements.push(a);
    }

    // Time-based (Secret) - use userTime if provided, else server time
    const hour = userTime ? new Date(userTime).getHours() : new Date().getHours();
    if (hour < 7) {
      const a = await this.earn(userId, 'Early Bird');
      if (a) newAchievements.push(a);
    } else if (hour >= 22) {
      const a = await this.earn(userId, 'Night Owl');
      if (a) newAchievements.push(a);
    }

    // Streak-based
    if (stats.current_streak >= 7) {
      const a = await this.earn(userId, 'Consistency King');
      if (a) newAchievements.push(a);
    }

    // Strength-based
    if (workout.exercise_name.toLowerCase().includes('bench press') && workout.weight >= 225) {
      const a = await this.earn(userId, 'Plate Power');
      if (a) newAchievements.push(a);
    }

    // Volume-based
    const tonnage = workout.weight * workout.sets * workout.reps;
    if (tonnage >= 10000) {
      const a = await this.earn(userId, 'Volume King');
      if (a) newAchievements.push(a);
    }

    return newAchievements;
  }
}

module.exports = Achievement;
