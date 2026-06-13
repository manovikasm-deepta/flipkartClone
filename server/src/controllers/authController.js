const asyncHandler   = require('../utils/asyncHandler');
const { success }    = require('../utils/formatResponse');
const authService    = require('../services/authService');

const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const result = await authService.register({ name, email, password });
  success(res, result, 201);
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const result = await authService.login({ email, password });
  success(res, result, 200);
});

const me = asyncHandler(async (req, res) => {
  const user = await authService.getProfile(req.user.publicId);
  success(res, { user });
});

const defaultUser = asyncHandler(async (req, res) => {
  const result = await authService.getDefaultUser();
  success(res, result);
});

module.exports = { register, login, me, defaultUser };
