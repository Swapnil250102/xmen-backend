const { Pool } = require('pg')
require('dotenv').config()

let pool

if (process.env.DATABASE_URL) {
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  })
} else {
  pool = new Pool({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'xmen_library',
    password: process.env.DB_PASSWORD || 'postgres123',
    port: process.env.DB_PORT || 5432,
  })
}

pool.on('connect', () => console.log('Database connected'))
pool.on('error', (err) => console.error('Database error:', err.message))

module.exports = pool