require('dotenv').config();
const express = require('express');
const cors = require('cors');
const pool = require('./config/db');
const entityRoutes = require('./routes/entityRoutes');
const reportRoutes = require('./routes/reportRoutes');
const errorHandler = require('./middleware/errorHandler');
const app = express();
app.use(cors());
app.use(express.json({ limit: '1mb' }));
app.get('/api/health', async (req, res, next) => {
  try { await pool.query('SELECT 1'); res.json({ status: 'ok', database: 'connected', project: 'Saffron & Slate' }); }
  catch (error) { next(error); }
});
app.use('/api/reports', reportRoutes);
app.use('/api', entityRoutes);
app.use((req, res) => res.status(404).json({ error: 'API endpoint not found.' }));
app.use(errorHandler);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Saffron & Slate API running on http://localhost:${PORT}/api`));
