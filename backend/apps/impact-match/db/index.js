const { Pool } = require('pg');

const pool = new Pool({
  connectionString: "postgres://u563hvr13bgmbh:pdffe5ffc8502bd05fdbb50d3782e269f72eda6dd6c0b8c7e25c7086ec32110ce@cd5gks8n4kb20g.cluster-czrs8kj4isg7.us-east-1.rds.amazonaws.com:5432/d8m17f0ud96jts",
  ssl: {
    rejectUnauthorized: false, // Use this only for development
  },
});

module.exports = pool; // Export the pool for use in other modules
