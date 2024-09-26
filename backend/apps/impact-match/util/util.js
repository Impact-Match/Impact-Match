async function checkExistUser(eamil) {
  const existingUser = await pool.query(
    "SELECT * FROM users WHERE email = $1",
    [email]
  );
  if (existingUser.rows.length > 0) {
    return true;
  }
  return false;
}

const generateVerificationToken = (email) => {
  return jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "1h" });
};

export { checkUserExist, generateVerificationToken }; // Export the function for use in other modules
