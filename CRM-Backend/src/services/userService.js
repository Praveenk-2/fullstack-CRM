const User = require('../models/User');

const getAllUsers = async () => {
  return await User.find({}).select('-password').sort({ name: 1 });
};

module.exports = {
  getAllUsers,
};
