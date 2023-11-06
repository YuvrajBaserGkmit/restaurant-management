'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('orders', {
      id: {
        allowNull: false,
        primaryKey: true,
        defaultValue: Sequelize.literal('uuid_generate_v4()'),
        type: Sequelize.UUID,
      },
      date: {
        type: Sequelize.DATE,
        allowNull: false,
        validate: {
          isDate: true,
        },
      },
      order_total: {
        type: Sequelize.DOUBLE,
        allowNull: false,
        validate: {
          isNumeric: true,
        },
      },
      order_status: {
        type: Sequelize.ENUM,
        values: ['received', 'cancelled', 'in process', 'prepared', 'paid'],
        allowNull: false,
        validate: {
          isAlpha: true,
        },
      },
      user_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          key: 'id',
          model: 'users',
        },
      },
      restaurant_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          key: 'id',
          model: 'restaurants',
        },
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      deleted_at: {
        allowNull: true,
        type: Sequelize.DATE,
        defaultValue: null,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('orders');
  },
};
