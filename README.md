# School Management API System 🏫

A production-ready RESTful API built with Node.js, Express.js, and MySQL. This API allows users to add schools and fetch a list of schools sorted by their proximity to a specified geographic location.

![Screenshot Placeholder](https://via.placeholder.com/800x400?text=App+Screenshot+Here)

---

## 📌 Project Overview
The School Management API System is designed to solve a common geolocation problem: finding the nearest facilities. It provides endpoints to store school data (including latitude and longitude) into a MySQL database, and to retrieve them intelligently sorted based on the user's distance using the Haversine formula.

## 🚀 Features
- **Add School**: Secure endpoint to insert new schools with validation and duplicate prevention.
- **Geospatial Sorting**: Calculates real-time distance using the Haversine formula and sorts results.
- **Bonus Features**: Pagination, Search by Name, and Radius Filtering.
- **Robust Architecture**: Built using MVC pattern and modular folder structure.
- **Security & Reliability**: Implements Helmet, CORS, Morgan logging, and global error handling.
- **API Documentation**: Integrated Swagger UI (`/api-docs`).

## 🛠️ Technologies Used
- **Backend:** Node.js, Express.js
- **Database:** MySQL
- **Libraries:** mysql2, dotenv, cors, express-validator, helmet, morgan, swagger-ui-express
- **Dev Tools:** nodemon

---

## 📁 Folder Structure Explanation

```text
school-management-api/
├── config/             # Database connection pooling setup (db.js)
├── controllers/        # Business logic for APIs (schoolController.js)
├── database/           # SQL scripts for table creation (schema.sql)
├── middleware/         # Global error handling and express-validators
├── postman/            # Exported Postman collection for easy testing
├── routes/             # API routing definitions
├── utils/              # Helper functions (constants, distanceCalculator)
├── .env                # Environment variables
├── package.json        # Project metadata and dependencies
├── server.js           # Main application entry point
└── swagger.yaml        # API Documentation schema
```

---

## 💻 Installation & Setup

### 1. Prerequisites
- Node.js installed on your computer.
- MySQL installed and running locally.

### 2. Exact Terminal Commands to Run Project
Open your terminal and execute:
```bash
# Clone the project or navigate to the folder
cd school-management-api

# Install all dependencies
npm install

# Start the application in development mode
npm run dev
```

### 3. Database Setup
1. Open MySQL Workbench or MySQL CLI.
2. Open the `database/schema.sql` file.
3. Copy the entire SQL query.
4. Run the query to create the `school_management` database and `schools` table.

### 4. Environment Variables
Create a `.env` file in the root folder with these values (modify DB credentials if needed):
```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=school_management
```

---

## 🔌 API Endpoints & Examples

### 1. Add School API
- **Endpoint:** `POST /api/v1/addSchool`
- **Purpose:** Adds a new school to the database.
- **Request Body:**
```json
{
  "name": "ABC School",
  "address": "Pune Maharashtra",
  "latitude": 18.5204,
  "longitude": 73.8567
}
```
- **Success Response (201 Created):**
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

### 2. List Schools API
- **Endpoint:** `GET /api/v1/listSchools`
- **Query Parameters:** `latitude` (required), `longitude` (required), `page` (optional), `limit` (optional), `name` (optional), `radius` (optional)
- **Example Request:** `GET /api/v1/listSchools?latitude=18.5204&longitude=73.8567&page=1&limit=5`
- **Success Response (200 OK):**
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

## 🔍 How Complex Features Work

### Distance Calculation (Haversine Formula)
Located in `utils/distanceCalculator.js`.
Because the Earth is a sphere, we cannot use simple geometry to calculate distance. The Haversine formula determines the "great-circle" distance between two points on a sphere given their longitudes and latitudes. The function converts coordinates to radians, applies the formula using the Earth's radius (6371 km), and returns the distance in kilometers.

### Pagination, Search & Radius Filter
1. **Search**: Handled via SQL `LIKE` operator (`SELECT * FROM schools WHERE name LIKE '%keyword%'`).
2. **Radius Filter**: After fetching and calculating distances, a `.filter()` removes schools further than the requested `radius`.
3. **Pagination**: After sorting by distance, the code manually slices the array using `startIndex = (page - 1) * limit` and `endIndex = page * limit` to return only the requested chunk.

---

## 🧪 Postman Testing Steps
1. Open Postman.
2. Click on `Import` and select the `School-Management-API.postman_collection.json` file from the `postman/` folder.
3. The collection will appear on the left pane.
4. Run "Add School" first to populate the DB.
5. Run "List Schools" to test distance calculation.

---

## 🌐 Deployment Instructions

### Deploying to Render
1. Create an account on [Render](https://render.com).
2. Create a "New Web Service" and link your GitHub repository.
3. For the **Build Command**, use: `npm install`
4. For the **Start Command**, use: `npm start`
5. Go to the "Environment" tab and add your `.env` variables. Note: You will need a cloud MySQL database.

### Deploying Database to Railway
1. Create an account on [Railway](https://railway.app).
2. Click "New Project" -> "Provision MySQL".
3. Once created, click on the MySQL container to get your connection credentials.
4. Use these credentials (Host, User, Password, DB Name) in your Render environment variables.

---

## ⚠️ Common Errors and Troubleshooting

1. **`ECONNREFUSED` Database Error**: 
   - *Cause:* MySQL is not running or credentials in `.env` are wrong.
   - *Fix:* Start your XAMPP/MySQL service and verify `DB_PASSWORD`.
2. **`Route not found`**: 
   - *Cause:* You missed `/api/v1` in the URL.
   - *Fix:* Ensure requests go to `http://localhost:5000/api/v1/listSchools`.
3. **`Validation failed`**: 
   - *Cause:* Missing or incorrect data types in the request.
   - *Fix:* Check the response `errors` array to see exactly which field failed.

---

## 🎓 Questions

**1. Why did you use Express.js instead of plain Node.js?**
*Answer:* Express.js is a minimal and flexible framework that simplifies routing, handling requests/responses, and setting up middlewares. Writing the same in plain Node.js requires a lot of manual, repetitive code.

**2. Why did you use MySQL instead of MongoDB?**
*Answer:* School data is highly structured with strict relationships (ID, Name, Coordinates). MySQL's tabular, relational nature ensures data integrity.

**3. What is the difference between GET and POST requests?**
*Answer:* GET is used to retrieve data from the server without modifying it (e.g., fetching schools). POST is used to send data to the server to create a new resource (e.g., adding a new school).

**4. What is a REST API?**
*Answer:* Representational State Transfer (REST) is an architectural style for APIs that uses standard HTTP methods (GET, POST, PUT, DELETE) and standardizes how clients communicate with servers using JSON.

**5. What is the purpose of Middleware?**
*Answer:* Middleware functions sit between the incoming request and the final route handler. They are used for tasks like parsing JSON, validating input, logging, handling CORS, and managing errors globally.

**6. What is CORS and why is it needed?**
*Answer:* Cross-Origin Resource Sharing (CORS) is a security feature built into browsers that prevents a frontend on one domain from making API requests to a backend on a different domain. We enable CORS in our API so that future frontends can consume it without being blocked.

**7. Can you explain the MVC architecture used here?**
*Answer:* MVC stands for Model-View-Controller. 
- **Model** (Database/Config): Handles data structure and DB connection.
- **View** (Postman/Swagger): The client interface visualizing the data.
- **Controller**: Contains the main business logic (calculating distance, sorting) and connects Routes to Models.

**8. Explain the Haversine Formula.**
*Answer:* The Haversine formula is a mathematical equation used to calculate the shortest distance between two points on a sphere (like Earth) based on their latitudes and longitudes. We manually implemented it in `utils/distanceCalculator.js` by converting coordinates to radians and multiplying by Earth's radius (6371km).

---

## 🔮 Future Improvements
- Implement Redis caching for faster `listSchools` response.
- Add user authentication (JWT) for adding schools.
- Connect a React/Next.js frontend.
