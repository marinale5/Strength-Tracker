const express = require('express');
const router = express.Router();
const passport = require('passport');
const pool = require('../config/database');
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/auth');

// Google auth
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/' }), authController.handleOAuthCallback);

// GitHub auth
router.get('/github', passport.authenticate('github'));
router.get('/github/callback', passport.authenticate('github', { failureRedirect: '/' }), authController.handleOAuthCallback);

// Get current user
router.get('/me', authMiddleware, authController.getCurrentUser);

// Logout
router.post('/logout', authMiddleware, authController.logout);

router.post('/update-weight', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const { weight } = req.body;
    await pool.query('UPDATE users SET body_weight = $1 WHERE id = $2', [weight, userId]);
    res.json({ message: 'Weight updated' });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/update-theme', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const { theme } = req.body;
    await pool.query('UPDATE users SET theme_preference = $1 WHERE id = $2', [theme, userId]);
    res.json({ message: 'Theme preference updated' });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
