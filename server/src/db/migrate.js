require('dotenv').config();
const { Client } = require('pg');
const fs         = require('fs');
const path       = require('path');

const MIGRATIONS_DIR = path.join(__dirname, 'migrations');

async function migrate() {
  // Strip ?sslmode=... from URL so pg doesn't override our explicit ssl option.
  // pg v8 merges URL sslmode with the ssl option in a way that can nullify rejectUnauthorized.
  const rawUrl = process.env.DATABASE_URL || '';
  // Strip sslmode and channel_binding — we set ssl explicitly below
  const dbUrl  = rawUrl.replace(/([?&])(sslmode|channel_binding)=[^&]*/g,
                   (_, sep) => (sep === '?' ? '?' : ''));
  const isLocal = /localhost|127\.0\.0\.1/.test(rawUrl);
  const ssl    = isLocal ? false : { rejectUnauthorized: false };
  const client = new Client({ connectionString: dbUrl, ssl });

  try {
    await client.connect();
    console.log('[migrate] Connected to database');

    await client.query(`
      CREATE TABLE IF NOT EXISTS migrations_log (
        id         SERIAL      PRIMARY KEY,
        filename   VARCHAR(255) NOT NULL UNIQUE,
        applied_at TIMESTAMPTZ DEFAULT NOW()
      )
    `);

    const { rows: applied } = await client.query(
      'SELECT filename FROM migrations_log'
    );
    const appliedSet = new Set(applied.map((r) => r.filename));

    const files = fs
      .readdirSync(MIGRATIONS_DIR)
      .filter((f) => f.endsWith('.sql'))
      .sort();

    let ran = 0;
    for (const file of files) {
      if (appliedSet.has(file)) {
        console.log(`[migrate] skip  ${file}`);
        continue;
      }

      const sql = fs.readFileSync(path.join(MIGRATIONS_DIR, file), 'utf8');

      await client.query('BEGIN');
      try {
        await client.query(sql);
        await client.query(
          'INSERT INTO migrations_log (filename) VALUES ($1)',
          [file]
        );
        await client.query('COMMIT');
        console.log(`[migrate] ran   ${file}`);
        ran++;
      } catch (err) {
        await client.query('ROLLBACK');
        throw new Error(`Migration failed for ${file}: ${err.message}`);
      }
    }

    console.log(`[migrate] Done. ${ran} migration(s) applied.`);
    process.exit(0);
  } catch (err) {
    console.error('[migrate] Error:', err.message || err.code || String(err));
    console.error('[migrate] Stack:', err.stack);
    process.exit(1);
  } finally {
    await client.end();
  }
}

migrate();
