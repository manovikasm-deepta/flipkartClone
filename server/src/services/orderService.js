const { pool, query } = require('../config/db');
const AppError        = require('../utils/AppError');

// ─── Helpers ─────────────────────────────────────────────────────────────────
function round2(n) { return Math.round(n * 100) / 100; }

function serializeItem(row) {
  return {
    id:           row.id           ?? row.public_id,
    productName:  row.product_name,
    productImage: row.product_image  || null,
    productBrand: row.product_brand  || null,
    mrp:          Number(row.mrp),
    sellingPrice: Number(row.selling_price),
    quantity:     row.quantity,
    lineTotal:    Number(row.line_total),
  };
}

function serializeOrder(row, items) {
  return {
    id:            row.public_id,
    orderNumber:   row.order_number,
    status:        row.status,
    paymentMethod: row.payment_method,
    paymentStatus: row.payment_status,
    subtotal:      Number(row.subtotal),
    discountTotal: Number(row.discount_total),
    deliveryFee:   Number(row.delivery_fee),
    totalAmount:   Number(row.total_amount),
    placedAt:      row.placed_at,
    updatedAt:     row.updated_at,
    delivery: {
      name:    row.delivery_name,
      phone:   row.delivery_phone,
      line1:   row.delivery_line1,
      line2:   row.delivery_line2   || null,
      city:    row.delivery_city,
      state:   row.delivery_state,
      pincode: row.delivery_pincode,
    },
    items: items || [],
  };
}

// ─── Shared aggregation query (reused for list + single) ─────────────────────
const ORDER_SELECT = `
  SELECT o.public_id, o.order_number, o.status,
         o.payment_method, o.payment_status,
         o.subtotal, o.discount_total, o.delivery_fee, o.total_amount,
         o.delivery_name,    o.delivery_phone,
         o.delivery_line1,   o.delivery_line2,
         o.delivery_city,    o.delivery_state,   o.delivery_pincode,
         o.placed_at,        o.updated_at,
         json_agg(
           json_build_object(
             'id',           oi.public_id,
             'productName',  oi.product_name,
             'productImage', oi.product_image,
             'productBrand', oi.product_brand,
             'mrp',          oi.mrp,
             'sellingPrice', oi.selling_price,
             'quantity',     oi.quantity,
             'lineTotal',    oi.line_total
           ) ORDER BY oi.id
         ) AS items
  FROM   orders o
  JOIN   order_items oi ON oi.order_id = o.id
`;

// ─── Resolve user UUID → bigint ───────────────────────────────────────────────
async function resolveUser(publicId, client) {
  const fn = client ? (t, p) => client.query(t, p) : query;
  const { rows } = await fn('SELECT id FROM users WHERE public_id = $1', [publicId]);
  if (!rows.length) throw new AppError('Unauthorized', 401, 'UNAUTHORIZED');
  return rows[0].id;
}

// ─── Service functions ────────────────────────────────────────────────────────
async function placeOrder(userPublicId, addressPublicId, paymentMethod) {
  const userId = await resolveUser(userPublicId);

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // ── Step 1: Resolve & verify address ─────────────────────────────────────
    const addrRes = await client.query(
      `SELECT id, user_id, name, phone, line1, line2, city, state, pincode
       FROM   addresses WHERE public_id = $1`,
      [addressPublicId]
    );
    if (!addrRes.rows.length) {
      throw new AppError('Address not found', 404, 'NOT_FOUND');
    }
    const addr = addrRes.rows[0];
    if (addr.user_id !== userId) {
      throw new AppError('Forbidden', 403, 'FORBIDDEN');
    }

    // ── Step 2: Fetch cart items ──────────────────────────────────────────────
    const cartRes = await client.query(
      `SELECT ci.quantity,
              p.id           AS product_id,
              p.name         AS product_name,
              p.brand        AS product_brand,
              p.mrp,
              p.selling_price,
              p.in_stock,
              pi.url         AS product_image
       FROM   cart_items ci
       JOIN   products p ON p.id = ci.product_id
       LEFT JOIN product_images pi
         ON   pi.product_id = p.id AND pi.display_order = 0
       WHERE  ci.user_id = $1`,
      [userId]
    );

    if (!cartRes.rows.length) {
      throw new AppError('Cart is empty', 400, 'CART_EMPTY');
    }

    const outOfStock = cartRes.rows.filter((r) => !r.in_stock);
    if (outOfStock.length) {
      const names = outOfStock.map((r) => r.product_name).join(', ');
      throw new AppError(`Out of stock: ${names}`, 400, 'OUT_OF_STOCK');
    }

    // ── Step 3: Calculate totals ──────────────────────────────────────────────
    let subtotal      = 0;
    let discountTotal = 0;
    for (const item of cartRes.rows) {
      subtotal      += Number(item.selling_price) * item.quantity;
      discountTotal += (Number(item.mrp) - Number(item.selling_price)) * item.quantity;
    }
    const deliveryFee = 0;
    const totalAmount = subtotal;           // free delivery

    // ── Step 4: Order number ──────────────────────────────────────────────────
    const cntRes = await client.query('SELECT COUNT(*) + 1 AS next_num FROM orders', []);
    const seq     = String(parseInt(cntRes.rows[0].next_num)).padStart(6, '0');
    const year    = new Date().getFullYear();
    const orderNumber = `FK-${year}-${seq}`;

    // ── Step 5: Insert order ──────────────────────────────────────────────────
    const orderRes = await client.query(
      `INSERT INTO orders
         (order_number, user_id, address_id,
          delivery_name, delivery_phone,
          delivery_line1, delivery_line2,
          delivery_city,  delivery_state, delivery_pincode,
          status, payment_method, payment_status,
          subtotal, discount_total, delivery_fee, total_amount)
       VALUES
         ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,
          'PLACED',$11,'PENDING',$12,$13,$14,$15)
       RETURNING *`,
      [
        orderNumber, userId, addr.id,
        addr.name, addr.phone,
        addr.line1, addr.line2 || null,
        addr.city, addr.state, addr.pincode,
        paymentMethod,
        round2(subtotal),
        round2(discountTotal),
        deliveryFee,
        round2(totalAmount),
      ]
    );
    const order = orderRes.rows[0];

    // ── Step 6: Insert order items ────────────────────────────────────────────
    const insertedItems = [];
    for (const item of cartRes.rows) {
      const iRes = await client.query(
        `INSERT INTO order_items
           (order_id, product_id, product_name, product_image,
            product_brand, mrp, selling_price, quantity)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
         RETURNING public_id AS id, product_name, product_image, product_brand,
                   mrp, selling_price, quantity, line_total`,
        [
          order.id, item.product_id,
          item.product_name,  item.product_image  || null,
          item.product_brand  || null,
          item.mrp, item.selling_price, item.quantity,
        ]
      );
      insertedItems.push(serializeItem(iRes.rows[0]));
    }

    // ── Step 7: Clear cart ────────────────────────────────────────────────────
    await client.query('DELETE FROM cart_items WHERE user_id = $1', [userId]);

    await client.query('COMMIT');
    return serializeOrder(order, insertedItems);
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

async function getOrders(userPublicId) {
  const userId = await resolveUser(userPublicId);

  const { rows } = await query(
    `${ORDER_SELECT}
     WHERE  o.user_id = $1
     GROUP  BY o.id
     ORDER  BY o.placed_at DESC`,
    [userId]
  );
  return rows.map((r) => serializeOrder(r, r.items));
}

async function getOrderById(userPublicId, orderPublicId) {
  const userId = await resolveUser(userPublicId);

  const { rows } = await query(
    `${ORDER_SELECT}
     WHERE  o.public_id = $1
     AND    o.user_id   = $2
     GROUP  BY o.id`,
    [orderPublicId, userId]
  );
  if (!rows.length) throw new AppError('Order not found', 404, 'NOT_FOUND');
  return serializeOrder(rows[0], rows[0].items);
}

module.exports = { placeOrder, getOrders, getOrderById };
