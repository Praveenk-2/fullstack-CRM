const express = require('express');
const { body } = require('express-validator');
const { register, login, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const { validate } = require('../middleware/validationMiddleware');

const router = express.Router();

router.get('/register', (req, res) => {
  res.json({
    success: true,
    message: 'Register endpoint is active. Use POST request with JSON body { name, email, password } to register.'
  });
});

router.post(
  '/register',
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters'),
    validate,
  ],
  register
);

router.get('/login', (req, res) => {
  res.json({
    success: true,
    message: 'Login endpoint is active. Use POST request with JSON body { email, password } to login.'
  });
});

router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required'),
    validate,
  ],
  login
);

router.get('/me', protect, getMe);

module.exports = router;

