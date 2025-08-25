const router = require('express').Router();
const userController = require('../controllers/user.controller');
const { isAuthenticated } = require('../middleware/auth.middleware');
const { authenticateJWT } = require('../middleware/auth');

// Protected user routes
router.get('/me', isAuthenticated, userController.getCurrentUser);

// JWT protected routes
router.put('/profile', authenticateJWT, userController.updateProfile);

module.exports = router;
