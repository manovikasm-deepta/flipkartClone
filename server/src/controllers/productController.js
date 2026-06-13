const asyncHandler     = require('../utils/asyncHandler');
const { success, list } = require('../utils/formatResponse');
const productService   = require('../services/productService');

const getProducts = asyncHandler(async (req, res) => {
  const { search, category, sort, page, limit, inStock, minPrice, maxPrice, rating } = req.query;

  const result = await productService.listProducts({
    search,
    category,
    sort,
    page,
    limit,
    inStock,
    minPrice,
    maxPrice,
    rating,
  });

  list(res, result.items, result.pagination);
});

const getFeaturedProducts = asyncHandler(async (req, res) => {
  const sections = await productService.getFeaturedSections();
  success(res, { sections });
});

const getProductById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const product = await productService.getProductById(id);
  success(res, product);
});

module.exports = { getProducts, getFeaturedProducts, getProductById };
