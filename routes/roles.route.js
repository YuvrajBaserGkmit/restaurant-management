const { Router } = require('express');

const authMiddleware = require('../middlewares/auth.middleware');
const roleValidator = require('../validators/role.validator');
const commonValidator = require('../validators/common.validator');
const roleController = require('../controllers/role.controller');
const genericResponse = require('../helpers/common-function.helper');

const router = Router();

router.get(
  '/',
  authMiddleware.checkAccessToken,
  authMiddleware.checkPermission('read_all_roles'),
  commonValidator.limitPageSchema,
  roleController.getAllRoles,
  genericResponse.sendResponse,
);

router.post(
  '/',
  authMiddleware.checkAccessToken,
  authMiddleware.checkPermission('create_role'),
  roleValidator.createRoleSchema,
  roleController.createRole,
  genericResponse.sendResponse,
);

router.get(
  '/:id',
  authMiddleware.checkAccessToken,
  authMiddleware.checkPermission('read_role'),
  commonValidator.idSchema,
  roleController.getRoleById,
  genericResponse.sendResponse,
);

router.put(
  '/:id',
  authMiddleware.checkAccessToken,
  authMiddleware.checkPermission('update_role'),
  commonValidator.idSchema,
  roleValidator.createRoleSchema,
  roleController.updateRole,
  genericResponse.sendResponse,
);

router.delete(
  '/:id',
  authMiddleware.checkAccessToken,
  authMiddleware.checkPermission('delete_role'),
  commonValidator.idSchema,
  commonValidator.deleteSchema,
  roleController.deleteRole,
  genericResponse.sendResponse,
);

router.post(
  '/:id/permissions',
  authMiddleware.checkAccessToken,
  authMiddleware.checkPermission('assign_permissions_to_role'),
  commonValidator.idSchema,
  roleValidator.permissionsSchema,
  roleController.assignPermissionsToRole,
  genericResponse.sendResponse,
);

router.delete(
  '/:roleId/permissions/:permissionId',
  authMiddleware.checkAccessToken,
  authMiddleware.checkPermission('remove_permission_from_role'),
  commonValidator.deleteSchema,
  roleValidator.roleIdPermissionIdSchema,
  roleController.removePermissionFromRole,
  genericResponse.sendResponse,
);

module.exports = router;
