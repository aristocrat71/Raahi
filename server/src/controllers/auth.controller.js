const jwt = require('jsonwebtoken');
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
const googleLoginSuccess = (req, res) => {
  if (req.user) {
    const token = generateToken(req.user);
    res.redirect(`${process.env.CLIENT_URL}/dashboard?token=${token}`);
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
