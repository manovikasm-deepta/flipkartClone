const bcrypt   = require('bcryptjs');
const jwt      = require('jsonwebtoken');
const { query } = require('../config/db');
const AppError = require('../utils/AppError');

const SALT_ROUNDS = 12;

function signToken(publicId) {
  return jwt.sign(
    { userId: publicId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
}

function serializeUser(row) {
  return {
    id:        row.public_id,
    name:      row.name,
    email:     row.email,
    phone:     row.phone     || null,
    avatarUrl: row.avatar_url || null,
    createdAt: row.created_at,
  };
}

async function register({ name, email, password }) {
  const existing = await query(
    'SELECT id FROM users WHERE email = $1',
    [email]
  );
  if (existing.rows.length) {
    throw new AppError('Email already registered', 409, 'EMAIL_ALREADY_EXISTS');
  }

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

  const { rows } = await query(
    `INSERT INTO users (name, email, password_hash)
     VALUES ($1, $2, $3)
     RETURNING public_id, name, email, phone, avatar_url, created_at`,
    [name.trim(), email, passwordHash]
  );

  const user  = rows[0];
  const token = signToken(user.public_id);

  return { user: serializeUser(user), token };
}

async function login({ email, password }) {
  const { rows } = await query(
    `SELECT public_id, name, email, phone, avatar_url, created_at, password_hash
     FROM users
     WHERE email = $1`,
    [email]
  );

  const CRED_ERROR = new AppError('Invalid email or password', 401, 'INVALID_CREDENTIALS');

  const user = rows[0];
  if (!user) throw CRED_ERROR;

  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) throw CRED_ERROR;

  const token = signToken(user.public_id);

  return { user: serializeUser(user), token };
}

async function getProfile(publicId) {
  const { rows } = await query(
    `SELECT public_id, name, email, phone, avatar_url, created_at
     FROM users
     WHERE public_id = $1`,
    [publicId]
  );
  if (!rows.length) throw new AppError('User not found', 404, 'NOT_FOUND');
  return serializeUser(rows[0]);
}

async function getDefaultUser() {
  const { rows } = await query(
    `SELECT public_id, name, email, phone, avatar_url, created_at
     FROM users
     WHERE is_default = TRUE
     LIMIT 1`,
    []
  );
  if (!rows.length) {
    throw new AppError('No default user configured', 404, 'NOT_FOUND');
  }

  const user  = rows[0];
  const token = signToken(user.public_id);

  return { user: serializeUser(user), token };
}

module.exports = { register, login, getProfile, getDefaultUser };
