// const errorMiddleware = (err, req, res, next) => {
//   // Set default status code and message
//   let statusCode = err.statusCode || 500;
//   let message = err.message || "Internal Server Error";

//   // Handle Mongoose Bad Object ID (e.g., searching for a hotel with a wrong ID format)
//   if (err.name === "CastError" && err.kind === "ObjectId") {
//     statusCode = 404;
//     message = "Resource not found. Invalid ID format.";
//   }

//   // Handle Mongoose Duplicate Key Error (e.g., registering with an email that already exists)
//   if (err.code === 11000) {
//     statusCode = 400;
//     message = `Duplicate ${Object.keys(err.keyValue)} entered.`;
//   }

//   // Handle JWT Errors (Authentication/Authorization issues)
//   if (err.name === "JsonWebTokenError") {
//     statusCode = 401;
//     message = "Json Web Token is invalid. Try again.";
//   }

//   if (err.name === "TokenExpiredError") {
//     statusCode = 401;
//     message = "Json Web Token is expired. Please login again.";
//   }

//   res.status(statusCode).json({
//     success: false,
//     message: message,
//     // stack only shows in development mode for security
//     stack: process.env.NODE_ENV === "development" ? err.stack : null,
//   });
// };

// module.exports = errorMiddleware;


const errorMiddleware = (
  err,
  req,
  res,
  next
) => {
  console.error(err);

  let statusCode =
    err.statusCode || 500;

  let message =
    err.message ||
    'Internal Server Error';

  // =========================================
  // Invalid MongoDB ObjectId
  // =========================================

  if (
    err.name === 'CastError' &&
    err.kind === 'ObjectId'
  ) {
    statusCode = 400;

    message =
      'Invalid resource ID format';
  }

  // =========================================
  // Duplicate Key Error
  // =========================================

  if (err.code === 11000) {
    statusCode = 400;

    const field = Object.keys(
      err.keyValue
    )[0];

    message = `${field} already exists`;
  }

  // =========================================
  // JWT Invalid
  // =========================================

  if (
    err.name ===
    'JsonWebTokenError'
  ) {
    statusCode = 401;

    message = 'Invalid token';
  }

  // =========================================
  // JWT Expired
  // =========================================

  if (
    err.name ===
    'TokenExpiredError'
  ) {
    statusCode = 401;

    message =
      'Session expired. Please login again.';
  }

  // =========================================
  // Mongoose Validation Error
  // =========================================

  if (
    err.name ===
    'ValidationError'
  ) {
    statusCode = 400;

    message = Object.values(
      err.errors
    )
      .map((val) => val.message)
      .join(', ');
  }

  res.status(statusCode).json({
    success: false,

    message,

    stack:
      process.env.NODE_ENV ===
      'development'
        ? err.stack
        : undefined,
  });
};

module.exports =
  errorMiddleware;