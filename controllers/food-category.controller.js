const { commonErrorHandler } = require('../helpers/common-function.helper');
const foodCategoryService = require('../services/food-category.service');

const getAllFoodCategories = async (req, res, next) => {
  try {
    const { query: payload } = req;
    const response = await foodCategoryService.getAllFoodCategories(payload);
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

const createFoodCategory = async (req, res, next) => {
  try {
    const { body: payload } = req;
    const response = await foodCategoryService.createFoodCategory(payload);
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

const getFoodCategoryById = async (req, res, next) => {
  try {
    const { params: payload } = req;
    const response = await foodCategoryService.getFoodCategoryById(payload);
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

const updateFoodCategory = async (req, res, next) => {
  try {
    const { body, params } = req;
    const payload = { ...body, ...params };

    const response = await foodCategoryService.updateFoodCategory(payload);
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

const deleteFoodCategory = async (req, res, next) => {
  try {
    const { params, query } = req;
    const payload = { ...params, ...query };

    const response = await foodCategoryService.deleteFoodCategory(payload);
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
  getAllFoodCategories,
  createFoodCategory,
  getFoodCategoryById,
  updateFoodCategory,
  deleteFoodCategory,
};
