const Joi = require('joi');
const { validateRequest } = require('../helpers/validate.helper');

const addressSchema = (req, res, next) => {
  const schema = Joi.object({
    street: Joi.string().min(5).max(100).required().label('Street'),
    city: Joi.string().min(3).max(50).required().label('City'),
    state: Joi.string().min(2).max(50).required().label('State'),
    pinCode: Joi.string()
      .length(6)
      .pattern(/^[1-9][0-9]{5}$/)
      .required()
      .label('Pin Code'),
    isDefault: Joi.boolean().required().label('Is Default'),
  });

  validateRequest(req, res, next, schema, 'body');
};

module.exports = {
  addressSchema,
};
