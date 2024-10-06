const express = require("express");
const router = express.Router();

// Middleware to ensure the user is authenticated
const ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: "Unauthorized" });
};

/**
 * @swagger
 * /profile/user:
 *   get:
 *     summary: Get the authenticated user's profile
 *     description: Retrieve the profile information of the currently authenticated user.
 *     tags:
 *       - Profile
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: User ID
 *                   example: 123456
 *                 email:
 *                   type: string
 *                   description: User email
 *                   example: user@example.com
 *                 google_id:
 *                   type: string
 *                   description: Google ID (if logged in via Google)
 *                   example: "112233445566"
 *                 name:
 *                   type: string
 *                   description: User name
 *                   example: "John Doe"
 *       401:
 *         description: Unauthorized - user is not authenticated
 *       500:
 *         description: Internal server error
 */
router.get("/user", ensureAuthenticated,  async (req, res) => {
  try {
    if (!req.user) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = {
      id: req.user.id,
      email: req.user.email,
      google_id: req.user.google_id || null,
      name: req.user.full_name,
    };

    res.json(user);
  } catch (error) {
    console.error("Error retrieving profile:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
