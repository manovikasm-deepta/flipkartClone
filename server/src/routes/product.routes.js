const router                          = require('express').Router();
const { list, getBySlug, getFeatured } = require('../controllers/product.controller');

router.get('/featured', getFeatured);
router.get('/',         list);
router.get('/:slug',    getBySlug);

module.exports = router;
