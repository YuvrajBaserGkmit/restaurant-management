const models = require('../models');

const getAllRoles = async (query) => {
  const page = query.page < 1 ? 1 : query.page || 1;
  const limit = query.limit || 10;
  const offset = (page - 1) * limit;

  const roles = await models.Role.findAll({
    offset: offset,
    limit: limit,
    attributes: {
      exclude: ['created_at', 'updated_at', 'deleted_at'],
    },
  });
  if (roles.length === 0) {
    const error = Error('no content available');
    error.statusCode = 204;
    throw error;
  }
  return roles;
};

const createRole = async (payload) => {
  const roleExists = await models.Role.findOne({
    where: {
      title: payload.title,
    },
  });
  if (roleExists) {
    const error = Error('role already exists');
    error.statusCode = 409;
    throw error;
  }
  const isSoftDeleted = await models.Role.findOne({
    where: {
      title: payload.title,
    },
    paranoid: false,
  });

  let role;
  if (isSoftDeleted) {
    await models.Role.restore({
      where: { title: payload.title },
    });
    role = await models.Role.findOne({
      where: {
        title: payload.title,
      },
    });
  } else {
    role = await models.Role.create(payload);
  }
  return role;
};

const getRoleById = async (params) => {
  const roleExists = await models.Role.findByPk(params.id, {
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

const updateRole = async (params, payload) => {
  const roleExists = await models.Role.findByPk(params.id, {});
  if (!roleExists) {
    const error = Error('role not exists');
    error.statusCode = 404;
    throw error;
  } else {
    await models.Role.update(payload, {
      where: {
        id: params.id,
      },
    });
    return 'role updated successfully';
  }
};

const deleteRole = async (params, query) => {
  const roleId = params.id;
  const hardDelete = query.permanentDelete === 'true';

  const roleExists = await models.Role.findByPk(roleId);
  if (!roleExists) {
    const error = Error('role not exists');
    error.statusCode = 404;
    throw error;
  } else {
    if (hardDelete) {
      await models.Role.destroy({
        where: {
          id: roleId,
        },
        force: true,
      });
    } else {
      await models.Role.destroy({
        where: {
          id: roleId,
        },
      });
    }
    return 'role deleted successfully';
  }
};

module.exports = {
  getAllRoles,
  createRole,
  getRoleById,
  updateRole,
  deleteRole,
};
