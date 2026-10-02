const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

const startTime = Date.now();

// Simple structured logging middleware
app.use((req, res, next) => {
  const log = {
    timestamp: new Date().toISOString(),
    method: req.method,
    path: req.path,
    ip: req.ip
  };
  console.log(JSON.stringify(log));
  next();
});

app.get('/', (req, res) => {
  res.json({
    message: 'Docker Web Server Running',
    status: 'healthy',
    version: '1.0.0'
  });
});

// Health check endpoint — Docker HEALTHCHECK will hit this
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// Basic metrics endpoint (feeds Prometheus later if you add it)
app.get('/metrics', (req, res) => {
  res.status(200).json({
    uptime_seconds: process.uptime(),
    memory_usage: process.memoryUsage(),
    timestamp: new Date().toISOString()
  });
});

// DEMO ONLY: simulates an application failure for troubleshooting demo
app.get('/simulate-crash', (req, res) => {
  res.json({ message: 'Crashing in 2 seconds...' });
  setTimeout(() => {
    process.exit(1); // simulates a fatal unhandled error
  }, 2000);
});

app.use((err, req, res, next) => {
  console.error(JSON.stringify({
    timestamp: new Date().toISOString(),
    level: 'error',
    message: err.message,
    stack: err.stack
  }));
  res.status(500).json({ status: 'error', message: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});