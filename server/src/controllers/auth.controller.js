const jwt = require('jsonwebtoken');
const User = require('../models/User');
require('dotenv').config();

// Generate JWT token
const generateToken = (user) => {
  return jwt.sign(
    { 
      id: user.id,
      email: user.email,
      name: user.name
    }, 
    process.env.JWT_SECRET, 
    { expiresIn: '1d' }
  );
};

// Google login success
const googleLoginSuccess = async (req, res) => {
  if (req.user) {
    try {
      // Store or update the user in our database
      const dbUser = await User.createOrUpdate({
        id: req.user.id,
        name: req.user.name,
        email: req.user.email,
        avatar: req.user.photos && req.user.photos[0] ? req.user.photos[0].value : null
      });
      
      // Generate token with the user data
      const token = generateToken(dbUser);
      
      // Redirect to the client with token
      res.redirect(`${process.env.CLIENT_URL}/dashboard?token=${token}`);
    } catch (error) {
      console.error('Error saving user to database:', error);
      res.status(500).json({ error: true, message: 'Internal server error' });
    }
  } else {
    res.status(403).json({ error: true, message: "Not Authorized" });
  }
};

// Login failure
const loginFailed = (req, res) => {
  // Redirect to the client's login page instead of returning JSON
  res.redirect(`${process.env.CLIENT_URL}/login?error=auth_failed`);
};

// Logout
const logout = (req, res) => {
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect(process.env.CLIENT_URL);
  });
};

module.exports = {
  googleLoginSuccess,
  loginFailed,
  logout
};
