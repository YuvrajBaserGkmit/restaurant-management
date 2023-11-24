const { Router } = require('express');

const authMiddleware = require('../middlewares/auth.middleware');
const addressValidator = require('../validators/address.validator');
const commonValidator = require('../validators/common.validator');
const addressController = require('../controllers/address.controller');
const addressSerializer = require('../serializers/address.serializer');
const genericResponse = require('../helpers/common-function.helper');

const router = Router();

router.get(
  '/',
  authMiddleware.checkAccessToken,
  authMiddleware.checkPermission('read_all_addresses'),
  commonValidator.limitPageSchema,
  addressController.getAllAddresses,
  addressSerializer.serializeAddress,
  genericResponse.sendResponse,
);

router.post(
  '/',
  authMiddleware.checkAccessToken,
  authMiddleware.checkPermission('create_address'),
  addressValidator.addressSchema,
  addressController.createAddress,
  addressSerializer.serializeAddress,
  genericResponse.sendResponse,
);

router.get(
  '/:id',
  authMiddleware.checkAccessToken,
  authMiddleware.checkPermission('read_address'),
  commonValidator.idSchema,
  addressController.getAddressById,
  addressSerializer.serializeAddress,
  genericResponse.sendResponse,
);

router.put(
  '/:id',
  authMiddleware.checkAccessToken,
  authMiddleware.checkPermission('update_address'),
  commonValidator.idSchema,
  addressValidator.addressSchema,
  addressController.updateAddress,
  genericResponse.sendResponse,
);

router.delete(
  '/:id',
  authMiddleware.checkAccessToken,
  authMiddleware.checkPermission('delete_address'),
  commonValidator.idSchema,
  commonValidator.deleteSchema,
  addressController.deleteAddress,
  genericResponse.sendResponse,
);

module.exports = router;
