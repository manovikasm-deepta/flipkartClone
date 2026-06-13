const { query } = require('../config/db');
const AppError  = require('../utils/AppError');

// ─── Serialiser ───────────────────────────────────────────────────────────────
function serializeItem(row) {
  return {
    id:        row.wishlist_id,
    createdAt: row.wishlist_created_at,
    product: {
      id:           row.product_public_id,
      name:         row.name,
      brand:        row.brand          || null,
      slug:         row.slug,
      sellingPrice: Number(row.selling_price),
      mrp:          Number(row.mrp),
      discountPct:  Number(row.discount_pct),
      inStock:      row.in_stock,
      rating:       Number(row.rating),
      reviewCount:  row.review_count,
      badge:        row.badge          || null,
      category: {
        id:   row.category_public_id,
        name: row.category_name,
        slug: row.category_slug,
      },
      thumbnail: row.thumbnail         || null,
    },
  };
}

// ─── Shared SELECT fragment ───────────────────────────────────────────────────
const WISH_SELECT = `
  SELECT w.public_id   AS wishlist_id,
         w.created_at  AS wishlist_created_at,
         p.public_id   AS product_public_id,
         p.name, p.brand, p.slug,
         p.selling_price, p.mrp, p.discount_pct,
         p.in_stock, p.rating, p.review_count, p.badge,
         c.public_id   AS category_public_id,
         c.name        AS category_name,
         c.slug        AS category_slug,
         pi.url        AS thumbnail
  FROM   wishlists w
  JOIN   products  p  ON p.id  = w.product_id
  JOIN   categories c ON c.id  = p.category_id
  LEFT JOIN product_images pi
    ON   pi.product_id = p.id AND pi.display_order = 0
`;

async function resolveUser(publicId) {
  const { rows } = await query('SELECT id FROM users WHERE public_id = $1', [publicId]);
  if (!rows.length) throw new AppError('Unauthorized', 401, 'UNAUTHORIZED');
  return rows[0].id;
}

// ─── Service functions ────────────────────────────────────────────────────────
async function getWishlist(userPublicId) {
  const userId = await resolveUser(userPublicId);
  const { rows } = await query(
    `${WISH_SELECT}
     WHERE  w.user_id = $1
     ORDER  BY w.created_at DESC`,
    [userId]
  );
  return rows.map(serializeItem);
}

async function addToWishlist(userPublicId, productPublicId) {
  const userId = await resolveUser(userPublicId);

  const prodRes = await query(
    'SELECT id FROM products WHERE public_id = $1',
    [productPublicId]
  );
  if (!prodRes.rows.length) throw new AppError('Product not found', 404, 'NOT_FOUND');
  const productId = prodRes.rows[0].id;

  const dupRes = await query(
    'SELECT id FROM wishlists WHERE user_id = $1 AND product_id = $2',
    [userId, productId]
  );
  if (dupRes.rows.length) throw new AppError('Product already in wishlist', 409, 'CONFLICT');

  await query(
    'INSERT INTO wishlists (user_id, product_id) VALUES ($1, $2)',
    [userId, productId]
  );

  const { rows } = await query(
    `${WISH_SELECT}
     WHERE  w.user_id    = $1
     AND    w.product_id = $2`,
    [userId, productId]
  );
  return serializeItem(rows[0]);
}

async function removeFromWishlist(userPublicId, productPublicId) {
  const userId = await resolveUser(userPublicId);

  const prodRes = await query(
    'SELECT id FROM products WHERE public_id = $1',
    [productPublicId]
  );
  if (!prodRes.rows.length) throw new AppError('Product not found', 404, 'NOT_FOUND');
  const productId = prodRes.rows[0].id;

  const { rowCount } = await query(
    'DELETE FROM wishlists WHERE user_id = $1 AND product_id = $2',
    [userId, productId]
  );
  if (!rowCount) throw new AppError('Item not in wishlist', 404, 'NOT_FOUND');

  return { message: 'Removed from wishlist' };
}

async function getWishlistIds(userPublicId) {
  const userId = await resolveUser(userPublicId);
  const { rows } = await query(
    `SELECT p.public_id
     FROM   wishlists w
     JOIN   products  p ON p.id = w.product_id
     WHERE  w.user_id = $1`,
    [userId]
  );
  return rows.map((r) => r.public_id);
}

module.exports = { getWishlist, addToWishlist, removeFromWishlist, getWishlistIds };
