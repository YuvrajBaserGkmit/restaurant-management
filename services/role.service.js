const models = require('../models');

const getAllRoles = async (payload) => {
  const { page, limit } = payload;

  const offset = (page - 1) * limit;

  const roles = await models.Role.findAndCountAll({
    offset: offset,
    limit: limit,
    attributes: {
      exclude: ['created_at', 'updated_at', 'deleted_at'],
    },
  });
  if (!roles.rows.length) {
    const error = Error('no content available');
    error.statusCode = 204;
    throw error;
  }
  return roles;
};

const createRole = async (payload) => {
  const { title } = payload;

  const roleExists = await models.Role.findOne({ where: { title } });
  if (roleExists) {
    const error = Error('role already exists');
    error.statusCode = 409;
    throw error;
  }

  const isSoftDeleted = await models.Role.findOne({
    where: { title },
    paranoid: false,
  });

  let role;
  if (isSoftDeleted) {
    await models.Role.restore({ where: { title } });
    role = await models.Role.findOne({ where: { title } });
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

  const roleExists = await models.Role.findByPk(id);
  if (!roleExists) {
    const error = Error('role not exists');
    error.statusCode = 404;
    throw error;
  } else {
    await models.Role.update(payload, { where: { id } });
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
      await models.Role.destroy({ where: { id }, force: true });
      message = 'role deleted permanently';
    } else {
      await models.Role.destroy({ where: { id } });
    }
    return message;
  }
};

const assignPermissionsToRole = async (payload) => {
  const { id, permissions } = payload;

  const roleExists = await models.Role.findByPk(id);
  if (!roleExists) {
    const error = Error('role not exists');
    error.statusCode = 404;
    throw error;
  }

  const allPermissions = await models.Permission.findAll({
    where: {
      title: permissions,
    },
    attributes: ['id', 'title'],
  });

  let addedPermissions = [];

  for (const permission of permissions) {
    const foundPermission = allPermissions.find((p) => p.title === permission);
    if (foundPermission) {
      await models.RolePermission.create({
        role_id: id,
        permission_id: foundPermission.id,
      });
      addedPermissions.push(foundPermission.title);
    } else {
      const error = Error(`${permission} permission not exists`);
      error.statusCode = 404;
      throw error;
    }
  }

  const rolePermissions = {
    role: roleExists.title,
    permissions: addedPermissions,
  };

  return rolePermissions;
};

const removePermissionFromRole = async (payload) => {
  const { permanentDelete, roleId, permissionId } = payload;
  let message;

  const roleExists = await models.Role.findByPk(roleId);
  if (!roleExists) {
    const error = Error('role not exists');
    error.statusCode = 404;
    throw error;
  }

  const permissionExists = await models.Permission.findByPk(permissionId);
  if (!permissionExists) {
    const error = Error('permission not exists');
    error.statusCode = 404;
    throw error;
  }

  const roleContainsPermission = await models.RolePermission.findOne({
    where: {
      role_id: roleId,
      permission_id: permissionId,
    },
  });
  if (!roleContainsPermission) {
    const error = Error(
      `${roleExists.title} role already don't have ${permissionExists.title} permission`,
    );
    error.statusCode = 422;
    throw error;
  }

  let isDeleted;
  if (permanentDelete) {
    isDeleted = await models.RolePermission.destroy({
      where: {
        role_id: roleId,
        permission_id: permissionId,
      },
      force: true,
    });
  } else {
    isDeleted = await models.RolePermission.destroy({
      where: {
        role_id: roleId,
        permission_id: permissionId,
      },
    });
  }
  if (isDeleted) {
    message = `${permissionExists.title} permission from ${
      roleExists.title
    } role deleted${permanentDelete ? ' permanently' : ''}`;
  }

  return message;
};

module.exports = {
  getAllRoles,
  createRole,
  getRoleById,
  updateRole,
  deleteRole,
  assignPermissionsToRole,
  removePermissionFromRole,
};
