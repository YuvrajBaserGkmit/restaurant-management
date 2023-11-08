'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Cart extends Model {
    static associate(models) {
      this.belongsTo(models.User, {
        foreignKey: 'user_id',
      });
      this.belongsTo(models.Order, {
        foreignKey: 'order_id',
      });
      this.hasMany(models.CartItem, {
        foreignKey: 'cart_id',
      });
    }
  }
  Cart.init(
    {
      user_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          key: 'id',
          model: 'users',
        },
      },
      order_id: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
          key: 'id',
          model: 'orders',
        },
      },
    },
    {
      sequelize,
      modelName: 'Cart',
      tableName: 'carts',
      paranoid: true,
    },
  );
  return Cart;
};
