const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

function inr(n) {
  return Number(n).toLocaleString('en-IN', {
    style: 'currency', currency: 'INR', maximumFractionDigits: 0,
  });
}

function buildOrderEmailHTML(order, userName) {
  const itemRows = order.items.map((item) => `
    <tr>
      <td style="padding:10px 12px;border-bottom:1px solid #f0f0f0;">
        ${item.productBrand ? `<div style="font-size:11px;color:#878787;text-transform:uppercase;letter-spacing:0.5px;">${item.productBrand}</div>` : ''}
        <div style="font-size:14px;color:#212121;font-weight:500;">${item.productName}</div>
        <div style="font-size:12px;color:#878787;margin-top:2px;">Qty: ${item.quantity}</div>
      </td>
      <td style="padding:10px 12px;border-bottom:1px solid #f0f0f0;text-align:right;font-size:14px;font-weight:600;color:#212121;white-space:nowrap;">
        ${inr(item.lineTotal)}
      </td>
    </tr>
  `).join('');

  const addr = order.delivery;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Order Confirmation</title>
</head>
<body style="margin:0;padding:0;background:#f1f3f6;font-family:'Segoe UI',Roboto,Arial,sans-serif;">

  <!-- Header -->
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#2874f0;padding:16px 0;">
    <tr>
      <td align="center">
        <span style="font-size:24px;font-weight:800;color:#fff;font-style:italic;letter-spacing:-0.5px;">
          Flipkart<span style="color:#ffe51f;">+</span>
        </span>
      </td>
    </tr>
  </table>

  <!-- Body -->
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;margin:24px auto;">
    <tr>
      <td style="background:#fff;border-radius:4px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.1);">

        <!-- Success banner -->
        <div style="background:#388e3c;padding:20px 24px;text-align:center;">
          <div style="font-size:28px;margin-bottom:6px;">✅</div>
          <h1 style="margin:0;color:#fff;font-size:20px;font-weight:700;">Order Placed Successfully!</h1>
          <p style="margin:6px 0 0;color:rgba(255,255,255,0.85);font-size:14px;">
            Hi ${userName}, your order has been confirmed.
          </p>
        </div>

        <!-- Order number -->
        <div style="padding:16px 24px;background:#f9fbe7;border-bottom:1px solid #f0f0f0;text-align:center;">
          <span style="font-size:13px;color:#878787;">Order Number</span>
          <div style="font-size:18px;font-weight:700;color:#212121;margin-top:4px;">${order.orderNumber}</div>
        </div>

        <!-- Items -->
        <div style="padding:0 24px;">
          <h2 style="font-size:14px;font-weight:700;color:#212121;margin:16px 0 8px;text-transform:uppercase;letter-spacing:0.5px;">Order Summary</h2>
          <table width="100%" cellpadding="0" cellspacing="0">
            ${itemRows}
          </table>
        </div>

        <!-- Price breakdown -->
        <div style="padding:0 24px 16px;">
          <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:12px;border-top:2px solid #f0f0f0;padding-top:12px;">
            <tr>
              <td style="padding:4px 0;font-size:13px;color:#878787;">Subtotal</td>
              <td style="padding:4px 0;font-size:13px;color:#878787;text-align:right;">${inr(order.subtotal)}</td>
            </tr>
            <tr>
              <td style="padding:4px 0;font-size:13px;color:#388e3c;">Discount</td>
              <td style="padding:4px 0;font-size:13px;color:#388e3c;text-align:right;">−${inr(order.discountTotal)}</td>
            </tr>
            <tr>
              <td style="padding:4px 0;font-size:13px;color:#388e3c;">Delivery</td>
              <td style="padding:4px 0;font-size:13px;color:#388e3c;text-align:right;">FREE</td>
            </tr>
            <tr>
              <td style="padding:10px 0 4px;font-size:16px;font-weight:700;color:#212121;border-top:1px dashed #e0e0e0;">Total Paid</td>
              <td style="padding:10px 0 4px;font-size:16px;font-weight:700;color:#212121;text-align:right;border-top:1px dashed #e0e0e0;">${inr(order.totalAmount)}</td>
            </tr>
          </table>
        </div>

        <!-- Delivery address -->
        <div style="margin:0 24px 16px;padding:14px 16px;background:#f5f5f5;border-radius:4px;">
          <div style="font-size:12px;font-weight:700;color:#878787;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:8px;">📦 Delivery Address</div>
          <div style="font-size:14px;color:#212121;font-weight:600;">${addr.name}</div>
          <div style="font-size:13px;color:#555;margin-top:4px;line-height:1.6;">
            ${addr.line1}${addr.line2 ? ', ' + addr.line2 : ''}<br/>
            ${addr.city}, ${addr.state} — ${addr.pincode}<br/>
            📞 ${addr.phone}
          </div>
        </div>

        <!-- Payment -->
        <div style="margin:0 24px 20px;display:flex;align-items:center;gap:8px;">
          <span style="font-size:13px;color:#878787;">Payment:</span>
          <span style="font-size:13px;color:#212121;font-weight:600;">${order.paymentMethod === 'COD' ? 'Cash on Delivery' : order.paymentMethod}</span>
        </div>

        <!-- Footer note -->
        <div style="padding:16px 24px;background:#e3f2fd;border-top:1px solid #bbdefb;text-align:center;">
          <p style="margin:0;font-size:13px;color:#1565c0;">
            Thank you for shopping with <strong>Flipkart Clone</strong>!<br/>
            Your order will be delivered within <strong>3–5 business days</strong>.
          </p>
        </div>

      </td>
    </tr>
  </table>

  <!-- Small footer -->
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;margin:0 auto 32px;">
    <tr>
      <td style="text-align:center;padding:12px;font-size:11px;color:#999;">
        This is an automated order confirmation. Please do not reply to this email.
      </td>
    </tr>
  </table>

</body>
</html>`;
}

async function sendOrderConfirmation(toEmail, order, userName) {
  if (!process.env.GMAIL_USER || !process.env.GMAIL_PASS) {
    console.warn('[email] GMAIL_USER or GMAIL_PASS not set — skipping email');
    return;
  }

  try {
    await transporter.sendMail({
      from: `"Flipkart Clone Orders" <${process.env.GMAIL_USER}>`,
      to: toEmail,
      subject: `✅ Order Confirmed: ${order.orderNumber} — ${Number(order.totalAmount).toLocaleString('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 })}`,
      html: buildOrderEmailHTML(order, userName),
    });
    console.log(`[email] Order confirmation sent to ${toEmail}`);
  } catch (err) {
    console.error('[email] Failed to send order confirmation:', err.message);
  }
}

module.exports = { sendOrderConfirmation };
