const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { getDb } = require('../db/database');
    const db = await getDb();

    const result = db.exec("SELECT * FROM patients ORDER BY name");
    if (!result.length) return res.json([]);

    const cols = result[0].columns;
    const patients = result[0].values.map(row => {
      const obj = {};
      cols.forEach((col, i) => { obj[col] = row[i]; });
      return obj;
    });

    res.json(patients);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { getDb } = require('../db/database');
    const db = await getDb();

    const result = db.exec("SELECT * FROM patients WHERE id = ?", [req.params.id]);
    if (!result.length || !result[0].values.length) {
      return res.status(404).json({ error: 'Patient not found' });
    }

    const cols = result[0].columns;
    const row = result[0].values[0];
    const patient = {};
    cols.forEach((col, i) => { patient[col] = row[i]; });

    res.json(patient);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
