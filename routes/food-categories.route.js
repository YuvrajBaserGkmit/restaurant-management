const { Router } = require('express');

const authMiddleware = require('../middlewares/auth.middleware');
const foodCategoryValidator = require('../validators/food-category.validator');
const commonValidator = require('../validators/common.validator');
const foodCategoryController = require('../controllers/food-category.controller');
const genericResponse = require('../helpers/common-function.helper');

const router = Router();

router.get(
  '/',
  authMiddleware.checkAccessToken,
  authMiddleware.checkPermission('read_all_food_categories'),
  commonValidator.limitPageSchema,
  foodCategoryController.getAllFoodCategories,
  genericResponse.sendResponse,
);

router.post(
  '/',
  authMiddleware.checkAccessToken,
  authMiddleware.checkPermission('create_food_category'),
  foodCategoryValidator.createFoodCategorySchema,
  foodCategoryController.createFoodCategory,
  genericResponse.sendResponse,
);

router.get(
  '/:id',
  authMiddleware.checkAccessToken,
  authMiddleware.checkPermission('read_food_category'),
  commonValidator.idSchema,
  foodCategoryController.getFoodCategoryById,
  genericResponse.sendResponse,
);

router.put(
  '/:id',
  authMiddleware.checkAccessToken,
  authMiddleware.checkPermission('update_food_category'),
  commonValidator.idSchema,
  foodCategoryValidator.createFoodCategorySchema,
  foodCategoryController.updateFoodCategory,
  genericResponse.sendResponse,
);

router.delete(
  '/:id',
  authMiddleware.checkAccessToken,
  authMiddleware.checkPermission('delete_food_category'),
  commonValidator.idSchema,
  commonValidator.deleteSchema,
  foodCategoryController.deleteFoodCategory,
  genericResponse.sendResponse,
);

module.exports = router;
