const { commonErrorHandler } = require('../helpers/common-function.helper');
const menuItemService = require('../services/menu-item.service');

const getAllMenuItems = async (req, res, next) => {
  try {
    const { query: payload } = req;
    const response = await menuItemService.getAllMenuItems(payload);
    res.data = response;
    next();
  } catch (error) {
    let message = error.message;
    if (error.errors) {
      message = error.errors[0].message;
    }
    commonErrorHandler(req, res, message, error.statusCode, error);
  }
};

const createMenuItem = async (req, res, next) => {
  try {
    const { body: payload } = req;
    const response = await menuItemService.createMenuItem(payload);
    res.data = response;
    res.statusCode = 201;
    next();
  } catch (error) {
    let message = error.message;
    if (error.errors) {
      message = error.errors[0].message;
    }
    commonErrorHandler(req, res, message, error.statusCode, error);
  }
};

const getMenuItemById = async (req, res, next) => {
  try {
    const { params: payload } = req;
    const response = await menuItemService.getMenuItemById(payload);
    res.data = response;
    next();
  } catch (error) {
    let message = error.message;
    if (error.errors) {
      message = error.errors[0].message;
    }
    commonErrorHandler(req, res, message, error.statusCode, error);
  }
};

const updateMenuItem = async (req, res, next) => {
  try {
    const { body, params } = req;
    const payload = { ...body, ...params };

    const response = await menuItemService.updateMenuItem(payload);
    res.data = response;
    next();
  } catch (error) {
    let message = error.message;
    if (error.errors) {
      message = error.errors[0].message;
    }
    commonErrorHandler(req, res, message, error.statusCode, error);
  }
};

const deleteMenuItem = async (req, res, next) => {
  try {
    const { params, query } = req;
    const payload = { ...params, ...query };

    const response = await menuItemService.deleteMenuItem(payload);
    res.data = response;
    next();
  } catch (error) {
    let message = error.message;
    if (error.errors) {
      message = error.errors[0].message;
    }
    commonErrorHandler(req, res, message, error.statusCode, error);
  }
};

module.exports = {
  getAllMenuItems,
  createMenuItem,
  getMenuItemById,
  updateMenuItem,
  deleteMenuItem,
};
