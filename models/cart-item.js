'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class CartItem extends Model {
    static associate(models) {
      this.belongsTo(models.MenuItem, {
        foreignKey: 'menu_item_id',
      });
      this.belongsTo(models.Cart, {
        foreignKey: 'cart_id',
      });
    }
  }
  CartItem.init(
    {
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          isNumeric: true,
        },
      },
      menu_item_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          key: 'id',
          model: 'menu_items',
        },
      },
      cart_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          key: 'id',
          model: 'carts',
        },
      },
    },
    {
      sequelize,
      modelName: 'CartItem',
      tableName: 'cart_items',
      paranoid: true,
    },
  );
  return CartItem;
};
