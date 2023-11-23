const Joi = require('joi');
const { validateRequest } = require('../helpers/validate.helper');
const passwordComplexity = require('joi-password-complexity');

const complexityOptions = {
  min: 8,
  max: 16,
  lowercase: 1,
  uppercase: 1,
};

const createUserSchema = (req, res, next) => {
  const schema = Joi.object({
    firstName: Joi.string().min(3).max(30).required().label('First Name'),
    lastName: Joi.string().min(3).max(30).required().label('Last Name'),
    email: Joi.string().email().lowercase().trim().required().label('Email'),
    phoneNumber: Joi.string()
      .length(10)
      .pattern(/^[0-9]+$/)
      .required()
      .label('Phone Number'),
    password: passwordComplexity(complexityOptions)
      .required()
      .label('Password'),
    roleId: Joi.string()
      .trim()
      .guid({ version: ['uuidv4'] })
      .required()
      .label('Role Id'),
  });
  validateRequest(req, res, next, schema, 'body');
};

module.exports = {
  createUserSchema,
};
