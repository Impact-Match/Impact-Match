const express = require("express");
const passport = require("../config/auth"); // Import your Passport setup
const bcrypt = require("bcrypt"); // For hashing passwords
const router = express.Router();
const pool = require("../db"); // Import the database connection
const { body, validationResult } = require("express-validator");

/**
 * @swagger
 * /auth/google:
 *   get:
 *     summary: Initiates Google OAuth login
 *     tags: [Auth]
 *     responses:
 *       302:
 *         description: Redirects to Google for authentication
 */
// Google login route
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

/**
 * @swagger
 * /auth/google/callback:
 *   get:
 *     summary: Google OAuth callback route
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Successful authentication, redirects to dashboard
 *       401:
 *         description: Unauthorized
 */
// Google OAuth callback route
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    // Successful authentication, redirect to dashboard
    res.redirect("/dashboard"); // Redirect to a dashboard or any other route
  }
);

/**
 * @swagger
 * /auth/logout:
 *   get:
 *     summary: Logs out the user
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Successful logout
 */
// Logout route
router.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/"); // Redirect to homepage after logout
  });
});

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Registers a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               full_name:
 *                 type: string
 *               role:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Internal server error
 */
// Registration route
router.post(
  "/register",
  // Validate input
  body("email").isEmail().withMessage("Invalid email format"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  body("full_name").notEmpty().withMessage("Full name is required"),
  body("role").notEmpty().withMessage("Role is required"),
  async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password, full_name, role } = req.body;

    try {
      // Check if the user already exists
      const existingUser = await pool.query(
        "SELECT * FROM users WHERE email = $1",
        [email]
      );
      if (existingUser.rows.length > 0) {
        return res.status(400).json({ error: "User already exists" });
      }

      // Hash the password
      const password_hash = await bcrypt.hash(password, 10);

      // Insert new user into the database
      await pool.query(
        "INSERT INTO users (email, password_hash, full_name, role) VALUES ($1, $2, $3, $4)",
        [email, password_hash, full_name, role]
      );

      res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Log in a user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       200:
 *         description: User logged in successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User logged in successfully
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     email:
 *                       type: string
 *                     full_name:
 *                       type: string
 *       400:
 *         description: Invalid email or password
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Incorrect email or password
 *       401:
 *         description: Unauthorized
 */

router.post(
  "/login",
  // Validate input
  body("email").isEmail().withMessage("Invalid email format"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    passport.authenticate("local", (err, user, info) => {
      if (err) {
        return next(err);
      }
      if (!user) {
        return res.status(400).json({ message: info.message });
      }

      req.logIn(user, (err) => {
        if (err) {
          return next(err);
        }
        return res
          .status(200)
          .json({ message: "User logged in successfully", user });
      });
    })(req, res, next); // Invoke passport.authenticate middleware
  }
);

module.exports = router;
