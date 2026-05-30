const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const rateLimit = require('express-rate-limit')
require('dotenv').config()

const app = express()

app.use(helmet())
app.use(cors({ origin: ['http://localhost:5173', 'https://xmen-library.vercel.app'] }))
app.use(express.json())

const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100, message: 'Too many requests' })
app.use('/api/', limiter)

app.use('/api/mutants', require('./routes/mutants'))
app.use('/api/teams', require('./routes/teams'))
app.use('/api/powers', require('./routes/powers'))

app.get('/api/health', (req, res) => res.json({ status: 'ok', timestamp: new Date() }))

app.get('/api/stats', async (req, res) => {
  try {
    const pool = require('./db')
    const [mutantCount, teamCount, powerCount] = await Promise.all([
      pool.query('SELECT COUNT(*) FROM mutants'),
      pool.query('SELECT COUNT(*) FROM teams'),
      pool.query('SELECT COUNT(*) FROM power_types')
    ])
    res.json({
      mutants: parseInt(mutantCount.rows[0].count),
      teams: parseInt(teamCount.rows[0].count),
      powerTypes: parseInt(powerCount.rows[0].count),
      universes: 3
    })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ error: 'Internal server error' })
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`X-Men API running on http://localhost:${PORT}`))