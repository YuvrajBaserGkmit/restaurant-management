'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class MenuItem extends Model {
    static associate(models) {
      this.belongsTo(models.Restaurant, {
        foreignKey: 'restaurant_id',
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
      modelName: 'MenuItem',
      tableName: 'menu_items',
      paranoid: true,
    },
  );
  return MenuItem;
};
