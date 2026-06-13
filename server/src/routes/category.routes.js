const router              = require('express').Router();
const { list, getBySlug } = require('../controllers/category.controller');

router.get('/',       list);
router.get('/:slug',  getBySlug);

module.exports = router;
