const asyncHandler      = require('../utils/asyncHandler');
const { success }       = require('../utils/formatResponse');
const categoryService   = require('../services/categoryService');

const getCategories = asyncHandler(async (req, res) => {
  const categories = await categoryService.getAllCategories();
  success(res, { categories });
});

const getCategoryBySlug = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  const category = await categoryService.getCategoryBySlug(slug);
  success(res, { category });
});

module.exports = { getCategories, getCategoryBySlug };
