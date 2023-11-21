const { Router } = require('express');

const router = Router();
const authMiddleware = require('../middlewares/auth.middleware');
const authValidator = require('../validators/auth.validator.js');
const authController = require('../controllers/auth.controller.js');
const genericResponse = require('../helpers/common-function.helper.js');

router.post(
  '/login',
  authValidator.loginSchema,
  authController.loginUser,
  genericResponse.sendResponse,
);

router.post(
  '/refresh-token',
  authValidator.refreshTokenSchema,
  authMiddleware.checkRefreshToken,
  authController.refreshToken,
  genericResponse.sendResponse,
);

module.exports = router;
