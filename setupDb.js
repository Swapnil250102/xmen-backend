const { Client } = require('pg')
require('dotenv').config()

async function setup() {
  const client = new Client({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: 'postgres',
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
  })

  await client.connect()

  await client.query(`CREATE DATABASE xmen_library`)
  console.log('Database created')
  await client.end()

  const db = new Client({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: 'xmen_library',
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
  })

  await db.connect()

  await db.query(`
    CREATE TABLE IF NOT EXISTS mutants (
      id VARCHAR(100) PRIMARY KEY,
      name VARCHAR(200) NOT NULL,
      real_name VARCHAR(200),
      aliases TEXT[],
      mutant_class VARCHAR(50),
      bio TEXT,
      power_types TEXT[],
      affiliations TEXT[],
      universes TEXT[],
      first_appearance VARCHAR(300),
      created_by VARCHAR(300),
      stats JSONB,
      abilities JSONB,
      related TEXT[],
      color VARCHAR(20),
      family JSONB,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    )
  `)

  await db.query(`
    CREATE TABLE IF NOT EXISTS teams (
      id VARCHAR(100) PRIMARY KEY,
      name VARCHAR(200) NOT NULL,
      description TEXT,
      color VARCHAR(20),
      created_at TIMESTAMP DEFAULT NOW()
    )
  `)

  await db.query(`
    CREATE TABLE IF NOT EXISTS power_types (
      id VARCHAR(100) PRIMARY KEY,
      name VARCHAR(200) NOT NULL,
      icon VARCHAR(10),
      description TEXT
    )
  `)

  await db.query(`
    CREATE INDEX IF NOT EXISTS idx_mutants_name ON mutants(name);
    CREATE INDEX IF NOT EXISTS idx_mutants_class ON mutants(mutant_class);
    CREATE INDEX IF NOT EXISTS idx_mutants_affiliations ON mutants USING GIN(affiliations);
    CREATE INDEX IF NOT EXISTS idx_mutants_power_types ON mutants USING GIN(power_types);
    CREATE INDEX IF NOT EXISTS idx_mutants_universes ON mutants USING GIN(universes);
  `)

  console.log('All tables and indexes created')
  await db.end()
}

setup().catch(err => {
  console.error('Setup failed:', err.message)
  process.exit(1)
})