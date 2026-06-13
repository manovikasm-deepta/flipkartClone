const { query } = require('../config/db');
const AppError  = require('../utils/AppError');

function serializeCategory(row) {
  return {
    id:        row.public_id,
    name:      row.name,
    slug:      row.slug,
    iconUrl:   row.icon_url || null,
    createdAt: row.created_at,
  };
}

async function getAllCategories() {
  const { rows } = await query(
    `SELECT public_id, name, slug, icon_url, created_at
     FROM   categories
     ORDER  BY name ASC`,
    []
  );
  return rows.map(serializeCategory);
}

async function getCategoryBySlug(slug) {
  const { rows } = await query(
    `SELECT public_id, name, slug, icon_url, created_at
     FROM   categories
     WHERE  slug = $1`,
    [slug]
  );
  if (!rows.length) throw new AppError('Category not found', 404, 'NOT_FOUND');
  return serializeCategory(rows[0]);
}

module.exports = { getAllCategories, getCategoryBySlug };
