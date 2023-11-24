const { Router } = require('express');

const authMiddleware = require('../middlewares/auth.middleware');
const restaurantValidator = require('../validators/restaurant.validator');
const commonValidator = require('../validators/common.validator');
const restaurantController = require('../controllers/restaurant.controller');
const genericResponse = require('../helpers/common-function.helper');

const router = Router();

router.get(
  '/',
  authMiddleware.checkAccessToken,
  authMiddleware.checkPermission('read_all_restaurants'),
  restaurantValidator.filerSchema,
  restaurantController.getAllRestaurants,
  genericResponse.sendResponse,
);

router.post(
  '/',
  authMiddleware.checkAccessToken,
  authMiddleware.checkPermission('create_restaurant'),
  restaurantValidator.createRestaurantSchema,
  restaurantController.createRestaurant,
  genericResponse.sendResponse,
);

router.get(
  '/:id',
  authMiddleware.checkAccessToken,
  authMiddleware.checkPermission('read_restaurant'),
  commonValidator.idSchema,
  restaurantController.getRestaurantById,
  genericResponse.sendResponse,
);

router.put(
  '/:id',
  authMiddleware.checkAccessToken,
  authMiddleware.checkPermission('update_restaurant'),
  commonValidator.idSchema,
  restaurantValidator.createRestaurantSchema,
  restaurantController.updateRestaurant,
  genericResponse.sendResponse,
);

router.delete(
  '/:id',
  authMiddleware.checkAccessToken,
  authMiddleware.checkPermission('delete_restaurant'),
  commonValidator.idSchema,
  commonValidator.deleteSchema,
  restaurantController.deleteRestaurant,
  genericResponse.sendResponse,
);

module.exports = router;
