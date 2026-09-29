const { errorResponse } = require('../utils/response');

const notFound = (req, res, next) => {
  return errorResponse(res, 404, `Route Not Found - ${req.originalUrl}`);
};

const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  const message = err.message || 'Internal Server Error';

  console.error('Error Stack:', err.stack);

  return errorResponse(
    res,
    statusCode,
    message,
    process.env.NODE_ENV === 'development' ? err.stack : null
  );
};

module.exports = { notFound, errorHandler };
