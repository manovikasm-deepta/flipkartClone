const { Pool } = require('pg');

const pool = new Pool({
  connectionString:        process.env.DATABASE_URL,
  max:                     process.env.NODE_ENV === 'production' ? 2 : 10,
  idleTimeoutMillis:       10000,
  connectionTimeoutMillis: 5000,
  ssl:
    process.env.NODE_ENV === 'production'
      ? { rejectUnauthorized: false }
      : false,
});

pool.on('error', (err) => {
  console.error('[db] Unexpected idle client error:', err.message);
});

async function query(text, params) {
  const start = Date.now();
  const result = await pool.query(text, params);
  if (process.env.NODE_ENV === 'development') {
    const ms = Date.now() - start;
    if (ms > 150) console.warn(`[db] slow query (${ms}ms):`, text.slice(0, 80));
  }
  return result;
}

module.exports = { pool, query };
