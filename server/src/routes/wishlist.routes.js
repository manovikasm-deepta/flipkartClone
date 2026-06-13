const router           = require('express').Router();
const { body }         = require('express-validator');
const { authenticate } = require('../middleware/auth');
const { validate }     = require('../middleware/validate');
const {
  getWishlist, addItem, removeItem,
} = require('../controllers/wishlist.controller');

router.use(authenticate);

router.get('/',    getWishlist);

router.post(
  '/',
  [body('product_id').isUUID().withMessage('Valid product_id (UUID) required')],
  validate,
  addItem
);

router.delete('/:id', removeItem);

module.exports = router;
