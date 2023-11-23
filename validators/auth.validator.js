const Joi = require('joi');
const { validateRequest } = require('../helpers/validate.helper');

const loginSchema = async (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().email().lowercase().trim().required().label('Email'),
    password: Joi.string().trim().required().label('Password'),
  });
  validateRequest(req, res, next, schema, 'body');
};

const refreshTokenSchema = async (req, res, next) => {
  const schema = Joi.object({
    refreshToken: Joi.string().trim().required().label('Refresh Token'),
  });
  validateRequest(req, res, next, schema, 'body');
};

module.exports = {
  loginSchema,
  refreshTokenSchema,
};
