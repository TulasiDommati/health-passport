const express = require('express');
const router = express.Router();

router.get('/:patientId', async (req, res) => {
  try {
    const { getDb } = require('../db/database');
    const db = await getDb();

    const result = db.exec("SELECT * FROM consents WHERE patient_id = ? ORDER BY granted_at DESC", [req.params.patientId]);
    if (!result.length) return res.json([]);

    const cols = result[0].columns;
    const consents = result[0].values.map(row => {
      const obj = {};
      cols.forEach((col, i) => { obj[col] = row[i]; });
      obj.data_types = obj.data_types ? obj.data_types.split(',') : [];
      return obj;
    });

    res.json(consents);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/:patientId', async (req, res) => {
  try {
    const { getDb, saveDb } = require('../db/database');
    const db = await getDb();
    const { patientId } = req.params;
    const { providerName, facility, purpose, dataTypes, expiresAt } = req.body;

    db.run(
      `INSERT INTO consents (patient_id, provider_name, facility, purpose, data_types, granted_at, expires_at, status) VALUES (?, ?, ?, ?, ?, ?, ?, 'active')`,
      [patientId, providerName, facility, purpose, dataTypes.join(','), new Date().toISOString(), expiresAt]
    );

    saveDb();

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:consentId/revoke', async (req, res) => {
  try {
    const { getDb, saveDb } = require('../db/database');
    const db = await getDb();

    db.run("UPDATE consents SET status = 'revoked' WHERE id = ?", [req.params.consentId]);
    saveDb();

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
