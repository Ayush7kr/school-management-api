const { HTTP_STATUS } = require('../utils/constants');
const { sendResponse } = require('../utils/responseFormatter');

/**
 * Global Error Handling Middleware
 * Catches any errors thrown in controllers and sends a consistent JSON response
 */
const errorMiddleware = (err, req, res, next) => {
  console.error('Error:', err);

  const statusCode = err.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR;
  const message = err.message || 'Internal Server Error';

  return sendResponse(res, statusCode, false, message);
};

module.exports = errorMiddleware;
