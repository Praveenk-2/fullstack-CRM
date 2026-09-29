const leadService = require('../services/leadService');
const { successResponse, errorResponse } = require('../utils/response');

const createLead = async (req, res, next) => {
  try {
    const lead = await leadService.createLead(req.body);
    return successResponse(res, 201, 'Lead created successfully', lead);
  } catch (error) {
    if (error.statusCode) {
      return errorResponse(res, error.statusCode, error.message);
    }
    next(error);
  }
};

const getLeads = async (req, res, next) => {
  try {
    const { page, limit, search, status } = req.query;
    const { leads, pagination } = await leadService.getLeads({
      page,
      limit,
      search,
      status,
    });
    return successResponse(
      res,
      200,
      'Leads retrieved successfully',
      leads,
      { pagination }
    );
  } catch (error) {
    next(error);
  }
};

const getLeadById = async (req, res, next) => {
  try {
    const lead = await leadService.getLeadById(req.params.id);
    return successResponse(res, 200, 'Lead retrieved successfully', lead);
  } catch (error) {
    if (error.statusCode) {
      return errorResponse(res, error.statusCode, error.message);
    }
    next(error);
  }
};

const updateLead = async (req, res, next) => {
  try {
    const lead = await leadService.updateLead(req.params.id, req.body);
    return successResponse(res, 200, 'Lead updated successfully', lead);
  } catch (error) {
    if (error.statusCode) {
      return errorResponse(res, error.statusCode, error.message);
    }
    next(error);
  }
};

const updateLeadStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const lead = await leadService.updateLeadStatus(req.params.id, status);
    return successResponse(res, 200, 'Lead status updated successfully', lead);
  } catch (error) {
    if (error.statusCode) {
      return errorResponse(res, error.statusCode, error.message);
    }
    next(error);
  }
};

const deleteLead = async (req, res, next) => {
  try {
    await leadService.softDeleteLead(req.params.id);
    return successResponse(res, 200, 'Lead soft-deleted successfully');
  } catch (error) {
    if (error.statusCode) {
      return errorResponse(res, error.statusCode, error.message);
    }
    next(error);
  }
};

module.exports = {
  createLead,
  getLeads,
  getLeadById,
  updateLead,
  updateLeadStatus,
  deleteLead,
};
