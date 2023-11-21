const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const models = require('../models');

const {
  SECRET_KEY_ACCESS_TOKEN,
  JWT_ACCESS_EXPIRATION,
  SECRET_KEY_REFRESH_TOKEN,
  REFRESH_TOKEN_EXPIRATION,
} = process.env;

const loginUser = async (payload) => {
  const { email, password } = payload;
  const userExist = await models.User.findOne({
    where: {
      email: email,
    },
  });
  if (!userExist) {
    const error = Error(`user with email ${email} not exists`);
    error.statusCode = 404;
    throw error;
  }
  const match = await bcrypt.compare(password, userExist.password);

  if (!match) {
    const error = Error(`wrong email or password`);
    error.statusCode = 401;
    throw error;
  }

  const accessToken = jwt.sign(
    { userId: userExist.id },
    SECRET_KEY_ACCESS_TOKEN,
    {
      expiresIn: JWT_ACCESS_EXPIRATION,
    },
  );

  const refreshToken = jwt.sign(
    { userId: userExist.id },
    SECRET_KEY_REFRESH_TOKEN,
    {
      expiresIn: REFRESH_TOKEN_EXPIRATION,
    },
  );

  const result = {
    id: userExist.id,
    email: userExist.email,
    accessToken: accessToken,
    refreshToken: refreshToken,
  };

  return result;
};

const refreshToken = async (payload) => {
  const { userId, refreshToken } = payload;

  const newAccessToken = jwt.sign({ userId: userId }, SECRET_KEY_ACCESS_TOKEN, {
    expiresIn: JWT_ACCESS_EXPIRATION,
  });

  const result = {
    id: userId,
    accessToken: newAccessToken,
  };

  return result;
};

module.exports = {
  loginUser,
  refreshToken,
};
