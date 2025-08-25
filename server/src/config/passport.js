const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');
const { supabaseAdmin } = require('./supabase');
require('dotenv').config();

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.getById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: '/api/auth/google/callback',
      scope: ['profile', 'email']
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if user exists in Supabase
        const { data: existingUser, error } = await supabaseAdmin
          .from('users')
          .select('*')
          .eq('email', profile.emails[0].value)
          .single();
        
        if (error && error.code !== 'PGRST116') {
          console.error('Error checking for existing user:', error);
          return done(error, null);
        }
        
        if (existingUser) {
          // User exists, return it
          return done(null, existingUser);
        } else {
          // Create a new user in the auth schema with the Google OAuth provider
          const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
            email: profile.emails[0].value,
            email_confirm: true,
            user_metadata: {
              full_name: profile.displayName,
              avatar_url: profile.photos[0].value,
              provider: 'google'
            }
          });
          
          if (authError) {
            console.error('Error creating auth user:', authError);
            return done(authError, null);
          }
          
          // Create the user in our application database
          const newUser = {
            id: authUser.user.id,
            name: profile.displayName,
            email: profile.emails[0].value,
            avatar: profile.photos[0].value
          };
          
          // Use our User model to create the user
          const user = await User.createOrUpdate(newUser);
          return done(null, user);
        }
      } catch (error) {
        console.error('Error in Google strategy:', error);
        return done(error, null);
      }
    }
  )
);
