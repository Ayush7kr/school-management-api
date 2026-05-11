const { validationResult } = require('express-validator');
const { sendResponse } = require('../utils/responseFormatter');
const { HTTP_STATUS } = require('../utils/constants');

/**
 * Reusable Validation Middleware
 * Executes express-validator checks and returns 400 if validation fails
 */
const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    return sendResponse(
      res, 
      HTTP_STATUS.BAD_REQUEST, 
      false, 
      'Validation failed', 
      errors.array()
    );
  }
  
  next(); // Move to the controller if validation is successful
};

module.exports = { validateRequest };
