// auth.js
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
require('dotenv').config();

// Replace with your Google Client ID and Secret from the Google Developer Console
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

// Configure Passport to use Google OAuth
passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback"
  },
  function (accessToken, refreshToken, profile, done) {
    // Logic to handle user after successful authentication
    const user = { id: profile.id, email: profile.emails[0].value, displayName: profile.displayName };
    return done(null, user);
  }
));

// Serialize and deserialize user (for session management)
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

// Export the passport configuration
module.exports = passport;
