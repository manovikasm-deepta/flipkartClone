const pool     = require('../config/db');
const ApiError = require('../utils/ApiError');

async function getAddresses(req, res, next) {
  try {
    const { rows } = await pool.query(
      `SELECT public_id AS id, name, phone, line1, line2,
              city, state, pincode, type, is_default, created_at
       FROM addresses WHERE user_id = $1 ORDER BY is_default DESC, created_at DESC`,
      [req.user.id]
    );
    res.json({ success: true, data: rows });
  } catch (err) {
    next(err);
  }
}

async function addAddress(req, res, next) {
  const { name, phone, line1, line2, city, state, pincode, type, is_default } = req.body;
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    if (is_default) {
      await client.query(
        'UPDATE addresses SET is_default = FALSE WHERE user_id = $1',
        [req.user.id]
      );
    }

    const { rows } = await client.query(
      `INSERT INTO addresses
         (user_id, name, phone, line1, line2, city, state, pincode, type, is_default)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
       RETURNING public_id AS id, name, phone, line1, line2,
                 city, state, pincode, type, is_default`,
      [req.user.id, name, phone, line1, line2 || null,
       city, state, pincode, type || 'HOME', !!is_default]
    );

    await client.query('COMMIT');
    res.status(201).json({ success: true, data: rows[0] });
  } catch (err) {
    await client.query('ROLLBACK');
    next(err);
  } finally {
    client.release();
  }
}

async function updateAddress(req, res, next) {
  const { id } = req.params;
  const { name, phone, line1, line2, city, state, pincode, type, is_default } = req.body;
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    if (is_default) {
      await client.query(
        'UPDATE addresses SET is_default = FALSE WHERE user_id = $1',
        [req.user.id]
      );
    }

    const { rows, rowCount } = await client.query(
      `UPDATE addresses
       SET name=$1, phone=$2, line1=$3, line2=$4,
           city=$5, state=$6, pincode=$7, type=$8,
           is_default=$9, updated_at=NOW()
       WHERE public_id=$10 AND user_id=$11
       RETURNING public_id AS id, name, phone, line1, line2,
                 city, state, pincode, type, is_default`,
      [name, phone, line1, line2 || null, city, state, pincode,
       type || 'HOME', !!is_default, id, req.user.id]
    );

    if (!rowCount) {
      await client.query('ROLLBACK');
      return next(new ApiError(404, 'Address not found'));
    }

    await client.query('COMMIT');
    res.json({ success: true, data: rows[0] });
  } catch (err) {
    await client.query('ROLLBACK');
    next(err);
  } finally {
    client.release();
  }
}

async function deleteAddress(req, res, next) {
  const { id } = req.params;
  try {
    const { rowCount } = await pool.query(
      'DELETE FROM addresses WHERE public_id = $1 AND user_id = $2',
      [id, req.user.id]
    );
    if (!rowCount) return next(new ApiError(404, 'Address not found'));
    res.json({ success: true, message: 'Address deleted' });
  } catch (err) {
    next(err);
  }
}

async function updateProfile(req, res, next) {
  const { name, phone } = req.body;
  try {
    const { rows, rowCount } = await pool.query(
      `UPDATE users SET name=$1, phone=$2, updated_at=NOW()
       WHERE id=$3
       RETURNING id, public_id, name, email, phone, avatar_url`,
      [name, phone || null, req.user.id]
    );
    if (!rowCount) return next(new ApiError(404, 'User not found'));
    res.json({ success: true, user: rows[0] });
  } catch (err) {
    next(err);
  }
}

module.exports = { getAddresses, addAddress, updateAddress, deleteAddress, updateProfile };
