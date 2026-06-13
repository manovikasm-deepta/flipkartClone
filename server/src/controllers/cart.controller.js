const pool     = require('../config/db');
const ApiError = require('../utils/ApiError');

const CART_QUERY = `
  SELECT
    ci.public_id AS id,
    ci.quantity,
    ci.created_at,
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
  FROM cart_items ci
  JOIN products p ON p.id = ci.product_id
  WHERE ci.user_id = $1
  ORDER BY ci.created_at DESC
`;

async function getCart(req, res, next) {
  try {
    const { rows } = await pool.query(CART_QUERY, [req.user.id]);
    res.json({ success: true, data: rows });
  } catch (err) {
    next(err);
  }
}

async function addItem(req, res, next) {
  const { product_id, quantity = 1 } = req.body;
  try {
    const prod = await pool.query(
      'SELECT id, in_stock FROM products WHERE public_id = $1',
      [product_id]
    );
    if (!prod.rows.length) return next(new ApiError(404, 'Product not found'));
    if (!prod.rows[0].in_stock) return next(new ApiError(400, 'Product is out of stock'));

    await pool.query(
      `INSERT INTO cart_items (user_id, product_id, quantity)
       VALUES ($1, $2, $3)
       ON CONFLICT (user_id, product_id)
       DO UPDATE SET quantity = cart_items.quantity + $3,
                     updated_at = NOW()`,
      [req.user.id, prod.rows[0].id, quantity]
    );

    const { rows } = await pool.query(CART_QUERY, [req.user.id]);
    res.status(201).json({ success: true, data: rows });
  } catch (err) {
    next(err);
  }
}

async function updateItem(req, res, next) {
  const { id }       = req.params;
  const { quantity } = req.body;
  try {
    const { rowCount } = await pool.query(
      `UPDATE cart_items
       SET quantity = $1, updated_at = NOW()
       WHERE public_id = $2 AND user_id = $3`,
      [quantity, id, req.user.id]
    );
    if (!rowCount) return next(new ApiError(404, 'Cart item not found'));
    const { rows } = await pool.query(CART_QUERY, [req.user.id]);
    res.json({ success: true, data: rows });
  } catch (err) {
    next(err);
  }
}

async function removeItem(req, res, next) {
  const { id } = req.params;
  try {
    const { rowCount } = await pool.query(
      'DELETE FROM cart_items WHERE public_id = $1 AND user_id = $2',
      [id, req.user.id]
    );
    if (!rowCount) return next(new ApiError(404, 'Cart item not found'));
    const { rows } = await pool.query(CART_QUERY, [req.user.id]);
    res.json({ success: true, data: rows });
  } catch (err) {
    next(err);
  }
}

async function clearCart(req, res, next) {
  try {
    await pool.query('DELETE FROM cart_items WHERE user_id = $1', [req.user.id]);
    res.json({ success: true, data: [] });
  } catch (err) {
    next(err);
  }
}

module.exports = { getCart, addItem, updateItem, removeItem, clearCart };
