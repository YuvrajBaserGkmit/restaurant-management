'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class RolePermission extends Model {
    static associate(models) {
      this.belongsTo(models.Role, {
        foreignKey: 'role_id',
      });
      this.belongsTo(models.Permission, {
        foreignKey: 'permission_id',
      });
    }
  }
  RolePermission.init(
    {
      role_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'roles',
          key: 'id',
        },
      },
      permission_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'permissions',
          key: 'id',
        },
      },
    },
    {
      sequelize,
      modelName: 'RolePermission',
      tableName: 'roles_permissions',
      paranoid: true,
    },
  );
  return RolePermission;
};
