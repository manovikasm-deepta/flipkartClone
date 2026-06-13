const pool     = require('../config/db');
const ApiError = require('../utils/ApiError');

async function list(_req, res, next) {
  try {
    const { rows } = await pool.query(
      'SELECT public_id AS id, name, slug, icon_url FROM categories ORDER BY name'
    );
    res.json({ success: true, data: rows });
  } catch (err) {
    next(err);
  }
}

async function getBySlug(req, res, next) {
  try {
    const { rows } = await pool.query(
      'SELECT public_id AS id, name, slug, icon_url FROM categories WHERE slug = $1',
      [req.params.slug]
    );
    if (!rows.length) return next(new ApiError(404, 'Category not found'));
    res.json({ success: true, data: rows[0] });
  } catch (err) {
    next(err);
  }
}

module.exports = { list, getBySlug };
