const { Router } = require('express');
const authMiddleware = require('../middlewares/auth.middleware');
const menuItemValidator = require('../validators/menu-item.validator');
const commonValidator = require('../validators/common.validator');
const menuItemController = require('../controllers/menu-item.controller');
const genericResponse = require('../helpers/common-function.helper');

const router = Router();

router.get(
  '/',
  authMiddleware.checkAccessToken,
  authMiddleware.checkPermission('read_all_menu_items'),
  commonValidator.limitPageSchema,
  menuItemController.getAllMenuItems,
  genericResponse.sendResponse,
);

router.post(
  '/',
  authMiddleware.checkAccessToken,
  authMiddleware.checkPermission('create_menu_item'),
  menuItemValidator.createMenuItemSchema,
  menuItemController.createMenuItem,
  genericResponse.sendResponse,
);

router.get(
  '/:id',
  authMiddleware.checkAccessToken,
  authMiddleware.checkPermission('read_menu_item'),
  commonValidator.idSchema,
  menuItemController.getMenuItemById,
  genericResponse.sendResponse,
);

router.put(
  '/:id',
  authMiddleware.checkAccessToken,
  authMiddleware.checkPermission('update_menu_item'),
  commonValidator.idSchema,
  menuItemValidator.createMenuItemSchema,
  menuItemController.updateMenuItem,
  genericResponse.sendResponse,
);

router.delete(
  '/:id',
  authMiddleware.checkAccessToken,
  authMiddleware.checkPermission('delete_menu_item'),
  commonValidator.idSchema,
  commonValidator.deleteSchema,
  menuItemController.deleteMenuItem,
  genericResponse.sendResponse,
);

module.exports = router;
