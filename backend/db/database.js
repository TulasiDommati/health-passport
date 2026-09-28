const initSqlJs = require('sql.js');
const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, 'healthpassport.db');
let db = null;

async function getDb() {
  if (db) return db;

  const SQL = await initSqlJs();

  if (fs.existsSync(DB_PATH)) {
    const fileBuffer = fs.readFileSync(DB_PATH);
    db = new SQL.Database(fileBuffer);
  } else {
    db = new SQL.Database();
  }

  createTables();
  seedData();

  return db;
}

function saveDb() {
  if (!db) return;
  const data = db.export();
  const buffer = Buffer.from(data);
  fs.writeFileSync(DB_PATH, buffer);
}

function createTables() {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      phone TEXT,
      role TEXT NOT NULL DEFAULT 'patient',
      hospital TEXT,
      specialty TEXT,
      emergency_contact_name TEXT,
      emergency_contact_phone TEXT,
      emergency_contact_relation TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS patients (
      id TEXT PRIMARY KEY,
      abha_id TEXT UNIQUE,
      name TEXT NOT NULL,
      dob TEXT,
      blood_group TEXT,
      gender TEXT,
      phone TEXT,
      emergency_contact TEXT,
      avatar TEXT,
      photo_url TEXT,
      abha_linked INTEGER DEFAULT 0,
      abha_linked_date TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS allergies (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      patient_id TEXT NOT NULL,
      allergen TEXT NOT NULL,
      severity TEXT,
      reaction TEXT,
      documented TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (patient_id) REFERENCES patients(id)
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS prescriptions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      patient_id TEXT NOT NULL,
      medication TEXT NOT NULL,
      dosage TEXT,
      prescribed_by TEXT,
      date TEXT,
      status TEXT DEFAULT 'active',
      condition_name TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (patient_id) REFERENCES patients(id)
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS prior_records (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      patient_id TEXT NOT NULL,
      title TEXT NOT NULL,
      facility TEXT,
      date TEXT,
      doctor TEXT,
      type TEXT,
      summary TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (patient_id) REFERENCES patients(id)
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS vitals (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      patient_id TEXT UNIQUE NOT NULL,
      blood_pressure TEXT,
      heart_rate INTEGER,
      temperature TEXT,
      blood_sugar TEXT,
      bmi REAL,
      last_updated TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (patient_id) REFERENCES patients(id)
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS consents (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      patient_id TEXT NOT NULL,
      provider_name TEXT,
      facility TEXT,
      purpose TEXT,
      data_types TEXT,
      granted_at TEXT,
      expires_at TEXT,
      status TEXT DEFAULT 'active',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (patient_id) REFERENCES patients(id)
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS audit_log (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      action TEXT NOT NULL,
      actor TEXT,
      target TEXT,
      timestamp TEXT,
      icon TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  saveDb();
}

function seedData() {
  const userCount = db.exec("SELECT COUNT(*) as count FROM users")[0]?.values[0][0];
  if (userCount > 0) return;

  const users = [
    { name: 'Priya Sharma', email: 'priya@example.com', password: 'demo123', phone: '+91 98765 43210', role: 'patient', ec_name: 'Raj Sharma', ec_phone: '+91 98765 11111', ec_relation: 'Spouse' },
    { name: 'Dr. Amit Patel', email: 'doctor@example.com', password: 'doctor123', phone: '+91 98765 55555', role: 'provider', hospital: 'AIIMS Delhi', specialty: 'Cardiology' },
    { name: 'Admin User', email: 'admin@example.com', password: 'admin123', phone: '+91 98765 99999', role: 'admin' },
    { name: 'Sunita Verma', email: 'receptionist@example.com', password: 'reception123', phone: '+91 98765 77777', role: 'receptionist', hospital: 'AIIMS Delhi' },
  ];

  users.forEach(u => {
    db.run(
      `INSERT INTO users (name, email, password, phone, role, hospital, specialty, emergency_contact_name, emergency_contact_phone, emergency_contact_relation)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [u.name, u.email, u.password, u.phone, u.role, u.hospital || null, u.specialty || null, u.ec_name || null, u.ec_phone || null, u.ec_relation || null]
    );
  });

  const patients = [
    { id: 'HP-2026-8847', abha_id: 'abha-demo-12345678', name: 'Priya Sharma', dob: '1992-03-14', blood_group: 'B+', gender: 'Female', phone: '+91 98765 43210', emergency_contact: 'Raj Sharma — +91 98765 11111', abha_linked: 1, abha_linked_date: '2026-08-01' },
    { id: 'HP-2026-9231', abha_id: 'abha-demo-23456789', name: 'Rahul Kumar', dob: '1985-07-22', blood_group: 'O+', gender: 'Male', phone: '+91 98765 22222', emergency_contact: 'Anita Kumar — +91 98765 33333', abha_linked: 1, abha_linked_date: '2026-06-15' },
    { id: 'HP-2026-7654', abha_id: 'abha-demo-34567890', name: 'Deepa Nair', dob: '1990-11-08', blood_group: 'A+', gender: 'Female', phone: '+91 98765 44444', emergency_contact: 'Suresh Nair — +91 98765 55555', abha_linked: 0 },
    { id: 'HP-2026-6123', abha_id: 'abha-demo-45678901', name: 'Arjun Reddy', dob: '1978-02-28', blood_group: 'AB-', gender: 'Male', phone: '+91 98765 66666', emergency_contact: 'Lakshmi Reddy — +91 98765 77777', abha_linked: 1, abha_linked_date: '2025-12-01' },
    { id: 'HP-2026-5890', abha_id: 'abha-demo-56789012', name: 'Meera Joshi', dob: '1995-09-17', blood_group: 'B-', gender: 'Female', phone: '+91 98765 88888', emergency_contact: 'Vikram Joshi — +91 98765 99999', abha_linked: 1, abha_linked_date: '2026-03-20' },
  ];

  patients.forEach(p => {
    db.run(
      `INSERT INTO patients (id, abha_id, name, dob, blood_group, gender, phone, emergency_contact, abha_linked, abha_linked_date)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [p.id, p.abha_id, p.name, p.dob, p.blood_group, p.gender, p.phone, p.emergency_contact, p.abha_linked, p.abha_linked_date || null]
    );
  });

  const allergies = [
    { patient_id: 'HP-2026-8847', allergen: 'Penicillin', severity: 'Severe', reaction: 'Anaphylaxis', documented: '2024-06-12' },
    { patient_id: 'HP-2026-8847', allergen: 'Peanuts', severity: 'Moderate', reaction: 'Skin rash, throat swelling', documented: '2021-01-20' },
    { patient_id: 'HP-2026-8847', allergen: 'Iodine contrast', severity: 'Mild', reaction: 'Nausea, light-headedness', documented: '2025-11-03' },
  ];

  allergies.forEach(a => {
    db.run(
      `INSERT INTO allergies (patient_id, allergen, severity, reaction, documented) VALUES (?, ?, ?, ?, ?)`,
      [a.patient_id, a.allergen, a.severity, a.reaction, a.documented]
    );
  });

  const prescriptions = [
    { patient_id: 'HP-2026-8847', medication: 'Metformin 500mg', dosage: 'Twice daily with meals', prescribed_by: 'Dr. Anjali Mehta', date: '2026-08-15', status: 'active', condition_name: 'Type 2 Diabetes' },
    { patient_id: 'HP-2026-8847', medication: 'Amlodipine 5mg', dosage: 'Once daily, morning', prescribed_by: 'Dr. Vikram Rao', date: '2026-07-22', status: 'active', condition_name: 'Hypertension' },
    { patient_id: 'HP-2026-8847', medication: 'Cetirizine 10mg', dosage: 'As needed for allergies', prescribed_by: 'Dr. Sneha Patel', date: '2026-06-10', status: 'completed', condition_name: 'Seasonal Allergies' },
  ];

  prescriptions.forEach(p => {
    db.run(
      `INSERT INTO prescriptions (patient_id, medication, dosage, prescribed_by, date, status, condition_name) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [p.patient_id, p.medication, p.dosage, p.prescribed_by, p.date, p.status, p.condition_name]
    );
  });

  const priorRecords = [
    { patient_id: 'HP-2026-8847', title: 'Appendectomy', facility: 'Apollo Hospital, Hyderabad', date: '2023-09-14', doctor: 'Dr. K. Reddy', type: 'Surgery', summary: 'Laparoscopic appendectomy, uncomplicated recovery.' },
    { patient_id: 'HP-2026-8847', title: 'Annual Health Checkup', facility: 'Manipal Hospital, Bangalore', date: '2026-01-10', doctor: 'Dr. S. Nair', type: 'Checkup', summary: 'All vitals normal. Fasting glucose slightly elevated.' },
    { patient_id: 'HP-2026-8847', title: 'MRI Right Knee', facility: 'Narayana Health, Bangalore', date: '2025-11-03', doctor: 'Dr. P. Menon', type: 'Imaging', summary: 'Mild meniscal tear, Grade I.' },
  ];

  priorRecords.forEach(r => {
    db.run(
      `INSERT INTO prior_records (patient_id, title, facility, date, doctor, type, summary) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [r.patient_id, r.title, r.facility, r.date, r.doctor, r.type, r.summary]
    );
  });

  db.run(
    `INSERT INTO vitals (patient_id, blood_pressure, heart_rate, temperature, blood_sugar, bmi, last_updated) VALUES (?, ?, ?, ?, ?, ?, ?)`,
    ['HP-2026-8847', '128/82', 74, '98.4°F', '112 mg/dL', 24.1, '2026-08-20']
  );

  db.run(
    `INSERT INTO consents (patient_id, provider_name, facility, purpose, data_types, granted_at, expires_at, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    ['HP-2026-8847', 'Dr. Anjali Mehta', 'Apollo Hospital', 'Ongoing Treatment — Diabetes Management', 'Allergies,Prescriptions,Lab Results', '2026-08-15T09:30:00Z', '2026-11-15T09:30:00Z', 'active']
  );

  db.run(
    `INSERT INTO consents (patient_id, provider_name, facility, purpose, data_types, granted_at, expires_at, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    ['HP-2026-8847', 'Dr. Vikram Rao', 'Narayana Health', 'Cardiology Consultation', 'Allergies,Vitals,Prior Records', '2026-09-01T14:00:00Z', '2026-09-30T14:00:00Z', 'active']
  );

  const auditEntries = [
    { action: 'Consent Granted', actor: 'Dr. Anjali Mehta', target: 'Diabetes Management', timestamp: '2026-08-15T09:30:00Z', icon: 'check' },
    { action: 'Records Accessed', actor: 'Dr. Anjali Mehta', target: 'Allergies & Prescriptions', timestamp: '2026-08-16T11:22:00Z', icon: 'eye' },
    { action: 'Consent Granted', actor: 'Dr. Vikram Rao', target: 'Cardiology Consultation', timestamp: '2026-09-01T14:00:00Z', icon: 'check' },
    { action: 'Records Accessed', actor: 'Dr. Vikram Rao', target: 'Vitals & Prior Records', timestamp: '2026-09-02T10:15:00Z', icon: 'eye' },
  ];

  auditEntries.forEach(e => {
    db.run(
      `INSERT INTO audit_log (action, actor, target, timestamp, icon) VALUES (?, ?, ?, ?, ?)`,
      [e.action, e.actor, e.target, e.timestamp, e.icon]
    );
  });

  saveDb();
}

module.exports = { getDb, saveDb };
