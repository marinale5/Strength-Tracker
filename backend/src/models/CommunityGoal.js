const pool = require('../config/database');
const { v4: uuidv4 } = require('uuid');

class CommunityGoal {
  static async getActive() {
    const result = await pool.query(
      `SELECT * FROM community_goals
       WHERE start_date <= NOW() AND end_date >= NOW() AND is_completed = false`
    );
    return result.rows;
  }

  static async contribute(userId, metric, value) {
    await pool.query(
      `UPDATE community_goals
       SET current_value = current_value + $1,
           is_completed = (current_value + $1 >= target_value)
       WHERE metric = $2 AND start_date <= NOW() AND end_date >= NOW() AND is_completed = false`,
      [value, metric]
    );
  }
}

module.exports = CommunityGoal;
