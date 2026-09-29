const companyService = require('../services/companyService');
const { successResponse, errorResponse } = require('../utils/response');

const createCompany = async (req, res, next) => {
  try {
    const { name, industry, location } = req.body;
    const company = await companyService.createCompany({
      name,
      industry,
      location,
    });
    return successResponse(res, 201, 'Company created successfully', company);
  } catch (error) {
    if (error.statusCode) {
      return errorResponse(res, error.statusCode, error.message);
    }
    next(error);
  }
};

const getCompanies = async (req, res, next) => {
  try {
    const companies = await companyService.getCompanies();
    return successResponse(
      res,
      200,
      'Companies retrieved successfully',
      companies
    );
  } catch (error) {
    next(error);
  }
};

const getCompanyById = async (req, res, next) => {
  try {
    const data = await companyService.getCompanyById(req.params.id);
    return successResponse(
      res,
      200,
      'Company details retrieved successfully',
      data
    );
  } catch (error) {
    if (error.statusCode) {
      return errorResponse(res, error.statusCode, error.message);
    }
    next(error);
  }
};

module.exports = {
  createCompany,
  getCompanies,
  getCompanyById,
};
