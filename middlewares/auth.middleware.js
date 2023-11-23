const jwt = require('jsonwebtoken');
require('dotenv').config();

const models = require('../models');
const { commonErrorHandler } = require('../helpers/common-function.helper');

const checkAccessToken = async (req, res, next) => {
  try {
    const header = req.headers['authorization'];
    const accessToken = header ? header.split(' ')[1] : null;
    if (!accessToken) {
      throw new Error('Access denied');
    }
    const decodedJwt = jwt.verify(
      accessToken,
      process.env.SECRET_KEY_ACCESS_TOKEN,
    );

    const user = await models.User.findOne({
      where: {
        id: decodedJwt.userId,
      },
    });
    if (!user) {
      throw new Error('User Not found');
    }
    req.user = user;
    next();
  } catch (error) {
    res.statusCode = 401;
    if (error.message === 'User Not found') res.statusCode = 404;
    commonErrorHandler(req, res, error.message, res.statusCode, error);
  }
};

const checkRefreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    const decodedRefreshToken = jwt.verify(
      refreshToken,
      process.env.SECRET_KEY_REFRESH_TOKEN,
    );

    const user = await models.User.findOne({
      where: {
        id: decodedRefreshToken.userId,
      },
    });
    if (!user) {
      const error = new Error('User Not found');
      error.statusCode = 404;
      throw error;
    }
    req.body.userId = user.id;
    next();
  } catch (error) {
    error.statusCode = error.statusCode ? error.statusCode : 401;
    commonErrorHandler(req, res, error.message, error.statusCode, error);
  }
};

const checkPermission = (requiredPermission) => {
  return async (req, res, next) => {
    try {
      const roleId = req.user.role_id;
      const rolePermissions = await models.Role.findByPk(roleId, {
        include: [
          {
            model: models.Permission,
          },
        ],
      });
      const havePermission = rolePermissions.Permissions.some(
        (obj) => obj.title === requiredPermission,
      );

      if (havePermission) {
        next();
      } else {
        throw Error(
          `you don't have required permission to access this api endpoint`,
        );
      }
    } catch (error) {
      res.statusCode = 403;
      commonErrorHandler(req, res, error.message, res.statusCode, error);
    }
  };
};

module.exports = {
  checkAccessToken,
  checkRefreshToken,
  checkPermission,
};
