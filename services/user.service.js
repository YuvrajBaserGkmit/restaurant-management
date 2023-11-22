const bcrypt = require('bcrypt');
const models = require('../models');

const getAllUsers = async (payload) => {
  const { page, limit } = payload;

  const offset = (page - 1) * limit;

  const users = await models.User.findAndCountAll({
    offset: offset,
    limit: limit,
    attributes: {
      exclude: ['password', 'created_at', 'updated_at', 'deleted_at'],
    },
  });
  if (!users.rows.length) {
    const error = new Error('No content available');
    error.statusCode = 204;
    throw error;
  }
  return users;
};

const createUser = async (payload) => {
  const { firstName, lastName, phoneNumber, email, password, roleId } = payload;

  const userEmailExist = await models.User.findOne({ where: { email } });
  if (userEmailExist) {
    const error = new Error('User already exists');
    error.statusCode = 409;
    throw error;
  }

  const roleExist = await models.Role.findByPk(roleId);
  if (!roleExist) {
    const error = new Error('Role does not exist');
    error.statusCode = 404;
    throw error;
  }
  if (roleExist.title === 'admin') {
    const error = Error('admin role not allowed');
    error.statusCode = 422;
    throw error;
  }

  const isSoftDeleted = await models.User.findOne({
    where: { email },
    paranoid: false,
  });

  const hashedPassword = await bcrypt.hash(password, 10);
  let user;

  if (isSoftDeleted) {
    await models.User.restore({ where: { email } });
    user = await models.User.findOne({ where: { email } });
  } else {
    const userPayload = {
      first_name: firstName,
      last_name: lastName,
      phone_number: phoneNumber,
      email: email,
      password: hashedPassword,
      role_id: roleId,
    };
    user = await models.User.create(userPayload);
  }

  return user;
};

const getUserById = async (payload) => {
  const { id } = payload;

  const userExists = await models.User.findByPk(id, {
    attributes: {
      exclude: ['password', 'created_at', 'updated_at', 'deleted_at'],
    },
  });

  if (!userExists) {
    const error = new Error('User not exists');
    error.statusCode = 404;
    throw error;
  } else {
    return userExists;
  }
};

const updateUser = async (payload) => {
  const { id, firstName, lastName, phoneNumber, email, password, roleId } =
    payload;

  const userExists = await models.User.findByPk(id);
  if (!userExists) {
    const error = new Error('User not exists');
    error.statusCode = 404;
    throw error;
  }

  const roleExist = await models.Role.findByPk(roleId);
  if (!roleExist) {
    const error = new Error('Role does not exist');
    error.statusCode = 404;
    throw error;
  }
  if (roleExist.title === 'admin') {
    const error = Error('admin role not allowed');
    error.statusCode = 422;
    throw error;
  }

  if (userExists.email !== email) {
    const error = Error('email can not be updated');
    error.statusCode = 422;
    throw error;
  }

  const isPasswordSame = await bcrypt.compare(password, userExists.password);
  const newHashedPassword = isPasswordSame
    ? userExists.password
    : await bcrypt.hash(password, 10);

  const userUpdatePayload = {
    first_name: firstName,
    last_name: lastName,
    phone_number: phoneNumber,
    password: newHashedPassword,
    role_id: roleId,
  };

  await models.User.update(userUpdatePayload, { where: { id } });
  return 'User updated successfully';
};

const deleteUser = async (payload) => {
  const { permanentDelete, id } = payload;
  let message = 'User deleted successfully';

  const userExists = await models.User.findByPk(id);
  if (!userExists) {
    const error = new Error('User not exists');
    error.statusCode = 404;
    throw error;
  } else {
    if (permanentDelete) {
      await models.User.destroy({ where: { id }, force: true });
      message = 'User deleted permanently';
    } else {
      await models.User.destroy({ where: { id } });
    }
    return message;
  }
};

module.exports = {
  getAllUsers,
  createUser,
  getUserById,
  updateUser,
  deleteUser,
};
