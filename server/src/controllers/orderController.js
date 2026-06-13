const orderService = require('../services/orderService');
const asyncHandler = require('../utils/asyncHandler');
const { success }  = require('../utils/formatResponse');

const placeOrder = asyncHandler(async (req, res) => {
  const { addressId, paymentMethod, buyNowItem } = req.body;
  const order = await orderService.placeOrder(req.user.publicId, addressId, paymentMethod, buyNowItem);
  success(res, order, 201);
});

const getOrders = asyncHandler(async (req, res) => {
  const orders = await orderService.getOrders(req.user.publicId);
  success(res, { items: orders, pagination: null });
});

const getOrderById = asyncHandler(async (req, res) => {
  const order = await orderService.getOrderById(req.user.publicId, req.params.id);
  success(res, order);
});

module.exports = { placeOrder, getOrders, getOrderById };
