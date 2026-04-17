const Achievement = require('../models/Achievement');
const PersonalRecord = require('../models/PersonalRecord');
const User = require('../models/User');

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
  }
};

module.exports = gamificationController;
