const pool = require('../config/database');
const { v4: uuidv4 } = require('uuid');

class Routine {
  static async create(userId, name, exercises) {
    const templateId = uuidv4();
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      await client.query(
        `INSERT INTO workout_templates (id, user_id, name) VALUES ($1, $2, $3)`,
        [templateId, userId, name]
      );

      for (let i = 0; i < exercises.length; i++) {
        const { exerciseName, sets, reps } = exercises[i];
        await client.query(
          `INSERT INTO template_exercises (template_id, exercise_name, suggested_sets, suggested_reps, order_index)
           VALUES ($1, $2, $3, $4, $5)`,
          [templateId, exerciseName, sets, reps, i]
        );
      }

      await client.query('COMMIT');
      return { id: templateId, name, exercises };
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  }

  static async getForUser(userId) {
    const result = await pool.query(
      `SELECT t.*,
              json_agg(json_build_object('name', e.exercise_name, 'sets', e.suggested_sets, 'reps', e.suggested_reps) ORDER BY e.order_index) as exercises
       FROM workout_templates t
       LEFT JOIN template_exercises e ON t.id = e.template_id
       WHERE t.user_id = $1
       GROUP BY t.id`,
      [userId]
    );
    return result.rows;
  }
}

module.exports = Routine;
