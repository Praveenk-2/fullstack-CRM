const Company = require('../models/Company');
const Lead = require('../models/Lead');

const createCompany = async ({ name, industry, location }) => {
  const company = await Company.create({
    name,
    industry,
    location,
  });
  return company;
};

const getCompanies = async () => {
  return await Company.find({}).sort({ createdAt: -1 });
};

const getCompanyById = async (companyId) => {
  const company = await Company.findById(companyId);
  if (!company) {
    const error = new Error('Company not found');
    error.statusCode = 404;
    throw error;
  }

  // Fetch associated leads (excluding soft-deleted leads!)
  const leads = await Lead.find({
    company: companyId,
    isDeleted: false,
  })
    .populate('assignedTo', 'name email')
    .sort({ createdAt: -1 });

  return {
    company,
    leads,
  };
};

module.exports = {
  createCompany,
  getCompanies,
  getCompanyById,
};
