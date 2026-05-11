# School Management API System 🏫

The School Management API System is a production-ready RESTful service built with Node.js, Express.js, and MySQL. This API enables client applications to securely store school facility data and retrieve intelligent, geolocation-based facility lists sorted by proximity to any given set of geographic coordinates.

![Screenshot Placeholder](https://via.placeholder.com/800x400?text=App+Screenshot+Here)

---

## 📌 Project Overview
The School Management API System addresses a common geolocation requirement: identifying the nearest facilities. It provides robust endpoints to persist school data (including latitude and longitude coordinates) into a relational database and to retrieve these records dynamically. The system calculates real-time distances utilizing the mathematical Haversine formula to ensure accurate geospatial sorting.

## 🚀 Key Capabilities
- **Facility Registration**: Secure endpoint to insert new school records with comprehensive input validation and duplicate prevention logic.
- **Geospatial Sorting**: Dynamically calculates real-time distances between user coordinates and stored facilities to ensure optimal sorting.
- **Advanced Querying**: Supports standard pagination (`page`, `limit`), case-insensitive name searching, and dynamic radius filtering.
- **Robust Architecture**: Built upon the Model-View-Controller (MVC) architectural pattern with a highly modular folder structure.
- **Security & Reliability**: Incorporates Helmet for HTTP header security, CORS configuration, Morgan for request logging, and centralized global error handling.
- **API Documentation**: Integrated Swagger UI available at `/api-docs` for seamless testing and schema validation.

## 🛠️ Technology Stack
- **Backend:** Node.js, Express.js
- **Database:** MySQL
- **Libraries:** mysql2, dotenv, cors, express-validator, helmet, morgan, swagger-ui-express
- **Development Tools:** nodemon

---

## 📁 Architecture Overview

```text
school-management-api/
├── config/             # Database connection pooling and environmental configuration
├── controllers/        # Core business logic for all API endpoints
├── database/           # SQL schema definitions for table creation
├── middleware/         # Centralized error handling and request validation layers
├── postman/            # Exported Postman collection for QA and integration testing
├── routes/             # API routing definitions
├── utils/              # Shared utilities (constants, Haversine calculator, response formatter)
├── .env                # Environment-specific variables
├── package.json        # Project metadata and dependency manifest
├── server.js           # Main application entry point and server bootstrap
└── swagger.yaml        # OpenAPI/Swagger specification
```

---

## 💻 Installation & Setup Instructions

### 1. System Requirements
- Node.js runtime environment installed on the host machine.
- MySQL server installed and accessible.

### 2. Initialization Commands
Execute the following commands in the terminal to initialize the service:
```bash
# Navigate to the project directory
cd school-management-api

# Install required dependencies
npm install

# Start the application in development mode
npm run dev
```

### 3. Database Provisioning
1. Access the MySQL environment via Workbench or CLI.
2. Locate the `database/schema.sql` file within the repository.
3. Execute the provided SQL queries to generate the `school_management` database and the corresponding `schools` table.

### 4. Environment Configuration
Create a `.env` file in the project root directory containing the following configuration keys (modify the credentials to match the target database):
```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_secure_password
DB_NAME=school_management
```

---

## 🔌 API Endpoints & Specifications

### 1. Add School Endpoint
- **Endpoint:** `POST /api/v1/addSchool`
- **Description:** Persists a new school record to the database. Requires exact coordinates.
- **Request Payload:**
```json
{
  "name": "ABC School",
  "address": "Pune Maharashtra",
  "latitude": 18.5204,
  "longitude": 73.8567
}
```
- **Expected Success Response (201 Created):**
```json
{
  "success": true,
  "message": "School added successfully",
  "timestamp": "2026-05-11T12:00:00.000Z",
  "data": {
    "id": 1,
    "name": "ABC School",
    "address": "Pune Maharashtra",
    "latitude": 18.5204,
    "longitude": 73.8567
  }
}
```

### 2. List Schools Endpoint
- **Endpoint:** `GET /api/v1/listSchools`
- **Query Parameters:** `latitude` (required), `longitude` (required), `page` (optional), `limit` (optional), `name` (optional), `radius` (optional)
- **Example Request:** `GET /api/v1/listSchools?latitude=18.5204&longitude=73.8567&page=1&limit=5`
- **Expected Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Schools retrieved successfully",
  "timestamp": "2026-05-11T12:05:00.000Z",
  "count": 1,
  "pagination": {
    "total": 1,
    "page": 1,
    "limit": 5,
    "totalPages": 1
  },
  "data": [
    {
      "id": 1,
      "name": "ABC School",
      "address": "Pune Maharashtra",
      "latitude": 18.5204,
      "longitude": 73.8567,
      "distance_in_km": 0
    }
  ]
}
```

---

## 🔍 Implementation Details

### Distance Calculation Algorithm
Because the Earth is a sphere, simple geometric equations cannot accurately determine geographical distance. The system implements the **Haversine formula** to determine the "great-circle" distance between two coordinate pairs. The algorithm converts decimal degrees to radians and applies the formula against the Earth's radius (6371 km) to yield precise distances in kilometers. This implementation is encapsulated within the `utils/distanceCalculator.js` utility.

### Data Filtering & Pagination Workflow
1. **Search Protocol**: Queries containing the `name` parameter utilize the SQL `LIKE` operator to perform partial string matching (`%keyword%`).
2. **Radius Filtering**: Following the extraction of records and calculation of relative distances, the application applies an in-memory filter to exclude any facilities falling outside the requested radial boundary.
3. **Pagination Logic**: After the data set is strictly sorted by ascending distance, the system applies mathematical array slicing boundaries based on the requested `page` and `limit` parameters to deliver the exact requested subset.

---

## 🧪 Integration Testing Protocol
1. Launch an API client such as Postman or Thunder Client.
2. Import the provided `School-Management-API.postman_collection.json` file located in the `postman/` directory.
3. Execute the **Add School** request to provision initial test data.
4. Execute the **List Schools** request to validate the distance calculation and sorting algorithms.
5. Alternatively, access `http://localhost:5000/api-docs` via a web browser to utilize the interactive Swagger UI.

---

## 🌐 Deployment Guidelines

### Application Hosting (Render)
1. Establish a new Web Service on [Render](https://render.com) linked to the application repository.
2. Define the **Build Command** as: `npm install`
3. Define the **Start Command** as: `npm start`
4. Configure the necessary environmental variables matching the `.env` schema. Note: A remote database connection string is required.

### Database Hosting (Railway)
1. Provision a new MySQL instance via [Railway](https://railway.app).
2. Extract the generated connection credentials (Host, User, Password, DB Name).
3. Inject these credentials into the application host's environment variables.

---

## 🛠️ Troubleshooting & Issue Resolution

If an issue is encountered while running or testing the API, refer to the following common scenarios and their designated resolutions:

### 1. Database Connection Failure (`ECONNREFUSED` or Access Denied)
- **Symptom:** The terminal outputs a `Failed to connect to the database` error during startup.
- **Action Required:**
  - Verify that the local MySQL service is actively running.
  - Cross-reference the credentials defined in the `.env` file (`DB_USER`, `DB_PASSWORD`, `DB_HOST`, `DB_NAME`) against the actual database configuration.
  - Ensure the `database/schema.sql` script has been successfully executed prior to application launch.

### 2. Request Rejection: Route Not Found (404)
- **Symptom:** The API returns a `404 Not Found` response with the message `Route not found`.
- **Action Required:**
  - Verify the request URL path. All core endpoints must be prefixed with the exact API versioning path: `/api/v1/`. 
  - *Example:* Ensure the request is targeting `http://localhost:5000/api/v1/listSchools` rather than `http://localhost:5000/listSchools`.

### 3. Request Rejection: Validation Failed (400 Bad Request)
- **Symptom:** The API rejects the payload with a `Validation failed` message and an array of specific errors.
- **Action Required:**
  - **For POST Requests:** Ensure the `Content-Type` header is strictly set to `application/json`. Verify that the payload contains all required fields (`name`, `address`, `latitude`, `longitude`) and that the coordinates fall within valid geographic ranges (Latitude: -90 to 90, Longitude: -180 to 180).
  - **For GET Requests:** Ensure both `latitude` and `longitude` query parameters are actively provided in the URL string, as they are strictly required to perform distance calculations.

### 4. Data Conflict: Duplicate Resource (409 Conflict)
- **Symptom:** Attempting to add a school returns a `409 Conflict` stating the school already exists.
- **Action Required:**
  - The API prevents the creation of duplicate records based on exact coordinate and name matching. If testing, either slightly alter the coordinates or the name of the facility in the payload.

### 5. Unexpected Server Errors (500 Internal Server Error)
- **Symptom:** The API crashes or returns a generic 500 status.
- **Action Required:**
  - Inspect the application terminal logs. The global error handling middleware will catch and print the exact stack trace to the console, detailing whether the issue stems from a malformed SQL query or an undefined variable.

---

## 🔮 Roadmap & Enhancements
- Implementation of Redis caching layers to optimize latency on high-frequency `listSchools` queries.
- Integration of robust JWT-based authorization for administrative POST operations.
- Development of a cohesive frontend client built on modern reactive frameworks.
