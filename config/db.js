const mysql = require('mysql2/promise');
require('dotenv').config();

// Create a connection pool for MySQL
// Connection pooling is better for performance as it reuses database connections
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 3306, // CRITICAL: Added DB_PORT support for Railway
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  connectTimeout: 20000, // Wait 20 seconds before timing out to prevent ETIMEDOUT hangs
  ssl: {
    rejectUnauthorized: false // CRITICAL: Required for Railway remote database connections
  }
});

// Function to test the connection specifically
const connectDB = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Connected to MySQL database successfully');
    console.log(`📡 Connected to Host: ${process.env.DB_HOST}`);
    connection.release();
    return true;
  } catch (error) {
    console.error('❌ Failed to connect to the database:', error.message);
    console.error('Error Details:', error); // Log full error for easier debugging
    throw error;
  }
};

module.exports = { pool, connectDB };
