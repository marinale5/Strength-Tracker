const User = require('../models/User');
const Workout = require('../models/Workout');
const jwt = require('jsonwebtoken');

const authController = {
  // Handle OAuth callback
  handleOAuthCallback: async (req, res) => {
    try {
      const { id, displayName, photos, emails } = req.user;
      const email = emails?.[0]?.value;

      // Generate token
      const token = jwt.sign(
        { id: req.user.id, email, username: req.user.username },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRE }
      );

      // Redirect to frontend with token
      res.redirect(
        `${process.env.FRONTEND_URL}/auth/callback?token=${token}&userId=${req.user.id}`
      );
    } catch (err) {
      console.error('Auth callback error:', err);
      res.status(500).json({ error: 'Authentication failed' });
    }
  },

  // Get current user
  getCurrentUser: async (req, res) => {
    try {
      const user = await User.findById(req.user.id);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.json(user);
    } catch (err) {
      console.error('Get current user error:', err);
      res.status(500).json({ error: 'Failed to get user' });
    }
  },

  // Logout
  logout: (req, res) => {
    req.logout((err) => {
      if (err) {
        return res.status(500).json({ error: 'Logout failed' });
      }
      res.json({ message: 'Logged out successfully' });
    });
  },
};

module.exports = authController;
