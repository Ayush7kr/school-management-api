-- Create the database if it doesn't exist
CREATE DATABASE IF NOT EXISTS school_management;

-- Switch to the newly created database
USE school_management;

-- Create the 'schools' table
CREATE TABLE IF NOT EXISTS schools (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    address VARCHAR(255) NOT NULL,
    latitude FLOAT NOT NULL,
    longitude FLOAT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Note: In a production environment, you might want to add indexes
-- on latitude and longitude if you have millions of records.
-- CREATE INDEX idx_location ON schools(latitude, longitude);
