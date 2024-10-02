const pool = require("../db"); // Import the database connection
const jwt = require("jsonwebtoken");

async function checkExistUser(email) {
  const existingUser = await pool.query(
    "SELECT * FROM users WHERE email = $1",
    [email]
  );
  if (existingUser.rows.length > 0) {
    return true;
  }
  return false;
}

async function checkUserNotVerified(email) {
  const existingUser = await pool.query(
    "SELECT * FROM users WHERE email = $1",
    [email]
  );

  if (existingUser.rows[0].is_verified === false) {
    return true;
  }

  return false;
}

const generateVerificationToken = (email) => {
  return jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "1h" });
};

module.exports = {
  checkExistUser,
  generateVerificationToken,
  checkUserNotVerified,
}; // Export the function for use in other modules
