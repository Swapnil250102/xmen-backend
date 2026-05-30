const express = require('express')
const router = express.Router()
const pool = require('../db')

router.get('/', async (req, res) => {
  try {
    const { search, class: mutantClass, universe, affiliation, sort = 'name', order = 'ASC', page = 1, limit = 24 } = req.query
    const offset = (parseInt(page) - 1) * parseInt(limit)
    const conditions = []
    const values = []
    let i = 1

    if (search) {
      conditions.push(`(name ILIKE $${i} OR real_name ILIKE $${i})`)
      values.push(`%${search}%`)
      i++
    }
    if (mutantClass) {
      conditions.push(`mutant_class = $${i}`)
      values.push(mutantClass)
      i++
    }
    if (universe) {
      conditions.push(`$${i} = ANY(universes)`)
      values.push(universe)
      i++
    }
    if (affiliation) {
      conditions.push(`$${i} = ANY(affiliations)`)
      values.push(affiliation)
      i++
    }

    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : ''
    const sortCol = ['name', 'mutant_class', 'created_at'].includes(sort) ? sort : 'name'
    const sortDir = order.toUpperCase() === 'DESC' ? 'DESC' : 'ASC'

    const countResult = await pool.query(`SELECT COUNT(*) FROM mutants ${where}`, values)
    const total = parseInt(countResult.rows[0].count)

    values.push(parseInt(limit), offset)
    const result = await pool.query(
      `SELECT id, name, real_name, aliases, mutant_class, power_types, affiliations, universes, color, bio
       FROM mutants ${where}
       ORDER BY ${sortCol} ${sortDir}
       LIMIT $${i} OFFSET $${i + 1}`,
      values
    )

    res.json({
      mutants: result.rows,
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(total / parseInt(limit))
    })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM mutants WHERE id = $1', [req.params.id])
    if (!result.rows.length) return res.status(404).json({ error: 'Mutant not found' })
    res.json(result.rows[0])
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.get('/:id/family', async (req, res) => {
  try {
    const mutantResult = await pool.query('SELECT * FROM mutants WHERE id = $1', [req.params.id])
    if (!mutantResult.rows.length) return res.status(404).json({ error: 'Mutant not found' })
    const mutant = mutantResult.rows[0]
    const family = mutant.family || {}
    const allIds = [...(family.children || []), ...(family.siblings || []), family.father, family.mother, family.spouse].filter(Boolean)
    let relatedMutants = []
    if (allIds.length) {
      const rel = await pool.query('SELECT id, name, color, mutant_class, power_types FROM mutants WHERE id = ANY($1)', [allIds])
      relatedMutants = rel.rows
    }
    res.json({ mutant: { id: mutant.id, name: mutant.name, color: mutant.color, mutant_class: mutant.mutant_class, family: mutant.family }, related: relatedMutants })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router