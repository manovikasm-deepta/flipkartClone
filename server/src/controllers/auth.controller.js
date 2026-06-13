const bcrypt   = require('bcryptjs');
const jwt      = require('jsonwebtoken');
const pool     = require('../config/db');
const ApiError = require('../utils/ApiError');

function signToken(user) {
  return jwt.sign(
    { sub: user.id, publicId: user.public_id },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
}

async function register(req, res, next) {
  const { name, email, password, phone } = req.body;
  try {
    const existing = await pool.query(
      'SELECT id FROM users WHERE email = $1',
      [email.toLowerCase()]
    );
    if (existing.rows.length) {
      return next(new ApiError(409, 'Email already registered'));
    }

    const hash = await bcrypt.hash(password, 12);
    const { rows } = await pool.query(
      `INSERT INTO users (name, email, password_hash, phone)
       VALUES ($1, $2, $3, $4)
       RETURNING id, public_id, name, email, phone, avatar_url, created_at`,
      [name.trim(), email.toLowerCase(), hash, phone || null]
    );

    const user  = rows[0];
    const token = signToken(user);

    res.status(201).json({ success: true, token, user });
  } catch (err) {
    next(err);
  }
}

async function login(req, res, next) {
  const { email, password } = req.body;
  try {
    const { rows } = await pool.query(
      `SELECT id, public_id, name, email, phone, avatar_url,
              password_hash, created_at
       FROM users WHERE email = $1`,
      [email.toLowerCase()]
    );
    const user = rows[0];
    if (!user) return next(new ApiError(401, 'Invalid email or password'));

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) return next(new ApiError(401, 'Invalid email or password'));

    const { password_hash: _, ...safeUser } = user;
    const token = signToken(user);

    res.json({ success: true, token, user: safeUser });
  } catch (err) {
    next(err);
  }
}

async function me(req, res, next) {
  try {
    const { rows } = await pool.query(
      `SELECT id, public_id, name, email, phone, avatar_url, created_at
       FROM users WHERE id = $1`,
      [req.user.id]
    );
    if (!rows.length) return next(new ApiError(404, 'User not found'));
    res.json({ success: true, user: rows[0] });
  } catch (err) {
    next(err);
  }
}

module.exports = { register, login, me };
