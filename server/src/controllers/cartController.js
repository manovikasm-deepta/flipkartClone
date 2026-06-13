const cartService  = require('../services/cartService');
const asyncHandler = require('../utils/asyncHandler');
const { success }  = require('../utils/formatResponse');

const getCart = asyncHandler(async (req, res) => {
  const data = await cartService.getCart(req.user.publicId);
  success(res, data);
});

const addToCart = asyncHandler(async (req, res) => {
  const { productId, quantity = 1 } = req.body;
  const data = await cartService.addToCart(req.user.publicId, productId, quantity);
  success(res, data, 201);
});

const updateCartItem = asyncHandler(async (req, res) => {
  const { quantity } = req.body;
  const data = await cartService.updateCartItem(req.user.publicId, req.params.itemId, quantity);
  success(res, data);
});

const removeCartItem = asyncHandler(async (req, res) => {
  const data = await cartService.removeCartItem(req.user.publicId, req.params.itemId);
  success(res, data);
});

const clearCart = asyncHandler(async (req, res) => {
  const data = await cartService.clearCart(req.user.publicId);
  success(res, data);
});

module.exports = { getCart, addToCart, updateCartItem, removeCartItem, clearCart };
