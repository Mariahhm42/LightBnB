# LightBnB

A full-stack, Airbnb-style property rental app built during the Lighthouse Labs web development bootcamp. Users can browse and search listings, sign up and log in, view their reservations and post their own properties. All data is stored in PostgreSQL and accessed through parameterised SQL queries.

## Features

- Browse property listings with average guest ratings
- Search and filter by city, owner, and minimum and maximum price per night
- User registration and login, with bcrypt-hashed passwords and cookie-based sessions
- View your own reservations
- Add a new property listing

## Tech stack

| Layer | Tools |
| --- | --- |
| Front end | HTML, Sass/CSS, jQuery (single-page app) |
| Back end | Node.js, Express |
| Database | PostgreSQL, accessed through `node-postgres` (`pg`) |
| Auth | `bcrypt`, `cookie-session` |

## Repository layout

```
.
├── 1_queries/            Standalone SQL queries written while learning joins and aggregates
├── migrations/           01_schema.sql: creates users, properties, reservations, property_reviews
├── seeds/                Sample data for local development
└── LightBnB_WebApp-master/
    ├── db/database.js    All database access functions (pg connection pool)
    ├── routes/           Express routes: /api/... and /users/...
    ├── public/           Front-end HTML, JavaScript and CSS
    ├── styles/           Sass source files
    └── server.js         App entry point
```

## Database design

Four tables, linked by foreign keys with `ON DELETE CASCADE`:

- `users`: name, unique email, hashed password
- `properties`: listing details, price per night, location, and `owner_id`
- `reservations`: start and end dates, `guest_id`, `property_id`
- `property_reviews`: rating (0 to 5, enforced with a `CHECK` constraint), message, and links to guest, reservation and property

## SQL highlights

The `1_queries/` folder includes:

- Average reservation length
- Most visited cities (`JOIN`, `GROUP BY`, `ORDER BY`)
- Properties in a city with an average rating of 4 or higher (`HAVING`)
- A user's reservations with average property ratings
- User lookup by email for login

## Getting started

### Prerequisites

- Node.js and npm
- PostgreSQL

### Setup

```bash
git clone https://github.com/Mariahhm42/LightBnB.git
cd LightBnB

# Create the database and load the schema and seed data
createdb lightbnb
psql -d lightbnb -f migrations/01_schema.sql
psql -d lightbnb -f seeds/01_seeds.sql
psql -d lightbnb -f seeds/02_seeds.sql

# Install dependencies and start the server
cd LightBnB_WebApp-master
npm install
npm run local
```

Then open http://localhost:3000.

The PostgreSQL connection settings (user, password, host, database, port) are in `LightBnB_WebApp-master/db/database.js`. Change them to match your local setup.

## API routes

| Method | Route | Purpose |
| --- | --- | --- |
| GET | `/api/properties` | List properties, with optional filters |
| POST | `/api/properties` | Create a property (logged-in users) |
| GET | `/api/reservations` | List the current user's reservations |
| POST | `/users` | Register |
| POST | `/users/login` | Log in |
| POST | `/users/logout` | Log out |
| GET | `/users/me` | Get the current user |

## What I learned

- Designing a relational schema and writing migrations and seed files
- Writing joins, aggregates and filters in SQL
- Preventing SQL injection with parameterised queries
- Connecting an Express app to PostgreSQL with promises
- Hashing passwords and managing sessions

## Author

Mariam Agboola, [@Mariahhm42](https://github.com/Mariahhm42)
