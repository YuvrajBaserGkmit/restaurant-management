const { commonErrorHandler } = require('../helpers/common-function.helper');
const authService = require('../services/auth.service');

const loginUser = async (req, res, next) => {
  try {
    const { body: payload } = req;
    const response = await authService.loginUser(payload);
    res.data = response;
    res.statusCode = 200;
    next();
  } catch (error) {
    commonErrorHandler(req, res, error.message, error.statusCode, error);
  }
};

const refreshToken = async (req, res, next) => {
  try {
    const { body: payload } = req;
    const response = await authService.refreshToken(payload);
    res.data = response;
    res.statusCode = 200;
    next();
  } catch (error) {
    commonErrorHandler(req, res, error.message, error.statusCode, error);
  }
};

module.exports = {
  loginUser,
  refreshToken,
};
