const Task = require('../models/Task');

const createTask = async (taskData) => {
  const task = await Task.create(taskData);
  return await Task.findById(task._id)
    .populate({
      path: 'lead',
      select: 'name email status',
      match: { isDeleted: false },
    })
    .populate('assignedTo', 'name email');
};

const getTasks = async ({ status, assignedTo, lead }) => {
  const query = {};
  if (status) query.status = status;
  if (assignedTo) query.assignedTo = assignedTo;
  if (lead) query.lead = lead;

  const tasks = await Task.find(query)
    .populate({
      path: 'lead',
      select: 'name email status isDeleted',
    })
    .populate('assignedTo', 'name email')
    .sort({ dueDate: 1, createdAt: -1 });

  // Filter out tasks whose lead is soft-deleted if lead exists
  return tasks.filter((t) => !t.lead || !t.lead.isDeleted);
};

const getTaskById = async (id) => {
  const task = await Task.findById(id)
    .populate('lead', 'name email status')
    .populate('assignedTo', 'name email');

  if (!task) {
    const error = new Error('Task not found');
    error.statusCode = 404;
    throw error;
  }

  return task;
};

const updateTaskStatus = async (taskId, currentUserId, newStatus) => {
  const task = await Task.findById(taskId);
  if (!task) {
    const error = new Error('Task not found');
    error.statusCode = 404;
    throw error;
  }

  // MANDATORY AUTHORIZATION CHECK
  // Compare authenticated user ID with task.assignedTo
  if (task.assignedTo.toString() !== currentUserId.toString()) {
    const error = new Error(
      'Forbidden: Only the user assigned to this task can update its status'
    );
    error.statusCode = 403;
    throw error;
  }

  task.status = newStatus;
  await task.save();

  return await Task.findById(task._id)
    .populate('lead', 'name email status')
    .populate('assignedTo', 'name email');
};

module.exports = {
  createTask,
  getTasks,
  getTaskById,
  updateTaskStatus,
};
