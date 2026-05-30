const express = require('express')
const router = express.Router()
const pool = require('../db')

router.get('/', async (req, res) => {
  try {
    const powers = await pool.query('SELECT * FROM power_types ORDER BY name')
    const result = await Promise.all(powers.rows.map(async (pt) => {
      const count = await pool.query(
        'SELECT COUNT(*) FROM mutants WHERE $1 = ANY(power_types)',
        [pt.name]
      )
      return { ...pt, mutantCount: parseInt(count.rows[0].count) }
    }))
    res.json(result)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router