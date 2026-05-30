const express = require('express')
const router = express.Router()
const pool = require('../db')

router.get('/', async (req, res) => {
  try {
    const teams = await pool.query('SELECT * FROM teams ORDER BY name')
    const result = await Promise.all(teams.rows.map(async (team) => {
      const members = await pool.query(
        'SELECT id, name, color, mutant_class FROM mutants WHERE $1 = ANY(affiliations)',
        [team.id]
      )
      return { ...team, members: members.rows, memberCount: members.rowCount }
    }))
    res.json(result)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.get('/:id', async (req, res) => {
  try {
    const team = await pool.query('SELECT * FROM teams WHERE id = $1', [req.params.id])
    if (!team.rows.length) return res.status(404).json({ error: 'Team not found' })
    const members = await pool.query(
      'SELECT id, name, color, mutant_class, power_types FROM mutants WHERE $1 = ANY(affiliations)',
      [req.params.id]
    )
    res.json({ ...team.rows[0], members: members.rows })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router