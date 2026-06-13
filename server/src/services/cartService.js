const { query }  = require('../config/db');
const AppError   = require('../utils/AppError');

// ─── Serialisers ─────────────────────────────────────────────────────────────
function serializeItem(row) {
  return {
    id:       row.id,
    quantity: row.quantity,
    product: {
      id:           row.product_id,
      name:         row.name,
      brand:        row.brand        || null,
      sellingPrice: Number(row.selling_price),
      mrp:          Number(row.mrp),
      discountPct:  Number(row.discount_pct),
      inStock:      row.in_stock,
      thumbnail:    row.thumbnail    || null,
    },
  };
}

function round2(n) { return Math.round(n * 100) / 100; }

function buildSummary(items) {
  let itemCount     = 0;
  let totalMrp      = 0;
  let totalDiscount = 0;
  let totalAmount   = 0;

  for (const item of items) {
    const { mrp, sellingPrice } = item.product;
    itemCount     += item.quantity;
    totalMrp      += mrp * item.quantity;
    totalDiscount += (mrp - sellingPrice) * item.quantity;
    totalAmount   += sellingPrice * item.quantity;
  }

  return {
    itemCount,
    totalMrp:      round2(totalMrp),
    totalDiscount: round2(totalDiscount),
    deliveryFee:   0,
    totalAmount:   round2(totalAmount),
  };
}

// ─── Shared cart query ────────────────────────────────────────────────────────
async function fetchCart(userId) {
  const { rows } = await query(
    `SELECT ci.public_id AS id,
            ci.quantity,
            p.public_id  AS product_id,
            p.name,
            p.brand,
            p.selling_price,
            p.mrp,
            p.discount_pct,
            p.in_stock,
            pi.url       AS thumbnail
     FROM   cart_items ci
     JOIN   products p ON p.id = ci.product_id
     LEFT JOIN product_images pi
       ON   pi.product_id = p.id AND pi.display_order = 0
     WHERE  ci.user_id = $1
     ORDER  BY ci.created_at DESC`,
    [userId]
  );
  const items   = rows.map(serializeItem);
  const summary = buildSummary(items);
  return { items, summary };
}

// ─── Resolve user UUID → bigint (throws UNAUTHORIZED if missing) ─────────────
async function resolveUser(publicId) {
  const { rows } = await query(
    'SELECT id FROM users WHERE public_id = $1',
    [publicId]
  );
  if (!rows.length) throw new AppError('Unauthorized', 401, 'UNAUTHORIZED');
  return rows[0].id;
}

// ─── Service functions ────────────────────────────────────────────────────────
async function getCart(userPublicId) {
  const userId = await resolveUser(userPublicId);
  return fetchCart(userId);
}

async function addToCart(userPublicId, productPublicId, quantity = 1) {
  const userId = await resolveUser(userPublicId);

  const prodRes = await query(
    'SELECT id, in_stock FROM products WHERE public_id = $1',
    [productPublicId]
  );
  if (!prodRes.rows.length) {
    throw new AppError('Product not found', 404, 'NOT_FOUND');
  }
  if (!prodRes.rows[0].in_stock) {
    throw new AppError('Product is out of stock', 400, 'OUT_OF_STOCK');
  }
  const productId = prodRes.rows[0].id;

  await query(
    `INSERT INTO cart_items (user_id, product_id, quantity)
     VALUES ($1, $2, $3)
     ON CONFLICT (user_id, product_id)
     DO UPDATE SET
       quantity   = cart_items.quantity + EXCLUDED.quantity,
       updated_at = NOW()`,
    [userId, productId, quantity]
  );

  return fetchCart(userId);
}

async function updateCartItem(userPublicId, itemPublicId, quantity) {
  const userId = await resolveUser(userPublicId);

  if (quantity === 0) {
    return removeCartItem(userPublicId, itemPublicId);
  }

  const itemRes = await query(
    'SELECT id, user_id FROM cart_items WHERE public_id = $1',
    [itemPublicId]
  );
  if (!itemRes.rows.length) {
    throw new AppError('Cart item not found', 404, 'NOT_FOUND');
  }
  if (itemRes.rows[0].user_id !== userId) {
    throw new AppError('Forbidden', 403, 'FORBIDDEN');
  }

  await query(
    'UPDATE cart_items SET quantity = $1, updated_at = NOW() WHERE id = $2',
    [quantity, itemRes.rows[0].id]
  );

  return fetchCart(userId);
}

async function removeCartItem(userPublicId, itemPublicId) {
  const userId = await resolveUser(userPublicId);

  const itemRes = await query(
    'SELECT id, user_id FROM cart_items WHERE public_id = $1',
    [itemPublicId]
  );
  if (!itemRes.rows.length) {
    throw new AppError('Cart item not found', 404, 'NOT_FOUND');
  }
  if (itemRes.rows[0].user_id !== userId) {
    throw new AppError('Forbidden', 403, 'FORBIDDEN');
  }

  await query('DELETE FROM cart_items WHERE id = $1', [itemRes.rows[0].id]);

  return fetchCart(userId);
}

async function clearCart(userPublicId) {
  const userId = await resolveUser(userPublicId);
  await query('DELETE FROM cart_items WHERE user_id = $1', [userId]);
  return { items: [], summary: buildSummary([]) };
}

module.exports = { getCart, addToCart, updateCartItem, removeCartItem, clearCart };
