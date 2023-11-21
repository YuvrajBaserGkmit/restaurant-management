const Joi = require('joi');
const { validateRequest } = require('../helpers/validate.helper');

const limitPageSchema = async (req, res, next) => {
  const schema = Joi.object({
    page: Joi.number().positive().max(100).default(1),
    limit: Joi.number().positive().min(1).max(100).default(10),
  });
  validateRequest(req, res, next, schema, 'query');
};

const idSchema = async (req, res, next) => {
  const schema = Joi.object({
    id: Joi.string()
      .guid({
        version: ['uuidv4'],
      })
      .required(),
  });
  validateRequest(req, res, next, schema, 'params');
};

const deleteSchema = (req, res, next) => {
  const schema = Joi.object({
    permanentDelete: Joi.boolean().label('Permanent Delete'),
  });
  validateRequest(req, res, next, schema, 'query');
};

module.exports = {
  limitPageSchema,
  idSchema,
  deleteSchema,
};
