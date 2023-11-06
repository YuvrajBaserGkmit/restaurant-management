'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class MenuItem extends Model {
    static associate(models) {
      this.belongsTo(models.FoodCategory, {
        foreignKey: 'food_category_id',
      });
    }
  }
  MenuItem.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      is_veg: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      image: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
          isUrl: true,
        },
      },
      price: {
        type: DataTypes.DOUBLE,
        allowNull: false,
        validate: {
          isNumeric: true,
        },
      },
      food_category_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          key: 'id',
          model: 'food_categories',
        },
      },
    },
    {
      sequelize,
      modelName: 'MenuItem',
      tableName: 'menu_items',
      paranoid: true,
    },
  );
  return MenuItem;
};
