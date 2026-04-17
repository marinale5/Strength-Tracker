const express = require('express');
const router = express.Router();
const gamificationController = require('../controllers/gamificationController');
const authMiddleware = require('../middleware/auth');

// Get user achievements
router.get('/achievements', authMiddleware, gamificationController.getAchievements);

// Get user personal records
router.get('/prs', authMiddleware, gamificationController.getPersonalRecords);

// Get user stats (streak, etc.)
router.get('/stats', authMiddleware, gamificationController.getUserStats);

// Get active community goals
router.get('/active-goals', authMiddleware, gamificationController.getActiveGoals);

module.exports = router;
