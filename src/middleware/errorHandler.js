// Central Error Handling Middleware
function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode || (res.statusCode !== 200 ? res.statusCode : 500);
  const isDevelopment = process.env.NODE_ENV === 'development';

  const response = {
    success: false,
  };

  // In production: hide internal error details, show generic messages
  if (!isDevelopment) {
    // Generic user-friendly messages
    if (statusCode >= 500) {
      response.message = 'حدث خطأ في الخادم. الرجاء المحاولة مرة أخرى.';
    } else if (statusCode === 404) {
      response.message = 'المورد المطلوب غير موجود';
    } else if (statusCode === 401) {
      response.message = 'يجب تسجيل الدخول للوصول إلى هذا المورد';
    } else if (statusCode === 403) {
      response.message = 'ليس لديك صلاحية للوصول إلى هذا المورد';
    } else {
      response.message = err.message || 'حدث خطأ في معالجة الطلب';
    }

    // Include validation errors (safe to expose)
    if (err.errors && statusCode < 500) {
      response.errors = err.errors;
    }

    // Log the real error server-side for debugging
    console.error('[Error]', {
      timestamp: new Date().toISOString(),
      method: req.method,
      path: req.path,
      statusCode,
      message: err.message,
      code: err.code,
      stack: err.stack?.split('\n').slice(0, 3).join('\n'), // First 3 lines only
    });
  } else {
    // Development: show everything for debugging
    response.message = err.message || 'حدث خطأ في الخادم (Internal Server Error)';
    
    // Include validation details
    if (err.errors) {
      response.errors = err.errors;
    }

    // Include stack trace in development
    response.stack = err.stack;

    // Include Prisma error details
    if (err.code) {
      response.errorCode = err.code;
    }
  }

  res.status(statusCode).json(response);
}

module.exports = errorHandler;
