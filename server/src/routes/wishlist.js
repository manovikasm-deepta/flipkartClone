const router       = require('express').Router();
const { body }     = require('express-validator');
const { authenticate } = require('../middleware/auth');
const validate     = require('../middleware/validate');
const ctrl         = require('../controllers/wishlistController');

router.use(authenticate);

// GET /ids MUST come before DELETE /:productId to avoid param conflict
router.get('/ids', ctrl.getWishlistIds);

router.get('/', ctrl.getWishlist);

router.post(
  '/',
  [body('productId').notEmpty().withMessage('productId is required')],
  validate,
  ctrl.addToWishlist
);

router.delete('/:productId', ctrl.removeFromWishlist);

module.exports = router;
