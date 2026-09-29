const express = require('express');
const { body } = require('express-validator');
const {
  createCompany,
  getCompanies,
  getCompanyById,
} = require('../controllers/companyController');
const { protect } = require('../middleware/authMiddleware');
const { validate } = require('../middleware/validationMiddleware');

const router = express.Router();

router.use(protect);

router
  .route('/')
  .get(getCompanies)
  .post(
    [body('name').notEmpty().withMessage('Company name is required'), validate],
    createCompany
  );

router.route('/:id').get(getCompanyById);

module.exports = router;
