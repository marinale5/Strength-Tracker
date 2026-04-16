const User = require('../models/User');
const Friend = require('../models/Friend');

const friendController = {
  // Send friend request
  sendFriendRequest: async (req, res) => {
    try {
      const { friendId } = req.body;
      const userId = req.user.id;

      if (!friendId) {
        return res.status(400).json({ error: 'Friend ID required' });
      }

      if (userId === friendId) {
        return res.status(400).json({ error: 'Cannot add yourself' });
      }

      const request = await Friend.sendRequest(userId, friendId);
      res.status(201).json({
        request,
        message: 'Friend request sent!',
      });
    } catch (err) {
      console.error('Send friend request error:', err);
      res.status(500).json({ error: 'Failed to send friend request' });
    }
  },

  // Accept friend request
  acceptFriendRequest: async (req, res) => {
    try {
      const { friendId } = req.body;
      const userId = req.user.id;

      const friendship = await Friend.acceptRequest(userId, friendId);
      res.json({
        friendship,
        message: 'Friend request accepted!',
      });
    } catch (err) {
      console.error('Accept friend request error:', err);
      res.status(500).json({ error: 'Failed to accept friend request' });
    }
  },

  // Reject friend request
  rejectFriendRequest: async (req, res) => {
    try {
      const { friendId } = req.body;
      const userId = req.user.id;

      await Friend.rejectRequest(userId, friendId);
      res.json({ message: 'Friend request rejected' });
    } catch (err) {
      console.error('Reject friend request error:', err);
      res.status(500).json({ error: 'Failed to reject friend request' });
    }
  },

  // Remove friend
  removeFriend: async (req, res) => {
    try {
      const { friendId } = req.params;
      const userId = req.user.id;

      await Friend.removeFriend(userId, friendId);
      res.json({ message: 'Friend removed' });
    } catch (err) {
      console.error('Remove friend error:', err);
      res.status(500).json({ error: 'Failed to remove friend' });
    }
  },

  // Get user's friends
  getFriends: async (req, res) => {
    try {
      const userId = req.user.id;
      const friends = await Friend.getFriends(userId);
      res.json(friends);
    } catch (err) {
      console.error('Get friends error:', err);
      res.status(500).json({ error: 'Failed to get friends' });
    }
  },

  // Get pending friend requests
  getPendingRequests: async (req, res) => {
    try {
      const userId = req.user.id;
      const requests = await Friend.getPendingRequests(userId);
      res.json(requests);
    } catch (err) {
      console.error('Get pending requests error:', err);
      res.status(500).json({ error: 'Failed to get pending requests' });
    }
  },

  // Get friends' workouts (feed)
  getFriendWorkouts: async (req, res) => {
    try {
      const userId = req.user.id;
      const workouts = await Friend.getFriendWorkouts(userId);
      res.json(workouts);
    } catch (err) {
      console.error('Get friend workouts error:', err);
      res.status(500).json({ error: 'Failed to get friend workouts' });
    }
  },

  // Get leaderboard
  getLeaderboard: async (req, res) => {
    try {
      const { limit = 50 } = req.query;
      const leaderboard = await User.getLeaderboard(parseInt(limit));
      res.json(leaderboard);
    } catch (err) {
      console.error('Get leaderboard error:', err);
      res.status(500).json({ error: 'Failed to get leaderboard' });
    }
  },
};

module.exports = friendController;
