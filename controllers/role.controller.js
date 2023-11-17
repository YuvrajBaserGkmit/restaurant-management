const { commonErrorHandler } = require('../helpers/common-function.helper');
const roleService = require('../services/role.service');

const getAllRoles = async (req, res, next) => {
  try {
    const { body: payload, query } = req;
    const response = await roleService.getAllRoles(query);
    res.data = response;
    next();
  } catch (error) {
    commonErrorHandler(req, res, error.message, error.statusCode, error);
  }
};

const createRole = async (req, res, next) => {
  try {
    const { body: payload } = req;
    const response = await roleService.createRole(payload);
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

const getRoleById = async (req, res, next) => {
  try {
    const { params } = req;
    const response = await roleService.getRoleById(params);
    res.data = response;
    next();
  } catch (error) {
    commonErrorHandler(req, res, error.message, error.statusCode, error);
  }
};

const updateRole = async (req, res, next) => {
  try {
    const { body: payload, params } = req;
    const response = await roleService.updateRole(params, payload);
    res.data = response;
    next();
  } catch (error) {
    commonErrorHandler(req, res, error.message, error.statusCode, error);
  }
};

const deleteRole = async (req, res, next) => {
  try {
    const { body: payload, params, query } = req;
    const response = await roleService.deleteRole(params, query);
    res.data = response;
    next();
  } catch (error) {
    commonErrorHandler(req, res, error.message, error.statusCode, error);
  }
};

module.exports = {
  getAllRoles,
  createRole,
  getRoleById,
  updateRole,
  deleteRole,
};
