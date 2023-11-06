'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserAddress extends Model {
    static associate(models) {
      this.belongsTo(models.User, {
        foreignKey: 'user_id',
      });
      this.belongsTo(models.Address, {
        foreignKey: 'address_id',
      });
    }
  }
  UserAddress.init(
    {
      is_default: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      user_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          key: 'id',
          model: 'users',
        },
      },
      address_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          key: 'id',
          model: 'addresses',
        },
      },
    },
    {
      sequelize,
      modelName: 'UserAddress',
      tableName: 'users_addresses',
      paranoid: true,
    },
  );
  return UserAddress;
};
