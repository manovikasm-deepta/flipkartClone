function success(res, data, statusCode = 200, message = null) {
  return res.status(statusCode).json({ success: true, data, message });
}

function error(res, message, statusCode = 500, errorCode = 'INTERNAL_ERROR') {
  return res.status(statusCode).json({
    success: false,
    data:    null,
    message,
    error:   errorCode,
  });
}

function list(res, items, pagination) {
  return res.status(200).json({
    success: true,
    data:    { items, pagination },
    message: null,
  });
}

module.exports = { success, error, list };
