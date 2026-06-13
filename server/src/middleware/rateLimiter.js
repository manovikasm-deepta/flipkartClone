const rateLimit = require('express-rate-limit');

function jsonReply(message) {
  return (_req, res) =>
    res.status(429).json({
      success: false,
      data:    null,
      message,
      error:   'RATE_LIMIT_EXCEEDED',
    });
}

const authLimiter = rateLimit({
  windowMs:        15 * 60 * 1000,
  max:             5,
  standardHeaders: true,
  legacyHeaders:   false,
  handler:         jsonReply('Too many login attempts. Please try again after 15 minutes.'),
});

const apiLimiter = rateLimit({
  windowMs:        15 * 60 * 1000,
  max:             200,
  standardHeaders: true,
  legacyHeaders:   false,
  handler:         jsonReply('Too many requests. Please try again later.'),
});

module.exports = { authLimiter, apiLimiter };
