const authService = require('../services/authService');
const { successResponse, errorResponse } = require('../utils/response');

const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const data = await authService.registerUser({ name, email, password });
    return successResponse(res, 201, 'User registered successfully', data);
  } catch (error) {
    if (error.statusCode) {
      return errorResponse(res, error.statusCode, error.message);
    }
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const data = await authService.loginUser({ email, password });
    return successResponse(res, 200, 'Login successful', data);
  } catch (error) {
    if (error.statusCode) {
      return errorResponse(res, error.statusCode, error.message);
    }
    next(error);
  }
};

const getMe = async (req, res, next) => {
  try {
    const data = await authService.getUserProfile(req.user._id);
    return successResponse(res, 200, 'User profile retrieved', data);
  } catch (error) {
    if (error.statusCode) {
      return errorResponse(res, error.statusCode, error.message);
    }
    next(error);
  }
};

module.exports = {
  register,
  login,
  getMe,
};
