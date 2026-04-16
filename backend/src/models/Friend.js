const pool = require('../config/database');
const { v4: uuidv4 } = require('uuid');

class Friend {
  static async sendRequest(userId, friendId) {
    const id = uuidv4();
    const result = await pool.query(
      `INSERT INTO friends (id, user_id, friend_id, status)
       VALUES ($1, $2, $3, 'pending')
       ON CONFLICT (user_id, friend_id) DO UPDATE SET status = 'pending'
       RETURNING *`,
      [id, userId, friendId]
    );
    return result.rows[0];
  }

  static async acceptRequest(userId, friendId) {
    // Update the request
    await pool.query(
      `UPDATE friends SET status = 'accepted' WHERE user_id = $1 AND friend_id = $2 AND status = 'pending'`,
      [friendId, userId]
    );
    
    // Create reverse relationship
    const id = uuidv4();
    const result = await pool.query(
      `INSERT INTO friends (id, user_id, friend_id, status)
       VALUES ($1, $2, $3, 'accepted')
       ON CONFLICT (user_id, friend_id) DO UPDATE SET status = 'accepted'
       RETURNING *`,
      [id, userId, friendId]
    );
    return result.rows[0];
  }

  static async rejectRequest(userId, friendId) {
    const result = await pool.query(
      `DELETE FROM friends WHERE user_id = $1 AND friend_id = $2 RETURNING *`,
      [friendId, userId]
    );
    return result.rows[0];
  }

  static async removeFriend(userId, friendId) {
    await pool.query(
      `DELETE FROM friends WHERE (user_id = $1 AND friend_id = $2) OR (user_id = $2 AND friend_id = $1)`,
      [userId, friendId]
    );
    return true;
  }

  static async getFriends(userId) {
    const result = await pool.query(
      `SELECT u.id, u.username, u.display_name, u.avatar_url, u.points, u.level
       FROM friends f
       JOIN users u ON f.friend_id = u.id
       WHERE f.user_id = $1 AND f.status = 'accepted'`,
      [userId]
    );
    return result.rows;
  }

  static async getPendingRequests(userId) {
    const result = await pool.query(
      `SELECT u.id, u.username, u.display_name, u.avatar_url
       FROM friends f
       JOIN users u ON f.user_id = u.id
       WHERE f.friend_id = $1 AND f.status = 'pending'`,
      [userId]
    );
    return result.rows;
  }

  static async getFriendWorkouts(userId) {
    const result = await pool.query(
      `SELECT w.*, u.username, u.display_name, u.avatar_url
       FROM workouts w
       JOIN users u ON w.user_id = u.id
       JOIN friends f ON (f.user_id = $1 AND f.friend_id = w.user_id)
       WHERE f.status = 'accepted'
       ORDER BY w.created_at DESC
       LIMIT 50`,
      [userId]
    );
    return result.rows;
  }
}

module.exports = Friend;
