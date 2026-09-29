const express = require('express');
const { body } = require('express-validator');
const {
  createTask,
  getTasks,
  getTaskById,
  updateTaskStatus,
} = require('../controllers/taskController');
const { protect } = require('../middleware/authMiddleware');
const { validate } = require('../middleware/validationMiddleware');

const router = express.Router();

router.use(protect);

router
  .route('/')
  .get(getTasks)
  .post(
    [
      body('title').notEmpty().withMessage('Task title is required'),
      body('lead').notEmpty().withMessage('Lead ID is required'),
      body('assignedTo').notEmpty().withMessage('Assigned user ID is required'),
      validate,
    ],
    createTask
  );

router.route('/:id').get(getTaskById);

router.patch(
  '/:id/status',
  [
    body('status')
      .isIn(['Pending', 'Completed'])
      .withMessage('Status must be Pending or Completed'),
    validate,
  ],
  updateTaskStatus
);

module.exports = router;
