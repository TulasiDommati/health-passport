const express = require('express');
const router = express.Router();

router.get('/:patientId', async (req, res) => {
  try {
    const { getDb } = require('../db/database');
    const db = await getDb();
    const { patientId } = req.params;

    const allergiesResult = db.exec("SELECT * FROM allergies WHERE patient_id = ?", [patientId]);
    const prescriptionsResult = db.exec("SELECT * FROM prescriptions WHERE patient_id = ?", [patientId]);
    const priorRecordsResult = db.exec("SELECT * FROM prior_records WHERE patient_id = ?", [patientId]);
    const vitalsResult = db.exec("SELECT * FROM vitals WHERE patient_id = ?", [patientId]);

    function parseResult(result) {
      if (!result.length || !result[0].values.length) return [];
      const cols = result[0].columns;
      return result[0].values.map(row => {
        const obj = {};
        cols.forEach((col, i) => { obj[col] = row[i]; });
        return obj;
      });
    }

    function parseSingle(result) {
      if (!result.length || !result[0].values.length) return null;
      const cols = result[0].columns;
      const row = result[0].values[0];
      const obj = {};
      cols.forEach((col, i) => { obj[col] = row[i]; });
      return obj;
    }

    res.json({
      allergies: parseResult(allergiesResult),
      prescriptions: parseResult(prescriptionsResult),
      priorRecords: parseResult(priorRecordsResult),
      vitals: parseSingle(vitalsResult),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/:patientId/allergy', async (req, res) => {
  try {
    const { getDb, saveDb } = require('../db/database');
    const db = await getDb();
    const { patientId } = req.params;
    const { allergen, severity, reaction, actor } = req.body;

    db.run(
      `INSERT INTO allergies (patient_id, allergen, severity, reaction, documented) VALUES (?, ?, ?, ?, ?)`,
      [patientId, allergen, severity, reaction, new Date().toISOString().split('T')[0]]
    );

    db.run(
      `INSERT INTO audit_log (action, actor, target, timestamp, icon) VALUES (?, ?, ?, ?, ?)`,
      ['Allergy Added', actor || 'Receptionist', `Patient ${patientId}`, new Date().toISOString(), 'check']
    );

    saveDb();

    const result = db.exec("SELECT * FROM allergies WHERE patient_id = ? ORDER BY id DESC LIMIT 1", [patientId]);
    const cols = result[0].columns;
    const row = result[0].values[0];
    const allergy = {};
    cols.forEach((col, i) => { allergy[col] = row[i]; });

    res.json({ success: true, report: allergy });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/:patientId/prescription', async (req, res) => {
  try {
    const { getDb, saveDb } = require('../db/database');
    const db = await getDb();
    const { patientId } = req.params;
    const { medication, dosage, prescribedBy, date, condition, actor } = req.body;

    db.run(
      `INSERT INTO prescriptions (patient_id, medication, dosage, prescribed_by, date, status, condition_name) VALUES (?, ?, ?, ?, ?, 'active', ?)`,
      [patientId, medication, dosage, prescribedBy, date, condition]
    );

    db.run(
      `INSERT INTO audit_log (action, actor, target, timestamp, icon) VALUES (?, ?, ?, ?, ?)`,
      ['Prescription Added', actor || 'Receptionist', `Patient ${patientId}`, new Date().toISOString(), 'check']
    );

    saveDb();

    const result = db.exec("SELECT * FROM prescriptions WHERE patient_id = ? ORDER BY id DESC LIMIT 1", [patientId]);
    const cols = result[0].columns;
    const row = result[0].values[0];
    const rx = {};
    cols.forEach((col, i) => { rx[col] = row[i]; });

    res.json({ success: true, report: rx });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/:patientId/prior-record', async (req, res) => {
  try {
    const { getDb, saveDb } = require('../db/database');
    const db = await getDb();
    const { patientId } = req.params;
    const { title, facility, date, doctor, type, summary, actor } = req.body;

    db.run(
      `INSERT INTO prior_records (patient_id, title, facility, date, doctor, type, summary) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [patientId, title, facility, date, doctor, type, summary]
    );

    db.run(
      `INSERT INTO audit_log (action, actor, target, timestamp, icon) VALUES (?, ?, ?, ?, ?)`,
      ['Prior Record Added', actor || 'Receptionist', `Patient ${patientId}`, new Date().toISOString(), 'check']
    );

    saveDb();

    const result = db.exec("SELECT * FROM prior_records WHERE patient_id = ? ORDER BY id DESC LIMIT 1", [patientId]);
    const cols = result[0].columns;
    const row = result[0].values[0];
    const record = {};
    cols.forEach((col, i) => { record[col] = row[i]; });

    res.json({ success: true, report: record });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/:patientId/vitals', async (req, res) => {
  try {
    const { getDb, saveDb } = require('../db/database');
    const db = await getDb();
    const { patientId } = req.params;
    const { bloodPressure, heartRate, temperature, bloodSugar, bmi, actor } = req.body;

    const existing = db.exec("SELECT id FROM vitals WHERE patient_id = ?", [patientId]);

    if (existing.length && existing[0].values.length) {
      db.run(
        `UPDATE vitals SET blood_pressure = ?, heart_rate = ?, temperature = ?, blood_sugar = ?, bmi = ?, last_updated = ? WHERE patient_id = ?`,
        [bloodPressure, heartRate, temperature, bloodSugar, bmi, new Date().toISOString().split('T')[0], patientId]
      );
    } else {
      db.run(
        `INSERT INTO vitals (patient_id, blood_pressure, heart_rate, temperature, blood_sugar, bmi, last_updated) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [patientId, bloodPressure, heartRate, temperature, bloodSugar, bmi, new Date().toISOString().split('T')[0]]
      );
    }

    db.run(
      `INSERT INTO audit_log (action, actor, target, timestamp, icon) VALUES (?, ?, ?, ?, ?)`,
      ['Vitals Added', actor || 'Receptionist', `Patient ${patientId}`, new Date().toISOString(), 'check']
    );

    saveDb();

    const result = db.exec("SELECT * FROM vitals WHERE patient_id = ?", [patientId]);
    const cols = result[0].columns;
    const row = result[0].values[0];
    const vitals = {};
    cols.forEach((col, i) => { vitals[col] = row[i]; });

    res.json({ success: true, report: vitals });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
