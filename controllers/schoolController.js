const { pool } = require('../config/db');
const { calculateDistance } = require('../utils/distanceCalculator');
const { sendResponse } = require('../utils/responseFormatter');
const { HTTP_STATUS, PAGINATION } = require('../utils/constants');

/**
 * @desc    Add a new school to the database
 * @route   POST /api/v1/addSchool
 * @access  Public
 */
const addSchool = async (req, res, next) => {
  try {
    const { name, address, latitude, longitude } = req.body;

    // Duplicate check: Check if a school with the exact name and coordinates already exists
    const [existing] = await pool.execute(
      'SELECT id FROM schools WHERE name = ? AND latitude = ? AND longitude = ?',
      [name, latitude, longitude]
    );

    if (existing.length > 0) {
      return sendResponse(res, HTTP_STATUS.CONFLICT, false, 'A school with this name and location already exists');
    }

    // Insert into database
    const [result] = await pool.execute(
      'INSERT INTO schools (name, address, latitude, longitude) VALUES (?, ?, ?, ?)',
      [name, address, latitude, longitude]
    );

    // Return success response
    return sendResponse(res, HTTP_STATUS.CREATED, true, 'School added successfully', {
      id: result.insertId,
      name,
      address,
      latitude,
      longitude
    });

  } catch (error) {
    next(error); // Pass error to global error handler
  }
};

/**
 * @desc    List all schools sorted by nearest distance
 * @route   GET /api/v1/listSchools
 * @access  Public
 */
const listSchools = async (req, res, next) => {
  try {
    const { 
      latitude, 
      longitude, 
      page = PAGINATION.DEFAULT_PAGE, 
      limit = PAGINATION.DEFAULT_LIMIT,
      name = '',
      radius = null // Optional filter by radius in km
    } = req.query;

    const userLat = parseFloat(latitude);
    const userLon = parseFloat(longitude);
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const searchName = `%${name}%`; // For SQL LIKE query

    // Fetch all matching schools from DB
    const [schools] = await pool.execute(
      'SELECT id, name, address, latitude, longitude FROM schools WHERE name LIKE ?',
      [searchName]
    );

    // If no schools found
    if (schools.length === 0) {
      return sendResponse(res, HTTP_STATUS.OK, true, 'No schools found', []);
    }

    // Map through schools to calculate distance
    let schoolsWithDistance = schools.map((school) => {
      const distance = calculateDistance(
        userLat,
        userLon,
        school.latitude,
        school.longitude
      );
      
      return {
        ...school,
        distance_in_km: distance
      };
    });

    // Filter by radius if provided
    if (radius) {
      schoolsWithDistance = schoolsWithDistance.filter(school => school.distance_in_km <= parseFloat(radius));
    }

    // Sort schools nearest to farthest
    schoolsWithDistance.sort((a, b) => a.distance_in_km - b.distance_in_km);

    // Apply Pagination manually since we have to sort AFTER distance calculation
    const startIndex = (pageNum - 1) * limitNum;
    const endIndex = pageNum * limitNum;
    
    const paginatedSchools = schoolsWithDistance.slice(startIndex, endIndex);

    // Prepare pagination metadata
    const pagination = {
      total: schoolsWithDistance.length,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(schoolsWithDistance.length / limitNum)
    };

    return sendResponse(
      res, 
      HTTP_STATUS.OK, 
      true, 
      'Schools retrieved successfully', 
      paginatedSchools, 
      { 
        count: paginatedSchools.length,
        pagination 
      }
    );

  } catch (error) {
    next(error);
  }
};

module.exports = {
  addSchool,
  listSchools
};
