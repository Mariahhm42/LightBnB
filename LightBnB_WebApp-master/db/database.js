const properties = require("./json/properties.json");
const users = require("./json/users.json");
const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',  // Replace with your PostgreSQL user
  host: 'localhost',
  database: 'lightbnb', 
  password: 'Victorious',  
  port: 5432,  // Default PostgreSQL port
});


/// Users

/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithEmail = function (email) {
  const query = `
    SELECT * 
    FROM users
    WHERE email = $1;`;
  return pool
    .query(query, [email])
    .then((result) => {
      return result.rows[0] || null; // Return the user object if found, otherwise null
    })
    .catch((err) => {
      console.error("Error retrieving user by email:", err.message);
      throw err;
    });
};

/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithId = function (id) {
  const query = `
    SELECT * 
    FROM users
    WHERE id = $1;`;
  return pool
    .query(query, [id])
    .then((result) => {
      return result.rows[0] || null; // Return the user object if found, otherwise null
    })
    .catch((err) => {
      console.error("Error retrieving user by id:", err.message);
      throw err;
    });
};

/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */
const addUser = function (user) {
  const query = `
    INSERT INTO users (name, email, password)
    VALUES ($1, $2, $3)
    RETURNING *;
  `;
  const values = [user.name, user.email, user.password];
  return pool
    .query(query, values)
    .then((result) => {
      return result.rows[0]; // Return the newly created user object
    })
    .catch((err) => {
      console.error("Error adding new user:", err.message);
      throw err;
    });
};

/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
const getAllReservations = function (guest_id, limit = 10) {
  return getAllProperties(null, 2);
};

/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */
const getAllProperties = (options, limit = 10) => {
  // Define the query to select all columns from the properties table and limit the results
  const query = `
    SELECT * 
    FROM properties
    LIMIT $1;
  `;

  // Execute the query using the limit parameter
  return pool
    .query(query, [limit])
    .then((result) => {
      console.log("Properties retrieved:", result.rows); // Log the rows for debugging
      return result.rows; // Return the rows as the promise's resolved value
    })
    .catch((err) => {
      console.error("Error retrieving properties:", err.message); // Log the error
      throw err; // Re-throw the error to propagate it to the caller
    });
};


/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = function (property) {
  const propertyId = Object.keys(properties).length + 1;
  property.id = propertyId;
  properties[propertyId] = property;
  return Promise.resolve(property);
};

module.exports = {
  pool,
  getUserWithEmail,
  getUserWithId,
  addUser,
  getAllReservations,
  getAllProperties,
  addProperty,
};
