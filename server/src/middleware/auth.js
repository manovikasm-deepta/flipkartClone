const jwt      = require('jsonwebtoken');
const AppError = require('../utils/AppError');

function authenticate(req, _res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return next(new AppError('Authentication required', 401, 'UNAUTHORIZED'));
  }

  const token = header.slice(7);
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { publicId: payload.userId };
    next();
  } catch {
    next(new AppError('Invalid or expired token', 401, 'UNAUTHORIZED'));
  }
}

module.exports = { authenticate };
