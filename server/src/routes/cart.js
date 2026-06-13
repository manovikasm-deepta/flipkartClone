const router      = require('express').Router();
const { body, param } = require('express-validator');
const { authenticate } = require('../middleware/auth');
const validate     = require('../middleware/validate');
const ctrl         = require('../controllers/cartController');

router.use(authenticate);

router.get('/', ctrl.getCart);

router.post(
  '/',
  [
    body('productId').notEmpty().withMessage('productId is required'),
    body('quantity').optional().isInt({ min: 1 }).withMessage('quantity must be ≥ 1'),
  ],
  validate,
  ctrl.addToCart
);

// DELETE /  (clear whole cart) MUST come before DELETE /:itemId
router.delete('/', ctrl.clearCart);

router.patch(
  '/:itemId',
  [
    param('itemId').notEmpty(),
    body('quantity').isInt({ min: 0 }).withMessage('quantity must be ≥ 0'),
  ],
  validate,
  ctrl.updateCartItem
);

router.delete('/:itemId', ctrl.removeCartItem);

module.exports = router;
