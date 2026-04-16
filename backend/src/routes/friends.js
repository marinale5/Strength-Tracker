const express = require('express');
const router = express.Router();
const friendController = require('../controllers/friendController');
const authMiddleware = require('../middleware/auth');

// Send friend request
router.post('/request', authMiddleware, friendController.sendFriendRequest);

// Accept friend request
router.post('/accept', authMiddleware, friendController.acceptFriendRequest);

// Reject friend request
router.post('/reject', authMiddleware, friendController.rejectFriendRequest);

// Remove friend
router.delete('/:friendId', authMiddleware, friendController.removeFriend);

// Get friends
router.get('/', authMiddleware, friendController.getFriends);

// Get pending requests
router.get('/pending', authMiddleware, friendController.getPendingRequests);

// Get friends' workouts
router.get('/workouts', authMiddleware, friendController.getFriendWorkouts);

// Get leaderboard
router.get('/leaderboard', friendController.getLeaderboard);

module.exports = router;
