const { commonErrorHandler } = require('../helpers/common-function.helper');
const roleService = require('../services/role.service');

const getAllRoles = async (req, res, next) => {
  try {
    const { query: payload } = req;
    const response = await roleService.getAllRoles(payload);
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
    const { params: payload } = req;
    const response = await roleService.getRoleById(payload);
    res.data = response;
    next();
  } catch (error) {
    commonErrorHandler(req, res, error.message, error.statusCode, error);
  }
};

const updateRole = async (req, res, next) => {
  try {
    const { body, params } = req;
    const payload = { body, params };

    const response = await roleService.updateRole(payload);
    res.data = response;
    next();
  } catch (error) {
    commonErrorHandler(req, res, error.message, error.statusCode, error);
  }
};

const deleteRole = async (req, res, next) => {
  try {
    const { params, query } = req;
    const payload = { params, query };

    const response = await roleService.deleteRole(payload);
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
