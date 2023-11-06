'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Address extends Model {
    static associate(models) {
      this.belongsToMany(models.User, {
        through: models.UserAddress,
        foreignKey: 'address_id',
      });
      this.hasOne(models.Restaurant, {
        foreignKey: 'address_id',
      });
    }
  }
  Address.init(
    {
      street: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      city: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isAlpha: true,
        },
      },
      state: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isAlpha: true,
        },
      },
      pin_code: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          min: 6,
          isNumeric: true,
        },
      },
    },
    {
      sequelize,
      modelName: 'Address',
      tableName: 'addresses',
      paranoid: true,
    },
  );
  return Address;
};
