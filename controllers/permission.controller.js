const { commonErrorHandler } = require('../helpers/common-function.helper');
const permissionService = require('../services/permission.service');

const getAllPermissions = async (req, res, next) => {
  try {
    const { query: payload } = req;
    const response = await permissionService.getAllPermissions(payload);
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

const createPermission = async (req, res, next) => {
  try {
    const { body: payload } = req;
    const response = await permissionService.createPermission(payload);
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

const getPermissionById = async (req, res, next) => {
  try {
    const { params: payload } = req;
    const response = await permissionService.getPermissionById(payload);
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

const updatePermission = async (req, res, next) => {
  try {
    const { body, params } = req;
    const payload = { ...body, ...params };

    const response = await permissionService.updatePermission(payload);
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

const deletePermission = async (req, res, next) => {
  try {
    const { params, query } = req;
    const payload = { ...params, ...query };

    const response = await permissionService.deletePermission(payload);
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
  getAllPermissions,
  createPermission,
  getPermissionById,
  updatePermission,
  deletePermission,
};
