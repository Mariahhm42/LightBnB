-- Drop tables if they already exist
DROP TABLE IF EXISTS property_reviews CASCADE;
DROP TABLE IF EXISTS reservations CASCADE;
DROP TABLE IF EXISTS properties CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Create Users Table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
);

-- Create Properties Table
CREATE TABLE properties (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    cost_per_night NUMERIC(10, 2) NOT NULL,
    parking_spaces INT NOT NULL,
    number_of_bathrooms INT NOT NULL,
    number_of_bedrooms INT NOT NULL,
    thumbnail_photo_url TEXT,
    cover_photo_url TEXT,
    country VARCHAR(255) NOT NULL,
    street VARCHAR(255) NOT NULL,
    city VARCHAR(255) NOT NULL,
    province VARCHAR(255) NOT NULL,
    post_code VARCHAR(10) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    owner_id INT REFERENCES users(id) ON DELETE CASCADE
);

-- Create Reservations Table
CREATE TABLE reservations (
    id SERIAL PRIMARY KEY,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    guest_id INT REFERENCES users(id) ON DELETE CASCADE,
    property_id INT REFERENCES properties(id) ON DELETE CASCADE
);

-- Create Property Reviews Table
CREATE TABLE property_reviews (
    id SERIAL PRIMARY KEY,
    message TEXT NOT NULL,
    rating INT CHECK (rating BETWEEN 1 AND 5),
    guest_id INT REFERENCES users(id) ON DELETE CASCADE,
    reservation_id INT REFERENCES reservations(id) ON DELETE CASCADE,
    property_id INT REFERENCES properties(id) ON DELETE CASCADE
);
