require('dotenv').config();

const express      = require('express');
const helmet       = require('helmet');
const cors         = require('cors');
const morgan       = require('morgan');

const routes        = require('./routes');
const errorHandler  = require('./middleware/errorHandler');
const { apiLimiter } = require('./middleware/rateLimiter');

const app = express();

// ─── CORS ─────────────────────────────────────────────────────────────────────
const CORS_ORIGINS = (process.env.CORS_ORIGINS || 'http://localhost:5173')
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean);

// ─── Middleware (order is critical) ──────────────────────────────────────────
app.use(helmet());

app.use(
  cors({
    origin:      CORS_ORIGINS,
    credentials: true,
    methods:     ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(express.json({ limit: '10kb' }));

app.use(
  morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev')
);

// ─── Rate limiting ────────────────────────────────────────────────────────────
app.use('/api', apiLimiter);

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use('/api', routes);

// ─── 404 handler (must come after all routes) ────────────────────────────────
app.use((req, res) => {
  res.status(404).json({
    success: false,
    data:    null,
    message: `Cannot ${req.method} ${req.path}`,
    error:   'NOT_FOUND',
  });
});

// ─── Global error handler (must be last) ─────────────────────────────────────
app.use(errorHandler);

module.exports = app;
