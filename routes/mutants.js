const express = require('express')
const router = express.Router()
const pool = require('../db')

// GET all mutants with search + filter + pagination
router.get('/', async (req, res) => {
  try {
    const { search, class: mutantClass, universe, affiliation, power, sort = 'name', order = 'ASC', page = 1, limit = 20 } = req.query
    const offset = (page - 1) * limit
    const conditions = []
    const values = []
    let i = 1

    if (search) {
      conditions.push(`(name ILIKE $${i} OR real_name ILIKE $${i} OR bio ILIKE $${i} OR $${i+1} ILIKE ANY(aliases))`)
      values.push(`%${search}%`, `%${search}%`)
      i += 2
    }
    if (mutantClass) { conditions.push(`mutant_class = $${i}`); values.push(mutantClass); i++ }
    if (universe) { conditions.push(`$${i} = ANY(universes)`); values.push(universe); i++ }
    if (affiliation) { conditions.push(`$${i} = ANY(affiliations)`); values.push(affiliation); i++ }
    if (power) { conditions.push(`EXISTS (SELECT 1 FROM unnest(power_types) pt WHERE pt ILIKE $${i})`); values.push(`%${power}%`); i++ }

    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : ''
    const sortCol = ['name', 'mutant_class', 'created_at'].includes(sort) ? sort : 'name'
    const sortDir = order.toUpperCase() === 'DESC' ? 'DESC' : 'ASC'

    const countResult = await pool.query(`SELECT COUNT(*) FROM mutants ${where}`, values)
    const total = parseInt(countResult.rows[0].count)

    values.push(limit, offset)
    const result = await pool.query(
      `SELECT id, name, real_name, aliases, mutant_class, power_types, affiliations, universes, color, bio FROM mutants ${where} ORDER BY ${sortCol} ${sortDir} LIMIT $${i} OFFSET $${i+1}`,
      values
    )

    res.json({ mutants: result.rows, total, page: parseInt(page), limit: parseInt(limit), totalPages: Math.ceil(total / limit) })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// GET single mutant by ID
router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM mutants WHERE id = $1', [req.params.id])
    if (!result.rows.length) return res.status(404).json({ error: 'Mutant not found' })
    res.json(result.rows[0])
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// GET family tree for a mutant
router.get('/:id/family', async (req, res) => {
  try {
    const mutantResult = await pool.query('SELECT * FROM mutants WHERE id = $1', [req.params.id])
    if (!mutantResult.rows.length) return res.status(404).json({ error: 'Mutant not found' })

    const mutant = mutantResult.rows[0]
    const family = mutant.family || {}
    const allRelatedIds = [
      ...(family.children || []),
      ...(family.siblings || []),
      family.father, family.mother, family.spouse
    ].filter(Boolean)

    let relatedMutants = []
    if (allRelatedIds.length) {
      const related = await pool.query('SELECT id, name, color, mutant_class, power_types FROM mutants WHERE id = ANY($1)', [allRelatedIds])
      relatedMutants = related.rows
    }

    res.json({ mutant: { id: mutant.id, name: mutant.name, color: mutant.color, mutant_class: mutant.mutant_class, family: mutant.family }, related: relatedMutants })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// POST create new mutant
router.post('/', async (req, res) => {
  try {
    const { id, name, real_name, aliases, mutant_class, bio, power_types, affiliations, universes, first_appearance, created_by, stats, abilities, related, color, family } = req.body
    if (!id || !name) return res.status(400).json({ error: 'id and name are required' })
    const result = await pool.query(`
      INSERT INTO mutants (id, name, real_name, aliases, mutant_class, bio, power_types, affiliations, universes, first_appearance, created_by, stats, abilities, related, color, family)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16) RETURNING *
    `, [id, name, real_name, aliases, mutant_class, bio, power_types, affiliations, universes, first_appearance, created_by, JSON.stringify(stats), JSON.stringify(abilities), related, color, JSON.stringify(family)])
    res.status(201).json(result.rows[0])
  } catch (err) {
    if (err.code === '23505') return res.status(409).json({ error: 'Mutant ID already exists' })
    res.status(500).json({ error: err.message })
  }
})

// PUT update mutant
router.put('/:id', async (req, res) => {
  try {
    const fields = ['name', 'real_name', 'aliases', 'mutant_class', 'bio', 'power_types', 'affiliations', 'universes', 'first_appearance', 'created_by', 'stats', 'abilities', 'related', 'color', 'family']
    const updates = []
    const values = []
    let i = 1
    for (const f of fields) {
      if (req.body[f] !== undefined) {
        updates.push(`${f} = $${i}`)
        values.push(['stats', 'abilities', 'family'].includes(f) ? JSON.stringify(req.body[f]) : req.body[f])
        i++
      }
    }
    if (!updates.length) return res.status(400).json({ error: 'No fields to update' })
    updates.push(`updated_at = NOW()`)
    values.push(req.params.id)
    const result = await pool.query(`UPDATE mutants SET ${updates.join(', ')} WHERE id = $${i} RETURNING *`, values)
    if (!result.rows.length) return res.status(404).json({ error: 'Mutant not found' })
    res.json(result.rows[0])
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// DELETE mutant
router.delete('/:id', async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM mutants WHERE id = $1 RETURNING id', [req.params.id])
    if (!result.rows.length) return res.status(404).json({ error: 'Mutant not found' })
    res.json({ deleted: req.params.id })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router