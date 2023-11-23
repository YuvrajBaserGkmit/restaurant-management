const models = require('../models');

const getAllPermissions = async (payload) => {
  const { page, limit } = payload;

  const offset = (page - 1) * limit;

  const permissions = await models.Permission.findAndCountAll({
    offset: offset,
    limit: limit,
    attributes: {
      exclude: ['created_at', 'updated_at', 'deleted_at'],
    },
  });

  if (!permissions.rows.length) {
    const error = new Error('no content available');
    error.statusCode = 204;
    throw error;
  }

  return permissions;
};

const createPermission = async (payload) => {
  const { title } = payload;

  const permissionExists = await models.Permission.findOne({
    where: { title },
  });
  if (permissionExists) {
    const error = new Error('permission already exists');
    error.statusCode = 409;
    throw error;
  }

  const isSoftDeleted = await models.Permission.findOne({
    where: { title },
    paranoid: false,
  });

  let permission;
  if (isSoftDeleted) {
    await models.Permission.restore({ where: { title } });
    permission = await models.Permission.findOne({ where: { title } });
  } else {
    permission = await models.Permission.create(payload);
  }

  return permission;
};

const getPermissionById = async (payload) => {
  const { id } = payload;

  const permissionExists = await models.Permission.findByPk(id, {
    attributes: {
      exclude: ['created_at', 'updated_at', 'deleted_at'],
    },
  });

  if (!permissionExists) {
    const error = new Error('permission not exists');
    error.statusCode = 404;
    throw error;
  } else {
    return permissionExists;
  }
};

const updatePermission = async (payload) => {
  const { id } = payload;

  const permissionExists = await models.Permission.findByPk(id);
  if (!permissionExists) {
    const error = new Error('permission not exists');
    error.statusCode = 404;
    throw error;
  } else {
    await models.Permission.update(payload, { where: { id } });
    return 'permission updated successfully';
  }
};

const deletePermission = async (payload) => {
  const { permanentDelete, id } = payload;
  let message = 'permission deleted successfully';

  const permissionExists = await models.Permission.findByPk(id);

  if (!permissionExists) {
    const error = new Error('permission not exists');
    error.statusCode = 404;
    throw error;
  } else {
    if (permanentDelete) {
      await models.Permission.destroy({ where: { id }, force: true });
      message = 'permission deleted permanently';
    } else {
      await models.Permission.destroy({ where: { id } });
    }
    return message;
  }
};

module.exports = {
  getAllPermissions,
  createPermission,
  getPermissionById,
  updatePermission,
  deletePermission,
};
