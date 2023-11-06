'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class FoodCategory extends Model {
    static associate(models) {
      this.belongsTo(models.Restaurant, {
        foreignKey: 'restaurant_id',
      });
      this.hasMany(models.MenuItem, {
        foreignKey: 'food_category_id',
      });
    }
  }
  FoodCategory.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      restaurant_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          key: 'id',
          model: 'restaurants',
        },
      },
    },
    {
      sequelize,
      modelName: 'FoodCategory',
      tableName: 'food_categories',
      paranoid: true,
    },
  );
  return FoodCategory;
};
