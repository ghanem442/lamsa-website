const express = require('express');
const cors = require('cors');
const path = require('path');
const env = require('./config/env');
const apiRoutes = require('./routes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// CORS configuration
const corsOptions = {
  origin: env.CORS_ORIGIN === '*' ? '*' : env.CORS_ORIGIN.split(',').map(s => s.trim()),
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};
app.use(cors(corsOptions));

// Body parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Mount API routes under /api
app.use('/api', apiRoutes);

// Serve frontend static files
const rootDir = path.join(__dirname, '..');
app.use(express.static(rootDir));

// Friendly page aliases
app.get('/', (req, res) => res.sendFile(path.join(rootDir, 'intro.html')));
app.get('/index', (req, res) => res.sendFile(path.join(rootDir, 'index.html')));
app.get('/shop', (req, res) => res.sendFile(path.join(rootDir, 'shop.html')));
app.get('/auth', (req, res) => res.sendFile(path.join(rootDir, 'auth.html')));
app.get('/admin', (req, res) => res.sendFile(path.join(rootDir, 'admin.html')));
app.get('/perfume', (req, res) => res.sendFile(path.join(rootDir, 'perfume.html')));
app.get('/routine', (req, res) => res.sendFile(path.join(rootDir, 'routine.html')));
app.get('/gift', (req, res) => res.sendFile(path.join(rootDir, 'gift.html')));

// 404 handler for API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `API Route not found: ${req.method} ${req.originalUrl}`
  });
});

// Central Error Handler
app.use(errorHandler);

module.exports = app;
