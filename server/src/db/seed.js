require('dotenv').config();
const { Client } = require('pg');
const fs         = require('fs');
const path       = require('path');

const SEEDS_DIR = path.join(__dirname, 'seeds');
const RESET     = process.argv.includes('--reset');

const RESET_SQL = `
  DELETE FROM order_items;
  DELETE FROM orders;
  DELETE FROM cart_items;
  DELETE FROM wishlists;
  DELETE FROM product_images;
  DELETE FROM products;
  DELETE FROM addresses;
  DELETE FROM users;
  DELETE FROM categories;
`;

async function seed() {
  const client = new Client({ connectionString: process.env.DATABASE_URL });

  try {
    await client.connect();
    console.log('[seed] Connected to database');

    if (RESET) {
      console.log('[seed] --reset flag detected, deleting existing data...');
      await client.query(RESET_SQL);
      console.log('[seed] Data cleared');
    }

    const files = fs
      .readdirSync(SEEDS_DIR)
      .filter((f) => f.endsWith('.sql'))
      .sort();

    for (const file of files) {
      const sql = fs.readFileSync(path.join(SEEDS_DIR, file), 'utf8');
      await client.query('BEGIN');
      try {
        await client.query(sql);
        await client.query('COMMIT');
        console.log(`[seed] ran   ${file}`);
      } catch (err) {
        await client.query('ROLLBACK');
        throw new Error(`Seed failed for ${file}: ${err.message}`);
      }
    }

    console.log('[seed] Done.');
    process.exit(0);
  } catch (err) {
    console.error('[seed] Error:', err.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

seed();
