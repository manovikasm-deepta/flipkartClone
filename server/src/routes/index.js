const router = require('express').Router();

router.use('/health',     require('./health'));
router.use('/auth',       require('./auth'));
router.use('/products',   require('./products'));
router.use('/categories', require('./categories'));

router.use('/cart',      require('./cart'));
router.use('/orders',    require('./orders'));
router.use('/addresses', require('./addresses'));
router.use('/wishlist',  require('./wishlist'));

module.exports = router;
