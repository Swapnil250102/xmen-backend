const express = require('express')
const router = express.Router()
const pool = require('../db')

router.get('/', async (req, res) => {
  try {
    const powers = await pool.query('SELECT * FROM power_types ORDER BY name')
    const powerData = await Promise.all(powers.rows.map(async (pt) => {
      const count = await pool.query('SELECT COUNT(*) FROM mutants WHERE EXISTS (SELECT 1 FROM unnest(power_types) p WHERE p ILIKE $1)', [`%${pt.name}%`])
      return { ...pt, mutantCount: parseInt(count.rows[0].count) }
    }))
    res.json(powerData)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router