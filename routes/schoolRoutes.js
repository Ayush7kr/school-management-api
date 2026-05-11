const express = require('express');
const { body, query } = require('express-validator');
const router = express.Router();

const { addSchool, listSchools } = require('../controllers/schoolController');
const { validateRequest } = require('../middleware/validationMiddleware');

/**
 * Route: POST /api/v1/addSchool
 * Validations:
 * - name: string, not empty
 * - address: string, not empty
 * - latitude: float, between -90 and 90
 * - longitude: float, between -180 and 180
 */
router.post(
  '/addSchool',
  [
    body('name').trim().notEmpty().withMessage('School name is required'),
    body('address').trim().notEmpty().withMessage('Address is required'),
    body('latitude')
      .isFloat({ min: -90, max: 90 })
      .withMessage('Latitude must be a valid number between -90 and 90'),
    body('longitude')
      .isFloat({ min: -180, max: 180 })
      .withMessage('Longitude must be a valid number between -180 and 180')
  ],
  validateRequest,
  addSchool
);

/**
 * Route: GET /api/v1/listSchools
 * Validations:
 * - latitude: required, float, between -90 and 90
 * - longitude: required, float, between -180 and 180
 */
router.get(
  '/listSchools',
  [
    query('latitude')
      .notEmpty().withMessage('User latitude is required')
      .isFloat({ min: -90, max: 90 }).withMessage('Valid latitude is required'),
    query('longitude')
      .notEmpty().withMessage('User longitude is required')
      .isFloat({ min: -180, max: 180 }).withMessage('Valid longitude is required'),
    query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
    query('limit').optional().isInt({ min: 1 }).withMessage('Limit must be a positive integer'),
    query('radius').optional().isFloat({ min: 0 }).withMessage('Radius must be a positive number')
  ],
  validateRequest,
  listSchools
);

module.exports = router;
