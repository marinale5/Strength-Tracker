const express = require('express');
const router = express.Router();
const workoutController = require('../controllers/workoutController');
const authMiddleware = require('../middleware/auth');

// Log workout
router.post('/', authMiddleware, workoutController.logWorkout);

// Get user workouts
router.get('/my-workouts', authMiddleware, workoutController.getUserWorkouts);

// Get recent workouts (feed)
router.get('/recent', workoutController.getRecentWorkouts);

// Share workout
router.post('/share', authMiddleware, workoutController.shareWorkout);

// Templates
router.get('/templates', authMiddleware, workoutController.getTemplates);
router.post('/templates', authMiddleware, workoutController.saveTemplate);

// Delete workout
router.delete('/:workoutId', authMiddleware, workoutController.deleteWorkout);

module.exports = router;
