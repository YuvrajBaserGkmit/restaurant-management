const { commonErrorHandler } = require('../helpers/common-function.helper');
const addressService = require('../services/address.service');

const getAllAddresses = async (req, res, next) => {
  try {
    const { query: payload } = req;
    const response = await addressService.getAllAddresses(payload);
    res.data = response;
    next();
  } catch (error) {
    let message = error.errors ? error.errors[0].message : error.message;
    commonErrorHandler(req, res, message, error.statusCode, error);
  }
};

const createAddress = async (req, res, next) => {
  try {
    const { body, user } = req;
    const { id } = user;
    const payload = { ...body, id };

    const response = await addressService.createAddress(payload);
    res.data = response;
    res.statusCode = 201;
    next();
  } catch (error) {
    let message = error.errors ? error.errors[0].message : error.message;
    commonErrorHandler(req, res, message, error.statusCode, error);
  }
};

const getAddressById = async (req, res, next) => {
  try {
    const { params: payload } = req;
    const response = await addressService.getAddressById(payload);
    res.data = response;
    next();
  } catch (error) {
    let message = error.errors ? error.errors[0].message : error.message;
    commonErrorHandler(req, res, message, error.statusCode, error);
  }
};

const updateAddress = async (req, res, next) => {
  try {
    const { body, params } = req;
    const payload = { ...body, ...params };

    const response = await addressService.updateAddress(payload);
    res.data = response;
    next();
  } catch (error) {
    let message = error.errors ? error.errors[0].message : error.message;
    commonErrorHandler(req, res, message, error.statusCode, error);
  }
};

const deleteAddress = async (req, res, next) => {
  try {
    const { params, query } = req;
    const payload = { ...params, ...query };

    const response = await addressService.deleteAddress(payload);
    res.data = response;
    next();
  } catch (error) {
    let message = error.errors ? error.errors[0].message : error.message;
    commonErrorHandler(req, res, message, error.statusCode, error);
  }
};

module.exports = {
  getAllAddresses,
  createAddress,
  getAddressById,
  updateAddress,
  deleteAddress,
};
