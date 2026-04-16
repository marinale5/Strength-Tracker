const Workout = require('../models/Workout');
const User = require('../models/User');

const workoutController = {
  // Log a workout
  logWorkout: async (req, res) => {
    try {
      const { exerciseName, muscleGroup, equipment, weight, weightUnit, sets, reps, notes } = req.body;
      const userId = req.user.id;

      if (!exerciseName || !muscleGroup || !sets || !reps) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      const workout = await Workout.create(userId, {
        exerciseName,
        muscleGroup,
        equipment,
        weight,
        weightUnit: weightUnit || 'lbs',
        sets,
        reps,
        notes,
      });

      // Award points to user
      await User.updatePoints(userId, workout.points_earned);

      res.status(201).json({
        workout,
        message: `Workout logged! You earned ${workout.points_earned} points!`,
      });
    } catch (err) {
      console.error('Log workout error:', err);
      res.status(500).json({ error: 'Failed to log workout' });
    }
  },

  // Get user's workouts
  getUserWorkouts: async (req, res) => {
    try {
      const userId = req.user.id;
      const { limit = 50, offset = 0 } = req.query;

      const workouts = await Workout.getUserWorkouts(
        userId,
        parseInt(limit),
        parseInt(offset)
      );

      res.json(workouts);
    } catch (err) {
      console.error('Get user workouts error:', err);
      res.status(500).json({ error: 'Failed to get workouts' });
    }
  },

  // Get recent workouts (feed)
  getRecentWorkouts: async (req, res) => {
    try {
      const { limit = 20 } = req.query;
      const workouts = await Workout.getRecentWorkouts(parseInt(limit));
      res.json(workouts);
    } catch (err) {
      console.error('Get recent workouts error:', err);
      res.status(500).json({ error: 'Failed to get workouts' });
    }
  },

  // Share a workout
  shareWorkout: async (req, res) => {
    try {
      const { workoutId, message } = req.body;
      const userId = req.user.id;

      // Verify workout belongs to user
      const workout = await Workout.findById(workoutId);
      if (!workout || workout.user_id !== userId) {
        return res.status(403).json({ error: 'Unauthorized' });
      }

      const share = await Workout.shareWorkout(workoutId, message);
      res.status(201).json({
        share,
        message: 'Workout shared!',
      });
    } catch (err) {
      console.error('Share workout error:', err);
      res.status(500).json({ error: 'Failed to share workout' });
    }
  },

  // Delete a workout
  deleteWorkout: async (req, res) => {
    try {
      const { workoutId } = req.params;
      const userId = req.user.id;

      const workout = await Workout.delete(workoutId, userId);
      if (!workout) {
        return res.status(404).json({ error: 'Workout not found' });
      }

      res.json({ message: 'Workout deleted' });
    } catch (err) {
      console.error('Delete workout error:', err);
      res.status(500).json({ error: 'Failed to delete workout' });
    }
  },
};

module.exports = workoutController;
