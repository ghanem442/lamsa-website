const app = require('./src/app');
const env = require('./src/config/env');

const PORT = env.PORT || 3000;

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`✨ LAMSA Store & API live at http://localhost:${PORT}`);
  console.log(`🩺 Health check: http://localhost:${PORT}/api/health`);
});

// Graceful shutdown handling
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
  });
});

module.exports = server;
