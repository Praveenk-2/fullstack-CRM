const taskService = require('../services/taskService');
const { successResponse, errorResponse } = require('../utils/response');

const createTask = async (req, res, next) => {
  try {
    const task = await taskService.createTask(req.body);
    return successResponse(res, 201, 'Task created successfully', task);
  } catch (error) {
    if (error.statusCode) {
      return errorResponse(res, error.statusCode, error.message);
    }
    next(error);
  }
};

const getTasks = async (req, res, next) => {
  try {
    const { status, assignedTo, lead } = req.query;
    const tasks = await taskService.getTasks({ status, assignedTo, lead });
    return successResponse(res, 200, 'Tasks retrieved successfully', tasks);
  } catch (error) {
    next(error);
  }
};

const getTaskById = async (req, res, next) => {
  try {
    const task = await taskService.getTaskById(req.params.id);
    return successResponse(res, 200, 'Task retrieved successfully', task);
  } catch (error) {
    if (error.statusCode) {
      return errorResponse(res, error.statusCode, error.message);
    }
    next(error);
  }
};

const updateTaskStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const currentUserId = req.user._id;
    const updatedTask = await taskService.updateTaskStatus(
      req.params.id,
      currentUserId,
      status
    );
    return successResponse(
      res,
      200,
      'Task status updated successfully',
      updatedTask
    );
  } catch (error) {
    if (error.statusCode) {
      return errorResponse(res, error.statusCode, error.message);
    }
    next(error);
  }
};

module.exports = {
  createTask,
  getTasks,
  getTaskById,
  updateTaskStatus,
};
