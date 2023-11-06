'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class OrderStatus extends Model {
    static associate(models) {
      this.hasMany(models.Order, {
        foreignKey: 'order_status_id',
      });
    }
  }
  OrderStatus.init(
    {
      order_status: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isAlpha: true,
        },
      },
    },
    {
      sequelize,
      modelName: 'OrderStatus',
      tableName: 'order_statuses',
      paranoid: true,
    },
  );
  return OrderStatus;
};
