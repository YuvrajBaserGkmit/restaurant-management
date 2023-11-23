const Joi = require('joi');
const { validateRequest } = require('../helpers/validate.helper');

const createRoleSchema = (req, res, next) => {
  const schema = Joi.object({
    title: Joi.string()
      .lowercase()
      .trim()
      .valid('customer', 'owner')
      .required()
      .label('Title'),
    description: Joi.string().label('Description'),
  });
  validateRequest(req, res, next, schema, 'body');
};

const permissionsSchema = (req, res, next) => {
  const schema = Joi.object({
    permissions: Joi.array().items(Joi.string()),
  });
  validateRequest(req, res, next, schema, 'body');
};

const roleIdPermissionIdSchema = (req, res, next) => {
  const schema = Joi.object({
    roleId: Joi.string()
      .guid({ version: ['uuidv4'] })
      .required(),
    permissionId: Joi.string()
      .guid({ version: ['uuidv4'] })
      .required(),
  });
  validateRequest(req, res, next, schema, 'params');
};

module.exports = {
  createRoleSchema,
  permissionsSchema,
  roleIdPermissionIdSchema,
};
