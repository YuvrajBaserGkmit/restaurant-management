'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Permission extends Model {
    static associate(models) {
      this.belongsToMany(models.Role, {
        through: models.RolePermission,
        foreignKey: 'permission_id',
      });
    }
  }
  Permission.init(
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
      modelName: 'Permission',
      tableName: 'permissions',
      paranoid: true,
    },
  );
  return Permission;
};
