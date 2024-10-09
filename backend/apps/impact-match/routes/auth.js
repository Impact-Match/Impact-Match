const express = require("express");
const passport = require("../config/auth"); // Import your Passport setup
const bcrypt = require("bcrypt"); // For hashing passwords
const router = express.Router();
const pool = require("../db"); // Import the database connection
const { body, validationResult } = require("express-validator");
const nodeMailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");
require("dotenv").config();
const {
  checkExistUser,
  generateVerificationToken,
  checkUserNotVerified,
} = require("../util/util"); // Import the function to check if a user exists
const e = require("express");
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
  passport.authenticate("google", {
    failureRedirect: process.env.REACT_APP + "/login",
  }),
  (req, res) => {
    // Successful authentication, redirect to dashboard
    res.redirect(process.env.REACT_APP + "/profile"); // Redirect to a dashboard or any other route
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
      const link = process.env.REACT_APP + `/verify-result?token=${token}`;

      // Read the HTML template from file
      const templatePath = path.join(
        __dirname,
        "../emails/email-verification.html"
      );
      let htmlContent = fs.readFileSync(templatePath, "utf-8");

      // Replace placeholders with dynamic values
      htmlContent = htmlContent.replace("{{username}}", email);
      htmlContent = htmlContent.replace("{{Link}}", link);

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
 *     summary: Log in a user with email, password, and role
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
 *                 description: The user's email address
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 description: The user's password (must be at least 6 characters long)
 *                 example: password123
 *               role:
 *                 type: string
 *                 description: The user's role (e.g., 'admin', 'student', 'ngo')
 *                 example: admin
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
 *                       example: 123e4567-e89b-12d3-a456-426614174000
 *                     email:
 *                       type: string
 *                       example: user@example.com
 *                     role:
 *                       type: string
 *                       example: admin
 *                     full_name:
 *                       type: string
 *                       example: John Doe
 *       400:
 *         description: Invalid input or incorrect credentials
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Incorrect email or password
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       msg:
 *                         type: string
 *                         example: Invalid email format
 *       500:
 *         description: Internal server error
 */
router.post(
  "/login",
  // Validate input
  body("email").isEmail().withMessage("Invalid email format"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  body("role").notEmpty().withMessage("Role is required"), // Validate role
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    passport.authenticate("local", async (err, user, info) => {
      if (err) {
        return next(err);
      }
      if (!user) {
        // If user exists but has not verified their email
        if (info.message === "Please verify your email") {
          try {
            const { email } = req.body;

            // Generate verification token
            const token = generateVerificationToken(email);
            const link =
              process.env.REACT_APP + `/verify-result?token=${token}`;

            // Read HTML template
            const templatePath = path.join(
              __dirname,
              "../emails/email-verification.html"
            );
            let htmlContent = fs.readFileSync(templatePath, "utf-8");

            // Replace placeholders in the template
            htmlContent = htmlContent.replace("{{username}}", email);
            htmlContent = htmlContent.replace("{{Link}}", link);

            // Send verification email
            const mailOptions = {
              from: process.env.EMAIL_USER,
              to: email,
              subject: "Impact Match Account Email Verification",
              html: htmlContent,
            };

            transporter.sendMail(mailOptions, (error, info) => {
              if (error) {
                console.log("Error sending verification email:", error);
              } else {
                console.log("Verification email sent: " + info.response);
              }
            });

            // Return message prompting the user to verify email
            return res.status(400).json({
              message: info.message, // 'Please verify your email'
            });
          } catch (error) {
            console.error("Error during email verification process:", error);
            return res.status(500).json({ error: "Internal server error" });
          }
        }

        // Other cases where user is not found
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
  console.log("req.query" + req.query);

  console.log("token: " + token);
  if (!token) {
    return res.status(400).json({ error: "Invalid token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("decoded: " + decoded);
    const email = decoded.email;
    const role = decoded.role;
    const isNgoRequired = decoded.isNgoRequired;
    const isAdmin = decoded.isAdmin;
    console.log("/verify-email role:" + role);
    console.log("/verify-email isNgoRequired:" + isNgoRequired);
    console.log("/verify-email isAdmin:" + isAdmin);
    await pool.query("UPDATE users SET is_verified = true WHERE email = $1", [
      email,
    ]);

    res.status(200).json({
      message: "Email verified successfully, please login to continue.",
      role: role,
      isNgoRequired: isNgoRequired,
      isAdmin: isAdmin,
    });
    // res.send("Email verified successfully, please login to continue");

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
      const resetLink =
        process.env.REACT_APP + `/reset-password?token=${token}`;

      // Read the HTML template from file
      const templatePath = path.join(
        __dirname,
        "../emails/email-password.html"
      );
      let htmlContent = fs.readFileSync(templatePath, "utf-8");

      // Replace placeholders with dynamic values
      htmlContent = htmlContent.replace("{{username}}", email);
      htmlContent = htmlContent.replace("{{resetLink}}", resetLink);

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Reset Your Password",
        html: htmlContent,
      };

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
  body("newPassword")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
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

/**
 * @swagger
 * /auth/resend-email:
 *   post:
 *     summary: Resend a verification email to the user
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
 *                 description: The user's email address
 *                 example: user@example.com
 *     responses:
 *       200:
 *         description: Verification email sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Reset link sent to your email. Please check your email to reset your password.
 *       400:
 *         description: Invalid email format or user already verified
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: User already verified, no action needed
 *       500:
 *         description: Internal server error when sending the email
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Failed to send email
 */
router.post(
  "/resend-email",
  body("email").isEmail().withMessage("Invalid email format"),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email } = req.body;

    if (!checkUserNotVerified(email)) {
      return res
        .status(400)
        .json({ error: "User alreay verified, no action needed" });
    }

    try {
      const token = generateVerificationToken(email);
      const resetLink =
        process.env.DATABASE_URL + `/reset-password?token=${token}`;

      // Read the HTML template from file
      const templatePath = path.join(
        __dirname,
        "../emails/email-password.html"
      );
      let htmlContent = fs.readFileSync(templatePath, "utf-8");

      // Replace placeholders with dynamic values
      htmlContent = htmlContent.replace("{{username}}", email);
      htmlContent = htmlContent.replace("{{resetLink}}", resetLink);

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "verification email",
        html: htmlContent,
      };

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
 * /auth/register-ngo:
 *   post:
 *     summary: Register a new NGO user
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
 *                 description: The email address of the user
 *                 example: ngo@example.com
 *               password:
 *                 type: string
 *                 description: The password for the user (must be at least 6 characters long)
 *                 example: password123
 *               full_name:
 *                 type: string
 *                 description: The full name of the NGO
 *                 example: My NGO Organization
 *               role:
 *                 type: string
 *                 description: The role of the user, must be "ngo"
 *                 example: ngo
 *     responses:
 *       201:
 *         description: NGO user registered successfully and verification email sent
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User registered successfully. Please check your email to verify your account.
 *       400:
 *         description: Bad request, invalid input or user already exists
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: User already exists
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       msg:
 *                         type: string
 *                         example: Invalid email format
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Internal server error
 */

router.post(
  "/register-ngo",
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
      if (role !== "ngo") {
        return res.status(400).json({ error: "this is ngo register endpoint" });
      }
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

      const token = generateVerificationToken(email, role);
      const link = process.env.REACT_APP + `/verify-result?token=${token}`;
      // !! check on this
      //const adminLink = process.env.REACT_APP + `/verify-ngo?token=${token}`; //need to create front end for this
      const newToken = generateVerificationToken(email, role, true, true);

      console.log(jwt.decode(newToken));
      console.log(newToken);
      const adminLink =
        process.env.REACT_APP + `/verify-result?token=${newToken}`;

      // Read the HTML template from file
      const userTemplatePath = path.join(
        __dirname,
        "../emails/email-verification.html"
      );
      let userHtmlContent = fs.readFileSync(userTemplatePath, "utf-8");

      // Read the Admin HTML template from file
      const adminTemplatePath = path.join(
        __dirname,
        "../emails/admin-email-verification.html"
      );
      let adminHtmlContent = fs.readFileSync(adminTemplatePath, "utf-8");

      // Replace placeholders with dynamic values
      htmlContent = userHtmlContent.replace("{{username}}", email);
      htmlContent = htmlContent.replace("{{Link}}", link);

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_USER,
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

      // Replace placeholders with dynamic values
      adminHtmlContent = adminHtmlContent.replace("{{Email}}", email);
      adminHtmlContent = adminHtmlContent.replace("{{Link}}", adminLink);

      const adminVerifymailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Impact Match NGO Account Email Verification",
        html: adminHtmlContent,
      };

      transporter.sendMail(adminVerifymailOptions, (error, info) => {
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
 * /auth/verify-ngo:
 *   get:
 *     summary: Verifies the NGO status of a user using a JWT token
 *     tags: [Auth]
 *     parameters:
 *       - in: query
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: The JWT token containing the user's email
 *     responses:
 *       200:
 *         description: Email verified successfully, NGO status updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Email verified successfully, please login to continue.
 *       400:
 *         description: Invalid token or error during verification
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Invalid token
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Internal server error
 */
router.get("/verify-ngo", async (req, res) => {
  const token = req.query.token;

  console.log("token: " + token);
  if (!token) {
    return res.status(400).json({ error: "Invalid token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const email = decoded.email;

    await pool.query("UPDATE users SET ngo_verify = true WHERE email = $1", [
      email,
    ]);

    res.status(200).json({
      message: "NGO verified successfully, please login to continue.",
    });
    // res.send("Email verified successfully, please login to continue");

    //res.redirect("/login");
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: "decoded error" });
  }
});
module.exports = router;
