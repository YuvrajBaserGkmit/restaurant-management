const Joi = require('joi');
const { validateRequest } = require('../helpers/validate.helper');

const limitPageSchema = async (req, res, next) => {
  const schema = Joi.object({
    page: Joi.number().positive().default(1),
    limit: Joi.number().positive().min(1).default(10),
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

module.exports = {
  limitPageSchema,
  idSchema,
};
