const addressService = require('../services/addressService');
const asyncHandler   = require('../utils/asyncHandler');
const { success }    = require('../utils/formatResponse');

const getAddresses = asyncHandler(async (req, res) => {
  const addresses = await addressService.getAddresses(req.user.publicId);
  success(res, addresses);
});

const addAddress = asyncHandler(async (req, res) => {
  const address = await addressService.addAddress(req.user.publicId, req.body);
  success(res, address, 201);
});

const updateAddress = asyncHandler(async (req, res) => {
  const address = await addressService.updateAddress(req.user.publicId, req.params.id, req.body);
  success(res, address);
});

const deleteAddress = asyncHandler(async (req, res) => {
  const result = await addressService.deleteAddress(req.user.publicId, req.params.id);
  success(res, result);
});

const setDefaultAddress = asyncHandler(async (req, res) => {
  const address = await addressService.setDefaultAddress(req.user.publicId, req.params.id);
  success(res, address);
});

module.exports = { getAddresses, addAddress, updateAddress, deleteAddress, setDefaultAddress };
