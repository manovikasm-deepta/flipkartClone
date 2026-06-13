const router = require('express').Router();
const {
  getProducts,
  getFeaturedProducts,
  getProductById,
} = require('../controllers/productController');

// /featured must be registered before /:id so Express doesn't treat
// the literal string "featured" as a UUID param value
router.get('/featured', getFeaturedProducts);
router.get('/',         getProducts);
router.get('/:id',      getProductById);

module.exports = router;
