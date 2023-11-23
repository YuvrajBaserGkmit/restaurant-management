const Joi = require('joi');
const { validateRequest } = require('../helpers/validate.helper');

const createPermissionSchema = (req, res, next) => {
  const schema = Joi.object({
    title: Joi.string().lowercase().trim().required().label('Title'),
    description: Joi.string().label('Description'),
  });
  validateRequest(req, res, next, schema, 'body');
};

module.exports = {
  createPermissionSchema,
};
