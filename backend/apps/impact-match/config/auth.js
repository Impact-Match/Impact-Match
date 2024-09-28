const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const bcrypt = require("bcrypt");
const pool = require("../db"); // Adjust this to your DB connection file
require("dotenv").config();

const { v4: uuidv4 } = require("uuid"); // Import the uuid library
// Local Strategy for Passport (email/password login)
passport.use(
  new LocalStrategy(
    { usernameField: "email" }, // Using email instead of the default 'username'
    async (email, password, done) => {
      try {
        // Check if the user exists in the database
        const result = await pool.query(
          "SELECT * FROM users WHERE email = $1",
          [email]
        );

        if (result.rows.length === 0) {
          return done(null, false, { message: "Incorrect email or password" });
        }

        const user = result.rows[0];

        // Compare the hashed password in the database with the provided password
        const isMatch = await bcrypt.compare(password, user.password_hash);

        if (!isMatch) {
          return done(null, false, { message: "Incorrect email or password" });
        }

        // If the password is correct, return the user
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);

// Google Strategy for Passport (Google OAuth login)
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if the user exists in the database using the Google ID
        const result = await pool.query(
          "SELECT * FROM users WHERE google_id = $1",
          [profile.id]
        );

        if (result.rows.length === 0) {
          // If the user doesn't exist, return an error instead of creating a new user
          return done(null, false, { message: "User does not exist" });
        }

        // If the user exists, return the existing user
        return done(null, result.rows[0]); // Return the existing user
      } catch (err) {
        return done(err);
      }
    }
  )
);

// Serialize user into the session (works for both local and Google logins)
passport.serializeUser((user, done) => {
  done(null, user.id); // Serialize user ID into session
});

// Deserialize user from the session (works for both local and Google logins)
passport.deserializeUser(async (id, done) => {
  try {
    const result = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
    done(null, result.rows[0]); // Attach user object to `req.user`
  } catch (err) {
    done(err, null);
  }
});

module.exports = passport;
