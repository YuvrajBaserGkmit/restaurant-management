'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class FoodCategory extends Model {
    static associate(models) {
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
