const express = require('express');
const cors = require('cors');
const path = require('path');
const { getDb } = require('./db/database');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const authRoutes = require('./routes/auth');
const patientRoutes = require('./routes/patients');
const reportRoutes = require('./routes/reports');
const consentRoutes = require('./routes/consents');
const auditRoutes = require('./routes/audit');

app.use('/api/auth', authRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/consents', consentRoutes);
app.use('/api/audit', auditRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

async function start() {
  await getDb();
  console.log('Database initialized');

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

start().catch(console.error);
