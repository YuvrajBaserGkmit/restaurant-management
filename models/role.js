'use strict';
const { Model } = require('sequelize');
const rolePermission = require('./role-permission');
module.exports = (sequelize, DataTypes) => {
  class Role extends Model {
    static associate(models) {
      this.belongsToMany(models.Permission, {
        through: models.RolePermission,
        foreignKey: 'role_id',
      });
    }
  }
  Role.init(
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      description: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: 'Role',
      tableName: 'roles',
      paranoid: true,
    },
  );
  return Role;
};
