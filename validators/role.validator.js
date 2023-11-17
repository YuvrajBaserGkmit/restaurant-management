const Joi = require('joi');
const { validateRequest } = require('../helpers/validate.helper');

const createRoleSchema = (req, res, next) => {
  const schema = Joi.object({
    title: Joi.string().required().label('Title'),
    description: Joi.string().label('Description'),
  });
  validateRequest(req, res, next, schema, 'body');
};

const deleteRoleSchema = (req, res, next) => {
  const schema = Joi.object({
    permanentDelete: Joi.boolean().label('Permanent Delete'),
  });
  validateRequest(req, res, next, schema, 'query');
};

module.exports = {
  createRoleSchema,
  deleteRoleSchema,
};
