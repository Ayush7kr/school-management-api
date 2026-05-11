const express = require('express');
const router = express.Router();

/**
 * @desc    API Health Check Route
 * @route   GET /
 * @access  Public
 */
router.get('/', (req, res) => {
  res.status(200).send('School Management API Running');
});

module.exports = router;
