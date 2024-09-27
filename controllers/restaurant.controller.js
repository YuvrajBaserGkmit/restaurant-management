const { commonErrorHandler } = require('../helpers/common-function.helper');
const restaurantService = require('../services/restaurant.service');

const getAllRestaurants = async (req, res, next) => {
  try {
    const { query: payload } = req;
    const response = await restaurantService.getAllRestaurants(payload);
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

const createRestaurant = async (req, res, next) => {
  try {
    const { body, user } = req;
    const { id } = user;
    const payload = { ...body, id };

    const response = await restaurantService.createRestaurant(payload);
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

const getRestaurantById = async (req, res, next) => {
  try {
    const { params: payload } = req;
    const response = await restaurantService.getRestaurantById(payload);
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

const updateRestaurant = async (req, res, next) => {
  try {
    const { body, params } = req;
    const payload = { ...body, ...params };

    const response = await restaurantService.updateRestaurant(payload);
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

const deleteRestaurant = async (req, res, next) => {
  try {
    const { params, query } = req;
    const payload = { ...params, ...query };

    const response = await restaurantService.deleteRestaurant(payload);
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
  getAllRestaurants,
  createRestaurant,
  getRestaurantById,
  updateRestaurant,
  deleteRestaurant,
};
