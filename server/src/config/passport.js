const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
require('dotenv').config();

// In a real application, you would use a database
// For now, we'll use an in-memory users array
const users = [];

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  const user = users.find(user => user.id === id);
  done(null, user);
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: '/api/auth/google/callback',
      scope: ['profile', 'email']
    },
    (accessToken, refreshToken, profile, done) => {
      // Check if user already exists
      let user = users.find(user => user.googleId === profile.id);
      
      if (user) {
        return done(null, user);
      } else {
        // Create a new user
        user = {
          id: Date.now().toString(),
          googleId: profile.id,
          name: profile.displayName,
          email: profile.emails[0].value,
          avatar: profile.photos[0].value
        };
        users.push(user);
        return done(null, user);
      }
    }
  )
);

module.exports = { users };  // Export users for testing purposes
