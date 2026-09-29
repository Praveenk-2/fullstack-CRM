const Lead = require('../models/Lead');
const Task = require('../models/Task');

const getDashboardStats = async () => {
  // Total non-deleted leads
  const totalLeads = await Lead.countDocuments({ isDeleted: false });

  // Qualified leads: leads with status "Contacted" (excluding soft deleted)
  const qualifiedLeads = await Lead.countDocuments({
    isDeleted: false,
    status: 'Contacted',
  });

  // Tasks due today: tasks with dueDate between start and end of today
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);

  const tasksDueToday = await Task.countDocuments({
    dueDate: {
      $gte: startOfDay,
      $lte: endOfDay,
    },
  });

  // Completed tasks count
  const completedTasks = await Task.countDocuments({ status: 'Completed' });

  return {
    totalLeads,
    qualifiedLeads,
    tasksDueToday,
    completedTasks,
  };
};

module.exports = {
  getDashboardStats,
};
