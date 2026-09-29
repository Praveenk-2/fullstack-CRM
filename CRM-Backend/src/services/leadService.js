const Lead = require('../models/Lead');

const createLead = async (leadData) => {
  const lead = await Lead.create(leadData);
  return await Lead.findById(lead._id)
    .populate('assignedTo', 'name email')
    .populate('company', 'name industry location');
};

const getLeads = async ({ page = 1, limit = 10, search = '', status = '' }) => {
  const pageNum = parseInt(page, 10) || 1;
  const limitNum = parseInt(limit, 10) || 10;
  const skip = (pageNum - 1) * limitNum;

  // Build query filter, ALWAYS enforcing isDeleted: false
  const query = { isDeleted: false };

  if (status && status !== 'All') {
    query.status = status;
  }

  if (search && search.trim() !== '') {
    const searchRegex = new RegExp(search.trim(), 'i');
    query.$or = [
      { name: searchRegex },
      { email: searchRegex },
      { phone: searchRegex },
    ];
  }

  const total = await Lead.countDocuments(query);
  const totalPages = Math.ceil(total / limitNum) || 1;

  const leads = await Lead.find(query)
    .populate('assignedTo', 'name email')
    .populate('company', 'name industry location')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limitNum);

  return {
    leads,
    pagination: {
      page: pageNum,
      limit: limitNum,
      total,
      totalPages,
    },
  };
};

const getLeadById = async (id) => {
  const lead = await Lead.findOne({ _id: id, isDeleted: false })
    .populate('assignedTo', 'name email')
    .populate('company', 'name industry location');

  if (!lead) {
    const error = new Error('Lead not found');
    error.statusCode = 404;
    throw error;
  }

  return lead;
};

const updateLead = async (id, updateData) => {
  const lead = await Lead.findOne({ _id: id, isDeleted: false });
  if (!lead) {
    const error = new Error('Lead not found');
    error.statusCode = 404;
    throw error;
  }

  Object.assign(lead, updateData);
  await lead.save();

  return await Lead.findById(lead._id)
    .populate('assignedTo', 'name email')
    .populate('company', 'name industry location');
};

const updateLeadStatus = async (id, status) => {
  const lead = await Lead.findOne({ _id: id, isDeleted: false });
  if (!lead) {
    const error = new Error('Lead not found');
    error.statusCode = 404;
    throw error;
  }

  lead.status = status;
  await lead.save();

  return await Lead.findById(lead._id)
    .populate('assignedTo', 'name email')
    .populate('company', 'name industry location');
};

const softDeleteLead = async (id) => {
  const lead = await Lead.findOne({ _id: id, isDeleted: false });
  if (!lead) {
    const error = new Error('Lead not found');
    error.statusCode = 404;
    throw error;
  }

  // Soft delete rule: DO NOT physical delete. Set isDeleted = true
  lead.isDeleted = true;
  await lead.save();

  return lead;
};

module.exports = {
  createLead,
  getLeads,
  getLeadById,
  updateLead,
  updateLeadStatus,
  softDeleteLead,
};
