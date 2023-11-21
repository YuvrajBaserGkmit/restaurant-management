const { commonErrorHandler } = require('../helpers/common-function.helper');
const userService = require('../services/user.service');

const getAllUsers = async (req, res, next) => {
  try {
    const { query: payload } = req;
    const response = await userService.getAllUsers(payload);
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

const createUser = async (req, res, next) => {
  try {
    const { body: payload } = req;
    const response = await userService.createUser(payload);
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

const getUserById = async (req, res, next) => {
  try {
    const { params: payload } = req;
    const response = await userService.getUserById(payload);
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

const updateUser = async (req, res, next) => {
  try {
    const { body, params } = req;
    const payload = { ...body, ...params };

    const response = await userService.updateUser(payload);
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

const deleteUser = async (req, res, next) => {
  try {
    const { params, query } = req;
    const payload = { ...params, ...query };

    const response = await userService.deleteUser(payload);
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
  getAllUsers,
  createUser,
  getUserById,
  updateUser,
  deleteUser,
};
