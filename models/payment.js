'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Payment extends Model {
    static associate(models) {
      this.belongsTo(models.Order, {
        foreignKey: 'order_id',
      });
      this.belongsTo(models.PaymentMethod, {
        foreignKey: 'payment_method_id',
      });
      this.belongsTo(models.PaymentStatus, {
        foreignKey: 'payment_status_id',
      });
    }
  }
  Payment.init(
    {
      amount: {
        type: DataTypes.DOUBLE,
        allowNull: false,
        validate: {
          isNumeric: true,
        },
      },
      payment_status_id: {
        allowNull: false,
        type: DataTypes.UUID,
        references: {
          key: 'id',
          model: 'payment_statuses',
        },
      },
      payment_method_id: {
        allowNull: false,
        type: DataTypes.UUID,
        references: {
          key: 'id',
          model: 'payment_methods',
        },
      },
      order_id: {
        allowNull: false,
        type: DataTypes.UUID,
        references: {
          key: 'id',
          model: 'orders',
        },
      },
    },
    {
      sequelize,
      modelName: 'Payment',
      tableName: 'payments',
      paranoid: true,
    },
  );
  return Payment;
};
