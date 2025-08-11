require('dotenv').config();
const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const adminRoutes = require('./routes/admin.routes');

const app = express();

// CORS-Konfiguration für Vite (Frontend läuft auf Port 5173)
const corsOptions = {
  origin: 'http://localhost:5173',
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

// API-Routing
app.use('/api', authRoutes);
app.use('/api', userRoutes);
app.use('/api', adminRoutes);

module.exports = app;
