const models = require('../models');

const getAllRoles = async (payload) => {
  const { page, limit } = payload;

  const offset = (page - 1) * limit;

  const roles = await models.Role.findAll({
    offset: offset,
    limit: limit,
    attributes: {
      exclude: ['created_at', 'updated_at', 'deleted_at'],
    },
  });
  if (!roles.length) {
    const error = Error('no content available');
    error.statusCode = 204;
    throw error;
  }
  return roles;
};

const createRole = async (payload) => {
  const { title } = payload;

  const roleExists = await models.Role.findOne({
    where: {
      title: title,
    },
  });
  if (roleExists) {
    const error = Error('role already exists');
    error.statusCode = 409;
    throw error;
  }
  const isSoftDeleted = await models.Role.findOne({
    where: {
      title: title,
    },
    paranoid: false,
  });

  let role;
  if (isSoftDeleted) {
    await models.Role.restore({
      where: { title: title },
    });
    role = await models.Role.findOne({
      where: {
        title: title,
      },
    });
  } else {
    role = await models.Role.create(payload);
  }
  return role;
};

const getRoleById = async (payload) => {
  const { id } = payload;

  const roleExists = await models.Role.findByPk(id, {
    attributes: {
      exclude: ['created_at', 'updated_at', 'deleted_at'],
    },
  });
  if (!roleExists) {
    const error = Error('role not exists');
    error.statusCode = 404;
    throw error;
  } else {
    return roleExists;
  }
};

const updateRole = async (payload) => {
  const { id } = payload;

  const roleExists = await models.Role.findByPk(id, {});
  if (!roleExists) {
    const error = Error('role not exists');
    error.statusCode = 404;
    throw error;
  } else {
    await models.Role.update(payload, {
      where: {
        id: id,
      },
    });
    return 'role updated successfully';
  }
};

const deleteRole = async (payload) => {
  const { permanentDelete, id } = payload;
  let message = 'role deleted successfully';

  const roleExists = await models.Role.findByPk(id);
  if (!roleExists) {
    const error = Error('role not exists');
    error.statusCode = 404;
    throw error;
  } else {
    if (permanentDelete) {
      await models.Role.destroy({
        where: {
          id: id,
        },
        force: true,
      });
      message = 'role deleted permanently';
    } else {
      await models.Role.destroy({
        where: {
          id: id,
        },
      });
    }
    return message;
  }
};

module.exports = {
  getAllRoles,
  createRole,
  getRoleById,
  updateRole,
  deleteRole,
};
