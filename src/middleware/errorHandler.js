// Central Error Handling Middleware
function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode || (res.statusCode !== 200 ? res.statusCode : 500);

  const response = {
    success: false,
    message: err.message || 'حدث خطأ في الخادم (Internal Server Error)',
  };

  // Include validation details if available (e.g. Zod errors)
  if (err.errors) {
    response.errors = err.errors;
  }

  // Include stack trace only in development
  if (process.env.NODE_ENV === 'development') {
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
}

module.exports = errorHandler;
