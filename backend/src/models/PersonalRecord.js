const pool = require('../config/database');
const { v4: uuidv4 } = require('uuid');

class PersonalRecord {
  static async getForUser(userId) {
    const result = await pool.query(
      `SELECT * FROM personal_records WHERE user_id = $1 ORDER BY exercise_name`,
      [userId]
    );
    return result.rows;
  }

  static async updateIfBetter(userId, workout) {
    const { exercise_name, weight, reps, sets, id: workoutId } = workout;
    const tonnage = (weight || 0) * reps * sets;

    // Fetch user body weight for relative strength
    const userResult = await pool.query('SELECT body_weight FROM users WHERE id = $1', [userId]);
    const bodyWeight = parseFloat(userResult.rows[0].body_weight) || 180; // Default if not set

    // Brzycki Formula for E1RM: weight * (36 / (37 - reps))
    // Limit reps to 30 to avoid division by zero or unrealistic results
    const cappedReps = Math.min(reps, 30);
    const e1rm = cappedReps > 1 ? (weight * (36 / (37 - cappedReps))) : weight;

    // Check existing PR
    const existingResult = await pool.query(
      'SELECT * FROM personal_records WHERE user_id = $1 AND exercise_name = $2',
      [userId, exercise_name]
    );
    const existing = existingResult.rows[0];

    const relativeStrength = weight / bodyWeight;

    const newRecord = {
      isNewBestWeight: !existing || weight > existing.best_weight,
      isNewBestReps: !existing || (reps > existing.best_rep_count),
      isNewMaxTonnage: !existing || tonnage > existing.max_tonnage,
      isNewE1RM: !existing || e1rm > existing.estimated_one_rep_max,
      isNewRelativeStrength: !existing || relativeStrength > (existing.best_weight / bodyWeight)
    };

    if (!existing) {
      await pool.query(
        `INSERT INTO personal_records
         (user_id, exercise_name, best_weight, best_rep_count, best_rep_weight, max_tonnage, estimated_one_rep_max, workout_id)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [userId, exercise_name, weight, reps, weight, tonnage, e1rm, workoutId]
      );
    } else if (newRecord.isNewBestWeight || newRecord.isNewBestReps || newRecord.isNewMaxTonnage || newRecord.isNewE1RM) {
      await pool.query(
        `UPDATE personal_records
         SET best_weight = GREATEST(best_weight, $1),
             best_rep_count = CASE WHEN $2 > best_rep_count THEN $2 ELSE best_rep_count END,
             best_rep_weight = CASE WHEN $2 > best_rep_count THEN $1 ELSE best_rep_weight END,
             max_tonnage = GREATEST(max_tonnage, $3),
             estimated_one_rep_max = GREATEST(estimated_one_rep_max, $4),
             workout_id = $5,
             updated_at = CURRENT_TIMESTAMP
         WHERE user_id = $6 AND exercise_name = $7`,
        [weight, reps, tonnage, e1rm, workoutId, userId, exercise_name]
      );
    }

    return Object.values(newRecord).some(v => v === true) ? newRecord : null;
  }
}

module.exports = PersonalRecord;
