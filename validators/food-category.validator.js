const Joi = require('joi');
const { validateRequest } = require('../helpers/validate.helper');

const createFoodCategorySchema = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().lowercase().trim().required().label('Name'),
  });
  validateRequest(req, res, next, schema, 'body');
};

module.exports = {
  createFoodCategorySchema,
};
