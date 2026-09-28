const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { getDb } = require('../db/database');
    const db = await getDb();

    const result = db.exec("SELECT * FROM audit_log ORDER BY timestamp DESC LIMIT 50");
    if (!result.length) return res.json([]);

    const cols = result[0].columns;
    const entries = result[0].values.map(row => {
      const obj = {};
      cols.forEach((col, i) => { obj[col] = row[i]; });
      return obj;
    });

    res.json(entries);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { getDb, saveDb } = require('../db/database');
    const db = await getDb();
    const { action, actor, target, icon } = req.body;

    db.run(
      `INSERT INTO audit_log (action, actor, target, timestamp, icon) VALUES (?, ?, ?, ?, ?)`,
      [action, actor, target, new Date().toISOString(), icon || 'eye']
    );

    saveDb();

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
