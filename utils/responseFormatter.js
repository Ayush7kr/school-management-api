/**
 * Utility to send a standardized JSON response
 * 
 * @param {Object} res - Express response object
 * @param {number} statusCode - HTTP status code
 * @param {boolean} success - Success flag
 * @param {string} message - Response message
 * @param {any} data - Additional data or errors (optional)
 * @param {any} extra - Extra fields like count or pagination (optional)
 */
const sendResponse = (res, statusCode, success, message, data = null, extra = null) => {
  const response = {
    success,
    message,
    timestamp: new Date().toISOString()
  };

  if (extra) {
    Object.assign(response, extra);
  }

  if (data !== null) {
    if (success) {
      response.data = data;
    } else {
      response.errors = data;
    }
  }

  return res.status(statusCode).json(response);
};

module.exports = { sendResponse };
