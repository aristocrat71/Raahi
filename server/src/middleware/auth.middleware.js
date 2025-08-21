const jwt = require('jsonwebtoken');
require('dotenv').config();

// Verify JWT token
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1] || req.query.token;

  if (!token) {
    return res.status(403).json({ error: true, message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: true, message: "Unauthorized" });
  }
};

// Check if user is authenticated
const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated() && req.user) {
    return next();
  }
  
  // If not authenticated via session, check for JWT
  return verifyToken(req, res, next);
};

module.exports = {
  verifyToken,
  isAuthenticated
};
