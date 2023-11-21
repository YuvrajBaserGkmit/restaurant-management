const Joi = require('joi');
const { validateRequest } = require('../helpers/validate.helper');

const createMenuItemSchema = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().required().label('Name'),
    description: Joi.string().label('Description'),
    price: Joi.number().positive().required().label('Price'),
    isVeg: Joi.boolean().required().label('Is Veg'),
    restaurant: Joi.object({
      name: Joi.string().required().label('Name'),
    })
      .required()
      .label('Restaurant'),
    foodCategory: Joi.object({
      name: Joi.string().required().label('Name'),
    })
      .required()
      .label('Food Category'),
  });

  validateRequest(req, res, next, schema, 'body');
};

module.exports = {
  createMenuItemSchema,
};
