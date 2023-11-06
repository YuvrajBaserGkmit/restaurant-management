'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PaymentMethod extends Model {
    static associate(models) {
      this.hasMany(models.Payment, {
        foreignKey: 'payment_method_id',
      });
    }
  }
  PaymentMethod.init(
    {
      payment_method: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isAlpha: true,
        },
      },
    },
    {
      sequelize,
      modelName: 'PaymentMethod',
      tableName: 'payment_methods',
      paranoid: true,
    },
  );
  return PaymentMethod;
};
