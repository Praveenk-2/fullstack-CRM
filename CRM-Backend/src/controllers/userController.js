const userService = require('../services/userService');
const { successResponse } = require('../utils/response');

const getUsers = async (req, res, next) => {
  try {
    const users = await userService.getAllUsers();
    return successResponse(res, 200, 'Users retrieved successfully', users);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUsers,
};
