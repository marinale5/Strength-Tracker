const pool = require('../config/database');
const { v4: uuidv4 } = require('uuid');

class Workout {
  static async create(userId, workoutData) {
    const id = uuidv4();
    const { exerciseName, muscleGroup, equipment, weight, weightUnit, sets, reps, notes } = workoutData;
    
    // Calculate points: base 10 points + bonus for weight and reps
    const pointsEarned = Math.floor(10 + (weight || 0) / 10 + reps);
    
    const result = await pool.query(
      `INSERT INTO workouts (id, user_id, exercise_name, muscle_group, equipment, weight, weight_unit, sets, reps, notes, points_earned)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
       RETURNING *`,
      [id, userId, exerciseName, muscleGroup, equipment, weight, weightUnit, sets, reps, notes, pointsEarned]
    );
    
    return result.rows[0];
  }

  static async findById(id) {
    const result = await pool.query('SELECT * FROM workouts WHERE id = $1', [id]);
    return result.rows[0];
  }

  static async getUserWorkouts(userId, limit = 50, offset = 0) {
    const result = await pool.query(
      `SELECT * FROM workouts WHERE user_id = $1 ORDER BY created_at DESC LIMIT $2 OFFSET $3`,
      [userId, limit, offset]
    );
    return result.rows;
  }

  static async getRecentWorkouts(limit = 20) {
    const result = await pool.query(
      `SELECT w.*, u.username, u.display_name, u.avatar_url
       FROM workouts w
       JOIN users u ON w.user_id = u.id
       ORDER BY w.created_at DESC
       LIMIT $1`,
      [limit]
    );
    return result.rows;
  }

  static async shareWorkout(workoutId, message = '') {
    const id = uuidv4();
    const result = await pool.query(
      `INSERT INTO workout_shares (id, workout_id, message)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [id, workoutId, message]
    );
    return result.rows[0];
  }

  static async delete(workoutId, userId) {
    const result = await pool.query(
      `DELETE FROM workouts WHERE id = $1 AND user_id = $2 RETURNING *`,
      [workoutId, userId]
    );
    return result.rows[0];
  }
}

module.exports = Workout;
