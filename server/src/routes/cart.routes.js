const router       = require('express').Router();
const { body }     = require('express-validator');
const { authenticate } = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const {
  getCart, addItem, updateItem, removeItem, clearCart,
} = require('../controllers/cart.controller');

router.use(authenticate);

router.get('/',          getCart);
router.delete('/clear',  clearCart);

router.post(
  '/',
  [
    body('product_id').isUUID().withMessage('Valid product_id (UUID) required'),
    body('quantity').optional().isInt({ min: 1 }).withMessage('Quantity must be >= 1'),
  ],
  validate,
  addItem
);

router.patch(
  '/:id',
  [body('quantity').isInt({ min: 1 }).withMessage('Quantity must be >= 1')],
  validate,
  updateItem
);

router.delete('/:id', removeItem);

module.exports = router;
