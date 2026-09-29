const express = require('express');
const { body } = require('express-validator');
const {
  createLead,
  getLeads,
  getLeadById,
  updateLead,
  updateLeadStatus,
  deleteLead,
} = require('../controllers/leadController');
const { protect } = require('../middleware/authMiddleware');
const { validate } = require('../middleware/validationMiddleware');

const router = express.Router();

router.use(protect);

router
  .route('/')
  .get(getLeads)
  .post(
    [
      body('name').notEmpty().withMessage('Lead name is required'),
      body('status')
        .optional()
        .isIn(['New', 'Contacted', 'Lost'])
        .withMessage('Invalid status value'),
      validate,
    ],
    createLead
  );

router
  .route('/:id')
  .get(getLeadById)
  .put(
    [
      body('name').notEmpty().withMessage('Lead name is required'),
      body('status')
        .optional()
        .isIn(['New', 'Contacted', 'Lost'])
        .withMessage('Invalid status value'),
      validate,
    ],
    updateLead
  )
  .delete(deleteLead);

router.patch(
  '/:id/status',
  [
    body('status')
      .isIn(['New', 'Contacted', 'Lost'])
      .withMessage('Valid status is required (New, Contacted, Lost)'),
    validate,
  ],
  updateLeadStatus
);

module.exports = router;
