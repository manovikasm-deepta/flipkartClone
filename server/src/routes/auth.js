const router       = require('express').Router();
const { body }     = require('express-validator');
const validate     = require('../middleware/validate');
const { authenticate } = require('../middleware/auth');
const { authLimiter }  = require('../middleware/rateLimiter');
const {
  register, login, me, defaultUser,
} = require('../controllers/authController');

router.post(
  '/register',
  [
    body('name')
      .trim()
      .isLength({ min: 2, max: 100 })
      .withMessage('Name must be 2–100 characters'),
    body('email')
      .isEmail()
      .normalizeEmail()
      .withMessage('A valid email is required'),
    body('password')
      .isLength({ min: 8, max: 50 })
      .withMessage('Password must be 8–50 characters')
      .matches(/^(?=.*[A-Z])(?=.*\d)/)
      .withMessage('Password must contain at least one uppercase letter and one number'),
  ],
  validate,
  register
);

router.post(
  '/login',
  authLimiter,
  [
    body('email').isEmail().normalizeEmail().withMessage('A valid email is required'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  validate,
  login
);

router.get('/me',           authenticate, me);
router.get('/default-user', defaultUser);

module.exports = router;
