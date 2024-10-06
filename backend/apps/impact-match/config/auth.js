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
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true,
    }, // Pass the entire request to the callback
    async (req, email, password, done) => {
      const role = req.body.role;
      try {
        // Check if the user exists in the database
        const result = await pool.query(
          "SELECT * FROM users WHERE email = $1 AND role = $2",
          [email, role]
        );
        if (result.rows.length === 0) {
          return done(null, false, { message: "Incorrect email or password" });
        }

        const user = result.rows[0];
        // Check if the user's role matches the role sent in the request
        if (user.role !== role) {
          return done(null, false, { message: "Unauthorized role" });
        }

        if (user.is_verified === false) {
          return done(null, false, { message: "Please verify your email" });
        }

        if (role === "ngo" && user.ngo_verify === false) {
          return done(null, false, {
            message: "Please contact admin to verify your NGO email",
          });
        }
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
        // Extract the email from the profile
        const email = profile.emails[0].value; // Get the user's email from the profile
        const googleId = profile.id; // Get the user's Google ID

        // Check if the user exists in the database using the email
        const result = await pool.query(
          "SELECT * FROM users WHERE email = $1",
          [email]
        );

        if (result.rows.length === 0) {
          // If the user doesn't exist, return an error
          return done(null, false, { message: "User does not exist" });
        }

        // User exists, update their Google ID
        const user = result.rows[0];
        await pool.query("UPDATE users SET google_id = $1 WHERE id = $2", [
          googleId,
          user.id,
        ]);

        // Return the updated user
        return done(null, user); // Return the updated user object
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
