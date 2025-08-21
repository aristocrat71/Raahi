const router = require('express').Router();
const userController = require('../controllers/user.controller');
const { isAuthenticated } = require('../middleware/auth.middleware');

// Protected user route
router.get('/me', isAuthenticated, userController.getCurrentUser);

module.exports = router;
