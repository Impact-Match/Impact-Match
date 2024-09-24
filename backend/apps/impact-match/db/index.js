const { Pool } = require("pg");

require("dotenv").config(); // Load environment variables from a .env file

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // Use this only for development
  },
});

module.exports = pool; // Export the pool for use in other modules
