const { Router } = require('express');

const authMiddleware = require('../middlewares/auth.middleware');
const permissionValidator = require('../validators/permission.validator');
const commonValidator = require('../validators/common.validator');
const permissionController = require('../controllers/permission.controller');
const genericResponse = require('../helpers/common-function.helper');

const router = Router();

router.get(
  '/',
  authMiddleware.checkAccessToken,
  authMiddleware.checkPermission('read_all_permissions'),
  commonValidator.limitPageSchema,
  permissionController.getAllPermissions,
  genericResponse.sendResponse,
);

router.post(
  '/',
  authMiddleware.checkAccessToken,
  authMiddleware.checkPermission('create_permission'),
  permissionValidator.createPermissionSchema,
  permissionController.createPermission,
  genericResponse.sendResponse,
);

router.get(
  '/:id',
  authMiddleware.checkAccessToken,
  authMiddleware.checkPermission('read_permission'),
  commonValidator.idSchema,
  permissionController.getPermissionById,
  genericResponse.sendResponse,
);

router.put(
  '/:id',
  authMiddleware.checkAccessToken,
  authMiddleware.checkPermission('update_permission'),
  commonValidator.idSchema,
  permissionValidator.createPermissionSchema,
  permissionController.updatePermission,
  genericResponse.sendResponse,
);

router.delete(
  '/:id',
  authMiddleware.checkAccessToken,
  authMiddleware.checkPermission('delete_permission'),
  commonValidator.idSchema,
  commonValidator.deleteSchema,
  permissionController.deletePermission,
  genericResponse.sendResponse,
);

module.exports = router;
