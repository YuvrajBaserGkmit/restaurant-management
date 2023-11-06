'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Restaurant extends Model {
    static associate(models) {
      this.belongsTo(models.Address, {
        foreignKey: 'address_id',
      });
      this.belongsTo(models.User, {
        foreignKey: 'owner_id',
      });
      this.hasMany(models.FoodCategory, {
        foreignKey: 'restaurant_id',
      });
      this.hasMany(models.Rating, {
        foreignKey: 'restaurant_id',
      });
      this.hasMany(models.Order, {
        foreignKey: 'restaurant_id',
      });
    }
  }
  Restaurant.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      owner_id: {
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
      modelName: 'Restaurant',
      tableName: 'restaurants',
      paranoid: true,
    },
  );
  return Restaurant;
};
