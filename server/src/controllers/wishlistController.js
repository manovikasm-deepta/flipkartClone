const wishlistService = require('../services/wishlistService');
const asyncHandler    = require('../utils/asyncHandler');
const { success }     = require('../utils/formatResponse');

const getWishlist = asyncHandler(async (req, res) => {
  const items = await wishlistService.getWishlist(req.user.publicId);
  success(res, items);
});

const addToWishlist = asyncHandler(async (req, res) => {
  const { productId } = req.body;
  const item = await wishlistService.addToWishlist(req.user.publicId, productId);
  success(res, item, 201);
});

const removeFromWishlist = asyncHandler(async (req, res) => {
  const result = await wishlistService.removeFromWishlist(req.user.publicId, req.params.productId);
  success(res, result);
});

const getWishlistIds = asyncHandler(async (req, res) => {
  const ids = await wishlistService.getWishlistIds(req.user.publicId);
  success(res, ids);
});

module.exports = { getWishlist, addToWishlist, removeFromWishlist, getWishlistIds };
