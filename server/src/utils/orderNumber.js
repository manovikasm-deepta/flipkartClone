const crypto = require('crypto');

function generateOrderNumber() {
  const ts     = Date.now().toString(36).toUpperCase();
  const random = crypto.randomBytes(3).toString('hex').toUpperCase();
  return `FK${ts}${random}`;
}

module.exports = { generateOrderNumber };
