require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const path = require('path');

// Import routes
const schoolRoutes = require('./routes/schoolRoutes');
const healthRoutes = require('./routes/healthRoutes');

// Import middleware
const errorMiddleware = require('./middleware/errorMiddleware');
const { connectDB } = require('./config/db'); // Imported the dedicated connection tester

const app = express();

// Middlewares
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(cors()); // Enable CORS
app.use(helmet()); // Add security headers
app.use(morgan('dev')); // Request logging

// Swagger API Documentation setup
try {
  const swaggerDocument = YAML.load(path.join(__dirname, 'swagger.yaml'));
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  console.log('Swagger documentation configured at /api-docs');
} catch (error) {
  console.log('Swagger configuration skipped (swagger.yaml not found or invalid).');
}

// Routes
app.use('/', healthRoutes); // Root health route
app.use('/api/v1', schoolRoutes); // School APIs

// 404 Route Handler
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    timestamp: new Date().toISOString()
  });
});

// Global Error Handling Middleware
app.use(errorMiddleware);

const PORT = process.env.PORT || 5000;

// Initialize Server after verifying Database Connection
const startServer = async () => {
  try {
    // 1. Verify DB Connection FIRST
    await connectDB();

    // 2. Start the Express App
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('❌ Server failed to start due to database connection error.');
    process.exit(1); // Exit immediately if DB connection fails
  }
};

startServer();
