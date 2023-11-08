'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    static associate(models) {
      this.belongsTo(models.User, {
        foreignKey: 'user_id',
      });
      this.belongsTo(models.Restaurant, {
        foreignKey: 'restaurant_id',
      });
      this.hasOne(models.Cart, {
        foreignKey: 'order_id',
      });
      this.hasOne(models.Payment, {
        foreignKey: 'order_id',
      });
    }
  }
  Order.init(
    {
      date: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
          isDate: true,
        },
      },
      order_total: {
        type: DataTypes.DOUBLE,
        allowNull: false,
        validate: {
          isNumeric: true,
        },
      },
      order_status: {
        type: DataTypes.ENUM,
        values: ['received', 'cancelled', 'in process', 'prepared', 'paid'],
        allowNull: false,
        validate: {
          isAlpha: true,
        },
      },
      user_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          key: 'id',
          model: 'users',
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
      modelName: 'Order',
      tableName: 'orders',
      paranoid: true,
    },
  );
  return Order;
};
