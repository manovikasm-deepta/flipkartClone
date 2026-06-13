const pool     = require('../config/db');
const ApiError = require('../utils/ApiError');

const PRODUCT_COLS = `
  p.public_id AS id, p.name, p.slug, p.description, p.specifications,
  p.brand, p.mrp, p.selling_price, p.discount_pct,
  p.in_stock, p.rating, p.review_count, p.is_featured,
  p.badge, p.created_at,
  c.name AS category_name, c.slug AS category_slug,
  COALESCE(
    json_agg(
      json_build_object(
        'url', pi.url,
        'alt_text', pi.alt_text,
        'display_order', pi.display_order
      ) ORDER BY pi.display_order ASC
    ) FILTER (WHERE pi.id IS NOT NULL),
    '[]'
  ) AS images
`;

async function list(req, res, next) {
  const {
    category, search, in_stock, is_featured,
    min_price, max_price, sort = 'created_at_desc',
    page = 1, limit = 20,
  } = req.query;

  const conditions = [];
  const params     = [];
  let   idx        = 1;

  if (category) {
    conditions.push(`c.slug = $${idx++}`);
    params.push(category);
  }
  if (search) {
    conditions.push(
      `(to_tsvector('english', p.name) @@ plainto_tsquery('english', $${idx}) OR p.name ILIKE $${idx + 1})`
    );
    params.push(search, `%${search}%`);
    idx += 2;
  }
  if (in_stock !== undefined) {
    conditions.push(`p.in_stock = $${idx++}`);
    params.push(in_stock === 'true');
  }
  if (is_featured !== undefined) {
    conditions.push(`p.is_featured = $${idx++}`);
    params.push(is_featured === 'true');
  }
  if (min_price) {
    conditions.push(`p.selling_price >= $${idx++}`);
    params.push(Number(min_price));
  }
  if (max_price) {
    conditions.push(`p.selling_price <= $${idx++}`);
    params.push(Number(max_price));
  }

  const WHERE = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

  const ORDER_MAP = {
    price_asc:       'p.selling_price ASC',
    price_desc:      'p.selling_price DESC',
    rating_desc:     'p.rating DESC',
    created_at_desc: 'p.created_at DESC',
    discount_desc:   'p.discount_pct DESC',
  };
  const ORDER = ORDER_MAP[sort] || 'p.created_at DESC';

  const pageNum  = Math.max(1, parseInt(page));
  const pageSize = Math.min(100, Math.max(1, parseInt(limit)));
  const offset   = (pageNum - 1) * pageSize;

  try {
    const countRes = await pool.query(
      `SELECT COUNT(DISTINCT p.id)
       FROM products p
       JOIN categories c ON c.id = p.category_id
       ${WHERE}`,
      params
    );
    const total = parseInt(countRes.rows[0].count);

    params.push(pageSize, offset);
    const { rows } = await pool.query(
      `SELECT ${PRODUCT_COLS}
       FROM products p
       JOIN categories c ON c.id = p.category_id
       LEFT JOIN product_images pi ON pi.product_id = p.id
       ${WHERE}
       GROUP BY p.id, c.id
       ORDER BY ${ORDER}
       LIMIT $${idx++} OFFSET $${idx++}`,
      params
    );

    res.json({
      success: true,
      data:    rows,
      meta: {
        total,
        page:       pageNum,
        limit:      pageSize,
        totalPages: Math.ceil(total / pageSize),
      },
    });
  } catch (err) {
    next(err);
  }
}

async function getBySlug(req, res, next) {
  const { slug } = req.params;
  try {
    const { rows } = await pool.query(
      `SELECT ${PRODUCT_COLS}
       FROM products p
       JOIN categories c ON c.id = p.category_id
       LEFT JOIN product_images pi ON pi.product_id = p.id
       WHERE p.slug = $1
       GROUP BY p.id, c.id`,
      [slug]
    );
    if (!rows.length) return next(new ApiError(404, 'Product not found'));
    res.json({ success: true, data: rows[0] });
  } catch (err) {
    next(err);
  }
}

async function getFeatured(req, res, next) {
  try {
    const { rows } = await pool.query(
      `SELECT ${PRODUCT_COLS}
       FROM products p
       JOIN categories c ON c.id = p.category_id
       LEFT JOIN product_images pi ON pi.product_id = p.id
       WHERE p.is_featured = TRUE AND p.in_stock = TRUE
       GROUP BY p.id, c.id
       ORDER BY p.rating DESC
       LIMIT 12`
    );
    res.json({ success: true, data: rows });
  } catch (err) {
    next(err);
  }
}

module.exports = { list, getBySlug, getFeatured };
