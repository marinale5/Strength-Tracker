const Achievement = require('../models/Achievement');
const PersonalRecord = require('../models/PersonalRecord');
const User = require('../models/User');
const pool = require('../config/database');

const gamificationController = {
  // Get user's achievements
  getAchievements: async (req, res) => {
    try {
      const userId = req.user.id;
      const achievements = await Achievement.getUserAchievements(userId);
      const allAchievements = await Achievement.getAll();

      res.json({
        earned: achievements,
        all: allAchievements
      });
    } catch (err) {
      console.error('Get achievements error:', err);
      res.status(500).json({ error: 'Failed to get achievements' });
    }
  },

  // Get user's personal records
  getPersonalRecords: async (req, res) => {
    try {
      const userId = req.user.id;
      const records = await PersonalRecord.getForUser(userId);
      res.json(records);
    } catch (err) {
      console.error('Get PRs error:', err);
      res.status(500).json({ error: 'Failed to get personal records' });
    }
  },

  // Get user's current stats (streak, points, etc.)
  getUserStats: async (req, res) => {
    try {
      const userId = req.user.id;
      const stats = await User.getStats(userId);
      res.json(stats);
    } catch (err) {
      console.error('Get stats error:', err);
      res.status(500).json({ error: 'Failed to get stats' });
    }
  },

  getActiveGoals: async (req, res) => {
    try {
      const { v4: uuidv4 } = require('uuid');
      const CommunityGoal = require('../models/CommunityGoal');
      const goals = await CommunityGoal.getActive();

      // If no active goal, seed one for demo
      if (goals.length === 0) {
        const startDate = new Date();
        const endDate = new Date();
        endDate.setDate(endDate.getDate() + 7);

        await pool.query(
          `INSERT INTO community_goals (id, title, description, target_value, current_value, metric, start_date, end_date)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
           ON CONFLICT DO NOTHING`,
          [uuidv4(), 'The Million Pound Challenge', 'Community must lift 1M lbs in a week!', 1000000, 452000, 'lbs', startDate, endDate]
        );
        const newGoals = await CommunityGoal.getActive();
        return res.json(newGoals);
      }

      res.json(goals);
    } catch (err) {
      console.error('Active goals error:', err);
      res.status(500).json({ error: 'Failed to get active goals' });
    }
  },

  getMuscleHeatmap: async (req, res) => {
    try {
      const userId = req.user.id;
      const result = await pool.query(
        `SELECT muscle_group, COUNT(*) as workout_count, SUM(weight * sets * reps) as total_volume
         FROM workouts
         WHERE user_id = $1 AND created_at > NOW() - INTERVAL '30 days'
         GROUP BY muscle_group`,
        [userId]
      );
      res.json(result.rows);
    } catch (err) {
      console.error('Heatmap error:', err);
      res.status(500).json({ error: 'Failed to get heatmap' });
    }
  }
};

module.exports = gamificationController;
