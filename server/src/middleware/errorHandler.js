const AppError = require('../utils/AppError');

const PG_UNIQUE_VIOLATION  = '23505';
const PG_FK_VIOLATION      = '23503';
const PG_NOT_NULL_VIOLATION = '23502';

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, _next) {
  if (err instanceof AppError && err.isOperational) {
    return res.status(err.statusCode).json({
      success: false,
      data:    null,
      message: err.message,
      error:   err.errorCode,
    });
  }

  if (err.code === PG_UNIQUE_VIOLATION) {
    return res.status(409).json({
      success: false,
      data:    null,
      message: 'A record with that value already exists',
      error:   'CONFLICT',
    });
  }

  if (err.code === PG_FK_VIOLATION) {
    return res.status(400).json({
      success: false,
      data:    null,
      message: 'Related resource not found',
      error:   'VALIDATION_ERROR',
    });
  }

  if (err.code === PG_NOT_NULL_VIOLATION) {
    return res.status(400).json({
      success: false,
      data:    null,
      message: `Missing required field: ${err.column}`,
      error:   'VALIDATION_ERROR',
    });
  }

  console.error('[server] Unhandled error:', err);

  return res.status(500).json({
    success: false,
    data:    null,
    message:
      process.env.NODE_ENV === 'production'
        ? 'Internal server error'
        : err.message,
    error: 'INTERNAL_ERROR',
  });
}

module.exports = errorHandler;
