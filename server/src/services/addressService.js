const { query } = require('../config/db');
const AppError  = require('../utils/AppError');

// ─── Serialiser ───────────────────────────────────────────────────────────────
function serialize(row) {
  return {
    id:        row.public_id,
    name:      row.name,
    phone:     row.phone,
    line1:     row.line1,
    line2:     row.line2      || null,
    city:      row.city,
    state:     row.state,
    pincode:   row.pincode,
    type:      row.type,
    isDefault: row.is_default,
    createdAt: row.created_at,
  };
}

const COLS = `public_id, name, phone, line1, line2, city, state,
              pincode, type, is_default, created_at`;

async function resolveUser(publicId) {
  const { rows } = await query('SELECT id FROM users WHERE public_id = $1', [publicId]);
  if (!rows.length) throw new AppError('Unauthorized', 401, 'UNAUTHORIZED');
  return rows[0].id;
}

async function resolveAddress(addressPublicId, userId) {
  const { rows } = await query(
    'SELECT id, user_id, is_default FROM addresses WHERE public_id = $1',
    [addressPublicId]
  );
  if (!rows.length) throw new AppError('Address not found', 404, 'NOT_FOUND');
  if (rows[0].user_id !== userId) throw new AppError('Forbidden', 403, 'FORBIDDEN');
  return rows[0];
}

// ─── Service functions ────────────────────────────────────────────────────────
async function getAddresses(userPublicId) {
  const userId = await resolveUser(userPublicId);
  const { rows } = await query(
    `SELECT ${COLS}
     FROM   addresses
     WHERE  user_id = $1
     ORDER  BY is_default DESC, created_at DESC`,
    [userId]
  );
  return rows.map(serialize);
}

async function addAddress(userPublicId, data) {
  const userId = await resolveUser(userPublicId);

  const cntRes = await query(
    'SELECT COUNT(*) AS cnt FROM addresses WHERE user_id = $1',
    [userId]
  );
  const isDefault = parseInt(cntRes.rows[0].cnt) === 0 ? true : !!(data.isDefault);

  const { rows } = await query(
    `INSERT INTO addresses
       (user_id, name, phone, line1, line2, city, state, pincode, type, is_default)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
     RETURNING ${COLS}`,
    [
      userId, data.name, data.phone, data.line1, data.line2 || null,
      data.city, data.state, data.pincode, data.type || 'HOME', isDefault,
    ]
  );
  return serialize(rows[0]);
}

async function updateAddress(userPublicId, addressPublicId, data) {
  const userId = await resolveUser(userPublicId);
  await resolveAddress(addressPublicId, userId);

  const { rows } = await query(
    `UPDATE addresses
     SET    name    = COALESCE($1, name),
            phone   = COALESCE($2, phone),
            line1   = COALESCE($3, line1),
            line2   = $4,
            city    = COALESCE($5, city),
            state   = COALESCE($6, state),
            pincode = COALESCE($7, pincode),
            type    = COALESCE($8, type),
            updated_at = NOW()
     WHERE  public_id = $9 AND user_id = $10
     RETURNING ${COLS}`,
    [
      data.name    || null, data.phone   || null,
      data.line1   || null, data.line2   || null,
      data.city    || null, data.state   || null,
      data.pincode || null, data.type    || null,
      addressPublicId, userId,
    ]
  );
  return serialize(rows[0]);
}

async function deleteAddress(userPublicId, addressPublicId) {
  const userId  = await resolveUser(userPublicId);
  const addr    = await resolveAddress(addressPublicId, userId);

  await query('DELETE FROM addresses WHERE id = $1', [addr.id]);

  if (addr.is_default) {
    await query(
      `UPDATE addresses
       SET    is_default = TRUE, updated_at = NOW()
       WHERE  id = (
         SELECT id FROM addresses
         WHERE  user_id = $1
         ORDER  BY created_at DESC
         LIMIT  1
       )`,
      [userId]
    );
  }
  return { message: 'Address deleted' };
}

async function setDefaultAddress(userPublicId, addressPublicId) {
  const userId = await resolveUser(userPublicId);
  await resolveAddress(addressPublicId, userId);

  await query(
    'UPDATE addresses SET is_default = FALSE WHERE user_id = $1',
    [userId]
  );
  const { rows } = await query(
    `UPDATE addresses
     SET    is_default = TRUE, updated_at = NOW()
     WHERE  public_id = $1 AND user_id = $2
     RETURNING ${COLS}`,
    [addressPublicId, userId]
  );
  return serialize(rows[0]);
}

module.exports = { getAddresses, addAddress, updateAddress, deleteAddress, setDefaultAddress };
