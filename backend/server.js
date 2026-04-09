/**
 * MzansiBuilds - Main Server Entry Point
 *
 * Initializes the Express application with security middleware,
 * static file serving, and API route registration.
 *
 * @module server
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// ─── Security Middleware (Secure by Design) ───────────────────────────────────

/**
 * Helmet sets secure HTTP response headers.
 * Protects against well-known web vulnerabilities like XSS, clickjacking etc.
 */
app.use(helmet({
  contentSecurityPolicy: false
}));

/**
 * Rate limiter — prevents brute force and DDoS attacks.
 * Limits each IP to 100 requests per 15 minutes on API routes.
 */
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: 'Too many requests, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false
});

// ─── General Middleware ───────────────────────────────────────────────────────

app.use(cors());
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));

// Serve frontend static files
app.use(express.static(path.join(__dirname, '../frontend')));

// ─── API Routes ───────────────────────────────────────────────────────────────

app.use('/api', apiLimiter);

/**
 * Health check endpoint.
 * Used by CI/CD and monitoring to confirm the server is running.
 *
 * @route GET /api/health
 * @returns {object} status and message
 */
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'MzansiBuilds API is running',
    timestamp: new Date().toISOString()
  });
});

// ─── Route Registration ───────────────────────────────────────────────────────

app.use('/api/auth', require('./routes/auth'));
// app.use('/api/projects', require('./routes/projects'));
// app.use('/api/comments', require('./routes/comments'));
// app.use('/api/milestones', require('./routes/milestones'));
// app.use('/api/celebrate', require('./routes/celebrate'));

// ─── Frontend Routes ──────────────────────────────────────────────────────────

/**
 * Serves the landing page at the root route.
 */
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/html/index.html'));
});

/**
 * Serves any HTML page by name from the html folder.
 * Example: /html/login.html → frontend/html/login.html
 */
app.get('/html/:page', (req, res) => {
  const safePage = path.basename(req.params.page);
  res.sendFile(path.join(__dirname, `../frontend/html/${safePage}`));
});

// ─── 404 Handler ─────────────────────────────────────────────────────────────

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// ─── Global Error Handler ─────────────────────────────────────────────────────

/**
 * Centralized error handling middleware.
 * Catches any unhandled errors and returns a clean JSON response.
 * Never exposes stack traces in production.
 */
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: process.env.NODE_ENV === 'production'
      ? 'Something went wrong'
      : err.message
  });
});

// ─── Start Server ─────────────────────────────────────────────────────────────

app.listen(PORT, () => {
  console.log(`✅ MzansiBuilds server running on http://localhost:${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;