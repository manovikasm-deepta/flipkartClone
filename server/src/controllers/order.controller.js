const pool                    = require('../config/db');
const ApiError                = require('../utils/ApiError');
const { generateOrderNumber } = require('../utils/orderNumber');

async function placeOrder(req, res, next) {
  const { address_id, payment_method = 'COD' } = req.body;
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const addrRes = await client.query(
      `SELECT * FROM addresses WHERE public_id = $1 AND user_id = $2`,
      [address_id, req.user.id]
    );
    if (!addrRes.rows.length) {
      await client.query('ROLLBACK');
      return next(new ApiError(404, 'Address not found'));
    }
    const addr = addrRes.rows[0];

    const cartRes = await client.query(
      `SELECT ci.quantity,
              p.id AS product_id, p.name, p.brand,
              p.mrp, p.selling_price, p.in_stock,
              (SELECT url FROM product_images pi
               WHERE pi.product_id = p.id
               ORDER BY pi.display_order ASC LIMIT 1) AS image
       FROM cart_items ci
       JOIN products p ON p.id = ci.product_id
       WHERE ci.user_id = $1`,
      [req.user.id]
    );
    if (!cartRes.rows.length) {
      await client.query('ROLLBACK');
      return next(new ApiError(400, 'Cart is empty'));
    }

    const outOfStock = cartRes.rows.filter((r) => !r.in_stock);
    if (outOfStock.length) {
      await client.query('ROLLBACK');
      return next(
        new ApiError(
          400,
          `Some items are out of stock: ${outOfStock.map((r) => r.name).join(', ')}`
        )
      );
    }

    let subtotal      = 0;
    let discountTotal = 0;

    for (const item of cartRes.rows) {
      subtotal      += Number(item.mrp)           * item.quantity;
      discountTotal += (Number(item.mrp) - Number(item.selling_price)) * item.quantity;
    }

    const deliveryFee  = subtotal - discountTotal >= 500 ? 0 : 40;
    const totalAmount  = subtotal - discountTotal + deliveryFee;
    const orderNumber  = generateOrderNumber();

    const orderRes = await client.query(
      `INSERT INTO orders
         (order_number, user_id, address_id,
          delivery_name, delivery_phone,
          delivery_line1, delivery_line2,
          delivery_city, delivery_state, delivery_pincode,
          status, payment_method, payment_status,
          subtotal, discount_total, delivery_fee, total_amount)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,'PLACED',$11,'PENDING',$12,$13,$14,$15)
       RETURNING *`,
      [
        orderNumber, req.user.id, addr.id,
        addr.name, addr.phone,
        addr.line1, addr.line2,
        addr.city, addr.state, addr.pincode,
        payment_method,
        subtotal.toFixed(2),
        discountTotal.toFixed(2),
        deliveryFee.toFixed(2),
        totalAmount.toFixed(2),
      ]
    );
    const order = orderRes.rows[0];

    for (const item of cartRes.rows) {
      await client.query(
        `INSERT INTO order_items
           (order_id, product_id, product_name, product_image,
            product_brand, mrp, selling_price, quantity)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
        [
          order.id, item.product_id, item.name,
          item.image, item.brand,
          item.mrp, item.selling_price, item.quantity,
        ]
      );
    }

    await client.query('DELETE FROM cart_items WHERE user_id = $1', [req.user.id]);
    await client.query('COMMIT');

    const { rows: [fullOrder] } = await pool.query(
      `SELECT o.*, json_agg(oi.*) AS items
       FROM orders o
       JOIN order_items oi ON oi.order_id = o.id
       WHERE o.id = $1
       GROUP BY o.id`,
      [order.id]
    );

    res.status(201).json({ success: true, data: fullOrder });
  } catch (err) {
    await client.query('ROLLBACK');
    next(err);
  } finally {
    client.release();
  }
}

async function listOrders(req, res, next) {
  try {
    const { rows } = await pool.query(
      `SELECT o.public_id AS id, o.order_number, o.status,
              o.payment_method, o.payment_status,
              o.subtotal, o.discount_total, o.delivery_fee, o.total_amount,
              o.placed_at,
              json_agg(
                json_build_object(
                  'product_name',  oi.product_name,
                  'product_image', oi.product_image,
                  'product_brand', oi.product_brand,
                  'quantity',      oi.quantity,
                  'selling_price', oi.selling_price,
                  'line_total',    oi.line_total
                ) ORDER BY oi.id
              ) AS items
       FROM orders o
       JOIN order_items oi ON oi.order_id = o.id
       WHERE o.user_id = $1
       GROUP BY o.id
       ORDER BY o.placed_at DESC`,
      [req.user.id]
    );
    res.json({ success: true, data: rows });
  } catch (err) {
    next(err);
  }
}

async function getOrder(req, res, next) {
  const { id } = req.params;
  try {
    const { rows } = await pool.query(
      `SELECT o.public_id AS id, o.order_number, o.status,
              o.payment_method, o.payment_status,
              o.delivery_name, o.delivery_phone,
              o.delivery_line1, o.delivery_line2,
              o.delivery_city, o.delivery_state, o.delivery_pincode,
              o.subtotal, o.discount_total, o.delivery_fee, o.total_amount,
              o.placed_at, o.updated_at,
              json_agg(
                json_build_object(
                  'product_name',  oi.product_name,
                  'product_image', oi.product_image,
                  'product_brand', oi.product_brand,
                  'mrp',           oi.mrp,
                  'selling_price', oi.selling_price,
                  'quantity',      oi.quantity,
                  'line_total',    oi.line_total
                ) ORDER BY oi.id
              ) AS items
       FROM orders o
       JOIN order_items oi ON oi.order_id = o.id
       WHERE o.public_id = $1 AND o.user_id = $2
       GROUP BY o.id`,
      [id, req.user.id]
    );
    if (!rows.length) return next(new ApiError(404, 'Order not found'));
    res.json({ success: true, data: rows[0] });
  } catch (err) {
    next(err);
  }
}

async function cancelOrder(req, res, next) {
  const { id } = req.params;
  try {
    const { rows } = await pool.query(
      `SELECT id, status FROM orders
       WHERE public_id = $1 AND user_id = $2`,
      [id, req.user.id]
    );
    if (!rows.length) return next(new ApiError(404, 'Order not found'));
    if (!['PLACED', 'CONFIRMED'].includes(rows[0].status)) {
      return next(new ApiError(400, `Cannot cancel an order with status ${rows[0].status}`));
    }

    const { rows: [updated] } = await pool.query(
      `UPDATE orders
       SET status = 'CANCELLED', updated_at = NOW()
       WHERE id = $1
       RETURNING public_id AS id, order_number, status`,
      [rows[0].id]
    );
    res.json({ success: true, data: updated });
  } catch (err) {
    next(err);
  }
}

module.exports = { placeOrder, listOrders, getOrder, cancelOrder };
