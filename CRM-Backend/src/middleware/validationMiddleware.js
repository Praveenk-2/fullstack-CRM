const { validationResult } = require('express-validator');
const { errorResponse } = require('../utils/response');

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map((err) => err.msg);
    return errorResponse(res, 400, errorMessages.join(', '), errors.array());
  }
  next();
};

module.exports = { validate };
