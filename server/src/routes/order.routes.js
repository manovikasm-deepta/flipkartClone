const router           = require('express').Router();
const { body }         = require('express-validator');
const { authenticate } = require('../middleware/auth');
const { validate }     = require('../middleware/validate');
const {
  placeOrder, listOrders, getOrder, cancelOrder,
} = require('../controllers/order.controller');

router.use(authenticate);

router.get('/',       listOrders);
router.get('/:id',    getOrder);
router.delete('/:id', cancelOrder);

router.post(
  '/',
  [
    body('address_id').isUUID().withMessage('Valid address_id (UUID) required'),
    body('payment_method')
      .optional()
      .isIn(['COD', 'UPI', 'CARD', 'EMI'])
      .withMessage('payment_method must be COD, UPI, CARD or EMI'),
  ],
  validate,
  placeOrder
);

module.exports = router;
