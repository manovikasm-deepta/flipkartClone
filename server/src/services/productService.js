const { query } = require('../config/db');
const AppError  = require('../utils/AppError');

// ─── Sort options ─────────────────────────────────────────────────────────────
const SORT_MAP = {
  popularity:     'p.rating DESC, p.review_count DESC',
  rating_desc:    'p.rating DESC, p.review_count DESC',
  price_asc:      'p.selling_price ASC',
  price_desc:     'p.selling_price DESC',
  newest:         'p.id DESC',
  created_at_desc:'p.id DESC',
  discount:       'p.discount_pct DESC',
  discount_desc:  'p.discount_pct DESC',
};

// ─── Serialisers ─────────────────────────────────────────────────────────────
function serializeCard(row) {
  return {
    id:          row.public_id,
    name:        row.name,
    brand:       row.brand       || null,
    slug:        row.slug,
    sellingPrice: Number(row.selling_price),
    mrp:         Number(row.mrp),
    discountPct: Number(row.discount_pct),
    inStock:     row.in_stock,
    rating:      Number(row.rating),
    reviewCount: row.review_count,
    badge:       row.badge       || null,
    category: {
      id:   row.category_public_id,
      name: row.category_name,
      slug: row.category_slug,
    },
    thumbnail: row.thumbnail || null,
  };
}

function serializeDetail(row, images) {
  return {
    ...serializeCard(row),
    description:    row.description    || null,
    specifications: row.specifications || null,
    images: images.map((img) => ({
      id:           img.public_id,
      url:          img.url,
      altText:      img.alt_text      || null,
      displayOrder: img.display_order,
      width:        img.width         || null,
      height:       img.height        || null,
    })),
  };
}

// ─── Shared SELECT fragment ───────────────────────────────────────────────────
const CARD_SELECT = `
  p.public_id,
  p.name,
  p.brand,
  p.slug,
  p.selling_price,
  p.mrp,
  p.discount_pct,
  p.in_stock,
  p.rating,
  p.review_count,
  p.badge,
  c.public_id AS category_public_id,
  c.name      AS category_name,
  c.slug      AS category_slug,
  (
    SELECT pi.url
    FROM   product_images pi
    WHERE  pi.product_id   = p.id
    AND    pi.display_order = 0
    LIMIT  1
  ) AS thumbnail
`;

// ─── Service functions ────────────────────────────────────────────────────────
async function listProducts({
  search,
  category,
  sort     = 'popularity',
  page     = 1,
  limit    = 20,
  inStock  = true,
  minPrice,
  maxPrice,
  rating,
  brand,
} = {}) {
  const pageNum  = Math.max(1, parseInt(page)  || 1);
  const pageSize = Math.min(40, Math.max(1, parseInt(limit) || 20));
  const offset   = (pageNum - 1) * pageSize;
  const orderBy  = SORT_MAP[sort] || SORT_MAP.popularity;

  const conditions = [];
  const params     = [];
  let   idx        = 1;

  // ── in_stock filter (default: true) ──────────────────────────────────────
  const showOnlyInStock = inStock !== false && inStock !== 'false';
  if (showOnlyInStock) {
    conditions.push('p.in_stock = TRUE');
  }

  // ── full-text search ──────────────────────────────────────────────────────
  if (search && search.trim()) {
    conditions.push(
      `to_tsvector('english', p.name) @@ plainto_tsquery('english', $${idx})`
    );
    params.push(search.trim());
    idx++;
  }

  // ── category filter (slug → bigint) ──────────────────────────────────────
  if (category) {
    const catRes = await query(
      'SELECT id FROM categories WHERE slug = $1',
      [category]
    );
    if (!catRes.rows.length) {
      throw new AppError('Category not found', 404, 'NOT_FOUND');
    }
    conditions.push(`p.category_id = $${idx}`);
    params.push(catRes.rows[0].id);
    idx++;
  }

  // ── price range filter ────────────────────────────────────────────────────
  if (minPrice !== undefined && minPrice !== '') {
    const min = parseFloat(minPrice);
    if (!isNaN(min)) {
      conditions.push(`p.selling_price >= $${idx}`);
      params.push(min);
      idx++;
    }
  }
  if (maxPrice !== undefined && maxPrice !== '') {
    const max = parseFloat(maxPrice);
    if (!isNaN(max)) {
      conditions.push(`p.selling_price <= $${idx}`);
      params.push(max);
      idx++;
    }
  }

  // ── minimum rating filter ─────────────────────────────────────────────────
  if (rating !== undefined && rating !== '') {
    const minRating = parseFloat(rating);
    if (!isNaN(minRating)) {
      conditions.push(`p.rating >= $${idx}`);
      params.push(minRating);
      idx++;
    }
  }

  // ── brand filter ──────────────────────────────────────────────────────────
  if (brand && brand.trim()) {
    conditions.push(`LOWER(p.brand) = LOWER($${idx})`);
    params.push(brand.trim());
    idx++;
  }

  const WHERE = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

  // ── total count ───────────────────────────────────────────────────────────
  const countRes = await query(
    `SELECT COUNT(*)
     FROM   products p
     JOIN   categories c ON c.id = p.category_id
     ${WHERE}`,
    params
  );
  const total = parseInt(countRes.rows[0].count);

  // ── paginated rows ────────────────────────────────────────────────────────
  params.push(pageSize, offset);
  const listRes = await query(
    `SELECT ${CARD_SELECT}
     FROM   products p
     JOIN   categories c ON c.id = p.category_id
     ${WHERE}
     ORDER  BY ${orderBy}
     LIMIT  $${idx} OFFSET $${idx + 1}`,
    params
  );

  return {
    items: listRes.rows.map(serializeCard),
    pagination: {
      page:       pageNum,
      limit:      pageSize,
      total,
      totalPages: Math.ceil(total / pageSize),
    },
  };
}

async function getFeaturedSections() {
  const SECTIONS = [
    {
      title: 'Trending Gadgets & Appliances',
      color: '#2096ff',
      slugs: ['electronics', 'mobiles'],
    },
    {
      title: 'Top Deals in Fashion',
      color: '#fcd646',
      slugs: ['fashion'],
    },
    {
      title: 'Home & Furniture Picks',
      color: '#2096ff',
      slugs: ['home-furniture'],
    },
  ];

  const sections = await Promise.all(
    SECTIONS.map(async (section) => {
      const placeholders = section.slugs
        .map((_, i) => `$${i + 1}`)
        .join(', ');

      const res = await query(
        `SELECT ${CARD_SELECT}
         FROM   products p
         JOIN   categories c ON c.id = p.category_id
         WHERE  p.is_featured = TRUE
         AND    p.in_stock    = TRUE
         AND    c.slug        IN (${placeholders})
         ORDER  BY p.rating DESC, p.review_count DESC
         LIMIT  8`,
        section.slugs
      );

      return {
        title:    section.title,
        color:    section.color,
        products: res.rows.map(serializeCard),
      };
    })
  );

  return sections;
}

async function getProductById(publicId) {
  // ── product row ───────────────────────────────────────────────────────────
  const prodRes = await query(
    `SELECT ${CARD_SELECT},
            p.description,
            p.specifications
     FROM   products p
     JOIN   categories c ON c.id = p.category_id
     WHERE  p.public_id = $1`,
    [publicId]
  );

  if (!prodRes.rows.length) {
    throw new AppError('Product not found', 404, 'NOT_FOUND');
  }

  // ── images (separate query — avoids array_agg complexity) ────────────────
  const imgRes = await query(
    `SELECT pi.public_id, pi.url, pi.alt_text,
            pi.display_order, pi.width, pi.height
     FROM   product_images pi
     JOIN   products p ON p.id = pi.product_id
     WHERE  p.public_id = $1
     ORDER  BY pi.display_order ASC`,
    [publicId]
  );

  return serializeDetail(prodRes.rows[0], imgRes.rows);
}

module.exports = { listProducts, getFeaturedSections, getProductById };
