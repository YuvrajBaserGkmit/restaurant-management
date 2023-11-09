'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PaymentStatus extends Model {
    static associate(models) {
      this.hasMany(models.Payment, {
        foreignKey: 'payment_status_id',
      });
    }
  }
  PaymentStatus.init(
    {
      payment_status: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isAlpha: true,
        },
      },
    },
    {
      sequelize,
      modelName: 'PaymentStatus',
      tableName: 'payment_statuses',
      paranoid: true,
    },
  );
  return PaymentStatus;
};
