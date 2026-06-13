const router       = require('express').Router();
const { query }    = require('../config/db');

router.get('/', async (_req, res) => {
  let dbStatus = 'connected';
  let healthy  = true;

  try {
    await query('SELECT 1', []);
  } catch {
    dbStatus = 'disconnected';
    healthy  = false;
  }

  res.status(healthy ? 200 : 503).json({
    status:    healthy ? 'healthy' : 'unhealthy',
    timestamp: new Date().toISOString(),
    uptime:    Math.floor(process.uptime()),
    database:  dbStatus,
    version:   process.env.npm_package_version || '1.0.0',
  });
});

module.exports = router;
