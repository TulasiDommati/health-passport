const express = require('express');
const router = express.Router();

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const { getDb } = require('../db/database');
    const db = await getDb();

    const result = db.exec("SELECT id, name, email, phone, role, hospital, specialty FROM users WHERE email = ? AND password = ?", [email, password]);

    if (!result.length || !result[0].values.length) {
      return res.status(401).json({ success: false, error: 'Invalid email or password' });
    }

    const cols = result[0].columns;
    const row = result[0].values[0];
    const user = {};
    cols.forEach((col, i) => { user[col] = row[i]; });

    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.post('/register', async (req, res) => {
  try {
    const { name, email, password, phone, emergencyContact } = req.body;
    const { getDb } = require('../db/database');
    const db = await getDb();

    const existing = db.exec("SELECT id FROM users WHERE email = ?", [email]);
    if (existing.length && existing[0].values.length) {
      return res.status(400).json({ success: false, error: 'Email already registered' });
    }

    db.run(
      `INSERT INTO users (name, email, password, phone, role, emergency_contact_name, emergency_contact_phone, emergency_contact_relation)
       VALUES (?, ?, ?, ?, 'patient', ?, ?, ?)`,
      [name, email, password, phone, emergencyContact?.name || '', emergencyContact?.phone || '', emergencyContact?.relation || '']
    );

    const { saveDb } = require('../db/database');
    saveDb();

    const result = db.exec("SELECT id, name, email, phone, role FROM users WHERE email = ?", [email]);
    const cols = result[0].columns;
    const row = result[0].values[0];
    const user = {};
    cols.forEach((col, i) => { user[col] = row[i]; });

    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
