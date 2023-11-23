const { Router } = require('express');

const authMiddleware = require('../middlewares/auth.middleware');
const userValidator = require('../validators/user.validator');
const commonValidator = require('../validators/common.validator');
const userController = require('../controllers/user.controller');
const userSerializer = require('../serializers/user.serializer');
const genericResponse = require('../helpers/common-function.helper');

const router = Router();

router.get(
  '/',
  authMiddleware.checkAccessToken,
  authMiddleware.checkPermission('read_all_users'),
  commonValidator.limitPageSchema,
  userController.getAllUsers,
  userSerializer.serializeUser,
  genericResponse.sendResponse,
);

router.post(
  '/',
  userValidator.createUserSchema,
  userController.createUser,
  userSerializer.serializeUser,
  genericResponse.sendResponse,
);

router.get(
  '/:id',
  authMiddleware.checkAccessToken,
  authMiddleware.checkPermission('read_user'),
  commonValidator.idSchema,
  userController.getUserById,
  userSerializer.serializeUser,
  genericResponse.sendResponse,
);

router.put(
  '/:id',
  authMiddleware.checkAccessToken,
  authMiddleware.checkPermission('update_user'),
  commonValidator.idSchema,
  userValidator.createUserSchema,
  userController.updateUser,
  genericResponse.sendResponse,
);

router.delete(
  '/:id',
  authMiddleware.checkAccessToken,
  authMiddleware.checkPermission('delete_user'),
  commonValidator.idSchema,
  commonValidator.deleteSchema,
  userController.deleteUser,
  genericResponse.sendResponse,
);

module.exports = router;
