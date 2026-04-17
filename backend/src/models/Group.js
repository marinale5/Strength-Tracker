const pool = require('../config/database');
const { v4: uuidv4 } = require('uuid');

class Group {
  static async create(ownerId, name, description) {
    const id = uuidv4();
    const inviteCode = Math.random().toString(36).substring(2, 8).toUpperCase();

    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      const result = await client.query(
        `INSERT INTO groups (id, name, description, invite_code, owner_id)
         VALUES ($1, $2, $3, $4, $5) RETURNING *`,
        [id, name, description, inviteCode, ownerId]
      );

      await client.query(
        `INSERT INTO group_members (group_id, user_id, role)
         VALUES ($1, $2, 'owner')`,
        [id, ownerId]
      );

      await client.query('COMMIT');
      return result.rows[0];
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  }

  static async joinByCode(userId, inviteCode) {
    const groupResult = await pool.query('SELECT id FROM groups WHERE invite_code = $1', [inviteCode]);
    const group = groupResult.rows[0];
    if (!group) throw new Error('Invalid invite code');

    await pool.query(
      `INSERT INTO group_members (group_id, user_id)
       VALUES ($1, $2) ON CONFLICT DO NOTHING`,
      [group.id, userId]
    );
    return group;
  }

  static async getForUser(userId) {
    const result = await pool.query(
      `SELECT g.*, COUNT(gm.user_id) as member_count
       FROM groups g
       JOIN group_members gm ON g.id = gm.group_id
       WHERE g.id IN (SELECT group_id FROM group_members WHERE user_id = $1)
       GROUP BY g.id`,
      [userId]
    );
    return result.rows;
  }
}

module.exports = Group;
