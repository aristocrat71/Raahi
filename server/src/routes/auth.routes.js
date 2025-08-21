const router = require('express').Router();
const passport = require('passport');
const authController = require('../controllers/auth.controller');

// Google OAuth routes
router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get(
  '/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/api/auth/failed',
    session: true
  }),
  authController.googleLoginSuccess
);

// Auth status routes
router.get('/failed', authController.loginFailed);
router.get('/logout', authController.logout);

module.exports = router;
