const Joi = require('joi');
const { validateRequest } = require('../helpers/validate.helper');

const createRestaurantSchema = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().required().label('Name'),
    address: Joi.object({
      street: Joi.string().required().label('Street'),
      city: Joi.string().required().label('City'),
      state: Joi.string().required().label('State'),
      pinCode: Joi.number()
        .min(100000)
        .max(999999)
        .required()
        .label('Pin Code'),
    })
      .required()
      .label('Address'),
  });
  validateRequest(req, res, next, schema, 'body');
};

const filerSchema = (req, res, next) => {
  const schema = Joi.object({
    page: Joi.number().positive().max(100).default(1),
    limit: Joi.number().positive().min(1).max(100).default(10),
    city: Joi.string().label('City'),
    state: Joi.string().label('state'),
    name: Joi.string().label('Name'),
  });
  validateRequest(req, res, next, schema, 'query');
};

module.exports = {
  createRestaurantSchema,
  filerSchema,
};
