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
 * Get all reservations for a specific user from the database.
 * @param {string} guest_id The id of the user.
 * @param {number} limit The number of results to return (default 10).
 * @return {Promise<[]>} A promise to the reservations.
 */
const getAllReservations = function (guest_id, limit = 10) {
  const query = `
    SELECT reservations.*, properties.*, AVG(property_reviews.rating) AS average_rating
    FROM reservations
    JOIN properties ON reservations.property_id = properties.id
    LEFT JOIN property_reviews ON properties.id = property_reviews.property_id
    WHERE reservations.guest_id = $1
    GROUP BY reservations.id, properties.id
    ORDER BY reservations.start_date
    LIMIT $2;
  `;
  const values = [guest_id, limit];

  return pool
    .query(query, values)
    .then((result) => {
      // Resolve with the reservations data
      return result.rows;
    })
    .catch((err) => {
      console.error("Error retrieving reservations:", err.message);
      throw err;
    });
};

/// Properties

/**
 * Get all properties with optional filters.
 * @param {Object} options - An object containing query filters.
 * @param {number} limit - The maximum number of results to return (default 10).
 * @return {Promise<[]>} A promise to the properties.
 */
const getAllProperties = function (options, limit = 10) {
  const queryParams = [];
  let queryString = `
    SELECT properties.*, AVG(property_reviews.rating) as average_rating
    FROM properties
    LEFT JOIN property_reviews ON properties.id = property_reviews.property_id
  `;

  // Add WHERE clause based on filters
  if (options.city || options.owner_id || options.minimum_price_per_night || options.maximum_price_per_night || options.minimum_rating) {
    queryString += `WHERE `;
    const conditions = [];

    if (options.city) {
      queryParams.push(`%${options.city}%`);
      conditions.push(`city LIKE $${queryParams.length}`);
    }

    if (options.owner_id) {
      queryParams.push(options.owner_id);
      conditions.push(`owner_id = $${queryParams.length}`);
    }

    if (options.minimum_price_per_night) {
      queryParams.push(options.minimum_price_per_night * 100); // Convert dollars to cents
      conditions.push(`cost_per_night >= $${queryParams.length}`);
    }

    if (options.maximum_price_per_night) {
      queryParams.push(options.maximum_price_per_night * 100); // Convert dollars to cents
      conditions.push(`cost_per_night <= $${queryParams.length}`);
    }

    if (options.minimum_rating) {
      queryParams.push(options.minimum_rating);
      conditions.push(`AVG(property_reviews.rating) >= $${queryParams.length}`);
    }

    queryString += conditions.join(' AND ');
  }

  // Final query string
  queryParams.push(limit);
  queryString += `
    GROUP BY properties.id
    ORDER BY cost_per_night
    LIMIT $${queryParams.length};
  `;

  // Debug: Log the query and parameters
  console.log("Query String:", queryString);
  console.log("Query Params:", queryParams);

  // Execute the query
  return pool.query(queryString, queryParams).then((res) => res.rows);
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
