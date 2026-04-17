const Achievement = require('../models/Achievement');
const PersonalRecord = require('../models/PersonalRecord');
const User = require('../models/User');
const CommunityGoal = require('../models/CommunityGoal');
const pool = require('../config/database');
const { v4: uuidv4 } = require('uuid');

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

  getSeasons: async (req, res) => {
    try {
      const result = await pool.query('SELECT * FROM seasons ORDER BY start_date DESC');
      res.json(result.rows);
    } catch (err) {
      res.status(500).json({ error: 'Failed to get seasons' });
    }
  },

  getActiveGoals: async (req, res) => {
    try {
      const goals = await CommunityGoal.getActive();
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
