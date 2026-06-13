require('dotenv').config();
const request = require('supertest');
const app     = require('../app');
const { pool } = require('../config/db');

const UNIQUE = Date.now();
const USER = {
  name:     'Jest Tester',
  email:    `jest_${UNIQUE}@test.com`,
  password: 'TestPass1',
};

afterAll(async () => {
  await pool.query('DELETE FROM users WHERE email = $1', [USER.email]);
  await pool.end();
});

// ─── Health ───────────────────────────────────────────────────────────────────
describe('GET /api/health', () => {
  it('returns 200 and healthy status with DB connected', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('healthy');
    expect(res.body.database).toBe('connected');
    expect(res.body).toHaveProperty('uptime');
    expect(res.body).toHaveProperty('timestamp');
  });
});

// ─── Auth — Register ──────────────────────────────────────────────────────────
describe('POST /api/auth/register', () => {
  it('creates a user and returns token + user with public_id', async () => {
    const res = await request(app).post('/api/auth/register').send(USER);
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.token).toBeDefined();
    expect(res.body.data.user.id).toBeDefined();
    expect(res.body.data.user.email).toBe(USER.email);
    expect(res.body.data.user).not.toHaveProperty('password_hash');
    expect(res.body.data.user).not.toHaveProperty('password');
  });

  it('rejects short password', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ ...USER, email: 'other@test.com', password: 'short' });
    expect(res.status).toBe(422);
    expect(res.body.error).toBe('VALIDATION_ERROR');
  });

  it('rejects password without uppercase', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ ...USER, email: 'other2@test.com', password: 'lowercase1' });
    expect(res.status).toBe(422);
    expect(res.body.error).toBe('VALIDATION_ERROR');
  });

  it('rejects duplicate email with CONFLICT error', async () => {
    const res = await request(app).post('/api/auth/register').send(USER);
    expect(res.status).toBe(409);
    expect(res.body.error).toBe('EMAIL_ALREADY_EXISTS');
    expect(res.body.success).toBe(false);
  });

  it('rejects missing name', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ email: 'x@y.com', password: 'TestPass1' });
    expect(res.status).toBe(422);
  });
});

// ─── Auth — Login ─────────────────────────────────────────────────────────────
describe('POST /api/auth/login', () => {
  let token;

  it('returns token for valid credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: USER.email, password: USER.password });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.token).toBeDefined();
    expect(res.body.data.user.email).toBe(USER.email);
    token = res.body.data.token;
  });

  it('rejects wrong password with INVALID_CREDENTIALS', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: USER.email, password: 'WrongPass1' });
    expect(res.status).toBe(401);
    expect(res.body.error).toBe('INVALID_CREDENTIALS');
  });

  it('gives same error for unknown email (no user enumeration)', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'nobody@example.com', password: 'WrongPass1' });
    expect(res.status).toBe(401);
    expect(res.body.error).toBe('INVALID_CREDENTIALS');
  });

  // ─── Auth — Me ─────────────────────────────────────────────────────────────
  it('GET /api/auth/me — returns profile for valid token', async () => {
    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.data.user.email).toBe(USER.email);
    expect(res.body.data.user).not.toHaveProperty('password_hash');
  });

  it('GET /api/auth/me — rejects missing token', async () => {
    const res = await request(app).get('/api/auth/me');
    expect(res.status).toBe(401);
    expect(res.body.error).toBe('UNAUTHORIZED');
  });

  it('GET /api/auth/me — rejects malformed token', async () => {
    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', 'Bearer not.a.token');
    expect(res.status).toBe(401);
    expect(res.body.error).toBe('UNAUTHORIZED');
  });
});

// ─── Auth — Default user ──────────────────────────────────────────────────────
describe('GET /api/auth/default-user', () => {
  it('returns 200 with token when default user exists', async () => {
    const res = await request(app).get('/api/auth/default-user');
    // Seed data has a default user; pass if 200, accept 404 if seed not run
    expect([200, 404]).toContain(res.status);
    if (res.status === 200) {
      expect(res.body.data.token).toBeDefined();
      expect(res.body.data.user.id).toBeDefined();
    }
  });
});

// ─── Products ─────────────────────────────────────────────────────────────────
describe('GET /api/products', () => {
  it('returns list shape with pagination', async () => {
    const res = await request(app).get('/api/products');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data.items)).toBe(true);
    expect(res.body.data.pagination).toHaveProperty('total');
    expect(res.body.data.pagination).toHaveProperty('totalPages');
  });

  it('product card contains camelCase fields', async () => {
    const res = await request(app).get('/api/products?limit=1');
    if (!res.body.data.items.length) return; // seed not run
    const p = res.body.data.items[0];
    expect(p).toHaveProperty('sellingPrice');
    expect(p).toHaveProperty('discountPct');
    expect(p).toHaveProperty('reviewCount');
    expect(p).toHaveProperty('inStock');
    expect(p.category).toHaveProperty('id');
    expect(p.category).toHaveProperty('slug');
    expect(p).not.toHaveProperty('selling_price');
    expect(p).not.toHaveProperty('discount_pct');
  });

  it('filters by inStock=true by default', async () => {
    const res = await request(app).get('/api/products');
    const outOfStock = res.body.data.items.filter((p) => !p.inStock);
    expect(outOfStock.length).toBe(0);
  });

  it('sort=price_asc returns ascending prices', async () => {
    const res = await request(app).get('/api/products?sort=price_asc&limit=10');
    const prices = res.body.data.items.map((p) => p.sellingPrice);
    for (let i = 1; i < prices.length; i++) {
      expect(prices[i]).toBeGreaterThanOrEqual(prices[i - 1]);
    }
  });

  it('paginates correctly', async () => {
    const p1 = await request(app).get('/api/products?page=1&limit=5');
    const p2 = await request(app).get('/api/products?page=2&limit=5');
    expect(p1.body.data.pagination.page).toBe(1);
    expect(p2.body.data.pagination.page).toBe(2);
    if (p1.body.data.items.length && p2.body.data.items.length) {
      expect(p1.body.data.items[0].id).not.toBe(p2.body.data.items[0].id);
    }
  });

  it('returns 404 for unknown category UUID', async () => {
    const fakeUUID = '00000000-0000-0000-0000-000000000000';
    const res = await request(app).get(`/api/products?category=${fakeUUID}`);
    expect(res.status).toBe(404);
    expect(res.body.error).toBe('NOT_FOUND');
  });
});

describe('GET /api/products/featured', () => {
  it('returns sections array with title and products', async () => {
    const res = await request(app).get('/api/products/featured');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data.sections)).toBe(true);
    if (res.body.data.sections.length) {
      const section = res.body.data.sections[0];
      expect(section).toHaveProperty('title');
      expect(section).toHaveProperty('color');
      expect(Array.isArray(section.products)).toBe(true);
    }
  });
});

describe('GET /api/products/:id', () => {
  it('returns 404 for non-existent UUID', async () => {
    const fakeUUID = '00000000-0000-0000-0000-000000000001';
    const res = await request(app).get(`/api/products/${fakeUUID}`);
    expect(res.status).toBe(404);
    expect(res.body.error).toBe('NOT_FOUND');
  });

  it('returns full product with images for a real product', async () => {
    // First get a product ID from the list
    const list = await request(app).get('/api/products?limit=1');
    if (!list.body.data.items.length) return; // seed not run

    const { id } = list.body.data.items[0];
    const res = await request(app).get(`/api/products/${id}`);
    expect(res.status).toBe(200);
    expect(res.body.data.product).toHaveProperty('images');
    expect(Array.isArray(res.body.data.product.images)).toBe(true);
    expect(res.body.data.product).toHaveProperty('description');
    expect(res.body.data.product).toHaveProperty('specifications');
  });
});

// ─── Categories ───────────────────────────────────────────────────────────────
describe('GET /api/categories', () => {
  it('returns categories array with camelCase iconUrl', async () => {
    const res = await request(app).get('/api/categories');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data.categories)).toBe(true);
    if (res.body.data.categories.length) {
      const c = res.body.data.categories[0];
      expect(c).toHaveProperty('id');
      expect(c).toHaveProperty('slug');
      expect(c).toHaveProperty('iconUrl');
    }
  });
});

// ─── 404 catch-all ────────────────────────────────────────────────────────────
describe('404 handler', () => {
  it('returns NOT_FOUND for unregistered routes', async () => {
    const res = await request(app).get('/api/does-not-exist');
    expect(res.status).toBe(404);
    expect(res.body.error).toBe('NOT_FOUND');
    expect(res.body.success).toBe(false);
  });
});
