const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve frontend static files
app.use(express.static(path.join(__dirname, '../frontend')));

// API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/courses', require('./routes/courseRoutes'));
app.use('/api/assessments', require('./routes/assessmentRoutes'));
app.use('/api/progress', require('./routes/progressRoutes'));
app.use('/api/study-plans', require('./routes/studyPlanRoutes'));
app.use('/api/skills', require('./routes/skillRoutes'));
app.use('/api/ai', require('./routes/aiRoutes'));
app.use('/api/ollama', require('./routes/ollamaRoutes'));

// Health check & DB status route
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    appName: 'SKILLNEX API Server',
    useDemoData: process.env.USE_DEMO_DATA !== 'false',
    ollamaHost: process.env.OLLAMA_HOST || 'http://localhost:11434',
    timestamp: new Date()
  });
});

// Fallback to index.html for SPA routing if needed
app.get('*', (req, res) => {
  if (!req.path.startsWith('/api')) {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
  } else {
    res.status(404).json({ success: false, message: 'API Endpoint not found' });
  }
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("Server Error:", err);
  res.status(500).json({ success: false, message: 'Internal Server Error', error: err.message });
});

app.listen(PORT, () => {
  console.log(`===================================================`);
  console.log(`🚀 SKILLNEX Server running on http://localhost:${PORT}`);
  console.log(`📊 Mode: ${process.env.USE_DEMO_DATA !== 'false' ? 'DEMO MODE (In-Memory DB)' : 'LIVE GOOGLE SHEETS MODE'}`);
  console.log(`===================================================`);
});
