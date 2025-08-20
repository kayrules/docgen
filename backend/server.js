// backend/server.js
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// --- Middleware ---
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// --- Routes ---
app.use('/api/project', require('./routes/projects')); // Project-related API
//app.use('/api/chat', require('./routes/chat'));         // Docs Assistant API

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    service: 'DocuPilot Backend API'
  });
});

// 404 handler (only after all other routes)
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found'
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

app.get("/api/project", (req, res) => {
  res.json({ success: true, message: "Project API works!" });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 DocuPilot Backend API running on port ${PORT}`);
  console.log(`📋 Health check: http://localhost:${PORT}/health`);
});
