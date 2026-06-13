const pool     = require('../config/db');
const ApiError = require('../utils/ApiError');

const WISH_QUERY = `
  SELECT
    w.public_id AS id,
    w.created_at,
    p.public_id  AS product_id,
    p.name       AS product_name,
    p.slug       AS product_slug,
    p.brand,
    p.mrp,
    p.selling_price,
    p.discount_pct,
    p.in_stock,
    (SELECT url FROM product_images pi
     WHERE pi.product_id = p.id
     ORDER BY pi.display_order ASC LIMIT 1) AS product_image
  FROM wishlists w
  JOIN products p ON p.id = w.product_id
  WHERE w.user_id = $1
  ORDER BY w.created_at DESC
`;

async function getWishlist(req, res, next) {
  try {
    const { rows } = await pool.query(WISH_QUERY, [req.user.id]);
    res.json({ success: true, data: rows });
  } catch (err) {
    next(err);
  }
}

async function addItem(req, res, next) {
  const { product_id } = req.body;
  try {
    const prod = await pool.query(
      'SELECT id FROM products WHERE public_id = $1',
      [product_id]
    );
    if (!prod.rows.length) return next(new ApiError(404, 'Product not found'));

    await pool.query(
      `INSERT INTO wishlists (user_id, product_id)
       VALUES ($1, $2)
       ON CONFLICT (user_id, product_id) DO NOTHING`,
      [req.user.id, prod.rows[0].id]
    );

    const { rows } = await pool.query(WISH_QUERY, [req.user.id]);
    res.status(201).json({ success: true, data: rows });
  } catch (err) {
    next(err);
  }
}

async function removeItem(req, res, next) {
  const { id } = req.params;
  try {
    const { rowCount } = await pool.query(
      'DELETE FROM wishlists WHERE public_id = $1 AND user_id = $2',
      [id, req.user.id]
    );
    if (!rowCount) return next(new ApiError(404, 'Wishlist item not found'));
    const { rows } = await pool.query(WISH_QUERY, [req.user.id]);
    res.json({ success: true, data: rows });
  } catch (err) {
    next(err);
  }
}

module.exports = { getWishlist, addItem, removeItem };
