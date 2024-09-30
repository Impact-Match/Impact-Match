const express = require("express");
const passport = require("../config/auth"); // Import your Passport setup
const bcrypt = require("bcrypt"); // For hashing passwords
const router = express.Router();
const pool = require("../db"); // Import the database connection
const { body, validationResult } = require("express-validator");
const nodeMailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const fs = require('fs');
const path = require('path');

const { checkExistUser, generateVerificationToken } = require("../util/util"); // Import the function to check if a user exists
// Configure the email transporter (using Gmail or any other email service)
//!!!https://support.google.com/mail/answer/185833?hl=en  create app password for gmail using this as EMAIL_PASSWORD
const transporter = nodeMailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // Your email
    pass: process.env.EMAIL_PASSWORD, // Your email password
  },
});

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

      if (await checkExistUser(email)) {
        return res.status(400).json({ error: "User already exists" });
      }

      // Hash the password
      const password_hash = await bcrypt.hash(password, 10);

      // Insert new user into the database
      await pool.query(
        "INSERT INTO users (email, password_hash, full_name, role) VALUES ($1, $2, $3, $4)",
        [email, password_hash, full_name, role]
      );

      const token = generateVerificationToken(email);
      const link = `http://localhost:8000/auth/verify-email?token=${token}`;

      // Read the HTML template from file
      const templatePath = path.join(__dirname, '../email-verification.html');
      let htmlContent = fs.readFileSync(templatePath, 'utf-8');

      // Replace placeholders with dynamic values
      htmlContent = htmlContent.replace('{{username}}', email);
      htmlContent = htmlContent.replace('{{Link}}', link);

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Impact Match Account Email Verification",
        html: htmlContent,
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log(error, "mail snet error");
        } else {
          console.log("Email sent: " + info.response);
        }
      });
      res.status(201).json({
        message:
          "User registered successfully. Please check your email to verify your account.",
      });
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

/**
 * @swagger
 * /auth/verify-email:
 *   get:
 *     summary: Verifies a user's email
 *     tags: [Auth]
 *     parameters:
 *       - in: query
 *         name: token
 *         schema:
 *           type: string
 *         required: true
 *         description: JWT token for email verification
 *     responses:
 *       200:
 *         description: Email verified successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: Email verified successfully, please login to continue
 *       400:
 *         description: Invalid token or error in verification
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Invalid token"
 */
router.get("/verify-email", async (req, res) => {
  const token = req.query.token;

  console.log("token: " + token);
  if (!token) {
    return res.status(400).json({ error: "Invalid token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const email = decoded.email;

    await pool.query("UPDATE users SET is_verified = true WHERE email = $1", [
      email,
    ]);

    res.send("Email verified successfully, please login to continue");

    //res.redirect("/login");
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: "decoded error" });
  }
});

/**
 * @swagger
 * /auth/forgot-password:
 *   post:
 *     summary: Sends a reset password link to the user's email.
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
 *                 example: "user@example.com"
 *     responses:
 *       200:
 *         description: Reset link sent to the user's email.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Reset link sent to your email. Please check your email to reset your password."
 *       400:
 *         description: Invalid email or user does not exist.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "User does not exist."
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Internal server error"
 */
router.post(
  "/forgot-password",
  body("email").isEmail().withMessage("Invalid email format"),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email } = req.body;

    if (!checkExistUser(email)) {
      return res.status(400).json({ error: "User does not exist" });
    }

    try {
      const token = generateVerificationToken(email); // Fixed typo
      const resetLink = `http://localhost:8000/auth/reset-password?token=${token}`;

      // Read the HTML template from file
      const templatePath = path.join(__dirname, '../email-password.html');
      let htmlContent = fs.readFileSync(templatePath, 'utf-8');

      // Replace placeholders with dynamic values
      htmlContent = htmlContent.replace('{{username}}', email);
      htmlContent = htmlContent.replace('{{resetLink}}', resetLink);

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Reset Your Password",
        html: htmlContent,
      }

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error("Error sending email: ", error);
          return res.status(500).json({ error: "Failed to send email" });
        } else {
          console.log("Email sent: " + info.response);
          res.status(200).json({
            message:
              "Reset link sent to your email. Please check your email to reset your password.",
          });
        }
      });
    } catch (error) {
      console.error("Error generating token or sending email:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
);

/**
 * @swagger
 * /auth/reset-password:
 *   post:
 *     summary: Resets a user's password
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *                 example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *                 description: JWT token for password reset
 *               newPassword:
 *                 type: string
 *                 example: "newPassword123"
 *                 description: New password for the user
 *     responses:
 *       200:
 *         description: Password reset successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Password reset successfully. You can now log in."
 *       400:
 *         description: Invalid token or error in password reset
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Invalid or expired token"
 */
router.post(
  "/reset-password",
  body("token").notEmpty().withMessage("Token is required"),
  body("newPassword").isLength({ min: 6 }).withMessage("Password must be at least 6 characters long"),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { token, newPassword } = req.body;

    try {
      // Verify the token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const email = decoded.email; // Get email from token

      // Update the user's password in the database
      const hashedPassword = await bcrypt.hash(newPassword, 10); // Hash the new password
      await pool.query("UPDATE users SET password_hash = $1 WHERE email = $2", [
        hashedPassword,
        email,
      ]);

      res.status(200).json({
        message: "Password reset successfully. You can now log in.",
      });
    } catch (error) {
      console.error(error);
      return res.status(400).json({ error: "Invalid or expired token" });
    }
  }
);

module.exports = router;
