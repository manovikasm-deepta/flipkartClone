const router       = require('express').Router();
const { body }     = require('express-validator');
const { authenticate } = require('../middleware/auth');
const validate     = require('../middleware/validate');
const ctrl         = require('../controllers/orderController');

router.use(authenticate);

router.get('/', ctrl.getOrders);

router.post(
  '/',
  [
    body('addressId').notEmpty().withMessage('addressId is required'),
    body('paymentMethod')
      .notEmpty()
      .isIn(['COD', 'UPI', 'CARD', 'NETBANKING'])
      .withMessage('paymentMethod must be COD, UPI, CARD or NETBANKING'),
  ],
  validate,
  ctrl.placeOrder
);

router.get('/:id', ctrl.getOrderById);

module.exports = router;
